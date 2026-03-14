import { 
  ShieldCheck, 
  Receipt, 
  Package, 
  Users, 
  ClipboardList, 
  BarChart3, 
  Truck, 
  Clock,
  ArrowRight,
  Zap
} from 'lucide-react';
import useModuleStore from '../store/moduleStore';

const ModuleCard = ({ id, title, description, icon: Icon, isEnabled, onToggle }) => (
  <div className={`card-soft group transition-all duration-500 overflow-hidden relative ${
    isEnabled ? 'border-rust/30 bg-rust/[0.02]' : 'opacity-70 bg-mist/5 grayscale'
  }`}>
    {isEnabled && (
        <div className="absolute top-0 right-0 p-4">
            <div className="w-8 h-8 bg-rust text-white rounded-full flex items-center justify-center shadow-lg shadow-rust/20">
                <Zap className="w-4 h-4" />
            </div>
        </div>
    )}
    
    <div className="flex items-start gap-6 relative z-10">
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border-2 border-white shadow-soft group-hover:scale-110 transition-transform ${
            isEnabled ? 'bg-ink text-white' : 'bg-cream text-mist'
        }`}>
            <Icon className="w-8 h-8" />
        </div>
        <div className="flex-1">
            <h4 className="font-heading text-xl font-bold text-ink mb-2">{title}</h4>
            <p className="text-sm text-mist font-medium leading-relaxed mb-6">{description}</p>
            
            <div className="flex items-center justify-between">
                 <button 
                    onClick={() => onToggle(id)}
                    className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        isEnabled ? 'bg-rust text-white shadow-lg shadow-rust/20' : 'bg-ink text-white hover:bg-zinc-800'
                    }`}
                 >
                    {isEnabled ? 'Disable Module' : 'Enable Module'}
                 </button>
                 {isEnabled && (
                     <span className="text-[10px] font-bold text-rust uppercase tracking-tighter flex items-center gap-1">
                        Active Now <ArrowRight className="w-3 h-3" />
                     </span>
                 )}
            </div>
        </div>
    </div>
  </div>
);

const Modules = () => {
  const { enabledModules, toggleModule } = useModuleStore();

  const moduleConfigs = [
    {
      id: 'salesInvoicing',
      title: 'Sales & Invoicing',
      description: 'Generate GST-compliant invoices, track payments, and manage sales reports effortlessly.',
      icon: Receipt
    },
    {
      id: 'inventory',
      title: 'Inventory & Stock',
      description: 'Real-time stock tracking, low-stock alerts, and SKU management across your warehouse.',
      icon: Package
    },
    {
      id: 'crm',
      title: 'CRM & Customers',
      description: 'Centralized customer database with relationship history, follow-up tracking, and VIP tagging.',
      icon: Users
    },
    {
      id: 'tasks',
      title: 'Operations Kanban',
      description: 'Manage internal business operations and team tasks with a visual drag-and-drop workflow.',
      icon: ClipboardList
    },
    {
        id: 'analytics',
        title: 'Business Insights',
        description: 'Advanced data visualizations of your revenue trends, top products, and growth metrics.',
        icon: BarChart3
    },
    {
        id: 'vendorPurchases',
        title: 'Vendor & Purchase',
        description: 'Track raw material purchases, manage supplier contacts, and monitor procurement costs.',
        icon: Truck
    },
    {
        id: 'hrTimekeeping',
        title: 'HR & Attendance',
        description: 'Manage staff profiles, track attendance, and process payroll for your SME workforce.',
        icon: Clock
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-ink tracking-tight">Toolkit Configuration</h1>
          <p className="text-mist font-medium">Enable or disable modules to customize BizReady for your unique business flow.</p>
        </div>
        <div className="bg-sage/10 text-sage px-4 py-2 rounded-2xl flex items-center gap-2 border border-sage/20">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Admin Control Only</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {moduleConfigs.map((cfg) => (
          <ModuleCard 
            key={cfg.id}
            id={cfg.id}
            title={cfg.title}
            description={cfg.description}
            icon={cfg.icon}
            isEnabled={enabledModules[cfg.id]}
            onToggle={toggleModule}
          />
        ))}
      </div>

      <div className="bg-ink text-paper p-10 rounded-[40px] flex flex-col md:flex-row items-center gap-12 mt-12 overflow-hidden relative">
          <div className="absolute inset-0 bg-rust/5 -rotate-12 scale-150 pointer-events-none"></div>
          <div className="relative z-10 flex-1">
              <h3 className="font-heading text-3xl font-black mb-4">Need a custom module?</h3>
              <p className="text-mist text-lg font-medium leading-relaxed max-w-xl">
                  BizReady is designed to grow with your SME. If you have specific workflow needs not covered here, our team can build it for you.
              </p>
              <button className="mt-8 bg-rust text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-rust/40 hover:-translate-y-1 transition-all">
                  Request Custom Build
              </button>
          </div>
          <div className="relative z-10 w-full md:w-auto">
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[40px] border border-white/10 flex flex-col items-center">
                  <div className="text-mist text-[10px] font-black uppercase tracking-[0.2em] mb-4">Toolkit efficiency</div>
                  <div className="text-5xl font-heading font-black text-white mb-2">
                    {Math.round((Object.values(enabledModules).filter(v => v).length / moduleConfigs.length) * 100)}%
                  </div>
                  <div className="text-rust font-bold uppercase tracking-widest text-[9px]">Features Utilized</div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Modules;
