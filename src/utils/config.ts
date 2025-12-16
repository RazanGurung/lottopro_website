/**
 * Environment Configuration
 * Centralized configuration for API endpoints and environment-specific settings
 */

interface EnvironmentConfig {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  ENABLE_LOGGING: boolean;
  APP_VERSION: string;
}

// Using production environment (same as mobile app)
// Change to 'development' if running backend locally
const ENV = 'production';

const environments: Record<string, EnvironmentConfig> = {
  development: {
    API_BASE_URL: 'http://localhost:3000/api',
    API_TIMEOUT: 30000,
    ENABLE_LOGGING: true,
    APP_VERSION: '1.0.0-dev',
  },
  staging: {
    API_BASE_URL: '/api', // Proxy forwards /api/* to Railway backend
    API_TIMEOUT: 20000,
    ENABLE_LOGGING: true,
    APP_VERSION: '1.0.0-staging',
  },
  production: {
    API_BASE_URL: '/api', // Proxy forwards to Railway production backend
    API_TIMEOUT: 15000,
    ENABLE_LOGGING: false,
    APP_VERSION: '1.0.0',
  },
};

// Export current environment config
export const config: EnvironmentConfig = environments[ENV];

// Helper to check if in development mode
export const isDevelopment = ENV === 'development';
export const isProduction = ENV === 'production';
