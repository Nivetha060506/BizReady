import { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2, Save } from 'lucide-react';
import invoiceService from '../services/invoiceService';
import api from '../services/api';

const InvoiceModal = ({ invoice, onClose, onSuccess }) => {
  const isEditing = !!invoice;
  const [formData, setFormData] = useState({
    customer: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    items: [{ name: '', description: '', quantity: 1, price: 0, taxRate: 18 }],
    discount: 0,
    status: 'draft',
    notes: '',
    terms: 'Payment due within 30 days.'
  });
  
  const [customers, setCustomers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (invoice) setFormData({ ...invoice });
    fetchCustomers();
  }, [invoice]);

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get('/customers');
      setCustomers(data);
    } catch (error) {}
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', description: '', quantity: 1, price: 0, taxRate: 18 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === 'name' || field === 'description' ? value : Number(value);
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotals = () => {
    const safeItems = Array.isArray(formData.items) ? formData.items : [];
    const subtotal = safeItems.reduce((s, i) => s + ((i?.price || 0) * (i?.quantity || 0)), 0);
    const taxAmount = safeItems.reduce((s, i) => s + ((i?.price || 0) * (i?.quantity || 0) * (i?.taxRate || 18) / 100), 0);
    const total = subtotal + taxAmount - (formData?.discount || 0);
    return { subtotal, taxAmount, total };
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  const handleCustomerSelect = (e) => {
    const custId = e.target.value;
    if (!custId) return;
    const cust = (customers || []).find(c => c._id === custId);
    if (cust) {
      setFormData({
        ...formData,
        customer: cust?._id,
        customerName: cust?.name,
        customerEmail: cust?.email,
        customerPhone: cust?.phone,
        customerAddress: cust?.address
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const submissionData = { ...formData };
    if (!submissionData.customer) delete submissionData.customer;

    try {
      if (isEditing) {
        await invoiceService.updateInvoice(invoice._id, submissionData);
      } else {
        await invoiceService.createInvoice(submissionData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-paper w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-mist/10 flex items-center justify-between bg-white text-ink">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight">
              {isEditing ? `Edit Invoice ${invoice.invoiceNumber}` : 'Create New Invoice'}
            </h2>
            <p className="text-[10px] text-mist font-bold uppercase tracking-widest mt-1">SME Billing Engine</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-cream rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Customer Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-rust mb-4">Customer Details</h3>
              <div className="space-y-3">
                <select 
                  className="w-full bg-cream/40 border-2 border-transparent focus:border-rust/30 p-3 rounded-xl outline-none font-bold text-sm"
                  onChange={handleCustomerSelect}
                  value={formData.customer}
                >
                  <option value="">Select Existing Customer</option>
                  {(customers || []).map(c => (
                    <option key={c?._id} value={c?._id}>{c?.name}</option>
                  ))}
                </select>
                
                <input 
                  placeholder="Customer Name"
                  required
                  className="w-full bg-cream/40 border-2 border-transparent focus:border-rust/30 p-3 rounded-xl outline-none text-sm font-medium"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    placeholder="Phone"
                    className="w-full bg-cream/40 border-2 border-transparent focus:border-rust/30 p-3 rounded-xl outline-none text-sm font-medium"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  />
                  <input 
                    placeholder="Email"
                    className="w-full bg-cream/40 border-2 border-transparent focus:border-rust/30 p-3 rounded-xl outline-none text-sm font-medium"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  />
                </div>
                
                <textarea 
                  placeholder="Billing Address"
                  className="w-full bg-cream/40 border-2 border-transparent focus:border-rust/30 p-3 rounded-xl outline-none text-sm font-medium h-24 resize-none"
                  value={formData.customerAddress}
                  onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                />
              </div>
            </div>

            {/* Invoice Settings */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-amber mb-4">Invoice Settings</h3>
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Current Status</label>
                    <div className="flex gap-2 mt-2">
                        {['draft', 'pending', 'paid'].map(s => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setFormData({...formData, status: s})}
                                className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border-2 transition-all ${
                                    formData.status === s ? 'bg-ink border-ink text-white' : 'border-mist/10 text-mist'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Notes to Customer</label>
                    <textarea 
                        className="w-full bg-cream/40 border-2 border-transparent focus:border-rust/30 p-3 rounded-xl outline-none text-sm font-medium h-24 resize-none"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                 </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-ink/50">Invoice Items</h3>
              <button 
                type="button" 
                onClick={addItem}
                className="text-xs font-bold text-rust flex items-center gap-1 hover:underline"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {(formData?.items || []).map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start animate-in slide-in-from-left-2 duration-300">
                  <div className="flex-1 space-y-2">
                    <input 
                      placeholder="Item name"
                      required
                      className="w-full bg-white border border-mist/10 p-2.5 rounded-lg text-sm font-bold"
                      value={item.name}
                      onChange={(e) => updateItem(idx, 'name', e.target.value)}
                    />
                    <input 
                      placeholder="Description (Optional)"
                      className="w-full bg-white border border-mist/10 p-2.5 rounded-lg text-[10px] font-medium"
                      value={item.description}
                      onChange={(e) => updateItem(idx, 'description', e.target.value)}
                    />
                  </div>
                  <div className="w-20">
                    <input 
                      type="number"
                      placeholder="Qty"
                      className="w-full bg-white border border-mist/10 p-2.5 rounded-lg text-sm font-bold text-center"
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                    />
                  </div>
                  <div className="w-32">
                    <input 
                      type="number"
                      placeholder="Price"
                      className="w-full bg-white border border-mist/10 p-2.5 rounded-lg text-sm font-bold text-right"
                      value={item.price}
                      onChange={(e) => updateItem(idx, 'price', e.target.value)}
                    />
                  </div>
                  <div className="pt-2">
                    <button 
                      type="button" 
                      onClick={() => removeItem(idx)}
                      disabled={formData.items.length === 1}
                      className="p-2 text-mist hover:text-rust opacity-50 hover:opacity-100 disabled:hidden"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="bg-ink text-paper rounded-3xl p-8 flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="w-full md:w-1/2 space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-mist">Payment Terms</label>
                    <input 
                        className="w-full bg-white/5 border border-white/5 p-3 rounded-xl outline-none text-xs text-paper"
                        value={formData.terms}
                        onChange={(e) => setFormData({...formData, terms: e.target.value})}
                    />
                </div>
            </div>
            
            <div className="w-full md:w-64 space-y-3">
              <div className="flex justify-between text-xs font-medium text-mist">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-mist">
                <span>GST (18%)</span>
                <span>₹{taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-mist">
                <div className="flex items-center gap-2">
                    <span>Discount</span>
                    <input 
                        type="number"
                        className="w-16 bg-white/5 border-none p-1 rounded text-[10px] text-right text-rust font-bold"
                        value={formData.discount}
                        onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})}
                    />
                </div>
                <span className="text-rust">-₹{formData.discount}</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="font-heading font-black text-white text-lg uppercase tracking-tight">Total</span>
                <span className="text-3xl font-heading font-black text-rust">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-mist/10 bg-white flex justify-between items-center">
          <button 
            type="button" 
            onClick={onClose}
            className="text-sm font-bold text-mist hover:text-ink px-4"
          >
            Discard Changes
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-ink text-white rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-ink/10 hover:shadow-2xl active:scale-[0.98] transition-all"
            >
              {isSubmitting ? 'Processing...' : 'Save Invoice'}
              <Save className="w-4 h-4" />
            </button>
            <button
               type="button"
               disabled={isSubmitting}
               className="px-8 py-3.5 bg-rust text-white rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-rust/20 hover:shadow-2xl active:scale-[0.98] transition-all"
            >
              Post & Send
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
