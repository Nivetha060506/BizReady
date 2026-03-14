const Business = require('../models/Business');

// GET /api/modules
exports.getModules = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const business = await Business.findById(bId).select('enabledModules name');
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.json(business.enabledModules);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/modules
exports.updateModules = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const business = await Business.findByIdAndUpdate(
      bId,
      { enabledModules: req.body },
      { new: true }
    );
    res.json(business.enabledModules);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PATCH /api/modules/:module — toggle a single module
exports.toggleModule = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const { module } = req.params;
    const { enabled } = req.body;
    const business = await Business.findById(bId);
    if (!business) return res.status(404).json({ message: 'Business not found' });
    business.enabledModules[module] = enabled;
    await business.save();
    res.json({ module, enabled, enabledModules: business.enabledModules });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
