const router = require('express').Router();
const { getStats, getRevenueChart, getTopProducts, getRecentActivity } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/stats', getStats);
router.get('/revenue-chart', getRevenueChart);
router.get('/top-products', getTopProducts);
router.get('/activity', getRecentActivity);

module.exports = router;
