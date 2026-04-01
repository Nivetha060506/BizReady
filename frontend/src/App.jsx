import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useModuleStore from './store/moduleStore';
import { Toaster } from 'react-hot-toast';

// Layouts
import AppLayout from './layouts/AppLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Inventory from './pages/Inventory';
import CRM from './pages/CRM';
import Tasks from './pages/Tasks';
import Modules from './pages/Modules';
import AIInsights from './pages/AIInsights';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();
  
  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-paper">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rust"></div>
    </div>
  );
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const { fetchModules } = useModuleStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchModules();
    }
  }, [isAuthenticated]);

  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="crm" element={<CRM />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="modules" element={<Modules />} />
          <Route path="ai-insights" element={<AIInsights />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
