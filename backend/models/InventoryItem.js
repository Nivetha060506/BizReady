const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  name: { type: String, required: true, trim: true },
  sku: { type: String, default: '' },
  category: { type: String, default: 'General' },
  unit: { type: String, default: 'pcs' },
  quantity: { type: Number, default: 0, min: 0 },
  reorderLevel: { type: Number, default: 10 },
  purchasePrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  description: { type: String, default: '' },
  supplier: { type: String, default: '' },
  location: { type: String, default: '' },
  lastUpdated: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('InventoryItem', inventorySchema);
