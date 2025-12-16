import { useNavigate } from 'react-router-dom';
import { useTheme, useThemeMode } from '../contexts/ThemeContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const colors = useTheme();
  const { isDark, setThemeMode } = useThemeMode();

  const toggleTheme = () => {
    setThemeMode(isDark ? 'light' : 'dark');
  };

  const features = [
    {
      icon: '🔒',
      title: 'Stop Theft & Mismanagement',
      description: 'Prevent the $5,000-$7,000 annual losses from lottery ticket theft and mismanagement with real-time tracking.',
    },
    {
      icon: '📱',
      title: 'No Extra Hardware',
      description: 'Use your existing smartphone - no expensive scanners or special devices needed. Just download and go.',
    },
    {
      icon: '📊',
      title: 'Perfect Daily Reports',
      description: 'Automatically generated daily sales reports with detailed breakdowns by game, price, and pack.',
    },
    {
      icon: '💰',
      title: 'Incredibly Affordable',
      description: 'Only $29.99/month - pays for itself by preventing just one misplaced pack per month.',
    },
    {
      icon: '⚡',
      title: 'Instant Inventory Updates',
      description: 'Scan tickets as they arrive or sell. Know exactly what you have in stock at all times.',
    },
    {
      icon: '🏪',
      title: 'Multi-Store Ready',
      description: 'Manage multiple store locations from one account. Perfect for growing businesses.',
    },
  ];

  const comparisons = [
    {
      feature: 'Monthly Cost',
      lottoPro: '$29.99',
      competitor: '$99+ or hardware cost',
      advantage: true,
    },
    {
      feature: 'Hardware Required',
      lottoPro: 'None - Use Your Phone',
      competitor: 'Expensive Scanner ($500+)',
      advantage: true,
    },
    {
      feature: 'Daily Reports',
      lottoPro: 'Automatic & Detailed',
      competitor: 'Manual or Limited',
      advantage: true,
    },
    {
      feature: 'Setup Time',
      lottoPro: '5 Minutes',
      competitor: '1-2 Days',
      advantage: true,
    },
    {
      feature: 'Mobile Access',
      lottoPro: 'Full Featured App',
      competitor: 'Desktop Only',
      advantage: true,
    },
    {
      feature: 'Contract Required',
      lottoPro: 'No - Cancel Anytime',
      competitor: 'Yes - 1-2 Years',
      advantage: true,
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Navigation */}
      <nav className="border-b backdrop-blur-sm sticky top-0 z-50" style={{
        borderColor: colors.border,
        backgroundColor: isDark ? 'rgba(26, 31, 46, 0.95)' : 'rgba(255, 255, 255, 0.9)',
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/logo/logo.png" alt="Lotto Pro Logo" className="h-10 w-auto" />
              <h1 className="text-2xl font-bold" style={{ color: colors.primary }}>
                Lotto Pro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-all hover:scale-110"
                style={{
                  backgroundColor: colors.backgroundDark,
                  color: colors.textPrimary
                }}
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                style={{
                  color: colors.primary,
                  backgroundColor: 'transparent',
                  border: `2px solid ${colors.primary}`,
                }}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2 rounded-lg font-medium transition-all hover:scale-105 shadow-lg"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.textLight,
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="relative overflow-hidden"
        style={{
          background: isDark
            ? `linear-gradient(135deg, ${colors.background} 0%, ${colors.backgroundDark} 100%)`
            : `linear-gradient(135deg, ${colors.background} 0%, #e0f2fe 100%)`,
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
            transform: 'translate(30%, -30%)',
            opacity: isDark ? 0.05 : 0.1,
          }}
        />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)`,
            transform: 'translate(-30%, 30%)',
            opacity: isDark ? 0.05 : 0.1,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Problem Statement Badge */}
            <div className="mb-8 inline-block">
              <div
                className="px-6 py-3 rounded-full text-lg font-bold animate-pulse"
                style={{
                  background: `linear-gradient(135deg, ${colors.error} 0%, ${colors.warning} 100%)`,
                  color: colors.textLight,
                }}
              >
                ⚠️ Stores Lose $5,000-$7,000 Annually to Lottery Theft & Mismanagement
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight" style={{ color: colors.textPrimary }}>
              Stop Losing Money on
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                }}
              >
                Scratch-Off Tickets
              </span>
            </h1>

            <p className="text-2xl md:text-3xl mb-8 max-w-4xl mx-auto font-semibold" style={{ color: colors.textSecondary }}>
              Track every ticket, prevent theft, and get perfect daily reports -
              <span style={{ color: colors.primary }}> all from your phone</span>
            </p>

            {/* Pricing Card */}
            <div className="mb-10 inline-block">
              <div
                className="relative px-8 md:px-12 py-8 rounded-3xl shadow-2xl transform transition-all hover:scale-105"
                style={{
                  background: isDark
                    ? `linear-gradient(135deg, ${colors.surface} 0%, ${colors.primary} 100%)`
                    : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                  border: `3px solid ${isDark ? colors.primary : colors.accent}`,
                }}
              >
                <div className="absolute -top-3 -right-3 text-4xl animate-bounce">🔥</div>

                <div className="mb-4">
                  <p className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: colors.textLight, opacity: 0.9 }}>
                    Launch Special - Limited Time
                  </p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-3xl font-bold line-through opacity-60" style={{ color: colors.textLight }}>
                      $99
                    </span>
                    <span className="text-6xl font-extrabold" style={{ color: colors.textLight }}>
                      $29.99
                    </span>
                  </div>
                  <p className="text-xl font-medium mt-1" style={{ color: colors.textLight, opacity: 0.9 }}>
                    per month • Cancel anytime
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                    <p className="text-base font-semibold" style={{ color: colors.textLight }}>
                      ✓ No Hardware Cost
                    </p>
                  </div>
                  <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                    <p className="text-base font-semibold" style={{ color: colors.textLight }}>
                      ✓ Use Your Phone
                    </p>
                  </div>
                  <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                    <p className="text-base font-semibold" style={{ color: colors.textLight }}>
                      ✓ No Hidden Fees
                    </p>
                  </div>
                  <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                    <p className="text-base font-semibold" style={{ color: colors.textLight }}>
                      ✓ Setup in 5 Minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <button
                onClick={() => navigate('/signup')}
                className="px-10 py-4 rounded-xl font-bold text-xl transition-all hover:scale-110 shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentOrange} 100%)`,
                  color: colors.textLight,
                }}
              >
                🚀 Start Free Trial
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-4 rounded-xl font-bold text-xl transition-all hover:scale-105"
                style={{
                  color: colors.primary,
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                  border: `3px solid ${colors.primary}`,
                }}
              >
                See How It Works
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm" style={{ color: colors.textSecondary }}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💳</span>
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span>5 Minute Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📞</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section - Problem/Solution */}
      <div className="py-20" style={{ backgroundColor: colors.backgroundDark }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6"
              style={{
                backgroundImage: `linear-gradient(90deg, ${colors.textPrimary}, ${colors.primary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              The Smart Solution for Lottery Retailers
            </h2>
            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
              Finally, an affordable and simple way to track your scratch-off inventory
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                style={{
                  backgroundColor: colors.surface,
                  border: `2px solid ${colors.border}`,
                  boxShadow: isDark ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.boxShadow = `0 20px 40px ${isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.boxShadow = isDark ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div className="text-6xl mb-6 transform transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: colors.textPrimary }}>
                  {feature.title}
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: colors.textSecondary }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div id="features" className="py-20" style={{ backgroundColor: colors.background }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: colors.textPrimary }}>
              Better Than The Competition
            </h2>
            <p className="text-xl md:text-2xl font-medium" style={{ color: colors.textSecondary }}>
              See why smart store owners are switching to Lotto Pro
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl shadow-2xl"
            style={{
              backgroundColor: colors.surface,
              border: `3px solid ${colors.border}`,
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: colors.backgroundDark }}>
                    <th className="px-6 py-5 text-left text-lg font-bold" style={{ color: colors.textPrimary }}>
                      Feature
                    </th>
                    <th className="px-6 py-5 text-center text-lg font-bold" style={{ color: colors.primary }}>
                      🏆 Lotto Pro
                    </th>
                    <th className="px-6 py-5 text-center text-lg font-bold" style={{ color: colors.textMuted }}>
                      Competitors
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((item, index) => (
                    <tr
                      key={index}
                      className="transition-colors hover:bg-opacity-50"
                      style={{
                        backgroundColor: index % 2 === 0 ? 'transparent' : colors.backgroundDark,
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      <td className="px-6 py-5 font-semibold text-base" style={{ color: colors.textPrimary }}>
                        {item.feature}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-2xl">✅</span>
                          <span className="font-bold text-base" style={{ color: colors.success }}>
                            {item.lottoPro}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-2xl">❌</span>
                          <span className="text-base" style={{ color: colors.textMuted }}>
                            {item.competitor}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>
              Save $800+ per year compared to traditional systems
            </p>
            <p className="text-lg" style={{ color: colors.textSecondary }}>
              Plus prevent $5,000-$7,000 in losses from theft and mismanagement
            </p>
          </div>
        </div>
      </div>

      {/* Perfect Reports Section */}
      <div className="py-20 relative overflow-hidden"
        style={{
          background: isDark
            ? `linear-gradient(135deg, ${colors.surface} 0%, ${colors.primaryDark} 100%)`
            : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
        }}
      >
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: colors.textLight }}>
              Perfect Daily Reports, Automatically
            </h2>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: colors.textLight, opacity: 0.95 }}>
              Know exactly what sold, what's in stock, and where your money is going
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl backdrop-blur-sm transform transition-all hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: colors.textLight }}>
                Sales by Game
              </h3>
              <p className="text-lg" style={{ color: colors.textLight, opacity: 0.9 }}>
                See which games are selling best and which are sitting on the shelf
              </p>
            </div>

            <div className="p-8 rounded-2xl backdrop-blur-sm transform transition-all hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="text-6xl mb-4">💵</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: colors.textLight }}>
                Revenue Tracking
              </h3>
              <p className="text-lg" style={{ color: colors.textLight, opacity: 0.9 }}>
                Track daily, weekly, and monthly revenue with automatic calculations
              </p>
            </div>

            <div className="p-8 rounded-2xl backdrop-blur-sm transform transition-all hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: colors.textLight }}>
                Inventory Value
              </h3>
              <p className="text-lg" style={{ color: colors.textLight, opacity: 0.9 }}>
                Always know the exact value of your lottery ticket inventory
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-24 relative overflow-hidden"
        style={{
          background: isDark
            ? `linear-gradient(135deg, ${colors.surface} 0%, ${colors.accent} 100%)`
            : `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentOrange} 100%)`,
        }}
      >
        <div className="absolute inset-0" style={{ opacity: isDark ? 0.1 : 0.2 }}>
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.textLight} 0%, transparent 70%)`,
              animation: 'pulse 3s infinite',
            }}
          />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.textLight} 0%, transparent 70%)`,
              animation: 'pulse 4s infinite',
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6" style={{ color: colors.textLight }}>
            Ready to Stop Losing Money?
          </h2>
          <p className="text-2xl md:text-3xl mb-12 font-medium" style={{ color: colors.textLight, opacity: 0.95 }}>
            Join lottery retailers who are saving thousands every year
            <br />
            <span className="text-3xl md:text-4xl font-bold mt-4 inline-block">Start Your Free Trial Today!</span>
          </p>

          <button
            onClick={() => navigate('/signup')}
            className="px-12 py-5 rounded-2xl font-bold text-2xl transition-all hover:scale-110 shadow-2xl mb-8"
            style={{
              backgroundColor: colors.textLight,
              color: colors.accent,
            }}
          >
            🎉 Get Started Now - It's Free
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="flex flex-col items-center">
              <div className="text-5xl mb-3">💳</div>
              <p className="text-lg font-semibold" style={{ color: colors.textLight }}>
                No Credit Card Required
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl mb-3">⚡</div>
              <p className="text-lg font-semibold" style={{ color: colors.textLight }}>
                Setup in 5 Minutes
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-lg font-semibold" style={{ color: colors.textLight }}>
                Cancel Anytime
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-12" style={{
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-3">
              <img src="/logo/logo.png" alt="Lotto Pro Logo" className="h-12 w-auto" />
              <h3 className="text-2xl font-bold" style={{ color: colors.primary }}>
                Lotto Pro
              </h3>
            </div>

            <p className="text-lg font-medium text-center" style={{ color: colors.textSecondary }}>
              Professional Lottery Inventory Management System
            </p>

            <div className="flex gap-8">
              <button
                onClick={() => navigate('/login')}
                className="text-base font-medium transition-colors hover:underline"
                style={{ color: colors.textSecondary }}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="text-base font-medium transition-colors hover:underline"
                style={{ color: colors.textSecondary }}
              >
                Sign Up
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-base font-medium transition-colors hover:underline"
                style={{ color: colors.textSecondary }}
              >
                Features
              </button>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t" style={{ borderColor: colors.border }}>
              <span className="text-2xl">⭐⭐⭐⭐⭐</span>
              <span style={{ color: colors.textSecondary }}>Rated 5/5 by store owners</span>
            </div>

            <p className="text-sm" style={{ color: colors.textMuted }}>
              &copy; 2024 Lotto Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
