from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from groq import Groq
import os
from urllib.parse import quote_plus

# ===============================
# 🌍 Load environment variables
# ===============================
load_dotenv()

# Groq client + model
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

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
        "model": GROQ_MODEL,
        "groq_configured": bool(GROQ_API_KEY)
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

@app.post("/schema")
async def get_schema(request: Request):
    """Get database schema information"""
    body = await request.json()
    conn_info = body.get("connection", {})
    
    required_fields = ["host", "port", "user", "password", "database"]
    missing = [f for f in required_fields if not conn_info.get(f)]
    if missing:
        return {"error": f"Missing fields: {', '.join(missing)}"}
    
    try:
        engine = create_dynamic_engine(conn_info)
        schema_info = []
        
        with engine.begin() as conn:
            # Get all tables
            tables_result = conn.execute(text("SHOW TABLES"))
            tables = [row[0] for row in tables_result]
            
            # Get detailed schema for each table
            for table in tables:
                rows = conn.execute(text(f"DESCRIBE {table}")).fetchall()
                columns = [{"name": row[0], "type": row[1], "nullable": row[2], "key": row[3]} for row in rows]
                schema_info.append({"table": table, "columns": columns})
        
        return {"schema": schema_info, "tableCount": len(schema_info)}
    except Exception as e:
        return {"error": f"Failed to fetch schema: {str(e)}"}

# ===============================
# 🗄️ DYNAMIC DATABASE ENGINE
# ===============================
def create_dynamic_engine(conn):
    try:
        # URL-encode the password to handle special characters like @, #, etc.
        encoded_password = quote_plus(conn['password'])
        db_url = (
            f"mysql+pymysql://{conn['user']}:{encoded_password}"
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
        
        # Get database schema for prompting the LLM
        schema_parts = []
        with engine.begin() as conn:
            # Get all tables
            tables_result = conn.execute(text("SHOW TABLES"))
            tables = [row[0] for row in tables_result]
            
            # Get detailed schema for each table (column name and type)
            for table in tables:
                rows = conn.execute(text(f"DESCRIBE {table}")).fetchall()
                columns_info = [f"{row[0]} ({row[1]})" for row in rows]
                schema_parts.append(f"Table '{table}': {', '.join(columns_info)}")
        
        schema_text = "\n".join(schema_parts)
        
        # Log schema for debugging
        print(f"\n=== SCHEMA SENT TO AI ===")
        print(f"Total tables: {len(tables)}")
        print(f"Tables: {', '.join(tables)}")
        print(f"Full schema length: {len(schema_text)} characters")
        print(schema_text)  # Print FULL schema, not truncated
        print(f"=== USER QUESTION ===")
        print(prompt)
        print(f"========================\n")

        if not client:
            return {"error": "Groq API key not configured. Set GROQ_API_KEY in .env."}

        # Generate SQL using Groq Llama 3.1
        system_prompt = (
            "You are an expert MySQL database assistant. Your task is to convert natural language questions "
            "into accurate, executable SQL queries.\n\n"
            "CRITICAL RULES:\n"
            "1. Analyze the user's question carefully to identify which table(s) and columns are relevant\n"
            "2. Use exact column names and table names from the provided schema\n"
            "3. For questions about 'payment details' or 'check number', use the 'payments' table\n"
            "4. For questions about customers, use the 'customers' table\n"
            "5. For questions about orders, use the 'orders' table\n"
            "6. For questions about products, use the 'products' table\n"
            "7. Return ONLY the SQL query - no explanations, comments, backticks, or markdown\n"
            "8. Use appropriate WHERE clauses to filter based on the user's specific criteria\n"
            "9. Join tables when necessary to get complete information\n"
            "10. Do NOT return generic queries - always address the specific question asked"
        )

        user_prompt = (
            f"Database Schema:\n{schema_text}\n\n"
            f"User Question: {prompt}\n\n"
            f"Instructions: Generate a MySQL query that directly answers this specific question. "
            f"Use the exact table and column names from the schema. Return only the SQL query."
        )

        chat = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.1,
            max_tokens=512,
        )

        sql = (chat.choices[0].message.content or "").strip()
        
        # Remove markdown code fences if present
        if sql.startswith("```"):
            lines = sql.split("\n")
            sql = "\n".join(lines[1:-1]) if len(lines) > 2 else lines[1] if len(lines) > 1 else sql
        sql = sql.replace("```sql", "").replace("```", "").strip()
        
        # Clean up the SQL (remove any extra formatting)
        sql = sql.replace("\n", " ").strip()
        
        # Log generated SQL for debugging
        print(f"\n=== GENERATED SQL ===")
        print(sql)
        print(f"=====================\n")
        
        # Validate SQL starts with SELECT, INSERT, UPDATE, or DELETE
        if not any(sql.upper().startswith(cmd) for cmd in ["SELECT", "INSERT", "UPDATE", "DELETE", "SHOW"]):
            return {"error": f"Generated invalid SQL: {sql}. Please rephrase your question."}

        # Execute the generated SQL query
        with engine.begin() as conn:
            result = conn.execute(text(sql))
            if sql.upper().startswith("SELECT") or sql.upper().startswith("SHOW"):
                rows = [dict(row._mapping) for row in result]
                return {"sql": sql, "data": rows}
            else:
                return {"sql": sql, "message": f"{result.rowcount} rows affected."}

    except Exception as e:
        return {"error": f"Server error: {e}"}
