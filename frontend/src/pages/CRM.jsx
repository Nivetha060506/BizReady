import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Edit2, 
  Trash2, 
  Star,
  MessageSquare,
  UserCheck,
  Building,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import customerService from '../services/customerService';
import CustomerModal from '../components/CustomerModal';

const Tag = ({ text, color }) => (
  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${color}`}>
    {text}
  </span>
);

const CRM = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await customerService.getCustomers({ search, status });
      setCustomers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, status]);

  const handleDelete = async (id) => {
    if (window.confirm('Remove this customer profile?')) {
      await customerService.deleteCustomer(id);
      fetchCustomers();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-sage/10 text-sage border-sage/20';
      case 'prospect': return 'bg-amber/10 text-amber border-amber/20';
      case 'inactive': return 'bg-mist/10 text-mist border-mist/20';
      default: return 'bg-mist/10 text-mist border-mist/20';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-ink tracking-tight">Customer Relationships</h1>
          <p className="text-mist font-medium">Manage your clients, track lifetime value, and never miss a follow-up.</p>
        </div>
        <button 
          onClick={() => { setSelectedCustomer(null); setIsModalOpen(true); }}
          className="btn-primary flex items-center gap-2 bg-steel shadow-steel/20"
        >
          <Plus className="w-4 h-4" />
          Add New Customer
        </button>
      </div>

      {/* CRM Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-soft">
           <p className="text-[10px] text-mist font-bold uppercase tracking-widest mb-1">Total Customers</p>
           <h4 className="text-2xl font-heading font-black text-ink">{customers.length}</h4>
        </div>
        <div className="card-soft">
           <p className="text-[10px] text-mist font-bold uppercase tracking-widest mb-1">Active Accounts</p>
           <h4 className="text-2xl font-heading font-black text-sage">{customers.filter(c => c.status === 'active').length}</h4>
        </div>
        <div className="card-soft">
           <p className="text-[10px] text-mist font-bold uppercase tracking-widest mb-1">Pipeline Value</p>
           <h4 className="text-2xl font-heading font-black text-amber">₹{customers.reduce((s, c) => s + (c.totalBusinessValue || 0), 0).toLocaleString()}</h4>
        </div>
        <div className="card-soft">
           <p className="text-[10px] text-mist font-bold uppercase tracking-widest mb-1">Needs Follow-up</p>
           <h4 className="text-2xl font-heading font-black text-rust">{customers.filter(c => c.followUpDate && new Date(c.followUpDate) <= new Date()).length}</h4>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-mist/10 shadow-soft flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
          <input 
            type="text" 
            placeholder="Search by name, email, or company..." 
            className="w-full bg-cream/30 border border-transparent focus:border-mist/20 p-2.5 pl-11 rounded-xl outline-none text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            className="bg-cream/30 border-none p-2.5 rounded-xl text-sm font-bold text-ink outline-none min-w-[140px]"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="active">Active</option>
            <option value="prospect">Prospect</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
            [...Array(4)].map((_, i) => <div key={i} className="h-48 bg-mist/5 rounded-3xl animate-pulse"></div>)
        ) : customers.length > 0 ? (
            customers.map((customer) => (
                <div key={customer._id} className="card-soft group hover:border-steel/30 transition-all duration-500 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-steel/5 -mr-12 -mt-12 rounded-full pointer-events-none group-hover:scale-110 transition-transform"></div>
                    
                    <div className="flex items-start gap-5 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center font-heading font-black text-xl text-steel border-2 border-white shadow-soft group-hover:bg-steel group-hover:text-white transition-all transform group-hover:rotate-3 shrink-0">
                            {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-heading text-lg font-bold text-ink truncate">{customer.name}</h4>
                                <Tag text={customer.status} color={getStatusColor(customer.status)} />
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-mist font-bold uppercase tracking-widest mb-4">
                                <Building className="w-3 h-3" /> {customer.company || 'Private Client'}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-xs font-medium text-ink/70">
                                    <Phone className="w-3 h-3 text-mist" /> {customer.phone || 'N/A'}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium text-ink/70 truncate">
                                    <Mail className="w-3 h-3 text-mist" /> {customer.email || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-6 pt-6 border-t border-mist/10">
                        <div>
                             <p className="text-[9px] text-mist font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Next Follow-up
                             </p>
                             <div className={`text-xs font-bold ${
                                 customer.followUpDate && new Date(customer.followUpDate) <= new Date() ? 'text-rust' : 'text-ink'
                             }`}>
                                 {customer.followUpDate ? new Date(customer.followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'No task set'}
                             </div>
                        </div>
                        <div className="text-right">
                             <p className="text-[9px] text-mist font-bold uppercase tracking-widest mb-1.5">Business Value</p>
                             <div className="text-sm font-black text-ink">₹{(customer.totalBusinessValue || 0).toLocaleString()}</div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                         <div className="flex gap-1">
                            {customer.tags?.slice(0, 2).map((t, i) => (
                                <span key={i} className="px-2 py-0.5 bg-cream/50 text-[9px] font-bold rounded-lg text-ink/50 uppercase tracking-tight italic">#{t}</span>
                            ))}
                         </div>
                         <div className="flex items-center gap-2">
                             <button 
                                onClick={() => { setSelectedCustomer(customer); setIsModalOpen(true); }}
                                className="p-2 rounded-xl text-mist hover:text-steel hover:bg-steel/5 transition-all"
                             >
                                <Edit2 className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => handleDelete(customer._id)}
                                className="p-2 rounded-xl text-mist hover:text-red-500 hover:bg-red-50 transition-all"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => { setSelectedCustomer(customer); setIsModalOpen(true); }}
                               className="flex items-center gap-1 bg-ink text-white px-3 py-1.5 rounded-xl text-[10px] font-bold hover:bg-steel transition-all group-hover:shadow-lg group-hover:shadow-steel/20 ml-2"
                             >
                                Details <ArrowRight className="w-3 h-3" />
                             </button>
                         </div>
                    </div>
                </div>
            ))
        ) : (
            <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-mist/10 shadow-soft">
                <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-6 border border-mist/20">
                    <Users className="w-10 h-10 text-mist" />
                </div>
                <h4 className="font-heading text-2xl font-bold text-ink mb-1">Start Building Relationships</h4>
                <p className="text-mist font-medium max-w-sm mx-auto">Digitize your customer list to track lifetime value and sales opportunities.</p>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="mt-8 btn-primary bg-steel shadow-steel/20 flex items-center gap-2 mx-auto"
                >
                    <Plus className="w-4 h-4" /> Add First Customer
                </button>
            </div>
        )}
      </div>

      {isModalOpen && (
        <CustomerModal 
          customer={selectedCustomer} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchCustomers}
        />
      )}
    </div>
  );
};

export default CRM;
