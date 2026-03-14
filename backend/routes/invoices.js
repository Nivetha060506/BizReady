const router = require('express').Router();
const multer = require('multer');
const ctrl = require('../controllers/invoiceController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/export/csv', ctrl.exportCSV);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.get('/:id/pdf', ctrl.downloadPDF);

module.exports = router;
