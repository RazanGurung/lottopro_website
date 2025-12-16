import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeService } from '../services/api';
import { STORAGE_KEYS } from '../types';

export default function CreateStoreScreen() {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [lotteryAcNo, setLotteryAcNo] = useState('');
  const [lotteryPw, setLotteryPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!storeName.trim()) {
      setError('Store name is required');
      return;
    }

    if (!lotteryAcNo.trim()) {
      setError('Lottery account number is required');
      return;
    }

    if (!lotteryPw) {
      setError('Lottery password is required');
      return;
    }

    setLoading(true);

    try {
      const userDataStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (!userDataStr) {
        setError('User data not found. Please login again.');
        setLoading(false);
        return;
      }

      const userData = JSON.parse(userDataStr);
      const ownerId = userData.id || userData.user_id;

      if (!ownerId) {
        setError('User ID not found. Please login again.');
        setLoading(false);
        return;
      }

      const result = await storeService.createStore({
        owner_id: ownerId,
        store_name: storeName.trim(),
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        zipcode: zipcode.trim() || undefined,
        lottery_ac_no: lotteryAcNo.trim(),
        lottery_pw: lotteryPw,
      });

      if (result.success) {
        alert('Store created successfully!');
        navigate('/stores');
      } else {
        setError(result.error || 'Failed to create store. Please try again.');
      }
    } catch (error: any) {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* Header */}
      <nav className="border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/stores')}
              className="flex items-center space-x-2 text-light-primary dark:text-dark-primary"
            >
              <span>←</span>
              <span>Back to Stores</span>
            </button>
            <h1 className="text-xl font-bold text-light-text dark:text-dark-text">
              Create New Store
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-2xl shadow-lg p-8 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏪</div>
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
              Add a New Store
            </h2>
            <p className="text-light-textSecondary dark:text-dark-textSecondary">
              Fill in the store details below
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-light-error dark:border-dark-error">
              <p className="text-light-error dark:text-dark-error">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleCreate}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-light-textSecondary dark:text-dark-textSecondary">
                Store Name *
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Enter store name"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border border-light-border dark:border-dark-border"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-light-textSecondary dark:text-dark-textSecondary">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border border-light-border dark:border-dark-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-light-textSecondary dark:text-dark-textSecondary">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border border-light-border dark:border-dark-border"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-light-textSecondary dark:text-dark-textSecondary">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  placeholder="State"
                  disabled={loading}
                  maxLength={2}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border border-light-border dark:border-dark-border uppercase"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-light-textSecondary dark:text-dark-textSecondary">
                Zip Code
              </label>
              <input
                type="text"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                placeholder="Zip code"
                disabled={loading}
                maxLength={10}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border border-light-border dark:border-dark-border"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-light-textSecondary dark:text-dark-textSecondary">
                Lottery Account Number *
              </label>
              <input
                type="text"
                value={lotteryAcNo}
                onChange={(e) => setLotteryAcNo(e.target.value)}
                placeholder="Enter lottery account number"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border border-light-border dark:border-dark-border"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-light-textSecondary dark:text-dark-textSecondary">
                Lottery Account Password *
              </label>
              <input
                type="password"
                value={lotteryPw}
                onChange={(e) => setLotteryPw(e.target.value)}
                placeholder="Enter lottery account password"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border border-light-border dark:border-dark-border"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-light-primary dark:bg-dark-primary text-white"
            >
              {loading ? 'Creating Store...' : 'Create Store'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
