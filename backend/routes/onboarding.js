const router = require('express').Router();
const ctrl = require('../controllers/onboardingController');
const auth = require('../middleware/auth');

router.use(auth);
router.post('/', ctrl.complete);
router.get('/status', ctrl.getStatus);

module.exports = router;
