import { useState, useEffect } from 'react';
import { X, Save, Package, Tag, Layers, Truck, AlertCircle } from 'lucide-react';
import inventoryService from '../services/inventoryService';

const InventoryModal = ({ item, onClose, onSuccess }) => {
  const isEditing = !!item;
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'General',
    unit: 'pcs',
    quantity: 0,
    reorderLevel: 10,
    purchasePrice: 0,
    sellingPrice: 0,
    description: '',
    supplier: '',
    location: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) setFormData({ ...item });
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: e.target.type === 'number' ? Number(value) : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await inventoryService.updateItem(item._id, formData);
      } else {
        await inventoryService.createItem(formData);
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
      
      <div className="relative bg-paper w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-mist/10 flex items-center justify-between bg-white text-ink">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${isEditing ? 'bg-sage' : 'bg-rust'}`}>
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-tight">
                {isEditing ? 'Update Stock Item' : 'Add New Inventory'}
              </h2>
              <p className="text-[10px] text-mist font-bold uppercase tracking-widest mt-1">Smart Stock Tracking</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-cream rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-ink/40 flex items-center gap-2">
              <Tag className="w-3 h-3" /> Basic Product Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Product Name</label>
                <input 
                  name="name"
                  required
                  placeholder="e.g. Copper Wire Reel"
                  className="w-full bg-cream/40 border-2 border-transparent focus:border-rust/30 p-3 rounded-xl outline-none font-bold text-sm"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">SKU / Code</label>
                <input 
                  name="sku"
                  placeholder="CW-102-RED"
                  className="w-full bg-cream/40 border-2 border-transparent focus:border-rust/30 p-3 rounded-xl outline-none font-bold text-sm"
                  value={formData.sku}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Category</label>
                    <input 
                        name="category"
                        className="w-full bg-cream/40 border-2 border-transparent focus:border-rust/30 p-3 rounded-xl outline-none font-bold text-sm"
                        value={formData.category}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Unit Type</label>
                    <select 
                        name="unit"
                        className="w-full bg-cream/40 border-2 border-transparent focus:border-rust/30 p-3 rounded-xl outline-none font-bold text-sm"
                        value={formData.unit}
                        onChange={handleChange}
                    >
                        <option value="pcs">Pieces (pcs)</option>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="mtr">Meters (mtr)</option>
                        <option value="ltr">Liters (ltr)</option>
                        <option value="box">Box</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Storage Location</label>
                    <input 
                        name="location"
                        placeholder="Warehouse A / Shelf 4"
                        className="w-full bg-cream/40 border-2 border-transparent focus:border-rust/30 p-3 rounded-xl outline-none font-bold text-sm"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>
            </div>
          </div>

          {/* Inventory Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-rust flex items-center gap-2">
                   <Layers className="w-3 h-3" /> Stock & Alerts
                </h3>
                <div className="bg-rust/[0.03] p-6 rounded-2xl border border-rust/10 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Initial Qty</label>
                            <input 
                                type="number"
                                name="quantity"
                                className="w-full bg-white border border-mist/20 p-3 rounded-xl outline-none font-black text-xl text-center"
                                value={formData.quantity}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-rust">Reorder Level</label>
                            <input 
                                type="number"
                                name="reorderLevel"
                                className="w-full bg-rust/5 border-2 border-rust/10 p-3 rounded-xl outline-none font-black text-xl text-rust text-center"
                                value={formData.reorderLevel}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 items-start text-rust/70">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <p className="text-[10px] font-medium leading-relaxed italic">
                            You'll get a notification when stock falls below this level.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-sage flex items-center gap-2">
                   <Tag className="w-3 h-3" /> Pricing & Supplier
                </h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-mist">Purchase Price</label>
                            <input 
                                type="number"
                                name="purchasePrice"
                                className="w-full bg-cream/40 border-2 border-transparent p-3 rounded-xl outline-none font-bold text-sm"
                                value={formData.purchasePrice}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-sage">Sale Price</label>
                            <input 
                                type="number"
                                name="sellingPrice"
                                className="w-full bg-sage/5 border-2 border-sage/10 p-3 rounded-xl outline-none font-bold text-sm text-sage"
                                value={formData.sellingPrice}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-mist">Supplier Name</label>
                        <div className="relative">
                            <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
                            <input 
                                name="supplier"
                                placeholder="Main Vendor Pvt Ltd"
                                className="w-full bg-cream/40 border-2 border-transparent p-3 pl-10 rounded-xl outline-none font-bold text-sm"
                                value={formData.supplier}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Internal Description</label>
            <textarea 
                name="description"
                placeholder="Details about product specifications or usage..."
                className="w-full bg-cream/40 border-2 border-transparent p-4 rounded-2xl outline-none text-sm font-medium h-24 resize-none"
                value={formData.description}
                onChange={handleChange}
            />
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
                isEditing ? 'bg-sage shadow-sage/20' : 'bg-rust shadow-rust/20'
            }`}
          >
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Stock' : 'Add to Inventory')}
            <Save className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
