import type { ThemeColors } from '../types';

// Light Theme Colors
export const lightTheme: ThemeColors = {
  // Primary Colors - Sophisticated Shiny Blue (Trust, Reliability, Premium)
  primary: '#1e3a8a',        // Deep Navy Blue with grey undertones - Main actions
  primaryDark: '#0f172a',    // Dark Slate - Hover states
  primaryLight: '#3b82f6',   // Bright Blue accent - Backgrounds

  // Secondary Colors - Clean Accent
  secondary: '#10B981',      // Fresh Green - Success, Available
  secondaryDark: '#059669',  // Dark Green
  secondaryLight: '#34D399', // Light Green

  // Accent Colors
  accent: '#8B5CF6',         // Purple - Special features
  accentOrange: '#F59E0B',   // Orange - Warnings, attention

  // Status Colors (Clear & Distinct)
  success: '#10B981',        // Green - Available, Success
  warning: '#F59E0B',        // Amber - Low stock, warnings
  error: '#EF4444',          // Red - Errors, sold out
  info: '#3B82F6',           // Blue - Information

  // Neutrals - Clean & Modern
  background: '#F8FAFC',     // Very light gray background
  backgroundDark: '#F1F5F9', // Slightly darker for contrast
  white: '#FFFFFF',
  black: '#000000',

  // Text Colors - High Contrast for Readability
  textPrimary: '#0F172A',    // Almost black - Main text
  textSecondary: '#64748B',  // Medium gray - Secondary text
  textLight: '#FFFFFF',      // White - On dark backgrounds
  textMuted: '#94A3B8',      // Light gray - Disabled/muted

  // Borders & Dividers - Subtle
  border: '#E2E8F0',         // Light border
  divider: '#CBD5E1',        // Divider lines

  // Card & Surface - Clean whites
  surface: '#FFFFFF',
  surfaceLight: '#FAFBFC',   // Very subtle gray

  // Inventory Status (for tickets)
  available: '#10B981',      // Green - Available tickets
  sold: '#94A3B8',           // Gray - Sold tickets
  lowStock: '#F59E0B',       // Orange - Low inventory
};

// Dark Theme Colors - Muted, comfortable palette (no eye strain)
export const darkTheme: ThemeColors = {
  // Primary Colors - Muted blues that are easy on the eyes
  primary: '#4A90E2',        // Calm medium blue - Not too bright
  primaryDark: '#2D5F8D',    // Deep muted blue
  primaryLight: '#6BA3E8',   // Slightly lighter blue

  // Secondary Colors - Muted greens
  secondary: '#5FB878',      // Soft muted green - Success, Available
  secondaryDark: '#4A9C60',  // Deeper muted green
  secondaryLight: '#7CC48F', // Light muted green

  // Accent Colors - Muted, comfortable tones
  accent: '#8B7EC8',         // Muted purple (not too bright)
  accentOrange: '#E8A542',   // Muted warm orange

  // Status Colors - Softer, muted versions
  success: '#5FB878',        // Muted green
  warning: '#E8B342',        // Muted amber
  error: '#E15D5D',          // Muted red
  info: '#5FB8D9',           // Muted sky blue

  // Neutrals - Comfortable dark backgrounds
  background: '#1a1f2e',     // Very dark blue-gray (comfortable, not pure black)
  backgroundDark: '#13171f', // Even darker for depth
  white: '#FFFFFF',          // Keep white
  black: '#000000',          // Keep black

  // Text Colors - Softer, reduced contrast
  textPrimary: '#E2E4E9',    // Soft light gray - Main text (not pure white)
  textSecondary: '#A8ACB8',  // Medium gray - Secondary text
  textLight: '#E2E4E9',      // Soft light gray - Emphasized text
  textMuted: '#6B7280',      // Muted gray - Disabled/muted

  // Borders & Dividers - Subtle
  border: '#2d3748',         // Subtle border
  divider: '#252d3a',        // Very subtle divider

  // Card & Surface - Comfortable elevated surfaces
  surface: '#252d3a',        // Elevated surface (subtle)
  surfaceLight: '#2d3748',   // Slightly lighter surface

  // Inventory Status (for tickets) - Muted variants
  available: '#5FB878',      // Muted green - Available tickets
  sold: '#6B7280',           // Muted gray - Sold tickets
  lowStock: '#E8B342',       // Muted amber - Low inventory
};
