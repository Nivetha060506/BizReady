import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  FileText, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Receipt
} from 'lucide-react';
import invoiceService from '../services/invoiceService';
import InvoiceModal from '../components/InvoiceModal';

const StatusBadge = ({ status }) => {
  const styles = {
    paid: 'bg-sage/10 text-sage border-sage/20',
    pending: 'bg-amber/10 text-amber border-amber/20',
    overdue: 'bg-rust/10 text-rust border-rust/20',
    draft: 'bg-mist/10 text-mist border-mist/20',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles.draft}`}>
      {status || 'unknown'}
    </span>
  );
};

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoiceService.getInvoices({ search, status });
      setInvoices(response?.data?.invoices || []);
    } catch (error) { 
      console.error('Fetch Invoices Error:', error);
      setInvoices([]); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [search, status]);

  const handleDownloadPDF = async (id, invNum) => {
    try {
      const { data } = await invoiceService.downloadPDF(id);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invNum}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) { console.error(error); }
  };

  const handleExportCSV = async () => {
    try {
      const { data } = await invoiceService.exportCSV();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'invoices_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this invoice?')) {
      await invoiceService.deleteInvoice(id);
      fetchInvoices();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-ink tracking-tight">Sales & Invoicing</h1>
          <p className="text-mist font-medium">Manage your bills, track payments, and generate GST invoices.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="btn-outline flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button 
            onClick={() => { setSelectedInvoice(null); setIsModalOpen(true); }}
            className="btn-primary flex items-center gap-2 bg-rust shadow-rust/20"
          >
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-mist/10 shadow-soft flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
          <input 
            type="text" 
            placeholder="Search by invoice number or customer name..." 
            className="w-full bg-cream/30 border border-transparent focus:border-mist/20 p-2.5 pl-11 rounded-xl outline-none text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-mist hidden sm:block" />
          <select 
            className="bg-cream/30 border-none p-2.5 rounded-xl text-sm font-bold text-ink outline-none min-w-[140px]"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="card-soft overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-ink text-white font-heading text-[11px] uppercase tracking-widest leading-none">
                <th className="px-6 py-5">Invoice No</th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Total Amount</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist/10">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8 bg-mist/5"></td>
                  </tr>
                ))
              ) : (invoices || []).length > 0 ? (
                invoices.map((inv) => (
                  <tr key={inv?._id || Math.random()} className="hover:bg-cream/20 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-rust/10 text-rust group-hover:scale-110 transition-transform">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-ink tracking-tight">{inv?.invoiceNumber || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-ink">{inv?.customerName || 'Unknown Customer'}</p>
                      <p className="text-[10px] text-mist font-medium uppercase tracking-wider">{inv?.customerPhone || 'No Phone'}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-medium text-ink/70">
                        {inv?.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-ink">₹{(inv?.totalAmount || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={inv?.status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setSelectedInvoice(inv); setIsModalOpen(true); }}
                          className="p-2 rounded-lg text-mist hover:text-ink hover:bg-cream transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                         <button 
                          onClick={() => handleDownloadPDF(inv?._id, inv?.invoiceNumber)}
                          className="p-2 rounded-lg text-mist hover:text-rust hover:bg-rust/10 transition-all"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(inv?._id)}
                          className="p-2 rounded-lg text-mist hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="max-w-xs mx-auto">
                      <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4 border border-mist/20 text-mist">
                        <Receipt className="w-8 h-8" />
                      </div>
                      <h4 className="font-heading text-lg font-bold text-ink">No invoices found</h4>
                      <p className="text-sm text-mist mt-2 mb-6 font-medium">Create your first invoice to start tracking sales.</p>
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary w-full bg-rust shadow-rust/20"
                      >
                        Create New Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <InvoiceModal 
          invoice={selectedInvoice} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchInvoices}
        />
      )}
    </div>
  );
};

export default Invoices;
