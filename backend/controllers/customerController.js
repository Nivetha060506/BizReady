const Customer = require('../models/Customer');
const ActivityLog = require('../models/ActivityLog');

const logActivity = async (bId, user, action, entity, entityId, description) => {
  try { await ActivityLog.create({ businessId: bId, user: user._id, userName: user.name, action, entity, entityId, description }); } catch (_) {}
};

exports.getAll = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const { search, status } = req.query;
    const query = { businessId: bId };
    if (status) query.status = status;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } }
    ];
    const customers = await Customer.find(query).sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const customer = await Customer.findOne({ _id: req.params.id, businessId: bId });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const customer = await Customer.create({ ...req.body, businessId: bId });
    await logActivity(bId, req.user, 'created', 'customer', customer._id, `Customer "${customer.name}" added`);
    res.status(201).json(customer);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const customer = await Customer.findOneAndUpdate({ _id: req.params.id, businessId: bId }, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    await Customer.findOneAndDelete({ _id: req.params.id, businessId: bId });
    res.json({ message: 'Customer removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
