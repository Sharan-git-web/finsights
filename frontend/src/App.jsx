import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import StockInsights from './pages/StockInsights';
import Compare from './pages/Compare';
import LongTermInvest from './pages/modules/LongTermInvest';
import LiabilityStructuring from './pages/modules/LiabilityStructuring';
import InsurancePlanning from './pages/modules/InsurancePlanning';
import CreditHealth from './pages/modules/CreditHealth';
import WealthAnalytics from './pages/modules/WealthAnalytics';
import AdvancedPlanning from './pages/modules/AdvancedPlanning';
import GovernmentSchemes from './pages/modules/GovernmentSchemes';
import FinancialPlanner from './pages/FinancialPlanner';
import Expenses from './pages/Expenses';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import EMIWidget from './components/EMIWidget';
import { CurrencyProvider } from './context/CurrencyContext';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();
  const location = useLocation();

  const handleStockSelect = (ticker) => {
    setSelectedTicker(ticker);
    navigate('/stockinsights');
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <CurrencyProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="bg-[var(--bg-primary)] min-h-screen text-[var(--text-main)] font-sans flex overflow-hidden transition-colors duration-300 w-full">
                <Sidebar
                  isOpen={isSidebarOpen}
                  setIsOpen={setIsSidebarOpen}
                  theme={theme}
                />

                <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} h-screen`}>
                  <Navbar theme={theme} toggleTheme={toggleTheme} onStockSelect={handleStockSelect} />
                  <main className="flex-1 overflow-y-auto p-6 scroll-smooth no-scrollbar">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard theme={theme} />} />
                      <Route path="/stockinsights" element={<StockInsights theme={theme} selectedTicker={selectedTicker} />} />
                      <Route path="/compare" element={<Compare theme={theme} />} />
                      <Route path="/financial-architecture/invest" element={<LongTermInvest />} />
                      <Route path="/financial-architecture/asset" element={<LiabilityStructuring />} />
                      <Route path="/financial-architecture/insurance" element={<InsurancePlanning />} />
                      <Route path="/financial-architecture/credit" element={<CreditHealth />} />
                      <Route path="/financial-architecture/wealth" element={<WealthAnalytics />} />
                      <Route path="/financial-architecture/advanced" element={<AdvancedPlanning />} />
                      <Route path="/financial-architecture/gov" element={<GovernmentSchemes />} />
                      <Route path="/planner" element={<Navigate to="/financial-architecture/invest" replace />} />
                      <Route path="/expenses" element={<Expenses theme={theme} />} />
                      <Route path="/portfolio" element={<Portfolio theme={theme} />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </main>

                  {/* Global Overlays */}
                  {location.pathname.includes('/financial-architecture') && <EMIWidget />}
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </CurrencyProvider>
  );
}

export default App;
