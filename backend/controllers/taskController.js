const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

const logActivity = async (bId, user, action, entity, entityId, description) => {
  try { await ActivityLog.create({ businessId: bId, user: user._id, userName: user.name, action, entity, entityId, description }); } catch (_) {}
};

exports.getAll = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const { status } = req.query;
    const query = { businessId: bId };
    if (status) query.status = status;
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const task = await Task.create({ ...req.body, businessId: bId, createdBy: req.user._id });
    await logActivity(bId, req.user, 'created', 'task', task._id, `Task "${task.title}" created`);
    res.status(201).json(task);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const updateData = { ...req.body };
    if (req.body.status === 'done' && !req.body.completedAt) updateData.completedAt = new Date();
    const task = await Task.findOneAndUpdate({ _id: req.params.id, businessId: bId }, updateData, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    await Task.findOneAndDelete({ _id: req.params.id, businessId: bId });
    res.json({ message: 'Task deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
