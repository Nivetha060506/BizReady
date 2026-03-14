const router = require('express').Router();
const multer = require('multer');
const ctrl = require('../controllers/inventoryController');
const auth = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

router.use(auth);
router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.post('/import-csv', upload.single('file'), ctrl.importCSV);

module.exports = router;
