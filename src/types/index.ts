// ==================== USER & AUTH TYPES ====================

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  role?: string;
  type?: string;
  user_type?: string;
  position?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ProfileData {
  full_name?: string;
  email?: string;
  phone?: string;
  position?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// ==================== STORE TYPES ====================

export interface Store {
  id: number;
  owner_id: number;
  store_name: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  lottery_ac_no: string;
  lottery_pw?: string;
  activeTickets?: number;
}

export interface StoreData {
  owner_id: number;
  store_name: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  lottery_ac_no: string;
  lottery_pw: string;
}

// ==================== LOTTERY TYPES ====================

export interface ScratchOffLottery {
  id: number | string;
  name?: string;
  lottery_name?: string;
  lottery_number?: string;
  price: number;
  totalCount?: number;
  currentCount?: number;
  total_tickets?: number;
  available_tickets?: number;
  sold_tickets?: number;
  image?: string;
  image_url?: string;
  state?: string;
  start_number?: number;
  end_number?: number;
  launch_date?: string;
  status?: string;
}

export interface LotteryData {
  lottery_name: string;
  lottery_number: string;
  state: string;
  price: number;
  start_number: number;
  end_number: number;
  launch_date?: string;
  status?: string;
  image_url?: string;
}

// ==================== TICKET TYPES ====================

export interface Ticket {
  number: number;
  ticket_number?: string;
  sold: boolean;
  soldDate?: string;
  customerName?: string;
  scanned_at?: string;
}

export interface TicketData {
  store_id: number;
  lottery_game_number: string;
  lottery_game_name: string;
  pack_number: string;
  ticket_number: string;
  barcode_raw: string;
  scanned_at: string;
  price?: number;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  msg?: string;
}

// ==================== THEME TYPES ====================

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Primary Colors
  primary: string;
  primaryDark: string;
  primaryLight: string;

  // Secondary Colors
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;

  // Accent Colors
  accent: string;
  accentOrange: string;

  // Status Colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Neutrals
  background: string;
  backgroundDark: string;
  white: string;
  black: string;

  // Text Colors
  textPrimary: string;
  textSecondary: string;
  textLight: string;
  textMuted: string;

  // Borders & Dividers
  border: string;
  divider: string;

  // Card & Surface
  surface: string;
  surfaceLight: string;

  // Inventory Status
  available: string;
  sold: string;
  lowStock: string;
}

// ==================== NAVIGATION TYPES ====================

export interface RouteParams {
  storeId?: string;
  storeName?: string;
  lottery?: ScratchOffLottery;
}

// ==================== REPORT TYPES ====================

export interface DailyReport {
  date: string;
  totalSales: number;
  totalRevenue: number;
  lotteryBreakdown: Array<{
    lottery_name: string;
    lottery_number: string;
    price: number;
    tickets_sold: number;
    revenue: number;
  }>;
}

// ==================== STORAGE KEYS ====================

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  USER_TYPE: 'user_type',
  THEME_MODE: 'theme_mode',
  ONBOARDING_COMPLETE: 'onboarding_complete',
} as const;
