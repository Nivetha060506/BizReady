const Invoice = require('../models/Invoice');
const InventoryItem = require('../models/InventoryItem');
const mongoose = require('mongoose');

// Helper to calculate growth trend
const calculateTrend = (history) => {
  if (history.length < 2) return 0;
  const recent = history[history.length - 1];
  const previous = history[history.length - 2];
  if (previous === 0) return recent > 0 ? 100 : 0;
  return ((recent - previous) / previous) * 100;
};

exports.getPredictions = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Get all invoices for the last 6 months
    const invoices = await Invoice.find({
      businessId: bId,
      status: { $in: ['paid', 'pending'] },
      invoiceDate: { $gte: sixMonthsAgo }
    }).sort({ invoiceDate: 1 });

    const productStats = {};

    invoices.forEach(inv => {
      const monthKey = `${inv.invoiceDate.getFullYear()}-${inv.invoiceDate.getMonth()}`;
      inv.items.forEach(item => {
        if (!productStats[item.name]) {
          productStats[item.name] = {
            name: item.name,
            monthlySales: {},
            totalQty: 0,
            totalRevenue: 0
          };
        }
        if (!productStats[item.name].monthlySales[monthKey]) {
          productStats[item.name].monthlySales[monthKey] = 0;
        }
        productStats[item.name].monthlySales[monthKey] += item.quantity;
        productStats[item.name].totalQty += item.quantity;
        productStats[item.name].totalRevenue += item.total;
      });
    });

    const predictions = Object.values(productStats).map(product => {
      // Create a sorted array of monthly sales
      const history = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        history.push(product.monthlySales[key] || 0);
      }

      const trend = calculateTrend(history);
      const avgSales = product.totalQty / 6;
      
      // Simple projection: average + (average * trend factor)
      // We cap the trend factor to avoid wild spikes
      const trendFactor = Math.min(Math.max(trend / 100, -0.5), 1);
      const predictedNextMonth = Math.max(0, Math.round(avgSales * (1 + trendFactor)));

      return {
        name: product.name,
        currentMonthSales: history[5],
        predictedNextMonth,
        trend: trend.toFixed(1),
        confidence: history.filter(h => h > 0).length > 2 ? 'High' : 'Medium'
      };
    });

    // Sort by predicted volume
    const topPredicted = predictions
      .sort((a, b) => b.predictedNextMonth - a.predictedNextMonth)
      .slice(0, 5);

    res.json(topPredicted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    
    // Fetch predictions (we reuse logic or call internally if needed, here we'll do a quick version)
    // For recommendations, we also need inventory levels
    const [inventory, invoices] = await Promise.all([
      InventoryItem.find({ businessId: bId, isActive: true }),
      Invoice.find({ businessId: bId, status: { $in: ['paid', 'pending'] } }).limit(100)
    ]);

    const productSales = {};
    invoices.forEach(inv => {
      inv.items.forEach(item => {
        productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
      });
    });

    const recommendations = [];

    // 1. Stock Out Risk
    inventory.forEach(item => {
      const recentSales = productSales[item.name] || 0;
      const monthlyAvg = recentSales / 3; // rough estimate
      if (item.quantity <= item.reorderLevel) {
        recommendations.push({
          type: 'inventory',
          priority: 'High',
          title: `Restock Alert: ${item.name}`,
          description: `Stock is at ${item.quantity}. Based on sales velocity, you might run out in ${monthlyAvg > 0 ? Math.round(item.quantity / (monthlyAvg / 30)) : 'N/A'} days.`,
          action: 'Update Stock'
        });
      }
    });

    // 2. High Demand Prediction
    // We'd ideally use the predictions from above, but keeping it simple for now
    const topSellers = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    topSellers.forEach(([name, qty]) => {
      recommendations.push({
        type: 'growth',
        priority: 'Medium',
        title: `Opportunity: ${name}`,
        description: `${name} is trending upwards. Consider a bundle offer to increase average order value.`,
        action: 'Create Promo'
      });
    });

    // 3. Digital Readiness Tip
    recommendations.push({
      type: 'digital',
      priority: 'Low',
      title: 'Boost SEO',
      description: 'Your top products are missing descriptions. Adding them can improve your digital presence.',
      action: 'Edit Catalog'
    });

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
