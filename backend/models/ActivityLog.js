const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, default: '' },
  action: { type: String, required: true },
  entity: { type: String, default: '' }, // 'invoice', 'customer', 'inventory', etc.
  entityId: { type: mongoose.Schema.Types.ObjectId },
  description: { type: String, default: '' },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
