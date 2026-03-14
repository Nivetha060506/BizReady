const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const InventoryItem = require('../models/InventoryItem');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

// GET /api/dashboard/stats
exports.getStats = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Revenue this month (paid invoices)
    const paidInvoices = await Invoice.find({ businessId: bId, status: 'paid', paidDate: { $gte: startOfMonth } });
    const monthlyRevenue = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    // Pending invoices
    const pendingCount = await Invoice.countDocuments({ businessId: bId, status: { $in: ['pending', 'overdue'] } });
    const pendingAmount = await Invoice.aggregate([
      { $match: { businessId: bId, status: { $in: ['pending', 'overdue'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Active customers
    const customerCount = await Customer.countDocuments({ businessId: bId, status: 'active' });

    // Stock items
    const stockCount = await InventoryItem.countDocuments({ businessId: bId, isActive: true });

    // Low stock alerts
    const lowStockItems = await InventoryItem.find({ businessId: bId, isActive: true }).then(items =>
      items.filter(i => i.quantity <= i.reorderLevel)
    );

    // Tasks summary
    const taskStats = await Task.aggregate([
      { $match: { businessId: bId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      monthlyRevenue,
      pendingInvoices: { count: pendingCount, amount: pendingAmount[0]?.total || 0 },
      customerCount,
      stockCount,
      lowStockCount: lowStockItems.length,
      taskStats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/dashboard/revenue-chart
exports.getRevenueChart = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ year: d.getFullYear(), month: d.getMonth() });
    }

    const data = await Promise.all(months.map(async ({ year, month }) => {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0, 23, 59, 59);
      const invoices = await Invoice.find({ businessId: bId, status: 'paid', paidDate: { $gte: start, $lte: end } });
      const revenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
      const label = start.toLocaleString('en-IN', { month: 'short' });
      return { month: label, revenue };
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/dashboard/top-products
exports.getTopProducts = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const invoices = await Invoice.find({ businessId: bId, status: { $in: ['paid', 'pending'] } });

    const productMap = {};
    invoices.forEach(inv => {
      inv.items.forEach(item => {
        if (!productMap[item.name]) productMap[item.name] = { name: item.name, revenue: 0, qty: 0 };
        productMap[item.name].revenue += item.total;
        productMap[item.name].qty += item.quantity;
      });
    });

    const products = Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/dashboard/activity
exports.getRecentActivity = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const logs = await ActivityLog.find({ businessId: bId })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
