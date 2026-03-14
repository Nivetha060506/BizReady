import { useState } from 'react';
import { X, Save, Package } from 'lucide-react';
import inventoryService from '../services/inventoryService';
import { toast } from 'react-hot-toast';

const AddStockModal = ({ item, onClose, onSuccess }) => {
  const [addedQuantity, setAddedQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!addedQuantity || isNaN(addedQuantity) || Number(addedQuantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    setIsSubmitting(true);
    try {
      const newQuantity = item.quantity + Number(addedQuantity);
      await inventoryService.updateItem(item._id, { quantity: newQuantity });
      toast.success(`Successfully added ${addedQuantity} ${item.unit} to stock`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-paper w-full max-w-md overflow-hidden rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-mist/10 flex items-center justify-between bg-white text-ink">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white bg-sage">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold tracking-tight">Add Stock</h2>
              <p className="text-[10px] text-mist font-bold uppercase tracking-widest mt-1">Quick Restock</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-cream rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="bg-cream/30 p-4 rounded-xl border border-mist/10 mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-mist mb-1">Product</p>
            <h3 className="font-heading font-bold text-ink text-lg">{item.name}</h3>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-mist/10">
              <span className="text-xs font-medium text-mist">Current Stock</span>
              <span className="font-black text-ink">{item.quantity} {item.unit}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-mist ml-1">Quantity to Add</label>
            <div className="flex items-center gap-3">
              <input 
                type="number"
                required
                min="1"
                placeholder="e.g. 50"
                className="flex-1 bg-white border border-mist/20 focus:border-sage/50 p-4 rounded-xl outline-none font-black text-2xl text-center shadow-inner"
                value={addedQuantity}
                onChange={(e) => setAddedQuantity(e.target.value)}
                autoFocus
              />
              <span className="text-sm font-bold text-mist w-12">{item.unit}</span>
            </div>
          </div>

          {addedQuantity && !isNaN(addedQuantity) && Number(addedQuantity) > 0 && (
            <div className="bg-sage/5 p-4 rounded-xl border border-sage/10 flex justify-between items-center animate-in fade-in duration-300">
              <span className="text-xs font-bold text-sage">New Total Quantity</span>
              <span className="font-black text-sage text-xl">{item.quantity + Number(addedQuantity)} {item.unit}</span>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 text-ink font-bold bg-cream hover:bg-mist/10 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 text-white font-bold bg-sage shadow-xl shadow-sage/20 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              {isSubmitting ? 'Updating...' : 'Update Stock'}
              <Save className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockModal;
