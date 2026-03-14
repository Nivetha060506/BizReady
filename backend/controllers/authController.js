const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Business = require('../models/Business');
const { seedBusinessData } = require('../utils/demoDataSeeder');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, businessName } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Create business
    const business = await Business.create({
      name: businessName || `${name}'s Business`,
    });

    const user = await User.create({
      name, email, password: hashed,
      role: role || 'owner',
      businessId: business._id
    });

    // Assign owner to business
    business.owner = user._id;
    await business.save();

    // Auto-seed demo data
    await seedBusinessData(business._id, user._id, user.name);

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      business: { _id: business._id, name: business.name, onboardingComplete: business.onboardingComplete }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    let user = await User.findOne({ email }).populate('businessId');
    
    // Auto-create and seed if user doesn't exist (Demo Mode Bypass)
    if (!user) {
      console.log(`Auto-seeding demo account for: ${email}`);
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      
      const newBusiness = await Business.create({
        name: `${email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)}'s Business`,
        industry: 'retail',
        onboardingComplete: true,
        digitalReadinessScore: 78
      });

      user = await User.create({
        name: email.split('@')[0],
        email,
        password: hashed,
        role: 'owner',
        businessId: newBusiness._id
      });

      newBusiness.owner = user._id;
      await newBusiness.save();
      
      // Run the seeder
      await seedBusinessData(newBusiness._id, user._id, user.name);
      
      // Refresh user object with business
      user = await User.findById(user._id).populate('businessId');
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      business: user.businessId
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('businessId');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
