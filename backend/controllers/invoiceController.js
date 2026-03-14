const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const ActivityLog = require('../models/ActivityLog');
const PDFDocument = require('pdfkit');

const logActivity = async (bId, user, action, entity, entityId, description) => {
  try {
    await ActivityLog.create({ businessId: bId, user: user._id, userName: user.name, action, entity, entityId, description });
  } catch (_) {}
};

// GET /api/invoices
exports.getAll = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = { businessId: bId };
    if (status) query.status = status;
    if (search) query.$or = [
      { invoiceNumber: { $regex: search, $options: 'i' } },
      { customerName: { $regex: search, $options: 'i' } }
    ];
    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Invoice.countDocuments(query);
    res.json({ invoices, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/invoices/:id
exports.getOne = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const invoice = await Invoice.findOne({ _id: req.params.id, businessId: bId });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/invoices
exports.create = async (req, res) => {
  try {
    if (!req.body.items || !Array.isArray(req.body.items)) {
      return res.status(400).json({ message: 'Items are required as an array' });
    }
    const bId = req.user.businessId._id || req.user.businessId;
    const count = await Invoice.countDocuments({ businessId: bId });
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const subtotal = req.body.items.reduce((s, i) => s + (i.price * i.quantity), 0);
    const taxAmount = req.body.items.reduce((s, i) => s + (i.price * i.quantity * (i.taxRate || 18) / 100), 0);
    const totalAmount = subtotal + taxAmount - (req.body.discount || 0);

    const items = req.body.items.map(i => ({
      ...i,
      total: i.price * i.quantity
    }));

    const sanitizedData = { ...req.body };
    if (!sanitizedData.customer) delete sanitizedData.customer;

    const invoice = await Invoice.create({
      ...sanitizedData, 
      businessId: bId, 
      invoiceNumber, 
      items, 
      subtotal, 
      taxAmount, 
      totalAmount,
      createdBy: req.user._id
    });

    await logActivity(bId, req.user, 'created', 'invoice', invoice._id, `Invoice ${invoiceNumber} created`);
    res.status(201).json(invoice);
  } catch (err) { 
    console.error('Invoice Creation Error:', err);
    res.status(500).json({ message: err.message }); 
  }
};

// PUT /api/invoices/:id
exports.update = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const sanitizedData = { ...req.body };
    if (sanitizedData.customer === "") delete sanitizedData.customer;

    // Recalculate totals if items are updated
    if (req.body.items && Array.isArray(req.body.items)) {
      const subtotal = req.body.items.reduce((s, i) => s + (i.price * i.quantity), 0);
      const taxAmount = req.body.items.reduce((s, i) => s + (i.price * i.quantity * (i.taxRate || 18) / 100), 0);
      const totalAmount = subtotal + taxAmount - (req.body.discount || 0);

      sanitizedData.items = req.body.items.map(i => ({
        ...i,
        total: i.price * i.quantity
      }));
      sanitizedData.subtotal = subtotal;
      sanitizedData.taxAmount = taxAmount;
      sanitizedData.totalAmount = totalAmount;
    }

    // Set paidDate if status is changed to paid
    if (req.body.status === 'paid') {
      const existing = await Invoice.findOne({ _id: req.params.id, businessId: bId });
      if (existing && existing.status !== 'paid') {
        sanitizedData.paidDate = new Date();
      }
    } else if (req.body.status && req.body.status !== 'paid') {
      sanitizedData.paidDate = null;
    }

    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, businessId: bId },
      sanitizedData,
      { new: true }
    );
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    await logActivity(bId, req.user, 'updated', 'invoice', invoice._id, `Invoice ${invoice.invoiceNumber} updated`);
    res.json(invoice);
  } catch (err) { 
    console.error('Invoice Update Error:', err);
    res.status(500).json({ message: err.message }); 
  }
};

