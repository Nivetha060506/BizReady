# BizReady — SME Digital Toolkit 📊🚀

BizReady is a production-grade MERN stack application designed specifically for **Small and Medium Enterprises (SMEs) in India**. It provides a unified digital dashboard to manage sales, inventory, customers, and operations with a focus on ease of use and professional aesthetics.

## ✨ Core Features

- **📊 Intelligence Dashboard**: Real-time analytics, revenue trends, and a unique "Digital Readiness Score."
- **📄 Smart Invoicing**: Professional PDF generation (GST-ready), CSV exports, and automated payment tracking.
- **📦 Proactive Inventory**: Stock management with automated reorder alerts and CSV import support.
- **🤝 CRM & Pipeline**: Track customer lifetime value and manage follow-up activities.
- **🏗️ Kanban Operations**: Visual task management for business workflows.
- **🧩 Modular Engine**: Enable or disable modules (Sales, Inventory, HR, etc.) based on your business needs.
- **🛠️ Automated Onboarding**: A 5-step wizard to configure the platform for your specific industry.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4, Zustand, Lucide-React, Recharts.
- **Backend**: Node.js, Express.js, JWT Auth, Bcrypt, Multer, PDFKit.
- **Database**: MongoDB (Mongoose) with multi-tenant business isolation.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Clone & Install
```bash
# Clone the repository
git clone <repository-url>
cd BizReady_App

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 2. Environment Setup
Create a `.env` file in the `/backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bizready
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

### 3. Run Locally (Development)
```bash
# Start Backend (from /backend)
npm run dev

# Start Frontend (from /frontend)
npm run dev
```

---

## 🚢 Deployment Guide

### Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Whitelist `0.0.0.0/0` in Network Access.
3. Copy your Connection String and update `MONGO_URI` in your production environment variables.

### Backend (Render / Heroku)
1. Connect your GitHub repository to [Render](https://render.com/).
2. Create a "Web Service".
3. Set **Root Directory** to `backend`.
4. **Build Command**: `npm install`.
5. **Start Command**: `node server.js`.
6. Add your `.env` variables in the "Environment" tab.

### Frontend (Vercel / Netlify)
1. Connect your repository to [Vercel](https://vercel.com/).
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Add an Environment Variable: `VITE_API_URL` pointing to your deployed Backend URL.
5. Click **Deploy**.

---

## 📄 License
Designed and Built for the Next Billion SMEs. 🇮🇳
