import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import type { User } from '../types';
import { STORAGE_KEYS } from '../types';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
    setIsDark(savedTheme === 'dark');
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const userDataStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userDataStr) {
        setUser(JSON.parse(userDataStr));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
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

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await authService.logout();
      navigate('/login');
    }
  };

  const menuItems = [
    {
      title: 'Account',
      items: [
        { icon: '✏️', label: 'Edit Profile', action: () => alert('Edit Profile - Coming soon') },
        { icon: '🏪', label: 'Store Information', action: () => navigate('/stores') },
        { icon: '🔔', label: 'Notifications', action: () => alert('Notifications - Coming soon') },
      ],
    },
    {
      title: 'Settings',
      items: [
        { icon: isDark ? '☀️' : '🌙', label: 'Dark Mode', action: toggleTheme, toggle: true },
        { icon: '🔒', label: 'Privacy & Security', action: () => alert('Privacy - Coming soon') },
        { icon: '❓', label: 'Help & Support', action: () => alert('Help - Coming soon') },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* Header */}
      <nav className="border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/stores')}
              className="text-light-primary dark:text-dark-primary"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold text-light-text dark:text-dark-text">
              Profile
            </h1>
            <div className="w-16"></div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-light-surface dark:bg-dark-surface rounded-2xl p-8 mb-6 border border-light-border dark:border-dark-border text-center">
          <div className="w-24 h-24 rounded-full bg-light-primary dark:bg-dark-primary mx-auto mb-4 flex items-center justify-center text-4xl text-white">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : '👤'}
          </div>
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
            {user?.full_name || 'User'}
          </h2>
          <p className="text-light-textSecondary dark:text-dark-textSecondary mb-1">
            {user?.email || 'No email'}
          </p>
          <p className="text-light-textSecondary dark:text-dark-textSecondary">
            {user?.phone || 'No phone'}
          </p>
        </div>

        {/* Menu Sections */}
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <h3 className="text-sm font-semibold text-light-textSecondary dark:text-dark-textSecondary mb-3 px-4">
              {section.title}
            </h3>
            <div className="bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between p-4 hover:bg-light-background dark:hover:bg-dark-background transition-colors ${
                    itemIndex !== section.items.length - 1
                      ? 'border-b border-light-border dark:border-dark-border'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-light-text dark:text-dark-text font-medium">
                      {item.label}
                    </span>
                  </div>
                  {item.toggle ? (
                    <div
                      className={`w-12 h-6 rounded-full transition-colors ${
                        isDark
                          ? 'bg-light-primary dark:bg-dark-primary'
                          : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                          isDark ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      ></div>
                    </div>
                  ) : (
                    <span className="text-light-textSecondary dark:text-dark-textSecondary">
                      →
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-xl font-semibold bg-light-error dark:bg-dark-error text-white transition-transform hover:scale-[1.02]"
        >
          Logout
        </button>

        {/* Version */}
        <p className="text-center text-sm text-light-textSecondary dark:text-dark-textSecondary mt-6">
          Lotto Pro v1.0.0
        </p>
      </div>
    </div>
  );
}
