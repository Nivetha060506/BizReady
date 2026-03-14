const router = require('express').Router();
const ctrl = require('../controllers/moduleController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', ctrl.getModules);
router.put('/', ctrl.updateModules);
router.patch('/:module', ctrl.toggleModule);

module.exports = router;
