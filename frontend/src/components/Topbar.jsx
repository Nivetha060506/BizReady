import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, HelpCircle, Plus, Search, User, X, CheckCircle, AlertCircle, Clock, ExternalLink, LifeBuoy, FileText } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Topbar = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const notificationRef = useRef(null);
  const helpRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setShowHelp(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dummy notifications
  const notifications = [
    { id: 1, title: 'New Invoice Created', desc: 'Invoice #INV-2023-001 has been generated.', time: '10m ago', type: 'success', read: false },
    { id: 2, title: 'Low Stock Alert', desc: 'Product "Wireless Mouse" is running low on inventory.', time: '1h ago', type: 'warning', read: false },
    { id: 3, title: 'System Update', desc: 'BizReady version 2.1 has been successfully deployed.', time: '2d ago', type: 'info', read: true },
  ];

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/invoices') return 'Sales & Invoicing';
    if (path === '/inventory') return 'Inventory Management';
    if (path === '/crm') return 'Customer Relationships';
    if (path === '/tasks') return 'Tasks & Production';
    if (path === '/onboarding') return 'Onboarding Wizard';
    if (path === '/modules') return 'Module Manager';
    return 'BizReady';
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-mist/10 px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-8">
        <h2 className="text-2xl font-heading font-bold text-ink tracking-tight">{getPageTitle()}</h2>
        
        {/* Quick Search */}
        <div className="hidden lg:flex items-center relative">
          <Search className="absolute left-3 w-4 h-4 text-mist" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-cream/50 border border-transparent focus:border-mist/20 focus:bg-white pl-10 pr-4 py-2 rounded-xl text-sm outline-none transition-all w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          to="/invoices" 
          className="hidden md:flex items-center gap-2 bg-rust text-white px-5 py-2.5 rounded-xl font-medium hover:bg-rust/90 active:scale-95 transition-all shadow-lg shadow-rust/20"
        >
          <Plus className="w-4 h-4" />
          New Invoice
        </Link>

        <div className="flex items-center gap-2 border-l border-mist/20 ml-2 pl-4">
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowHelp(false);
              }}
              className={`p-2.5 rounded-xl transition-all relative ${showNotifications ? 'bg-cream text-ink' : 'text-mist hover:bg-cream hover:text-ink'}`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rust rounded-full border-2 border-white"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-mist/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between px-4 py-3 border-b border-mist/10 bg-paper/50">
                  <h3 className="font-heading font-semibold text-ink">Notifications</h3>
                  <button className="text-xs font-medium text-rust hover:underline">Mark all as read</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`flex items-start gap-3 p-4 border-b border-mist/5 hover:bg-cream/50 transition-colors cursor-pointer ${notif.read ? 'opacity-70' : ''}`}>
                      <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        notif.type === 'success' ? 'bg-sage/10 text-sage' : 
                        notif.type === 'warning' ? 'bg-rust/10 text-rust' : 
                        'bg-ink/5 text-ink'
                      }`}>
                        {notif.type === 'success' && <CheckCircle className="w-4 h-4" />}
                        {notif.type === 'warning' && <AlertCircle className="w-4 h-4" />}
                        {notif.type === 'info' && <Bell className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-ink leading-none mb-1">{notif.title}</h4>
                        <p className="text-xs text-mist leading-relaxed mb-2">{notif.desc}</p>
                        <div className="flex items-center gap-1 text-[10px] text-mist font-medium">
                          <Clock className="w-3 h-3" />
                          <span>{notif.time}</span>
                        </div>
                      </div>
                      {!notif.read && <div className="w-2 h-2 bg-rust rounded-full mt-1 shrink-0"></div>}
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-paper/50 border-t border-mist/10 text-center">
                  <button className="text-sm font-semibold text-ink hover:text-rust transition-colors">View all notifications</button>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative" ref={helpRef}>
            <button 
              onClick={() => {
                setShowHelp(!showHelp);
                setShowNotifications(false);
              }}
              className={`p-2.5 rounded-xl transition-all ${showHelp ? 'bg-cream text-ink' : 'text-mist hover:bg-cream hover:text-ink'}`}
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            
            {showHelp && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-mist/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-mist/10 bg-paper/50">
                  <h3 className="font-heading font-semibold text-ink">Help & Support</h3>
                  <p className="text-xs text-mist mt-0.5">How can we help you today?</p>
                </div>
                <div className="p-2">
                  <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cream transition-colors text-sm font-medium text-ink group">
                    <div className="w-8 h-8 rounded-lg bg-ink/5 flex items-center justify-center text-ink group-hover:bg-white group-hover:shadow-sm transition-all">
                      <LifeBuoy className="w-4 h-4" />
                    </div>
                    Contact Support
                  </a>
                  <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cream transition-colors text-sm font-medium text-ink group">
                    <div className="w-8 h-8 rounded-lg bg-sage/10 flex items-center justify-center text-sage group-hover:bg-white group-hover:shadow-sm transition-all">
                      <FileText className="w-4 h-4" />
                    </div>
                    Documentation
                  </a>
                  <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cream transition-colors text-sm font-medium text-ink group">
                    <div className="w-8 h-8 rounded-lg bg-rust/10 flex items-center justify-center text-rust group-hover:bg-white group-hover:shadow-sm transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    Community Forum
                  </a>
                </div>
                <div className="p-3 bg-paper/50 border-t border-mist/10 text-center">
                  <p className="text-[10px] text-mist font-medium">BizReady Version 2.1.0</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 ml-2 group cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-ink leading-tight group-hover:text-rust transition-colors">{user?.name}</p>
              <p className="text-[10px] text-mist font-medium uppercase tracking-wider">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sage/10 border border-sage/20 flex items-center justify-center text-sage group-hover:bg-sage group-hover:text-white transition-all overflow-hidden shadow-inner">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
