from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import google.generativeai as genai
import os

# ===============================
# 🌍 Load environment variables
# ===============================
load_dotenv()

# Configure Gemini API key from .env
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Load model name from .env (default: gemini-1.5-flash)
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

app = FastAPI(title="Ask-Lytics Backend", version="1.0")

# ===============================
# ⚙️ CORS SETTINGS
# ===============================
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# ❤️ HEALTH CHECK
# ===============================
@app.get("/")
async def health_check():
    return {
        "status": "running",
        "service": "Ask-Lytics Backend",
        "version": "1.0",
        "gemini_model": MODEL_NAME
    }

@app.post("/test-connection")
async def test_connection(request: Request):
    """Test database connection without running a query"""
    body = await request.json()
    conn_info = body.get("connection", {})
    
    required_fields = ["host", "port", "user", "password", "database"]
    missing = [f for f in required_fields if not conn_info.get(f)]
    if missing:
        return {"error": f"Missing fields: {', '.join(missing)}"}
    
    try:
        engine = create_dynamic_engine(conn_info)
        with engine.connect() as test_conn:
            test_conn.execute(text("SELECT 1"))
        return {"success": True, "message": "Database connection successful!"}
    except Exception as e:
        return {"success": False, "error": f"Connection failed: {str(e)}"}

# ===============================
# 🗄️ DYNAMIC DATABASE ENGINE
# ===============================
def create_dynamic_engine(conn):
    try:
        db_url = (
            f"mysql+pymysql://{conn['user']}:{conn['password']}"
            f"@{conn['host']}:{conn['port']}/{conn['database']}"
        )
        return create_engine(db_url)
    except Exception as e:
        raise ValueError(f"Invalid connection: {e}")

# ===============================
# 💬 NLP → SQL ENDPOINT
# ===============================
@app.post("/query")
async def query_db(request: Request):
    body = await request.json()
    prompt = body.get("prompt", "")
    conn_info = body.get("connection", {})

    # Validate inputs
    if not prompt or not prompt.strip():
        return {"error": "Prompt is required and cannot be empty."}
    
    required_fields = ["host", "port", "user", "password", "database"]
    missing = [f for f in required_fields if not conn_info.get(f)]
    if missing:
        return {"error": f"Missing connection fields: {', '.join(missing)}"}

    try:
        engine = create_dynamic_engine(conn_info)
        
        # Test connection
        try:
            with engine.connect() as test_conn:
                test_conn.execute(text("SELECT 1"))
        except Exception as db_err:
            return {"error": f"Database connection failed: {str(db_err)}. Please check your credentials."}
        
        model = genai.GenerativeModel(MODEL_NAME)

        # 1️⃣ Extract table names from user prompt
        table_prompt = f"Extract table names from this prompt (comma-separated, no explanation): {prompt}"
        table_names_resp = model.generate_content(table_prompt)
        tables = [t.strip() for t in table_names_resp.text.split(",") if t.strip()]

        if not tables:
            return {"error": "No table names detected in the query."}

        # 2️⃣ Fetch schema from the database
        schema_parts = []
        with engine.begin() as conn:
            for table in tables:
                try:
                    rows = conn.execute(text(f"DESCRIBE {table}")).fetchall()
                    columns = [f"{row[0]} {row[1]}" for row in rows]
                    schema_parts.append(f"{table}({', '.join(columns)})")
                except Exception as e:
                    return {"error": f"Schema error for '{table}': {e}"}

        schema = "\n".join(schema_parts)

        # 3️⃣ Generate SQL query using Gemini
        system_prompt = f"""
You are a MySQL expert.
Using the schema below, generate a valid SQL query that answers the user's prompt.

Schema:
{schema}

Return only the SQL query.
"""
        sql_response = model.generate_content(f"{system_prompt}\n\nUser prompt: {prompt}")
        sql = sql_response.text.strip().strip("```sql").strip("```")

        # 4️⃣ Execute the generated SQL query
        with engine.begin() as conn:
            result = conn.execute(text(sql))
            if sql.lower().startswith("select"):
                rows = [dict(row._mapping) for row in result]
                return {"sql": sql, "data": rows}
            else:
                return {"sql": sql, "message": f"{result.rowcount} rows affected."}

    except Exception as e:
        return {"error": f"Server error: {e}"}
