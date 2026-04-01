const router = require('express').Router();
const { getPredictions, getRecommendations } = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/predictions', getPredictions);
router.get('/recommendations', getRecommendations);

module.exports = router;
