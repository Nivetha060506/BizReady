import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Package, 
  Receipt, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { RevenueAreaChart, SalesBarChart, DigitalRadarChart } from '../components/DashboardCharts';
import dashboardService from '../services/dashboardService';
import useAuthStore from '../store/authStore';
import useModuleStore from '../store/moduleStore';
import { toast } from 'react-hot-toast';

const StatCard = ({ title, value, subValue, icon: Icon, trend, trendValue, color }) => (
  <div className="card-soft relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-110`} style={{ backgroundColor: color }}></div>
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}15`, color: color }}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-sage' : 'text-rust'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trendValue}
        </div>
      )}
    </div>
    
    <div className="relative z-10">
      <p className="text-mist text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-heading font-black text-ink">{value}</h3>
      <p className="text-mist text-[10px] font-medium mt-1">{subValue}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { business } = useAuthStore();
  const { enabledModules: modules } = useModuleStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleUpdateStock = () => {
    if (modules.inventory) {
      navigate('/inventory');
    } else {
      toast.error('Inventory module is disabled. Please enable it in the Module Manager.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, rRes, pRes, aRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRevenueChart(),
          dashboardService.getTopProducts(),
          dashboardService.getRecentActivity()
        ]);
        setStats(sRes?.data || {});
        setRevenueData(Array.isArray(rRes?.data) ? rRes.data : []);
        setTopProducts(Array.isArray(pRes?.data) ? pRes.data : []);
        setActivities(Array.isArray(aRes?.data) ? aRes.data : []);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-mist/10 rounded-2xl"></div>)}
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-ink">Namaste, {business?.name}</h1>
          <p className="text-mist font-medium">Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-mist/10 shadow-soft">
          <Clock className="w-4 h-4 text-rust" />
          <span className="text-xs font-bold text-ink uppercase tracking-tight">Last Updated: Just Now</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Monthly Revenue" 
          value={`₹${(stats?.monthlyRevenue || 0).toLocaleString()}`} 
          subValue="Target: ₹50,000"
          icon={TrendingUp}
          trend="up"
          trendValue="+12.5%"
          color="#c84b2f"
        />
        <StatCard 
          title="Pending Invoices" 
          value={stats?.pendingInvoices?.count || 0} 
          subValue={`Total: ₹${(stats?.pendingInvoices?.amount || 0).toLocaleString()}`}
          icon={Receipt}
          trend="down"
          trendValue="-2%"
          color="#e8933a"
        />
        <StatCard 
          title="Active Customers" 
          value={stats?.customerCount || 0} 
          subValue="3 New this week"
          icon={Users}
          trend="up"
          trendValue="+5"
          color="#4a7c59"
        />
        <StatCard 
          title="Stock Items" 
          value={stats?.stockCount || 0} 
          subValue={stats?.lowStockCount > 0 ? `${stats.lowStockCount} items need reorder` : 'All items in stock'}
          icon={Package}
          color="#3a5a7c"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 card-soft">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-heading text-xl font-bold text-ink">Revenue Performance</h3>
            <select className="bg-cream/50 text-xs font-bold border-none rounded-lg px-3 py-1.5 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          {revenueData.length > 0 && revenueData.some(d => d.revenue > 0) ? (
            <RevenueAreaChart data={revenueData} />
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-center p-6 bg-cream/10 rounded-2xl border border-dashed border-mist/20">
              <TrendingUp className="w-12 h-12 text-mist/30 mb-3" />
              <p className="text-sm font-bold text-mist">No revenue recorded yet.</p>
              <p className="text-[10px] text-mist/70 uppercase font-medium mt-1 tracking-widest">Mark invoices as paid to see growth trends</p>
            </div>
          )}
        </div>

        {/* Digital Readiness Radar / Quick Info */}
        <div className="card-soft bg-ink text-white border-none shadow-2xl shadow-ink/40">
          <div className="h-[250px] w-full flex items-center justify-center relative">
            <DigitalRadarChart score={Number(business?.digitalReadinessScore || 0)} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-rust font-heading font-black text-2xl tracking-tighter">
              {Number(business?.digitalReadinessScore || 0)}%
            </p>
            <p className="text-mist text-[11px] font-bold uppercase tracking-widest mt-1">
              Readiness Score
            </p>
            <p className="mt-4 text-mist/80 text-center text-[10px] font-medium leading-relaxed max-w-[200px] mx-auto">
              You are <span className="text-rust font-bold">Scaling Digital</span>. Keep going to reach 100% maturity.
            </p>
          </div>
          <button className="w-full mt-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-mist hover:text-white transition-colors">
            View Detail Report <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Products */}
        <div className="card-soft">
          <h3 className="font-heading text-xl font-bold text-ink mb-6">Top Selling Products</h3>
          {(topProducts || []).length > 0 ? (
            <SalesBarChart data={topProducts} />
          ) : (
            <div className="h-[250px] flex flex-col items-center justify-center text-center p-6 bg-cream/30 rounded-2xl">
              <Package className="w-12 h-12 text-mist/50 mb-3" />
              <p className="text-sm font-bold text-mist">No sales data yet.</p>
              <p className="text-[10px] text-mist/70 uppercase font-medium mt-1 tracking-widest leading-tight">Create your first invoice to see insights</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 card-soft">
          <h3 className="font-heading text-xl font-bold text-ink mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {(activities || []).length > 0 ? activities.map((activity) => (
              <div key={activity?._id || Math.random()} className="flex items-center gap-4 p-4 rounded-2xl bg-cream/30 border border-transparent hover:border-mist/10 transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg ${
                  activity.action === 'created' ? 'bg-sage shadow-sage/20' : 
                  activity.action === 'updated' ? 'bg-amber shadow-amber/20' : 'bg-steel shadow-steel/20'
                }`}>
                  {activity.entity?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-ink">{activity?.description || 'System Activity'}</p>
                  <p className="text-[10px] text-mist font-medium uppercase tracking-wider mt-0.5">
                    {activity?.userName || 'System'} • {activity?.createdAt ? new Date(activity.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <button className="p-2 rounded-lg hover:bg-white text-mist hover:text-ink transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="w-12 h-12 text-mist/30 mb-2" />
                <p className="text-sm font-bold text-mist uppercase tracking-widest">No activity logged yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {stats?.lowStockCount > 0 && (
        <div className="bg-rust/5 border-2 border-rust/10 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-rust text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rust/20">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-heading text-xl font-bold text-rust">Inventory Alert</h4>
              <p className="text-ink/60 font-medium text-sm">You have {stats.lowStockCount} items running below reorder levels.</p>
            </div>
          </div>
          <button 
            onClick={handleUpdateStock}
            className="bg-rust text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-rust/20 hover:-translate-y-0.5 transition-all"
          >
            Update Stock Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
