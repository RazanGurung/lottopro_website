/**
 * API Service Layer
 * Centralized API communication with error handling, retries, and timeouts
 */

import { config } from '../utils/config';
import {
  NetworkError,
  AuthenticationError,
  ServerError,
  ValidationError,
} from '../utils/errors';
import type {
  RegisterData,
  LoginData,
  StoreData,
  ProfileData,
  ChangePasswordData,
  LotteryData,
  ApiResponse,
} from '../types';
import { STORAGE_KEYS } from '../types';

// ==================== HELPER FUNCTIONS ====================

/**
 * Get auth token from localStorage
 */
const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    return null;
  }
};

/**
 * Clear all auth data on logout
 */
export const clearAuthData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
  } catch (error) {
    // Silent fail on logout cleanup
  }
};

/**
 * Fetch with timeout support
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error: any) {
    throw new NetworkError(error.message || 'Network request failed');
  }
};

/**
 * Retry logic for failed requests
 */
const retryFetch = async <T>(
  fetchFn: () => Promise<T>,
  maxRetries: number = 2,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fetchFn();
    } catch (error: any) {
      lastError = error;

      // Don't retry on auth errors or validation errors
      if (error instanceof AuthenticationError || error instanceof ValidationError) {
        throw error;
      }

      // Don't retry if this is the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt)));
    }
  }

  throw lastError || new NetworkError();
};

/**
 * Make authenticated API request
 */
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth: boolean = true
): Promise<ApiResponse<T>> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add auth token if required
    if (requiresAuth) {
      const token = getAuthToken();
      console.log('Auth token retrieved:', token ? `${token.substring(0, 20)}...` : 'null');
      if (!token) {
        throw new AuthenticationError('No authentication token found. Please login again.');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${config.API_BASE_URL}${endpoint}`;

    console.log('=== API REQUEST ===');
    console.log('Base URL:', config.API_BASE_URL);
    console.log('Endpoint:', endpoint);
    console.log('Full URL:', url);
    console.log('Method:', options.method || 'GET');

    const response = await fetchWithTimeout(url, {
      ...options,
      headers,
    });

    console.log('Response status:', response.status);
    console.log('Response OK:', response.ok);

    const result = await response.json();
    console.log('Response body:', JSON.stringify(result, null, 2));

    // Handle HTTP error codes
    if (!response.ok) {
      if (response.status === 401) {
        // Clear auth data on 401
        clearAuthData();
        throw new AuthenticationError(result.error || result.message || 'Session expired. Please login again.');
      }

      if (response.status === 400) {
        throw new ValidationError(result.error || result.message || 'Invalid request data');
      }

      if (response.status >= 500) {
        throw new ServerError(result.error || result.message);
      }

      return {
        success: false,
        error: result.error || result.message || 'Request failed',
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    if (error instanceof AuthenticationError ||
        error instanceof ValidationError ||
        error instanceof ServerError) {
      throw error;
    }

    throw new NetworkError(error.message);
  }
};

// ==================== AUTH SERVICE ====================

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<ApiResponse<any>> => {
    try {
      return await retryFetch(() =>
        apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify(data),
        }, false)
      );
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  },

  /**
   * Login user
   */
  login: async (data: LoginData): Promise<ApiResponse<any>> => {
    try {
      return await retryFetch(() =>
        apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify(data),
        }, false)
      );
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  },

  /**
   * Get user profile
   */
  getProfile: async (): Promise<ApiResponse<any>> => {
    try {
      return await retryFetch(() => apiRequest('/auth/profile'));
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch profile',
      };
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: ProfileData): Promise<ApiResponse<any>> => {
    try {
      return await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update profile',
      };
    }
  },

  /**
   * Change user password
   */
  changePassword: async (data: ChangePasswordData): Promise<ApiResponse<any>> => {
    try {
      return await apiRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          current_password: data.current_password,
          new_password: data.new_password,
        }),
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to change password',
      };
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    clearAuthData();
  },
};

// ==================== STORE SERVICE ====================

export const storeService = {
  /**
   * Get all stores for the authenticated user
   */
  getStores: async (): Promise<ApiResponse<any>> => {
    try {
      return await retryFetch(() => apiRequest('/stores'));
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch stores',
      };
    }
  },

  /**
   * Create a new store
   */
  createStore: async (data: StoreData): Promise<ApiResponse<any>> => {
    try {
      return await apiRequest('/stores', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create store',
      };
    }
  },

  /**
   * Update an existing store
   */
  updateStore: async (storeId: number, data: Partial<StoreData>): Promise<ApiResponse<any>> => {
    try {
      return await apiRequest(`/stores/${storeId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update store',
      };
    }
  },
};

