# 🚀 Quick Start Guide

Get Ask-Lytics running in 5 minutes!

## Prerequisites

- Python 3.8+
- Node.js 18+
- MySQL running with a database

## Step 1: Backend Setup

```powershell
# Install Python dependencies
pip install -r requirements.txt

# Your .env file already exists with your Groq API key!
# Just verify the database credentials match your MySQL setup:
# - DB_USER=root
# - DB_PASSWORD=Bhuvi@123  (change if needed)
# - DB_NAME=classicmodels

# Start the backend
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend should be running at http://localhost:8000

## Step 2: Frontend Setup

```powershell
# Navigate to frontend
cd frontend-nextjs

# Install dependencies
npm install

# The .env.local is already configured!

# Start the frontend
npm run dev
```

✅ Frontend should be running at http://localhost:3000

## Step 3: Configure Database

1. Open http://localhost:3000
2. Go to **Settings** (sidebar)
3. Enter your MySQL credentials:
   - Host: `localhost`
   - Port: `3306`
   - User: `root`
   - Password: (your MySQL password)
   - Database: `classicmodels` (or your database name)
4. Click **Test Connection**
5. Click **Save Configuration**

## Step 4: Start Asking Questions!

Go to **Ask Query** and try:
- "Show me all customers from France"
- "What are the top 10 products?"
- "List all orders from last month"

## 🎉 You're all set!

### Troubleshooting

**Backend error?**
- Check MySQL is running: `mysql -u root -p`
- Verify `.env` has correct GROQ_API_KEY

**Frontend can't connect?**
- Make sure backend is running on port 8000
- Check `.env.local` has `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`

**Need help?**
- Check the full [README.md](README.md) for detailed instructions