// DELETE /api/invoices/:id
exports.remove = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, businessId: bId });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/invoices/:id/pdf
exports.downloadPDF = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const invoice = await Invoice.findOne({ _id: req.params.id, businessId: bId });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const business = req.user.businessId;
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${invoice.invoiceNumber}.pdf`);
    doc.pipe(res);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#c84b2f').text('INVOICE', 50, 50);
    doc.fontSize(10).font('Helvetica').fillColor('#333')
      .text(`Invoice No: ${invoice.invoiceNumber}`, 50, 90)
      .text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}`, 50, 105)
      .text(`Due: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-IN') : 'N/A'}`, 50, 120)
      .text(`Status: ${invoice.status.toUpperCase()}`, 50, 135);

    // Business info
    doc.fontSize(12).font('Helvetica-Bold').text(business.name || 'Your Business', 350, 90);
    doc.fontSize(9).font('Helvetica').text(business.address || '', 350, 108)
      .text(`GSTIN: ${business.gstin || 'N/A'}`, 350, 120);

    // Divider
    doc.moveTo(50, 155).lineTo(545, 155).strokeColor('#ddd').stroke();

    // Bill To
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#333').text('Bill To:', 50, 170);
    doc.fontSize(10).font('Helvetica').text(invoice.customerName, 50, 185).text(invoice.customerAddress || '', 50, 200);

    // Table header
    const tableTop = 240;
    const cols = [50, 220, 300, 360, 430, 495];
    doc.rect(50, tableTop, 495, 20).fill('#0d0d0d');
    doc.fillColor('#fff').fontSize(9).font('Helvetica-Bold')
      .text('Item', cols[0], tableTop + 5)
      .text('Description', cols[1], tableTop + 5)
      .text('Qty', cols[2], tableTop + 5)
      .text('Price', cols[3], tableTop + 5)
      .text('Tax%', cols[4], tableTop + 5)
      .text('Total', cols[5], tableTop + 5);

    let y = tableTop + 25;
    invoice.items.forEach((item, idx) => {
      if (idx % 2 === 0) doc.rect(50, y - 3, 495, 18).fill('#f9f9f9');
      doc.fillColor('#333').fontSize(9).font('Helvetica')
        .text(item.name, cols[0], y)
        .text(item.description || '', cols[1], y)
        .text(item.quantity, cols[2], y)
        .text(`₹${item.price.toFixed(2)}`, cols[3], y)
        .text(`${item.taxRate || 18}%`, cols[4], y)
        .text(`₹${item.total.toFixed(2)}`, cols[5], y);
      y += 20;
    });

    // Totals
    y += 10;
    doc.moveTo(350, y).lineTo(545, y).strokeColor('#ddd').stroke();
    y += 8;
    doc.fontSize(9).fillColor('#555').font('Helvetica')
      .text('Subtotal:', 360, y).text(`₹${invoice.subtotal?.toFixed(2) || '0.00'}`, 480, y);
    y += 15;
    doc.text('Tax:', 360, y).text(`₹${invoice.taxAmount?.toFixed(2) || '0.00'}`, 480, y);
    if (invoice.discount) {
      y += 15;
      doc.text('Discount:', 360, y).text(`-₹${invoice.discount.toFixed(2)}`, 480, y);
    }
    y += 20;
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#c84b2f')
      .text('Total:', 360, y).text(`₹${invoice.totalAmount.toFixed(2)}`, 470, y);

    // Notes
    if (invoice.notes) {
      y += 40;
      doc.fontSize(9).font('Helvetica').fillColor('#666').text('Notes:', 50, y).text(invoice.notes, 50, y + 12);
    }
    if (invoice.terms) {
      y += 40;
      doc.fontSize(9).fillColor('#aaa').text(invoice.terms, 50, y + 12);
    }

    doc.end();
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/invoices/export/csv
exports.exportCSV = async (req, res) => {
  try {
    const bId = req.user.businessId._id || req.user.businessId;
    const invoices = await Invoice.find({ businessId: bId }).sort({ createdAt: -1 });
    const header = 'Invoice No,Customer,Date,Due Date,Amount,Status\n';
    const rows = invoices.map(inv =>
      `${inv.invoiceNumber},${inv.customerName},${new Date(inv.invoiceDate).toLocaleDateString('en-IN')},${inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-IN') : ''},₹${inv.totalAmount},${inv.status}`
    ).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=invoices.csv');
    res.send(header + rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
