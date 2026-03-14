import { useState, useEffect } from 'react';
import { X, Save, User, Building, Phone, Mail, MapPin, Calendar, Tag as TagIcon } from 'lucide-react';
import customerService from '../services/customerService';

const CustomerModal = ({ customer, onClose, onSuccess }) => {
  const isEditing = !!customer;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    state: '',
    gstin: '',
    address: '',
    followUpDate: '',
    followUpNote: '',
    status: 'active',
    tags: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
        setFormData({ 
            ...customer,
            followUpDate: customer.followUpDate ? new Date(customer.followUpDate).toISOString().split('T')[0] : '',
            tags: customer.tags?.join(', ') || ''
        });
    }
  }, [customer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSubmit = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };
      
      if (isEditing) {
        await customerService.updateCustomer(customer._id, dataToSubmit);
      } else {
        await customerService.createCustomer(dataToSubmit);
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
      
      <div className="relative bg-paper w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-mist/10 flex items-center justify-between bg-white text-ink">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${isEditing ? 'bg-steel' : 'bg-sage'}`}>
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-tight">
                {isEditing ? 'Edit Customer Profile' : 'Add New Customer'}
              </h2>
              <p className="text-[10px] text-mist font-bold uppercase tracking-widest mt-1">SME CRM Module</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-cream rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
          {/* Identity */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-steel/60 flex items-center gap-2">
               User Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Contact Name</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
                    <input 
                        name="name"
                        required
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full bg-cream/40 border-2 border-transparent focus:border-steel/30 p-3 pl-10 rounded-xl outline-none font-bold text-sm"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Business/Company</label>
                <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
                    <input 
                        name="company"
                        placeholder="e.g. Kumar Enterprise"
                        className="w-full bg-cream/40 border-2 border-transparent focus:border-steel/30 p-3 pl-10 rounded-xl outline-none font-bold text-sm"
                        value={formData.company}
                        onChange={handleChange}
                    />
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-sage/60">Contact & Billing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Phone Number</label>
                 <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
                    <input 
                        name="phone"
                        className="w-full bg-cream/40 border-2 border-transparent focus:border-steel/30 p-3 pl-10 rounded-xl outline-none font-bold text-sm"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                 </div>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Email Address</label>
                 <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
                    <input 
                        type="email"
                        name="email"
                        className="w-full bg-cream/40 border-2 border-transparent focus:border-steel/30 p-3 pl-10 rounded-xl outline-none font-bold text-sm"
                        value={formData.email}
                        onChange={handleChange}
                    />
                 </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">GSTIN Number</label>
                    <input 
                        name="gstin"
                        placeholder="27AAAAA0000A1Z5"
                        className="w-full bg-cream/40 border-2 border-transparent focus:border-steel/30 p-3 rounded-xl outline-none font-bold text-sm tracking-widest"
                        value={formData.gstin}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">City</label>
                    <input 
                        name="city"
                        className="w-full bg-cream/40 border-2 border-transparent focus:border-steel/30 p-3 rounded-xl outline-none font-bold text-sm"
                        value={formData.city}
                        onChange={handleChange}
                    />
                </div>
            </div>
          </div>

          {/* CRM Strategy */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-amber/60">Relationship Strategy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Next Follow-up</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
                        <input 
                            type="date"
                            name="followUpDate"
                            className="w-full bg-cream/40 border-2 border-transparent focus:border-steel/30 p-3 pl-10 rounded-xl outline-none font-bold text-sm"
                            value={formData.followUpDate}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Account Relationship</label>
                    <select 
                        name="status"
                        className="w-full bg-cream/40 border-2 border-transparent focus:border-steel/30 p-3 rounded-xl outline-none font-bold text-sm"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="active">Active Customer</option>
                        <option value="prospect">Sale Prospect</option>
                        <option value="inactive">Inactive / Lapsed</option>
                    </select>
                </div>
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Internal Note for Follow-up</label>
                <textarea 
                    name="followUpNote"
                    placeholder="Briefly state why you need to contact them next..."
                    className="w-full bg-cream/30 border-2 border-transparent focus:border-steel/20 p-4 rounded-xl outline-none text-sm font-medium h-20 resize-none"
                    value={formData.followUpNote}
                    onChange={handleChange}
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Tags (Comma separated)</label>
                <div className="relative">
                    <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
                    <input 
                        name="tags"
                        placeholder="VIP, Frequent, Wholesale, New"
                        className="w-full bg-cream/30 border-2 border-transparent p-3 pl-10 rounded-xl outline-none text-xs font-bold"
                        value={formData.tags}
                        onChange={handleChange}
                    />
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
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-10 py-4 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl active:scale-[0.98] transition-all ${
                isEditing ? 'bg-steel shadow-steel/20' : 'bg-sage shadow-sage/20'
            }`}
          >
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Profile' : 'Save Customer')}
            <Save className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;
