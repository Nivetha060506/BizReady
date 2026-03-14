const Customer = require('../models/Customer');
const InventoryItem = require('../models/InventoryItem');
const Task = require('../models/Task');
const Invoice = require('../models/Invoice');
const ActivityLog = require('../models/ActivityLog');

const INDIAN_NAMES = ['Rahul Sharma', 'Anjali Gupta', 'Vikram Singh', 'Priya Patel', 'Amitabh Das', 'Sneha Reddy', 'Rajesh Iyer', 'Meera Kapoor', 'Arjun Verma', 'Sanjay Nair', 'Kavita Joshi', 'Sunil Malhotra'];
const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];

const seedBusinessData = async (businessId, userId, userName) => {
    try {
        console.log(`Seeding demo data for business: ${businessId}`);
        
        // 1. Create Customers
        const customers = [];
        for (let i = 0; i < 12; i++) {
            const cust = await Customer.create({
                businessId: businessId,
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

        // 2. Create Inventory
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
                businessId: businessId,
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

        // 3. Create Invoices (Last 12 months)
        for (let i = 0; i < 15; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - (14 - i)); 
            
            const customer = customers[i % customers.length];
            const invTotal = 5000 + Math.random() * 50000;
            const status = i === 14 ? 'pending' : (i % 5 === 0 ? 'overdue' : 'paid');
            
            await Invoice.create({
                businessId: businessId,
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
                createdBy: userId
            });

            if (status === 'paid') {
                customer.totalBusinessValue += invTotal;
                await customer.save();
            }
        }

        // 4. Create Tasks
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
                businessId: businessId,
                title: t.title,
                status: t.status,
                priority: t.priority,
                createdBy: userId
            });
        }

        // 5. Activity Logs
        const activities = [
            { action: 'created', entity: 'invoice', desc: 'Large order processed' },
            { action: 'updated', entity: 'inventory', desc: 'Stock updated for main products' },
            { action: 'created', entity: 'customer', desc: 'New VIP customer added' }
        ];

        for (const a of activities) {
            await ActivityLog.create({
                businessId: businessId,
                user: userId,
                userName: userName,
                action: a.action,
                entity: a.entity,
                description: a.desc
            });
        }

        return true;
    } catch (error) {
        console.error('Error seeding business data:', error);
        return false;
    }
};

module.exports = { seedBusinessData };
