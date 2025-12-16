import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { lotteryService, ticketService } from '../services/api';

interface LotteryType {
  lottery_id: number;
  lottery_name: string;
  lottery_number: string;
  price: number;
  image_url?: string;
  state?: string;
  top_prize?: string;
  overall_odds?: string;
  is_assigned?: boolean;
  inventory_count?: number;
}

export default function LotteryDashboard() {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const location = useLocation();
  const storeName = (location.state as any)?.storeName || 'Store';
  const stateCode = (location.state as any)?.state || '';

  const [loading, setLoading] = useState(true);
  const [lotteryTypes, setLotteryTypes] = useState<LotteryType[]>([]);

  useEffect(() => {
    if (storeId) {
      fetchLotteryTypes();
    }
  }, [storeId]);

  const fetchLotteryTypes = async () => {
    try {
      setLoading(true);

      // Fetch lottery types
      const lotteriesResult = await lotteryService.getLotteryTypes(Number(storeId));

      console.log('=== LOTTERY DASHBOARD DEBUG ===');
      console.log('Lotteries result:', lotteriesResult);

      let lotteriesData: LotteryType[] = [];

      if (lotteriesResult.success && lotteriesResult.data) {
        lotteriesData = Array.isArray(lotteriesResult.data)
          ? lotteriesResult.data
          : lotteriesResult.data.lotteryTypes || lotteriesResult.data.lotteries || [];

        console.log('Total lotteries received:', lotteriesData.length);
      } else {
        console.log('⚠️ Lotteries fetch failed');
        setLotteryTypes([]);
        setLoading(false);
        return;
      }

      // Fetch inventory data to determine activation status
      console.log('Fetching inventory data...');
      const inventoryResult = await ticketService.getStoreInventory(Number(storeId));

      console.log('Inventory result:', inventoryResult);

      if (inventoryResult.success && inventoryResult.data) {
        const inventoryData = inventoryResult.data.inventory || inventoryResult.data.data || inventoryResult.data;

        console.log('Inventory items:', Array.isArray(inventoryData) ? inventoryData.length : 'N/A');

        if (Array.isArray(inventoryData)) {
          // Match inventory with lotteries to determine activation
          const updatedLotteries = lotteriesData.map((lottery) => {
            const inventoryItem = inventoryData.find(
              (item: any) => item.lottery_id === lottery.lottery_id && item.status === 'active'
            );

            if (inventoryItem) {
              console.log(`✓ Lottery #${lottery.lottery_number} is ACTIVATED`);
              return {
                ...lottery,
                is_assigned: true,
                inventory_count: inventoryItem.current_count || 0
              };
            } else {
              console.log(`✗ Lottery #${lottery.lottery_number} is NOT ACTIVATED`);
              return {
                ...lottery,
                is_assigned: false,
                inventory_count: 0
              };
            }
          });

          // Sort by activation status (activated first), then by price
          const sortedLotteries = updatedLotteries.sort((a, b) => {
            // First sort by activation status
            if (a.is_assigned && !b.is_assigned) return -1;
            if (!a.is_assigned && b.is_assigned) return 1;
            // Then by price
            return parseFloat(a.price.toString()) - parseFloat(b.price.toString());
          });

          console.log('Setting lottery types with activation status...');
          setLotteryTypes(sortedLotteries);
        } else {
          // No inventory data, mark all as not assigned
          const updatedLotteries = lotteriesData.map((lottery) => ({
            ...lottery,
            is_assigned: false,
            inventory_count: 0
          }));

          setLotteryTypes(updatedLotteries);
        }
      } else {
        // Inventory fetch failed, mark all as not assigned
        const updatedLotteries = lotteriesData.map((lottery) => ({
          ...lottery,
          is_assigned: false,
          inventory_count: 0
        }));

        setLotteryTypes(updatedLotteries);
      }

      console.log('Done!');
    } catch (error) {
      console.error('Failed to fetch lottery types:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-light-textSecondary dark:text-dark-textSecondary">
            Loading lottery games...
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
              <p className="text-sm opacity-90">Lottery Games Dashboard - {stateCode || 'All'} State Games</p>
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
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
            <div className="text-2xl mb-2">🎮</div>
            <p className="text-2xl font-bold text-light-text dark:text-dark-text">
              {lotteryTypes.length}
            </p>
            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
              Total Games
            </p>
          </div>

          <div className="p-4 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
            <div className="text-2xl mb-2">💵</div>
            <p className="text-2xl font-bold text-light-text dark:text-dark-text">
              {lotteryTypes.filter(g => parseFloat(g.price.toString()) === 1).length}
            </p>
            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
              $1 Games
            </p>
          </div>

          <div className="p-4 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
            <div className="text-2xl mb-2">💎</div>
            <p className="text-2xl font-bold text-light-text dark:text-dark-text">
              {lotteryTypes.filter(g => parseFloat(g.price.toString()) >= 10).length}
            </p>
            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
              $10+ Games
            </p>
          </div>

          <div className="p-4 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
            <div className="text-2xl mb-2">📍</div>
            <p className="text-2xl font-bold text-light-text dark:text-dark-text">
              {stateCode || 'N/A'}
            </p>
            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
              State
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => navigate(`/inventory/${storeId}`, { state: { storeName, state: stateCode } })}
            className="flex-1 p-4 rounded-lg bg-light-primary dark:bg-dark-primary text-white font-semibold hover:opacity-90 transition-opacity"
          >
            📦 View My Inventory
          </button>
          <button
            onClick={() => navigate(`/reports/${storeId}`, { state: { storeName } })}
            className="flex-1 p-4 rounded-lg bg-light-secondary dark:bg-dark-secondary text-white font-semibold hover:opacity-90 transition-opacity"
          >
            📊 View Reports
          </button>
        </div>

        {/* Lottery Games Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-light-text dark:text-dark-text">
            All Lottery Games ({lotteryTypes.length})
          </h2>

          {lotteryTypes.length === 0 ? (
            <div className="text-center py-16 bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border">
              <div className="text-6xl mb-4">🎰</div>
              <h3 className="text-xl font-bold mb-2 text-light-text dark:text-dark-text">
                No Lottery Games Available
              </h3>
              <p className="text-light-textSecondary dark:text-dark-textSecondary">
                No lottery games found for this store's state
              </p>
              <p className="text-xs text-red-500 mt-4">
                Debug: lotteryTypes.length = {lotteryTypes.length}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {lotteryTypes.map((lottery) => {
                console.log('Rendering lottery card:', lottery);
                const priceNum = parseFloat(lottery.price.toString());
                const isActivated = lottery.is_assigned || false;
                const stockCount = lottery.inventory_count || 0;

                return (
                <div
                  key={lottery.lottery_id}
                  className="relative rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/inventory/${storeId}`, { state: { storeName, state: stateCode } })}
                >
                  {/* Status Indicator Dot */}
                  <div className={`absolute top-3 left-3 w-3 h-3 rounded-full shadow-lg z-10 ${
                    isActivated ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>

                  {/* Lottery Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    {lottery.image_url ? (
                      <img
                        src={lottery.image_url}
                        alt={lottery.lottery_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-light-primary/10 dark:bg-dark-primary/10">
                        <span className="text-6xl">🎫</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Name */}
                    <h3 className="text-sm font-bold mb-2 text-light-text dark:text-dark-text line-clamp-2 min-h-[2.5rem]">
                      {lottery.lottery_name}
                    </h3>

                    {/* Price */}
                    <p className="text-xl font-bold text-light-primary dark:text-dark-primary mb-3">
                      {formatCurrency(priceNum)}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                    </div>

                    {/* Stock Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-light-textSecondary dark:text-dark-textSecondary">
                        <span>📦</span>
                        <span>Your Stock: </span>
                        <span className={`font-semibold ${
                          stockCount > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {stockCount > 0 ? `${stockCount} tickets` : 'None'}
                        </span>
                      </div>
                      {stockCount === 0 && (
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          Use mobile app to scan tickets
                        </p>
                      )}
                      {stockCount > 0 && (
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {((stockCount / 300) * 100).toFixed(0)}% of capacity
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Not Activated Overlay */}
                  {!isActivated && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="bg-gray-800/90 px-4 py-3 rounded-lg flex items-center gap-2">
                        <span className="text-2xl">🔒</span>
                        <span className="text-white font-semibold text-sm">NOT ACTIVATED</span>
                      </div>
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
