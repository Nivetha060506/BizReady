import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ReceiptIndianRupee, 
  Package, 
  Users, 
  CheckSquare, 
  Sparkles, 
  Settings,
  LogOut,
  ChevronRight,
  BrainCircuit
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useModuleStore from '../store/moduleStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const { logout, business } = useAuthStore();
  const { enabledModules } = useModuleStore();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/', enabled: true },
    { name: 'Sales & Invoicing', icon: ReceiptIndianRupee, path: '/invoices', enabled: enabledModules?.salesInvoicing },
    { name: 'Inventory', icon: Package, path: '/inventory', enabled: enabledModules?.inventory },
    { name: 'CRM', icon: Users, path: '/crm', enabled: enabledModules?.crm },
    { name: 'Tasks & Production', icon: CheckSquare, path: '/tasks', enabled: enabledModules?.tasks },
    { name: 'AI Insights', icon: BrainCircuit, path: '/ai-insights', enabled: true },
    { name: 'Onboarding Wizard', icon: Sparkles, path: '/onboarding', enabled: true },
    { name: 'Modules', icon: Settings, path: '/modules', enabled: true },
  ];

  return (
    <aside className="w-64 bg-ink text-paper flex flex-col border-r border-mist/20 shrink-0 z-30">
      {/* Logo Section */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rust rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-rust/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold tracking-tight text-white leading-none">BizReady</h1>
            <p className="text-[10px] text-mist font-medium tracking-widest uppercase mt-1">SME Toolkit</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4 custom-scrollbar">
        {menuItems.filter(item => item.enabled).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-rust text-white shadow-lg shadow-rust/20" 
                : "text-mist hover:bg-white/5 hover:text-paper"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-[15px]">{item.name}</span>
            </div>
            <ChevronRight className={cn(
              "w-4 h-4 opacity-0 transition-opacity",
              "group-hover:opacity-50"
            )} />
          </NavLink>
        ))}
      </nav>

      {/* Business Info & Logout */}
      <div className="p-4 mt-auto">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-cream/10 border border-white/10 flex items-center justify-center text-amber font-heading font-bold">
              {business?.name?.charAt(0) || 'B'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{business?.name || 'My Business'}</p>
              <p className="text-[10px] text-mist font-medium truncate uppercase tracking-wider">{business?.industry || 'SME'}</p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-mist hover:text-rust hover:bg-rust/10 transition-colors duration-200 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
