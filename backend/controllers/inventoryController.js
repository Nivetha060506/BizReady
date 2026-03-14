const InventoryItem = require('../models/InventoryItem');
const ActivityLog = require('../models/ActivityLog');
const csv = require('csv-parser');
const stream = require('stream');

const logActivity = async (bId, user, action, entity, entityId, description) => {
  try { await ActivityLog.create({ businessId: bId, user: user._id, userName: user.name, action, entity, entityId, description }); } catch (_) {}
};

// GET /api/inventory
exports.getAll = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const { search, category, lowStock } = req.query;
    const query = { businessId: bId, isActive: true };
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    let items = await InventoryItem.find(query).sort({ updatedAt: -1 });
    if (lowStock === 'true') items = items.filter(i => i.quantity <= i.reorderLevel);
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/inventory
exports.create = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const item = await InventoryItem.create({ ...req.body, businessId: bId });
    await logActivity(bId, req.user, 'created', 'inventory', item._id, `Item "${item.name}" added`);
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/inventory/:id
exports.update = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const item = await InventoryItem.findOneAndUpdate(
      { _id: req.params.id, businessId: bId },
      { ...req.body, lastUpdated: new Date() },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/inventory/:id
exports.remove = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    await InventoryItem.findOneAndUpdate({ _id: req.params.id, businessId: bId }, { isActive: false });
    res.json({ message: 'Item removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/inventory/import-csv
exports.importCSV = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const results = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);
    bufferStream.pipe(csv()).on('data', row => results.push(row)).on('end', async () => {
      const items = results.map(row => ({
        businessId: bId,
        name: row.name || row.Name,
        category: row.category || row.Category || 'General',
        unit: row.unit || row.Unit || 'pcs',
        quantity: Number(row.quantity || row.Quantity || 0),
        reorderLevel: Number(row.reorderLevel || row['Reorder Level'] || 10),
        purchasePrice: Number(row.purchasePrice || row['Purchase Price'] || 0),
        sellingPrice: Number(row.sellingPrice || row['Selling Price'] || 0)
      })).filter(i => i.name);
      await InventoryItem.insertMany(items);
      res.json({ message: `${items.length} items imported`, count: items.length });
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
