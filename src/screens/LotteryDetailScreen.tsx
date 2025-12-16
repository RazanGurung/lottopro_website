import { useNavigate, useLocation } from 'react-router-dom';
import type { ScratchOffLottery } from '../types';

export default function LotteryDetailScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const lottery = (location.state as any)?.lottery as ScratchOffLottery;
  const storeName = (location.state as any)?.storeName || 'Store';
  const storeId = (location.state as any)?.storeId;

  if (!lottery) {
    return (
      <div className="min-h-screen bg-light-background dark:bg-dark-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-light-text dark:text-dark-text mb-4">Lottery not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg bg-light-primary dark:bg-dark-primary text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const totalTickets = lottery.total_tickets || lottery.totalCount || 0;
  const availableTickets = lottery.available_tickets || lottery.currentCount || 0;
  const soldTickets = lottery.sold_tickets || (totalTickets - availableTickets);
  const revenue = soldTickets * lottery.price;

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* Header */}
      <nav className="border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate(`/dashboard/${storeId}`, { state: { storeName } })}
              className="text-light-primary dark:text-dark-primary"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-lg font-bold text-light-text dark:text-dark-text">
              {storeName}
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Lottery Header */}
        <div className="bg-light-surface dark:bg-dark-surface rounded-2xl p-8 mb-6 border border-light-border dark:border-dark-border">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-6xl mb-4">
                {lottery.price === 1 ? '🎫' : lottery.price === 2 ? '🎟️' : lottery.price === 5 ? '💵' : lottery.price === 10 ? '💎' : '🎰'}
              </div>
              <h1 className="text-3xl font-bold mb-2 text-light-text dark:text-dark-text">
                {lottery.lottery_name || lottery.name}
              </h1>
              <p className="text-light-textSecondary dark:text-dark-textSecondary">
                Game #{lottery.lottery_number}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-1">
                Ticket Price
              </p>
              <p className="text-4xl font-bold text-light-primary dark:text-dark-primary">
                ${lottery.price}
              </p>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-light-background dark:bg-dark-background">
              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mb-1">
                Total Tickets
              </p>
              <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                {totalTickets}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mb-1">
                Available
              </p>
              <p className="text-2xl font-bold text-light-success dark:text-dark-success">
                {availableTickets}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mb-1">
                Sold
              </p>
              <p className="text-2xl font-bold text-light-error dark:text-dark-error">
                {soldTickets}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mb-1">
                Revenue
              </p>
              <p className="text-2xl font-bold text-light-info dark:text-dark-info">
                ${revenue}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-light-textSecondary dark:text-dark-textSecondary">
                Inventory Status
              </span>
              <span className="font-semibold text-light-text dark:text-dark-text">
                {totalTickets > 0 ? Math.round((availableTickets / totalTickets) * 100) : 0}% Available
              </span>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-light-primary dark:bg-dark-primary h-4 rounded-full transition-all"
                style={{
                  width: `${totalTickets > 0 ? (availableTickets / totalTickets) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Ticket Legend */}
        <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-6 border border-light-border dark:border-dark-border">
          <h2 className="text-xl font-bold mb-4 text-light-text dark:text-dark-text">
            Legend
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded bg-light-success dark:bg-dark-success"></div>
              <span className="text-light-text dark:text-dark-text">Available Tickets</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded bg-gray-400 dark:bg-gray-600"></div>
              <span className="text-light-text dark:text-dark-text">Sold Tickets</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {(lottery.start_number || lottery.end_number) && (
          <div className="mt-6 bg-light-surface dark:bg-dark-surface rounded-xl p-6 border border-light-border dark:border-dark-border">
            <h2 className="text-xl font-bold mb-4 text-light-text dark:text-dark-text">
              Ticket Range
            </h2>
            <p className="text-light-textSecondary dark:text-dark-textSecondary">
              Tickets numbered from{' '}
              <span className="font-bold text-light-text dark:text-dark-text">
                #{lottery.start_number}
              </span>
              {' '}to{' '}
              <span className="font-bold text-light-text dark:text-dark-text">
                #{lottery.end_number}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
