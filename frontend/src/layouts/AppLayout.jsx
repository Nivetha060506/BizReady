import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import useAuthStore from '../store/authStore';

const AppLayout = () => {
  const { business, loading } = useAuthStore();

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-paper">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rust"></div>
    </div>
  );

  // If onboarding is not complete and we are not on the onboarding page, redirect
  if (business && !business.onboardingComplete && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="flex h-screen bg-paper overflow-hidden font-body">
      {/* Sidebar - Fixed Width */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
