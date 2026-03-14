const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  industry: {
    type: String,
    enum: ['retail', 'manufacturing', 'services', 'food', 'textiles', 'agriculture', 'technology', 'healthcare', 'education', 'other'],
    default: 'retail'
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gstin: { type: String, default: '' },
  pan: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  logo: { type: String, default: '' },
  preferredLanguage: { type: String, default: 'en' },
  employeeCount: { type: Number, default: 1 },
  invoicingMethod: { type: String, default: 'digital' },
  painPoint: { type: String, default: '' },
  digitalReadinessScore: { type: Number, default: 0 },
  enabledModules: {
    salesInvoicing: { type: Boolean, default: true },
    inventory: { type: Boolean, default: true },
    crm: { type: Boolean, default: true },
    tasks: { type: Boolean, default: true },
    analytics: { type: Boolean, default: false },
    vendorPurchases: { type: Boolean, default: false },
    hrTimekeeping: { type: Boolean, default: false }
  },
  onboardingComplete: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Business', businessSchema);
