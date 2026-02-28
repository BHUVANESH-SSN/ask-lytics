# 🚀 Ask-Lytics - AI-Powered Natural Language to SQL

Ask-Lytics is an intelligent application that converts natural language questions into SQL queries using AI. Ask questions about your database in plain English and get instant SQL queries with results!

## ✨ Features

- 🤖 **AI-Powered Query Generation** - Uses Groq's Llama 3.1 to convert natural language to SQL
- 💬 **Interactive Chat Interface** - Ask questions and get SQL queries with results
- 📊 **Database Schema Explorer** - Browse your database tables and columns
- ✏️ **SQL Editor** - Write and execute custom SQL queries
- 📝 **Query History** - Track and re-run previous queries
- ⚙️ **Dynamic Connection Settings** - Configure database connections on the fly

## 🏗️ Project Structure

```
ask-lytics/
├── app.py                      # FastAPI backend server
├── requirements.txt            # Python dependencies
├── .env                        # Backend environment variables (not in git)
├── .env.example               # Example environment variables
├── mysqlsampledatabase.sql    # Sample MySQL database
│
└── frontend-nextjs/           # Next.js frontend application
    ├── app/                   # Next.js app router pages
    │   ├── ask-query/        # Main chat interface
    │   ├── schema/           # Database schema viewer
    │   ├── sql-editor/       # SQL query editor
    │   ├── history/          # Query history
    │   └── settings/         # Database connection settings
    ├── components/           # Reusable React components
    ├── lib/                  # API utilities and helpers
    └── .env.local           # Frontend environment variables (not in git)
```

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 18+** and npm
- **MySQL 5.7+** or MariaDB
- **Groq API Key** (Get one free at [https://console.groq.com](https://console.groq.com))

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd ask-lytics
```

### 2️⃣ Backend Setup (FastAPI)

#### Install Python Dependencies

```bash
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
# Get your API key from https://console.groq.com
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant

# Your MySQL database credentials
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=classicmodels

# Server configuration
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### Setup Sample Database (Optional)

If you want to use the included sample database:

```bash
mysql -u root -p < mysqlsampledatabase.sql
```

This creates a `classicmodels` database with sample data.

#### Start the Backend Server

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

### 3️⃣ Frontend Setup (Next.js)

#### Navigate to Frontend Directory

```bash
cd frontend-nextjs
```

#### Install Node Dependencies

```bash
npm install
```

#### Configure Environment Variables

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# Optional: Default database connection (can be changed in Settings)
NEXT_PUBLIC_DB_HOST=localhost
NEXT_PUBLIC_DB_PORT=3306
NEXT_PUBLIC_DB_USER=root
NEXT_PUBLIC_DB_PASSWORD=
NEXT_PUBLIC_DB_NAME=classicmodels
```

#### Start the Frontend Development Server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 🎯 Usage

### 1. Configure Database Connection

1. Open `http://localhost:3000`
2. Click on **Settings** in the sidebar
3. Enter your MySQL database credentials
4. Click **Test Connection** to verify
5. Click **Save Configuration**

### 2. Explore Database Schema

- Navigate to **Schema** to browse your database tables and columns
- Use the search bar to filter tables

### 3. Ask Natural Language Questions

1. Go to **Ask Query**
2. Type questions like:
   - "Show me all customers from France"
   - "What are the top 5 products by quantity in stock?"
   - "List all orders from last month"
3. Get AI-generated SQL and results instantly!

### 4. Run Custom SQL

- Use the **SQL Editor** to write and execute custom queries
- View results in real-time

### 5. View Query History

- Check **History** to see previous queries
- Click to re-run any query

## 🔌 API Endpoints

### Backend (FastAPI)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/test-connection` | POST | Test database connection |
| `/schema` | POST | Get database schema |
| `/query` | POST | Convert natural language to SQL and execute |
| `/execute-sql` | POST | Execute raw SQL query |

## 🧪 Example Queries

Try these natural language questions:

- "Show me all customers from USA"
- "What are the top 10 most expensive products?"
- "List employees with their office locations"
- "Show total sales by product line"
- "Find customers with credit limit over 50000"

## 🐛 Troubleshooting

### Backend won't start

- Check if Python dependencies are installed: `pip install -r requirements.txt`
- Verify `.env` file exists and has correct values
- Ensure MySQL server is running

### Frontend won't connect to backend

- Check if backend is running on port 8000
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS settings in `app.py`

### Database connection fails

- Verify MySQL credentials in Settings page
- Check if MySQL server is accessible
- Ensure database exists

### AI not generating good queries

- Make sure `GROQ_API_KEY` is set correctly
- Check backend logs for errors
- Try rephrasing your question

## 📦 Dependencies

### Backend
- **FastAPI** - Modern web framework
- **SQLAlchemy** - Database ORM
- **Groq** - AI model API
- **PyMySQL** - MySQL connector

### Frontend
- **Next.js 14** - React framework
- **TailwindCSS** - Styling
- **Monaco Editor** - SQL editor
- **Lucide Icons** - UI icons

## 🔐 Security Notes

- Never commit `.env` or `.env.local` files to version control
- Use strong database passwords
- Keep your Groq API key secret
- In production, use proper authentication and CORS settings

## 📝 License

See [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🌟 Credits

Built with ❤️ using Groq's Llama 3.1, FastAPI, and Next.js
