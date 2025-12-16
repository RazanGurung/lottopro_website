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
      icon: '📊',
      title: 'Real-Time Inventory',
      description: 'Track your lottery ticket inventory in real-time with live updates and stock management.',
    },
    {
      icon: '📱',
      title: 'Multi-Store Management',
      description: 'Manage multiple store locations from a single dashboard with ease.',
    },
    {
      icon: '📈',
      title: 'Sales Reports',
      description: 'Generate detailed sales reports and analytics to optimize your business.',
    },
    {
      icon: '🎫',
      title: 'Lottery Tracking',
      description: 'Track all scratch-off lottery games with detailed pricing and availability.',
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with encrypted data and secure authentication.',
    },
    {
      icon: '⚡',
      title: 'Fast Performance',
      description: 'Lightning-fast interface built for efficiency and productivity.',
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

      {/* Hero Section with Gradient Background */}
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Main Headline */}
            <h1 className="text-6xl font-extrabold mb-8 leading-tight" style={{ color: colors.textPrimary }}>
              Manage Your Store's
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                }}
              >
                Scratch-Off Inventory
              </span>
              <br />
              <span style={{ color: colors.textPrimary }}>& Track Daily Reports</span>
            </h1>

            {/* Pricing Card - Modern Design */}
            <div className="mb-10 inline-block">
              <div
                className="relative px-10 py-8 rounded-3xl shadow-2xl transform transition-all hover:scale-105"
                style={{
                  background: isDark
                    ? `linear-gradient(135deg, ${colors.surface} 0%, ${colors.primary} 100%)`
                    : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                  border: `3px solid ${isDark ? colors.primary : colors.accent}`,
                }}
              >
                {/* Sparkle effect */}
                <div className="absolute -top-2 -right-2 text-4xl animate-pulse">✨</div>

                <div className="mb-4">
                  <p className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: colors.textLight, opacity: 0.9 }}>
                    Special Launch Offer
                  </p>
                  <p className="text-5xl font-extrabold mb-1" style={{ color: colors.textLight }}>
                    $29.99
                  </p>
                  <p className="text-xl font-medium" style={{ color: colors.textLight, opacity: 0.9 }}>
                    per month
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                    <p className="text-base font-semibold" style={{ color: colors.textLight }}>
                      ✓ No Hidden Fees
                    </p>
                  </div>
                  <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                    <p className="text-base font-semibold" style={{ color: colors.textLight }}>
                      ✓ Cancel Anytime
                    </p>
                  </div>
                  <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                    <p className="text-base font-semibold" style={{ color: colors.textLight }}>
                      ✓ No Hardware
                    </p>
                  </div>
                  <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                    <p className="text-base font-semibold" style={{ color: colors.textLight }}>
                      ✓ Just Your Phone
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-2xl mb-10 max-w-3xl mx-auto font-medium" style={{ color: colors.textSecondary }}>
              📱 Simple • 💪 Powerful • 💰 Affordable
              <br />
              Everything you need to manage lottery inventory from your phone
            </p>

            <div className="flex justify-center gap-6">
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
                className="px-10 py-4 rounded-xl font-bold text-xl transition-all hover:scale-105 backdrop-blur-sm"
                style={{
                  color: colors.primary,
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                  border: `3px solid ${colors.primary}`,
                }}
              >
                Learn More
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex justify-center items-center gap-8 text-sm" style={{ color: colors.textSecondary }}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                <span>Secure & Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💯</span>
                <span>100% Cloud-Based</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24" style={{ backgroundColor: colors.backgroundDark }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-extrabold mb-6"
              style={{
                backgroundImage: `linear-gradient(90deg, ${colors.textPrimary}, ${colors.primary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Everything You Need
            </h2>
            <p className="text-2xl font-medium" style={{ color: colors.textSecondary }}>
              Powerful features designed for modern lottery retailers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer"
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

      {/* Stats Section with Gradient Background */}
      <div className="py-24 relative overflow-hidden"
        style={{
          background: isDark
            ? `linear-gradient(135deg, ${colors.surface} 0%, ${colors.primaryDark} 100%)`
            : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
        }}
      >
        {/* Decorative pattern */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${colors.textLight} 10px, ${colors.textLight} 20px)`,
            opacity: isDark ? 0.03 : 0.1,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4" style={{ color: colors.textLight }}>
              Trusted by Lottery Retailers
            </h2>
            <p className="text-xl" style={{ color: colors.textLight, opacity: 0.9 }}>
              Join the growing community of smart store owners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 rounded-2xl backdrop-blur-sm transform transition-all hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="text-7xl font-extrabold mb-4" style={{ color: colors.textLight }}>
                50+
              </div>
              <p className="text-2xl font-semibold" style={{ color: colors.textLight, opacity: 0.95 }}>
                Lottery Games Supported
              </p>
            </div>
            <div className="p-10 rounded-2xl backdrop-blur-sm transform transition-all hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="text-7xl font-extrabold mb-4" style={{ color: colors.textLight }}>
                24/7
              </div>
              <p className="text-2xl font-semibold" style={{ color: colors.textLight, opacity: 0.95 }}>
                Real-Time Tracking
              </p>
            </div>
            <div className="p-10 rounded-2xl backdrop-blur-sm transform transition-all hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="text-7xl font-extrabold mb-4" style={{ color: colors.textLight }}>
                100%
              </div>
              <p className="text-2xl font-semibold" style={{ color: colors.textLight, opacity: 0.95 }}>
                Secure & Encrypted
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Eye-Catching */}
      <div className="py-28 relative overflow-hidden"
        style={{
          background: isDark
            ? `linear-gradient(135deg, ${colors.surface} 0%, ${colors.accent} 100%)`
            : `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentOrange} 100%)`,
        }}
      >
        {/* Animated background elements */}
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
          <h2 className="text-6xl font-extrabold mb-6" style={{ color: colors.textLight }}>
            Ready to Transform Your Business?
          </h2>
          <p className="text-2xl mb-12 font-medium" style={{ color: colors.textLight, opacity: 0.95 }}>
            Join hundreds of lottery retailers managing their inventory smarter
            <br />
            <span className="text-3xl font-bold mt-2 inline-block">Start Your Free Trial Today!</span>
          </p>

          <div className="flex justify-center gap-6">
            <button
              onClick={() => navigate('/signup')}
              className="px-12 py-5 rounded-2xl font-bold text-2xl transition-all hover:scale-110 shadow-2xl"
              style={{
                backgroundColor: colors.textLight,
                color: colors.accent,
              }}
            >
              🎉 Get Started Now
            </button>
          </div>

          <p className="mt-10 text-lg font-medium" style={{ color: colors.textLight, opacity: 0.9 }}>
            💳 No Credit Card Required • ⚡ Setup in 5 Minutes • 📞 24/7 Support
          </p>
        </div>
      </div>

      {/* Footer - Modern & Clean */}
      <footer className="border-t py-12" style={{
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <img src="/logo/logo.png" alt="Lotto Pro Logo" className="h-12 w-auto" />
              <h3 className="text-2xl font-bold" style={{ color: colors.primary }}>
                Lotto Pro
              </h3>
            </div>

            {/* Tagline */}
            <p className="text-lg font-medium text-center" style={{ color: colors.textSecondary }}>
              Professional Lottery Store Management System
            </p>

            {/* Links */}
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

            {/* Social proof & Copyright */}
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
