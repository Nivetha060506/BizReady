const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, default: '', trim: true },
  phone: { type: String, default: '' },
  company: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  gstin: { type: String, default: '' },
  address: { type: String, default: '' },
  totalBusinessValue: { type: Number, default: 0 },
  lastContactDate: { type: Date, default: Date.now },
  followUpDate: { type: Date },
  followUpNote: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive', 'prospect'], default: 'active' },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
