import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeService, authService } from '../services/api';
import type { Store } from '../types';
import { STORAGE_KEYS } from '../types';

export default function StoreListScreen() {
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check theme
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
    setIsDark(savedTheme === 'dark');

    loadStores();
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const userDataStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        setUserName(userData.full_name || userData.store_name || 'User');
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const loadStores = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await storeService.getStores();

      if (result.success && result.data) {
        const storesData = result.data.stores || result.data || [];
        setStores(storesData);
      } else {
        setError(result.error || 'Failed to load stores');
      }
    } catch (error: any) {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await authService.logout();
      navigate('/login');
    }
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, newTheme);
    setIsDark(!isDark);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* Navigation Bar */}
      <nav className="border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/logo/logo.png" alt="Lotto Pro Logo" className="h-10 w-auto" />
              <h1 className="text-2xl font-bold text-light-primary dark:text-dark-primary">
                Lotto Pro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-light-textSecondary dark:text-dark-textSecondary">
                Welcome, {userName}
              </span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text transition-colors"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="p-2 rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text transition-colors"
              >
                👤
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg font-medium bg-light-error dark:bg-dark-error text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-light-text dark:text-dark-text">
              My Stores
            </h2>
            <p className="text-light-textSecondary dark:text-dark-textSecondary">
              Select a store to view dashboard
            </p>
          </div>
          <button
            onClick={() => navigate('/stores/create')}
            className="px-6 py-3 rounded-lg font-semibold bg-light-primary dark:bg-dark-primary text-white transition-transform hover:scale-105"
          >
            + Create New Store
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-light-error dark:border-dark-error">
            <p className="text-light-error dark:text-dark-error">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">⏳</div>
            <p className="text-light-textSecondary dark:text-dark-textSecondary">
              Loading stores...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && stores.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold mb-2 text-light-text dark:text-dark-text">
              No Stores Yet
            </h3>
            <p className="mb-6 text-light-textSecondary dark:text-dark-textSecondary">
              Create your first store to get started
            </p>
            <button
              onClick={() => navigate('/stores/create')}
              className="px-6 py-3 rounded-lg font-semibold bg-light-primary dark:bg-dark-primary text-white"
            >
              Create Store
            </button>
          </div>
        )}

        {/* Store Grid */}
        {!loading && stores.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, index) => {
              const storeIcons = ['🏪', '🏬', '🏢', '🏛️', '🏦', '🏭'];
              const icon = storeIcons[index % storeIcons.length];
              const formatAddress = () => {
                const parts = [store.address, store.city, store.state, store.zipcode].filter(Boolean);
                return parts.length > 0 ? parts.join(', ') : 'No address provided';
              };

              return (
                <div
                  key={store.id}
                  className="rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border overflow-hidden"
                >
                  {/* Card Header - Clickable */}
                  <div
                    onClick={() => navigate(`/inventory/${store.id}`, { state: { storeName: store.store_name, state: store.state } })}
                    className="p-6 cursor-pointer hover:bg-light-background dark:hover:bg-dark-background transition-colors"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-4xl">{icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1 text-light-text dark:text-dark-text">
                          {store.store_name}
                        </h3>
                        <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                          {formatAddress()}
                        </p>
                      </div>
                      <div className="text-2xl text-light-textSecondary dark:text-dark-textSecondary">›</div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-around py-3 border-t border-light-border dark:border-dark-border">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-light-text dark:text-dark-text">
                          ••••{store.lottery_ac_no?.slice(-4) || '0000'}
                        </p>
                        <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                          Account No.
                        </p>
                      </div>
                      <div className="w-px h-8 bg-light-border dark:bg-dark-border"></div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-light-text dark:text-dark-text">
                          {new Date(store.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                          Created
                        </p>
                      </div>
                      <div className="w-px h-8 bg-light-border dark:bg-dark-border"></div>
                      <div className="text-center">
                        <div className="flex justify-center mb-1">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </div>
                        <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                          Active
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-3 border-t border-light-border dark:border-dark-border">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/${store.id}`, { state: { storeName: store.store_name, state: store.state } });
                      }}
                      className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-light-primary dark:text-dark-primary hover:bg-light-background dark:hover:bg-dark-background transition-colors border-r border-light-border dark:border-dark-border"
                    >
                      <span>📊</span>
                      Dashboard
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/inventory/${store.id}`, { state: { storeName: store.store_name, state: store.state } });
                      }}
                      className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-light-secondary dark:text-dark-secondary hover:bg-light-background dark:hover:bg-dark-background transition-colors border-r border-light-border dark:border-dark-border"
                    >
                      <span>📦</span>
                      My Inventory
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/reports/${store.id}`, { state: { storeName: store.store_name } });
                      }}
                      className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-light-background dark:hover:bg-dark-background transition-colors"
                    >
                      <span>📄</span>
                      Reports
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
