from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from transformers import T5Tokenizer, T5ForConditionalGeneration
import os
from urllib.parse import quote_plus

# ===============================
# 🌍 Load environment variables
# ===============================
load_dotenv()

# Load T5-based Text-to-SQL model (cssupport/t5-small-awesome-text-to-sql)
MODEL_NAME = "cssupport/t5-small-awesome-text-to-sql"
print(f"Loading model: {MODEL_NAME}...")
tokenizer = T5Tokenizer.from_pretrained(MODEL_NAME)
model = T5ForConditionalGeneration.from_pretrained(MODEL_NAME)
print("Model loaded successfully!")

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
        "model": MODEL_NAME
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
        
        # Get database schema in a format the T5 model understands
        schema_parts = []
        with engine.begin() as conn:
            # Get all tables
            tables_result = conn.execute(text("SHOW TABLES"))
            tables = [row[0] for row in tables_result]
            
            # Get detailed schema for each table (column name and type)
            for table in tables:
                rows = conn.execute(text(f"DESCRIBE {table}")).fetchall()
                columns_info = [f"{row[0]} {row[1]}" for row in rows]
                schema_parts.append(f"CREATE TABLE {table} ( {', '.join(columns_info)} )")
        
        schema_text = " | ".join(schema_parts)
        
        # Prepare input for the T5 model in the format it was trained on
        # Format: "translate English to SQL: <question> | <schema>"
        input_text = f"translate English to SQL: {prompt} | {schema_text}"
        
        # Generate SQL using the T5 model
        inputs = tokenizer(input_text, return_tensors="pt", max_length=512, truncation=True, padding=True)
        outputs = model.generate(
            inputs.input_ids,
            max_length=150,
            num_beams=5,
            early_stopping=True
        )
        sql = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
        
        # Clean up the SQL (remove any extra formatting)
        sql = sql.replace("\\n", " ").strip()
        
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
