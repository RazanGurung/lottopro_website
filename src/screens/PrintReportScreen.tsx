import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ticketService } from '../services/api';

export default function PrintReportScreen() {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const location = useLocation();
  const storeName = (location.state as any)?.storeName || 'Store';

  const [dateRange, setDateRange] = useState<'today' | 'yesterday' | 'custom'>('today');
  const [customDate, setCustomDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState('');

  const getFormattedDate = () => {
    const today = new Date();
    if (dateRange === 'today') {
      return today.toISOString().split('T')[0];
    } else if (dateRange === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toISOString().split('T')[0];
    } else {
      return customDate;
    }
  };

  const loadReport = async () => {
    const date = getFormattedDate();
    if (!date) {
      setError('Please select a date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await ticketService.getDailyReport(Number(storeId), date);

      if (result.success && result.data) {
        setReport(result.data);
      } else {
        setError(result.error || 'Failed to load report');
      }
    } catch (error: any) {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* Header */}
      <nav className="border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate(`/dashboard/${storeId}`, { state: { storeName } })}
              className="text-light-primary dark:text-dark-primary"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-lg font-bold text-light-text dark:text-dark-text">
              Sales Report - {storeName}
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Range Selector */}
        <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-6 mb-6 border border-light-border dark:border-dark-border print:hidden">
          <h2 className="text-xl font-bold mb-4 text-light-text dark:text-dark-text">
            Select Date Range
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <button
              onClick={() => setDateRange('today')}
              className={`p-4 rounded-lg border-2 transition-all ${
                dateRange === 'today'
                  ? 'border-light-primary dark:border-dark-primary bg-blue-50 dark:bg-blue-900/20'
                  : 'border-light-border dark:border-dark-border'
              }`}
            >
              <p className="font-semibold text-light-text dark:text-dark-text">Today</p>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                {new Date().toLocaleDateString()}
              </p>
            </button>

            <button
              onClick={() => setDateRange('yesterday')}
              className={`p-4 rounded-lg border-2 transition-all ${
                dateRange === 'yesterday'
                  ? 'border-light-primary dark:border-dark-primary bg-blue-50 dark:bg-blue-900/20'
                  : 'border-light-border dark:border-dark-border'
              }`}
            >
              <p className="font-semibold text-light-text dark:text-dark-text">Yesterday</p>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                {new Date(Date.now() - 86400000).toLocaleDateString()}
              </p>
            </button>

            <button
              onClick={() => setDateRange('custom')}
              className={`p-4 rounded-lg border-2 transition-all ${
                dateRange === 'custom'
                  ? 'border-light-primary dark:border-dark-primary bg-blue-50 dark:bg-blue-900/20'
                  : 'border-light-border dark:border-dark-border'
              }`}
            >
              <p className="font-semibold text-light-text dark:text-dark-text">Custom</p>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                Select date
              </p>
            </button>
          </div>

          {dateRange === 'custom' && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg mb-4 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border border-light-border dark:border-dark-border"
            />
          )}

          <div className="flex space-x-4">
            <button
              onClick={loadReport}
              disabled={loading}
              className="flex-1 py-3 rounded-lg font-semibold bg-light-primary dark:bg-dark-primary text-white disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Generate Report'}
            </button>
            {report && (
              <button
                onClick={handlePrint}
                className="px-6 py-3 rounded-lg font-semibold bg-light-secondary dark:bg-dark-secondary text-white"
              >
                🖨️ Print
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-light-error dark:border-dark-error print:hidden">
            <p className="text-light-error dark:text-dark-error">{error}</p>
          </div>
        )}

        {/* Report Content */}
        {report && (
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-8 border border-light-border dark:border-dark-border print:border-none print:shadow-none">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
                Daily Sales Report
              </h1>
              <p className="text-light-textSecondary dark:text-dark-textSecondary">
                {storeName} - {getFormattedDate()}
              </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-lg bg-light-background dark:bg-dark-background">
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-2">
                  Total Sales
                </p>
                <p className="text-3xl font-bold text-light-primary dark:text-dark-primary">
                  {report.total_sales || 0}
                </p>
              </div>
              <div className="p-6 rounded-lg bg-light-background dark:bg-dark-background">
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-2">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-light-success dark:text-dark-success">
                  ${report.total_revenue || 0}
                </p>
              </div>
            </div>

            {/* Breakdown */}
            {report.breakdown && report.breakdown.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-light-text dark:text-dark-text">
                  Sales Breakdown
                </h2>
                <div className="space-y-3">
                  {report.breakdown.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 rounded-lg bg-light-background dark:bg-dark-background"
                    >
                      <div>
                        <p className="font-semibold text-light-text dark:text-dark-text">
                          {item.lottery_name}
                        </p>
                        <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                          ${item.price} × {item.tickets_sold} tickets
                        </p>
                      </div>
                      <p className="text-xl font-bold text-light-primary dark:text-dark-primary">
                        ${item.revenue}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!report && !loading && (
          <div className="text-center py-12 bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2 text-light-text dark:text-dark-text">
              No Report Generated
            </h3>
            <p className="text-light-textSecondary dark:text-dark-textSecondary">
              Select a date range and click Generate Report
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
