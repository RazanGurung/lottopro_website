import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './screens/LandingPage';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import StoreListScreen from './screens/StoreListScreen';
import CreateStoreScreen from './screens/CreateStoreScreen';
import LotteryDashboard from './screens/LotteryDashboard';
import DashboardScreen from './screens/DashboardScreen';
import LotteryDetailScreen from './screens/LotteryDetailScreen';
import PrintReportScreen from './screens/PrintReportScreen';
import ProfileScreen from './screens/ProfileScreen';
import { STORAGE_KEYS } from './types';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignUpScreen />} />

          {/* Protected Routes */}
          <Route
            path="/stores"
            element={
              <ProtectedRoute>
                <StoreListScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stores/create"
            element={
              <ProtectedRoute>
                <CreateStoreScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/:storeId"
            element={
              <ProtectedRoute>
                <LotteryDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/:storeId"
            element={
              <ProtectedRoute>
                <DashboardScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lottery/:lotteryId"
            element={
              <ProtectedRoute>
                <LotteryDetailScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/:storeId"
            element={
              <ProtectedRoute>
                <PrintReportScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileScreen />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
