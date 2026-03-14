const Business = require('../models/Business');

// POST /api/onboarding
exports.complete = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const {
      name, industry, gstin, pan, phone, address, city, state, pincode,
      preferredLanguage, employeeCount, invoicingMethod, painPoint,
      enabledModules, digitalReadinessScore
    } = req.body;

    const business = await Business.findByIdAndUpdate(bId, {
      name, industry, gstin, pan, phone, address, city, state, pincode,
      preferredLanguage, employeeCount, invoicingMethod, painPoint,
      enabledModules, digitalReadinessScore,
      onboardingComplete: true
    }, { new: true });

    res.json({ message: 'Onboarding complete', business });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/onboarding/status
exports.getStatus = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const business = await Business.findById(bId).select('onboardingComplete name industry enabledModules');
    res.json(business);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
