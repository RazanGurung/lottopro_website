import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ticketService, lotteryService } from '../services/api';
import { STORAGE_KEYS } from '../types';

interface InventoryBook {
  id: number;
  store_id: number;
  lottery_id: number;
  serial_number: string;
  total_count: number;
  current_count: number;
  direction: 'asc' | 'desc';
  status: string;
  created_at: string;
}

interface BookInventoryCard {
  book_id: number;
  serial_number: string;
  total_count: number;
  current_count: number;
  direction: 'asc' | 'desc';
  sold_count: number;
  book_value: number;
  lottery_id: number;
  lottery_game_number: string;
  lottery_game_name: string;
  price: number;
  status?: string;
  image_url?: string;
}

interface DashboardStats {
  total_inventory_value: number;
  total_sold_value: number;
  total_games: number;
  total_packs: number;
  total_tickets: number;
  total_sold_tickets: number;
}

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const location = useLocation();
  const storeName = (location.state as any)?.storeName || 'Store';

  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<BookInventoryCard[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_inventory_value: 0,
    total_sold_value: 0,
    total_games: 0,
    total_packs: 0,
    total_tickets: 0,
    total_sold_tickets: 0,
  });

  useEffect(() => {
    if (storeId) {
      fetchDashboardData();
    }
  }, [storeId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch inventory from API
      const inventoryResult = await ticketService.getStoreInventory(Number(storeId));

      // Fetch lottery types
      const lotteryTypesResult = await lotteryService.getLotteryTypes(Number(storeId));

      let rawInventoryData: InventoryBook[] = [];
      let lotteryTypes: any[] = [];

      if (inventoryResult.success && inventoryResult.data) {
        rawInventoryData = inventoryResult.data.inventory || inventoryResult.data || [];
      }

      if (lotteryTypesResult.success && lotteryTypesResult.data) {
        lotteryTypes = Array.isArray(lotteryTypesResult.data)
          ? lotteryTypesResult.data
          : lotteryTypesResult.data.lotteryTypes || lotteryTypesResult.data.lotteries || [];
      }

      processTicketData(rawInventoryData, lotteryTypes);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processTicketData = (rawInventoryData: InventoryBook[], lotteryTypesData: any[]) => {
    // Create map of lottery_id -> lottery details
    const lotteryMap = new Map();
    lotteryTypesData.forEach((lottery) => {
      lotteryMap.set(lottery.lottery_id, lottery);
    });

    // Create map of lottery_id -> array of inventory books
    const inventoryBookMap = new Map<number, InventoryBook[]>();
    rawInventoryData.forEach((book) => {
      if (!inventoryBookMap.has(book.lottery_id)) {
        inventoryBookMap.set(book.lottery_id, []);
      }
      inventoryBookMap.get(book.lottery_id)!.push(book);
    });

    // Create cards for ALL lottery types (both locked and unlocked)
    const bookCards: BookInventoryCard[] = [];
    const uniqueGameIds = new Set<number>();

    lotteryTypesData.forEach((lotteryType) => {
      const price = parseFloat(lotteryType.price) || 0;
      const inventoryBooksForLottery = inventoryBookMap.get(lotteryType.lottery_id) || [];

      if (inventoryBooksForLottery.length > 0) {
        // UNLOCKED - Has inventory, show book details
        inventoryBooksForLottery.forEach((book) => {
          uniqueGameIds.add(lotteryType.lottery_id);

          let soldCount = 0;
          let remainingCount = 0;

          if (book.direction === 'asc') {
            soldCount = book.current_count + 1;
            remainingCount = book.total_count - soldCount;
          } else {
            soldCount = book.total_count - book.current_count - 1;
            remainingCount = book.current_count + 1;
          }

          const bookValue = remainingCount * price;

          bookCards.push({
            book_id: book.id,
            serial_number: book.serial_number,
            total_count: book.total_count,
            current_count: remainingCount,
            direction: book.direction,
            sold_count: soldCount,
            book_value: bookValue,
            lottery_id: lotteryType.lottery_id,
            lottery_game_number: lotteryType.lottery_number,
            lottery_game_name: lotteryType.lottery_name,
            price: price,
            status: 'active',
            image_url: lotteryType.image_url,
          });
        });
      } else {
        // LOCKED - No inventory yet, show as locked card
        uniqueGameIds.add(lotteryType.lottery_id);
        bookCards.push({
          book_id: 0, // No book ID for locked cards
          serial_number: 'Not scanned',
          total_count: 0,
          current_count: 0,
          direction: 'asc',
          sold_count: 0,
          book_value: 0,
          lottery_id: lotteryType.lottery_id,
          lottery_game_number: lotteryType.lottery_number,
          lottery_game_name: lotteryType.lottery_name,
          price: price,
          status: 'inactive',
          image_url: lotteryType.image_url,
        });
      }
    });

    // Calculate stats
    const totalRemainingValue = bookCards.reduce((sum, card) => sum + card.book_value, 0);
    const totalSoldValue = bookCards.reduce((sum, card) => sum + (card.sold_count * card.price), 0);
    const totalBooks = bookCards.length;
    const totalTickets = bookCards.reduce((sum, card) => sum + card.current_count, 0);
    const totalSoldTickets = bookCards.reduce((sum, card) => sum + card.sold_count, 0);
    const totalGames = uniqueGameIds.size;

    // Sort: active first, then by price
    const sortedBookCards = [...bookCards].sort((a, b) => {
      const aIsActive = a.status === 'active' ? 1 : 0;
      const bIsActive = b.status === 'active' ? 1 : 0;
      if (aIsActive !== bIsActive) {
        return bIsActive - aIsActive;
      }
      return a.price - b.price;
    });

    setInventory(sortedBookCards);
    setStats({
      total_inventory_value: totalRemainingValue,
      total_sold_value: totalSoldValue,
      total_games: totalGames,
      total_packs: totalBooks,
      total_tickets: totalTickets,
      total_sold_tickets: totalSoldTickets,
    });
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-light-textSecondary dark:text-dark-textSecondary">
            Loading inventory...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* Header */}
      <div className="bg-light-primary dark:bg-dark-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{storeName}</h1>
              <p className="text-sm opacity-90">My Inventory - Scanned Tickets (Locked & Unlocked)</p>
            </div>
            <button
              onClick={() => navigate('/stores')}
              className="text-4xl hover:opacity-80 transition-opacity"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="text-2xl mb-2 text-green-600 dark:text-green-400">💰</div>
            <p className="text-xl font-bold text-green-700 dark:text-green-300">
              {formatCurrency(stats.total_inventory_value)}
            </p>
            <p className="text-xs text-green-600 dark:text-green-500">Remaining Value</p>
          </div>

          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <div className="text-2xl mb-2 text-orange-600 dark:text-orange-400">📈</div>
            <p className="text-xl font-bold text-orange-700 dark:text-orange-300">
              {formatCurrency(stats.total_sold_value)}
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-500">Sold Value</p>
          </div>

          <div className="p-4 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
            <div className="text-2xl mb-2">📚</div>
            <p className="text-xl font-bold text-light-text dark:text-dark-text">{stats.total_packs}</p>
            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">Total Books</p>
          </div>

          <div className="p-4 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
            <div className="text-2xl mb-2">🎮</div>
            <p className="text-xl font-bold text-light-text dark:text-dark-text">{stats.total_games}</p>
            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">Unique Games</p>
          </div>

          <div className="p-4 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
            <div className="text-2xl mb-2">🎫</div>
            <p className="text-xl font-bold text-light-text dark:text-dark-text">{stats.total_tickets}</p>
            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">Remaining Tickets</p>
          </div>

          <div className="p-4 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
            <div className="text-2xl mb-2">✅</div>
            <p className="text-xl font-bold text-light-text dark:text-dark-text">{stats.total_sold_tickets}</p>
            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">Sold Tickets</p>
          </div>
        </div>

        {/* Lottery Games - Locked and Unlocked */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-light-text dark:text-dark-text">
            Lottery Games Dashboard
          </h2>

          {inventory.length === 0 ? (
            <div className="text-center py-16 bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border">
              <div className="text-6xl mb-4">🎰</div>
              <h3 className="text-xl font-bold mb-2 text-light-text dark:text-dark-text">
                No Lottery Games Available
              </h3>
              <p className="text-light-textSecondary dark:text-dark-textSecondary mb-6">
                No lottery games found for this store's state
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {inventory.map((book) => {
                const isLocked = book.status === 'inactive';
                const soldPercentage = book.total_count > 0 ? (book.sold_count / book.total_count) * 100 : 0;
                const soldValue = book.sold_count * book.price;
                const remainingValue = book.book_value;

                return (
                  <div
                    key={`${book.lottery_id}-${book.book_id}`}
                    className={`p-6 rounded-xl border transition-shadow ${
                      isLocked
                        ? 'bg-gray-100 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700 opacity-75'
                        : 'bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border hover:shadow-lg'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        {book.image_url ? (
                          <img
                            src={book.image_url}
                            alt={book.lottery_game_name}
                            className={`w-20 h-20 rounded-lg object-cover ${isLocked ? 'grayscale' : ''}`}
                          />
                        ) : (
                          <div className={`w-20 h-20 rounded-lg flex items-center justify-center ${
                            isLocked ? 'bg-gray-300 dark:bg-gray-700' : 'bg-light-primary/10 dark:bg-dark-primary/10'
                          }`}>
                            <span className="text-3xl">{isLocked ? '🔒' : '🎫'}</span>
                          </div>
                        )}
                        {isLocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                            <span className="text-3xl">🔒</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-light-text dark:text-dark-text">
                            {book.lottery_game_name}
                          </h3>
                          {isLocked && (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              LOCKED
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                          Game #{book.lottery_game_number}
                        </p>
                        <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                          {isLocked ? 'Not scanned yet - Scan to unlock' : `Book: ${book.serial_number}`}
                        </p>
                      </div>
                      <div className="text-right">{!isLocked && (
                        <>
                          <div className="mb-2">
                            <span className="text-xs text-light-textSecondary dark:text-dark-textSecondary">Remaining:</span>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                              {formatCurrency(remainingValue)}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-light-textSecondary dark:text-dark-textSecondary">Sold:</span>
                            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                              {formatCurrency(soldValue)}
                            </p>
                          </div>
                        </>
                      )}
                      {isLocked && (
                        <div className="text-center">
                          <p className="text-2xl font-bold text-light-primary dark:text-dark-primary">
                            {formatCurrency(book.price)}
                          </p>
                          <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                            Price per ticket
                          </p>
                        </div>
                      )}
                      </div>
                    </div>

                    {!isLocked && (
                      <>
                        {/* Stats Row */}
                        <div className="flex items-center justify-around py-3 border-t border-b border-light-border dark:border-dark-border mb-4">
                          <div className="text-center">
                            <p className="text-lg font-bold text-light-text dark:text-dark-text">{book.total_count}</p>
                            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">Total</p>
                          </div>
                          <div className="w-px h-8 bg-light-border dark:bg-dark-border"></div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-light-text dark:text-dark-text">{book.current_count}</p>
                            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">Remaining</p>
                          </div>
                          <div className="w-px h-8 bg-light-border dark:border-dark-border"></div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-light-text dark:text-dark-text">{book.sold_count}</p>
                            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">Sold</p>
                          </div>
                          <div className="w-px h-8 bg-light-border dark:bg-dark-border"></div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-light-text dark:text-dark-text">{formatCurrency(book.price)}</p>
                            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">Price</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-light-primary dark:bg-dark-primary transition-all"
                              style={{ width: `${soldPercentage.toFixed(0)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-2 text-center">
                            {soldPercentage.toFixed(1)}% sold • {book.direction === 'asc' ? 'Ascending' : 'Descending'}
                          </p>
                        </div>
                      </>
                    )}

                    {/* Locked card info */}
                    {isLocked && (
                      <div className="text-center py-4 border-t border-gray-300 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                          🔒 This game is locked
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Scan your first ticket to unlock inventory tracking
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