// ==================== LOTTERY SERVICE ====================

export const lotteryService = {
  /**
   * Create a new lottery game (Super Admin only)
   */
  createLottery: async (data: LotteryData): Promise<ApiResponse<any>> => {
    try {
      return await apiRequest('/super-admin/lotteries', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create lottery',
      };
    }
  },

  /**
   * Get all lottery games (Super Admin only)
   */
  getLotteries: async (): Promise<ApiResponse<any>> => {
    try {
      return await retryFetch(() => apiRequest('/super-admin/lotteries'));
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch lotteries',
      };
    }
  },

  /**
   * Get lottery types based on logged-in user's state (using bearer token)
   */
  getLotteryTypes: async (storeId: number): Promise<ApiResponse<any>> => {
    try {
      console.log('=== LOTTERY TYPES API CALL ===');
      console.log('Endpoint: /lottery/types/store/' + storeId);
      console.log('Store ID:', storeId);
      const result = await retryFetch(() => apiRequest(`/lottery/types/store/${storeId}`));
      console.log('Lottery Types Result:', result);
      return result;
    } catch (error: any) {
      console.error('Lottery Types Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch lottery types',
      };
    }
  },

  /**
   * Update a lottery game
   */
  updateLottery: async (lotteryId: number, data: LotteryData): Promise<ApiResponse<any>> => {
    try {
      return await apiRequest(`/super-admin/lotteries/${lotteryId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update lottery',
      };
    }
  },

  /**
   * Delete a lottery game
   */
  deleteLottery: async (lotteryId: number): Promise<ApiResponse<any>> => {
    try {
      return await apiRequest(`/super-admin/lotteries/${lotteryId}`, {
        method: 'DELETE',
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete lottery',
      };
    }
  },
};

// ==================== CHAT SERVICE ====================

export const chatService = {
  /**
   * Send message to Badda AI Assistant
   */
  sendMessage: async (message: string, conversationHistory: Array<{role: string, content: string}> = []): Promise<ApiResponse<any>> => {
    try {
      return await apiRequest('/chat/message', {
        method: 'POST',
        body: JSON.stringify({
          message,
          history: conversationHistory
        }),
      }, false); // No auth required for landing page chat
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to send message',
      };
    }
  },
};

// ==================== TICKET SERVICE ====================

export const ticketService = {
  /**
   * Get store inventory
   */
  getStoreInventory: async (storeId: number): Promise<ApiResponse<any>> => {
    try {
      console.log('=== STORE INVENTORY API CALL ===');
      console.log('Endpoint: /lottery/store/' + storeId + '/inventory');
      console.log('Store ID:', storeId);

      const result = await retryFetch(() => apiRequest(`/lottery/store/${storeId}/inventory`));

      console.log('=== INVENTORY API RESPONSE ===');
      console.log('Result:', JSON.stringify(result, null, 2));

      return result;
    } catch (error: any) {
      console.error('Inventory API Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch store inventory',
      };
    }
  },

  /**
   * Get daily report for a store
   */
  getDailyReport: async (storeId: number, date: string): Promise<ApiResponse<any>> => {
    try {
      console.log('=== DAILY REPORT API CALL ===');
      console.log('Endpoint: /reports/store/' + storeId + '/daily?date=' + date);

      const result = await retryFetch(() => apiRequest(`/reports/store/${storeId}/daily?date=${date}`));

      console.log('=== DAILY REPORT API RESPONSE ===');
      console.log('Result:', JSON.stringify(result, null, 2));

      return result;
    } catch (error: any) {
      console.error('Daily Report API Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch daily report',
      };
    }
  },
};
