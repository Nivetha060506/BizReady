import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Upload, 
  Filter, 
  AlertTriangle, 
  Edit2, 
  Trash2, 
  MoreVertical,
  ChevronRight,
  Package,
  Layers,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import inventoryService from '../services/inventoryService';
import InventoryModal from '../components/InventoryModal';
import AddStockModal from '../components/AddStockModal';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [lowStock, setLowStock] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const fileInputRef = useRef(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data } = await inventoryService.getItems({ search, category, lowStock });
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch Inventory Error:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, category, lowStock]);

  const handleDelete = async (id) => {
    if (window.confirm('Archive this item?')) {
      await inventoryService.deleteItem(id);
      fetchItems();
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await inventoryService.importCSV(file);
        fetchItems();
        alert('Items imported successfully');
      } catch (error) {
        alert('Failed to import items');
      }
    }
  };

  const categories = [...new Set((items || []).map(i => i?.category).filter(Boolean))];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-ink tracking-tight">Inventory Management</h1>
          <p className="text-mist font-medium">Track your stock levels, set reorder alerts, and manage product variety.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            className="hidden" 
            accept=".csv"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="btn-outline flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button 
            onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
            className="btn-primary flex items-center gap-2 bg-sage shadow-sage/20"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-soft flex items-center gap-5">
           <div className="w-12 h-12 bg-ink text-paper rounded-2xl flex items-center justify-center">
             <Layers className="w-6 h-6" />
           </div>
           <div>
             <p className="text-[10px] text-mist font-bold uppercase tracking-widest leading-none mb-1">Total Stock Value</p>
             <h4 className="text-xl font-heading font-black text-ink">
               ₹{items.reduce((sum, item) => sum + (item.quantity * item.purchasePrice), 0).toLocaleString()}
             </h4>
           </div>
        </div>
        <div className="card-soft flex items-center gap-5">
           <div className="w-12 h-12 bg-sage/10 text-sage rounded-2xl flex items-center justify-center">
             <CheckCircle2 className="w-6 h-6" />
           </div>
           <div>
             <p className="text-[10px] text-mist font-bold uppercase tracking-widest leading-none mb-1">In Stock</p>
             <h4 className="text-xl font-heading font-black text-ink">
               {items.filter(i => i.quantity > i.reorderLevel).length} Categories
             </h4>
           </div>
           <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="card-soft flex items-center gap-5 border-rust/10 bg-rust/5">
           <div className="w-12 h-12 bg-rust text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rust/20">
             <AlertTriangle className="w-6 h-6" />
           </div>
           <div>
             <p className="text-[10px] text-rust font-bold uppercase tracking-widest leading-none mb-1">Needs Reorder</p>
             <h4 className="text-xl font-heading font-black text-rust">
               {items.filter(i => i.quantity <= i.reorderLevel).length} Items
             </h4>
           </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-mist/10 shadow-soft flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
          <input 
            type="text" 
            placeholder="Search products, SKU, or suppliers..." 
            className="w-full bg-cream/30 border border-transparent focus:border-mist/20 p-2.5 pl-11 rounded-xl outline-none text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            className="bg-cream/30 border-none p-2.5 rounded-xl text-sm font-bold text-ink outline-none min-w-[140px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button 
            onClick={() => setLowStock(!lowStock)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-2 ${
              lowStock ? 'bg-rust border-rust text-white shadow-lg shadow-rust/20' : 'border-mist/10 text-mist'
            }`}
          >
            Low Stock
          </button>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
            [...Array(8)].map((_, i) => <div key={i} className="h-64 bg-mist/5 rounded-2xl animate-pulse"></div>)
        ) : (items || []).length > 0 ? (
            items.map((item) => (
                <div key={item?._id || Math.random()} className={`card-soft group hover:-translate-y-1 ${
                    (item?.quantity || 0) <= (item?.reorderLevel || 0) ? 'border-rust/30 bg-rust/[0.02]' : ''
                }`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-xl ${
                            item.quantity <= item.reorderLevel ? 'bg-rust/10 text-rust' : 'bg-mist/10 text-mist'
                        }`}>
                            <Package className="w-5 h-5" />
                        </div>
                        <div className="flex gap-1">
                            <button 
                                onClick={() => { setSelectedItem(item); setIsModalOpen(true); }}
                                className="p-1.5 hover:bg-cream rounded-lg text-mist hover:text-ink transition-all"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => handleDelete(item._id)}
                                className="p-1.5 hover:bg-red-50 rounded-lg text-mist hover:text-red-500 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    
                    <h4 className="font-heading font-bold text-ink truncate mb-1">{item.name}</h4>
                    <p className="text-[10px] text-mist font-bold uppercase tracking-widest">{item.category}</p>
                    
                    <div className="mt-6 flex items-end justify-between">
                        <div>
                            <p className="text-[10px] text-mist font-medium uppercase tracking-wider mb-1">Available Quantity</p>
                            <div className="flex items-center gap-2">
                                <span className={`text-2xl font-heading font-black ${
                                    item.quantity <= item.reorderLevel ? 'text-rust' : 'text-ink'
                                }`}>
                                    {item.quantity}
                                </span>
                                <span className="text-[10px] text-mist font-bold uppercase">{item.unit}</span>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-[10px] text-mist font-medium uppercase tracking-wider mb-1">Sale Price</p>
                             <span className="text-xl font-heading font-black text-sage">₹{item.sellingPrice}</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-mist/10 flex items-center justify-between">
                         <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${
                                item.quantity > item.reorderLevel ? 'bg-sage' : 'bg-rust animate-pulse'
                            }`}></div>
                            <span className="text-[10px] font-bold text-ink/70">
                                {item.quantity > item.reorderLevel ? 'Safe Stock' : 'Low Stock Alert'}
                            </span>
                         </div>
                         <button onClick={() => { setSelectedItem(item); setIsAddStockOpen(true); }} className="text-[10px] font-black uppercase text-rust hover:underline flex items-center gap-1">
                            Add Stock <ArrowRight className="w-3 h-3" />
                         </button>
                    </div>
                </div>
            ))
        ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-mist/10 shadow-soft">
                <Package className="w-16 h-16 text-mist/30 mx-auto mb-4" />
                <h4 className="font-heading text-xl font-bold text-ink">No items in inventory</h4>
                <p className="text-sm text-mist font-medium mt-2 max-w-xs mx-auto">Add your products manually or import a CSV file to start tracking stock.</p>
                <div className="flex justify-center gap-3 mt-8">
                    <button onClick={() => fileInputRef.current?.click()} className="btn-outline">Import CSV</button>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary bg-sage shadow-sage/20">Add First Item</button>
                </div>
            </div>
        )}
      </div>

      {isModalOpen && (
        <InventoryModal 
          item={selectedItem} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchItems}
        />
      )}

      {isAddStockOpen && (
        <AddStockModal 
          item={selectedItem} 
          onClose={() => setIsAddStockOpen(false)} 
          onSuccess={fetchItems}
        />
      )}
    </div>
  );
};


export default Inventory;
