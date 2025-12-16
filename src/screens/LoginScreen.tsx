import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { authService } from '../services/api';
import { STORAGE_KEYS } from '../types';

export default function LoginScreen() {
  const navigate = useNavigate();
  const colors = useTheme();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate input
    if (!emailOrPhone.trim()) {
      setError('Email or Account Number is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    try {
      const result = await authService.login({
        email: emailOrPhone.trim(),
        password,
      });

      if (result.success && result.data) {
        // Store authentication token and user data
        if (result.data.token) {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, result.data.token);
        }

        if (result.data.user) {
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(result.data.user));
        }

        // For store account login
        if (result.data.store) {
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(result.data.store));
        }

        // Determine user type
        const userRole = result.data.user?.role || result.data.user?.type || result.data.user?.user_type || '';
        const successMessage = result.message || result.data?.message || result.msg || result.data?.msg || '';

        let userType = 'store_owner';

        if (userRole === 'superadmin' || userRole === 'super_admin' || userRole === 'admin' ||
            successMessage.toLowerCase().includes('super admin')) {
          userType = 'superadmin';
        } else if (successMessage.toLowerCase().includes('store account login successful')) {
          userType = 'store';
        } else if (userRole === 'store_owner' || userRole === 'owner') {
          userType = 'store_owner';
        } else if (userRole === 'store') {
          userType = 'store';
        }

        localStorage.setItem(STORAGE_KEYS.USER_TYPE, userType);

        // Only allow store_owner and superadmin on website
        if (userType === 'store') {
          setError('Store accounts cannot login on the website. Please use the mobile app.');
          localStorage.clear(); // Clear any stored data
          return;
        }

        // Navigate based on user type
        if (userType === 'superadmin') {
          // TODO: Navigate to SuperAdmin dashboard when ready
          navigate('/stores');
        } else if (userType === 'store_owner') {
          navigate('/stores');
        } else {
          setError('Invalid user type. Only store owners and administrators can login here.');
          localStorage.clear();
        }
      } else {
        setError(result.error || 'Invalid email or password. Please try again.');
      }
    } catch (error: any) {
      setError('Cannot connect to server. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-md w-full">
        <div
          className="rounded-2xl shadow-lg p-8"
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
          }}
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="/logo/logo.png" alt="Lotto Pro Logo" className="h-20 w-auto" />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
              Lotto Pro
            </h1>
            <p style={{ color: colors.textSecondary }}>
              Store Management System
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mb-4 p-3 rounded-lg"
              style={{
                backgroundColor: `${colors.error}15`,
                border: `1px solid ${colors.error}`,
              }}
            >
              <p style={{ color: colors.error }}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>
                Email or Account Number
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Enter your email or account number"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: colors.backgroundDark,
                  color: colors.textPrimary,
                  border: `1px solid ${colors.border}`,
                }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.backgroundDark,
                    color: colors.textPrimary,
                    border: `1px solid ${colors.border}`,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: colors.primary }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: colors.primary,
                color: colors.textLight,
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <p style={{ color: colors.textSecondary }}>
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold" style={{ color: colors.primary }}>
                Sign Up
              </Link>
            </p>
            <Link to="/" className="block mt-4 text-sm" style={{ color: colors.primary }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
