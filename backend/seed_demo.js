const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Business = require('./models/Business');
const Customer = require('./models/Customer');
const InventoryItem = require('./models/InventoryItem');
const Task = require('./models/Task');
const Invoice = require('./models/Invoice');
const ActivityLog = require('./models/ActivityLog');

dotenv.config();

const SEED_DATA = {
  user: {
    name: 'Demo Admin',
    email: 'demo@bizready.com',
    password: 'password123',
    role: 'owner'
  },
  business: {
    name: 'India Mart Solutions',
    industry: 'retail',
    gstin: '27AAACG1234F1Z5',
    phone: '9876543210',
    address: '123, MG Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    employeeCount: 15,
    digitalReadinessScore: 78,
    onboardingComplete: true
  }
};

const INDIAN_NAMES = ['Rahul Sharma', 'Anjali Gupta', 'Vikram Singh', 'Priya Patel', 'Amitabh Das', 'Sneha Reddy', 'Rajesh Iyer', 'Meera Kapoor', 'Arjun Verma', 'Sanjay Nair', 'Kavita Joshi', 'Sunil Malhotra'];
const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // 1. Clear existing demo data (Optional: only if you want a clean slate for the demo user)
    // For now, let's just find or create the demo user/business
    let user = await User.findOne({ email: SEED_DATA.user.email });
    if (user) {
      console.log('Demo user already exists. Cleaning up their old data...');
      await Business.deleteOne({ owner: user._id });
      await Customer.deleteMany({ businessId: user.businessId });
      await InventoryItem.deleteMany({ businessId: user.businessId });
      await Task.deleteMany({ businessId: user.businessId });
      await Invoice.deleteMany({ businessId: user.businessId });
      await ActivityLog.deleteMany({ businessId: user.businessId });
    } else {
      const hashedPassword = await bcrypt.hash(SEED_DATA.user.password, 10);
      user = await User.create({ ...SEED_DATA.user, password: hashedPassword });
    }

    const business = await Business.create({
      ...SEED_DATA.business,
      owner: user._id
    });

    user.businessId = business._id;
    await user.save();

    console.log('Created Demo User & Business.');

    // 2. Create Customers
    const customers = [];
    for (let i = 0; i < 12; i++) {
        const cust = await Customer.create({
            businessId: business._id,
            name: INDIAN_NAMES[i % INDIAN_NAMES.length],
            email: `customer${i}@example.com`,
            phone: `91000000${i.toString().padStart(2, '0')}`,
            city: CITIES[i % CITIES.length],
            state: 'India',
            status: i % 5 === 0 ? 'prospect' : 'active',
            tags: i % 4 === 0 ? ['VIP', 'Regular'] : ['Regular'],
            totalBusinessValue: 0
        });
        customers.push(cust);
    }
    console.log('Created 12 Customers.');

    // 3. Create Inventory
    const categories = ['Electronics', 'Furniture', 'Stationery', 'Hardware'];
    const products = [
        { name: 'Laptop Pro X1', price: 55000, buy: 42000, cat: 'Electronics', stock: 5, alert: 10 },
        { name: 'Wireless Mouse', price: 1200, buy: 800, cat: 'Electronics', stock: 50, alert: 15 },
        { name: 'Office Desk', price: 8500, buy: 6000, cat: 'Furniture', stock: 2, alert: 5 },
        { name: 'Ergonomic Chair', price: 12000, buy: 9000, cat: 'Furniture', stock: 12, alert: 5 },
        { name: 'Paper Reams (A4)', price: 450, buy: 300, cat: 'Stationery', stock: 100, alert: 20 },
        { name: 'Ink Cartridges', price: 2500, buy: 1800, cat: 'Electronics', stock: 3, alert: 8 },
        { name: 'LED Monitor 24"', price: 15000, buy: 11000, cat: 'Electronics', stock: 8, alert: 5 },
        { name: 'USB-C Hub', price: 3500, buy: 2200, cat: 'Electronics', stock: 15, alert: 10 },
        { name: 'Keyboard Mechanical', price: 4500, buy: 3000, cat: 'Electronics', stock: 20, alert: 5 },
        { name: 'Storage Cabinet', price: 18000, buy: 14000, cat: 'Furniture', stock: 4, alert: 3 }
    ];

    for (const p of products) {
        await InventoryItem.create({
            businessId: business._id,
            name: p.name,
            sku: `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`,
            category: p.cat,
            quantity: p.stock,
            reorderLevel: p.alert,
            purchasePrice: p.buy,
            sellingPrice: p.price,
            supplier: 'Primary Wholesalers Ltd.'
        });
    }
    console.log('Created 10 Inventory Items.');

    // 4. Create Invoices (Last 12 months)
    for (let i = 0; i < 15; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - (14 - i)); // Spread across 14 months
        
        const customer = customers[i % customers.length];
        const invTotal = 5000 + Math.random() * 50000;
        const status = i === 14 ? 'pending' : (i % 5 === 0 ? 'overdue' : 'paid');
        
        await Invoice.create({
            businessId: business._id,
            invoiceNumber: `INV-2025-${String(i + 1).padStart(4, '0')}`,
            customer: customer._id,
            customerName: customer.name,
            customerEmail: customer.email,
            items: [{ name: 'Assorted Business Supplies', quantity: 1, price: invTotal, total: invTotal }],
            totalAmount: invTotal,
            subtotal: invTotal / 1.18,
            taxAmount: (invTotal / 1.18) * 0.18,
            status: status,
            invoiceDate: date,
            paidDate: status === 'paid' ? date : null,
            createdBy: user._id
        });

        if (status === 'paid') {
            customer.totalBusinessValue += invTotal;
            await customer.save();
        }
    }
    console.log('Created 15 Invoices.');

    // 5. Create Tasks
    const tasks = [
        { title: 'Follow up with VIP customers', status: 'todo', priority: 'high' },
        { title: 'Restock Office Desks', status: 'inprogress', priority: 'medium' },
        { title: 'Monthly GST Filing', status: 'done', priority: 'high' },
        { title: 'Update Inventory location tags', status: 'todo', priority: 'low' },
        { title: 'Client meeting for bulk order', status: 'inprogress', priority: 'high' },
        { title: 'Send invoices to pending clients', status: 'todo', priority: 'medium' }
    ];

    for (const t of tasks) {
        await Task.create({
            businessId: business._id,
            title: t.title,
            status: t.status,
            priority: t.priority,
            createdBy: user._id
        });
    }
    console.log('Created 6 Tasks.');

    // 6. Activity Logs
    const activities = [
        { action: 'created', entity: 'invoice', desc: 'Large order processed for Rahul Sharma' },
        { action: 'updated', entity: 'inventory', desc: 'Stock updated for Laptop Pro X1' },
        { action: 'created', entity: 'customer', desc: 'New VIP customer added' }
    ];

    for (const a of activities) {
        await ActivityLog.create({
            businessId: business._id,
            user: user._id,
            userName: user.name,
            action: a.action,
            entity: a.entity,
            description: a.desc
        });
    }

    console.log('Seeding complete! Log in with: demo@bizready.com / password123');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
