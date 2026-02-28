from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from groq import Groq
import os
from urllib.parse import quote_plus
import jwt
import bcrypt
from datetime import datetime, timedelta

# ===============================
# 🌍 Load environment variables
# ===============================
load_dotenv()

# Groq client + model
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# JWT configuration
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# HTTP Bearer security
security = HTTPBearer()

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
    missing = []
    for f in required_fields:
        val = conn_info.get(f)
        if f == "password":
            if val is None:
                missing.append(f)
        else:
            if not val:
                missing.append(f)
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
    missing = []
    for f in required_fields:
        val = conn_info.get(f)
        if f == "password":
            if val is None:
                missing.append(f)
        else:
            if not val:
                missing.append(f)
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

@app.post("/execute-sql")
async def execute_sql(request: Request):
    """Execute raw SQL query directly"""
    body = await request.json()
    sql = body.get("sql", "")
    conn_info = body.get("connection", {})
    
    if not sql or not sql.strip():
        return {"error": "SQL query is required"}
    
    required_fields = ["host", "port", "user", "password", "database"]
    missing = []
    for f in required_fields:
        val = conn_info.get(f)
        if f == "password":
            if val is None:
                missing.append(f)
        else:
            if not val:
                missing.append(f)
    if missing:
        return {"error": f"Missing fields: {', '.join(missing)}"}
    
    try:
        engine = create_dynamic_engine(conn_info)
        
        with engine.begin() as conn:
            result = conn.execute(text(sql))
            if sql.strip().upper().startswith("SELECT") or sql.strip().upper().startswith("SHOW"):
                rows = [dict(row._mapping) for row in result]
                return {"sql": sql, "data": rows, "rowCount": len(rows)}
            else:
                return {"sql": sql, "message": f"{result.rowcount} rows affected.", "rowCount": result.rowcount}
    except Exception as e:
        return {"error": f"SQL execution failed: {str(e)}"}


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
    missing = []
    for f in required_fields:
        val = conn_info.get(f)
        if f == "password":
            if val is None:
                missing.append(f)
        else:
            if not val:
                missing.append(f)
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


# ===============================
# 🔐 AUTHENTICATION HELPERS
# ===============================
def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_jwt_token(user_id: int, email: str) -> str:
    """Create a JWT token for authenticated user"""
    expiration = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": expiration,
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token from Authorization header"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_auth_engine():
    """Create engine for authentication database"""
    try:
        host = os.getenv("DB_HOST", "localhost")
        port = os.getenv("DB_PORT", "3306")
        user = os.getenv("DB_USER", "root")
        password = os.getenv("DB_PASSWORD", "")
        database = os.getenv("DB_NAME", "classicmodels")
        
        encoded_password = quote_plus(password)
        db_url = f"mysql+pymysql://{user}:{encoded_password}@{host}:{port}/{database}"
        return create_engine(db_url)
    except Exception as e:
        raise ValueError(f"Invalid auth database connection: {e}")


# ===============================
# 🔐 AUTHENTICATION ENDPOINTS
# ===============================
@app.post("/auth/register")
async def register(request: Request):
    """Register a new user"""
    try:
        body = await request.json()
        name = body.get("name", "").strip()
        mobile = body.get("mobile", "").strip()
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        
        # Validation
        if not all([name, mobile, email, password]):
            return {"success": False, "error": "All fields are required"}
        
        if len(password) < 8:
            return {"success": False, "error": "Password must be at least 8 characters"}
        
        # Hash password
        password_hash = hash_password(password)
        
        # Insert user into database
        engine = get_auth_engine()
        with engine.begin() as conn:
            # Check if email or mobile already exists
            check = conn.execute(
                text("SELECT id FROM users WHERE email = :email OR mobile = :mobile"),
                {"email": email, "mobile": mobile}
            ).fetchone()
            
            if check:
                return {"success": False, "error": "Email or mobile number already registered"}
            
            # Insert new user
            result = conn.execute(
                text("INSERT INTO users (name, mobile, email, password_hash) VALUES (:name, :mobile, :email, :password_hash)"),
                {"name": name, "mobile": mobile, "email": email, "password_hash": password_hash}
            )
            user_id = result.lastrowid
        
        # Create JWT token
        token = create_jwt_token(user_id, email)
        
        return {
            "success": True,
            "message": "Registration successful",
            "token": token,
            "user": {"id": user_id, "name": name, "email": email}
        }
    
    except Exception as e:
        return {"success": False, "error": f"Registration failed: {str(e)}"}


@app.post("/auth/login")
async def login(request: Request):
    """Login user and return JWT token"""
    try:
        body = await request.json()
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        
        if not email or not password:
            return {"success": False, "error": "Email and password are required"}
        
        # Find user in database
        engine = get_auth_engine()
        with engine.begin() as conn:
            result = conn.execute(
                text("SELECT id, name, email, password_hash, is_active FROM users WHERE email = :email"),
                {"email": email}
            ).fetchone()
            
            if not result:
                return {"success": False, "error": "Invalid email or password"}
            
            user_id, name, email, password_hash, is_active = result
            
            if not is_active:
                return {"success": False, "error": "Account is deactivated"}
            
            # Verify password
            if not verify_password(password, password_hash):
                return {"success": False, "error": "Invalid email or password"}
            
            # Update last login
            conn.execute(
                text("UPDATE users SET last_login = NOW() WHERE id = :id"),
                {"id": user_id}
            )
        
        # Create JWT token
        token = create_jwt_token(user_id, email)
        
        return {
            "success": True,
            "message": "Login successful",
            "token": token,
            "user": {"id": user_id, "name": name, "email": email}
        }
    
    except Exception as e:
        return {"success": False, "error": f"Login failed: {str(e)}"}


@app.post("/auth/forgot-password")
async def forgot_password(request: Request):
    """Reset password by verifying email and mobile number"""
    try:
        body = await request.json()
        email = body.get("email", "").strip().lower()
        mobile = body.get("mobile", "").strip()
        new_password = body.get("new_password", "")
        
        if not email or not mobile or not new_password:
            return {"success": False, "error": "Email, mobile, and new password are required"}
            
        if len(new_password) < 8:
            return {"success": False, "error": "New password must be at least 8 characters"}
            
        engine = get_auth_engine()
        with engine.begin() as conn:
            # Verify user exists with this exact email and mobile combination
            result = conn.execute(
                text("SELECT id FROM users WHERE email = :email AND mobile = :mobile AND is_active = TRUE"),
                {"email": email, "mobile": mobile}
            ).fetchone()
            
            if not result:
                return {"success": False, "error": "Invalid email or mobile number"}
                
            user_id = result[0]
            
            # Hash new password and update
            new_hash = hash_password(new_password)
            conn.execute(
                text("UPDATE users SET password_hash = :password_hash WHERE id = :id"),
                {"password_hash": new_hash, "id": user_id}
            )
            
        return {
            "success": True,
            "message": "Password reset successfully. You can now login with your new password."
        }
        
    except Exception as e:
        return {"success": False, "error": f"Password reset failed: {str(e)}"}


@app.get("/auth/me")
async def get_current_user(payload: dict = Depends(verify_jwt_token)):
    """Get current authenticated user details"""
    try:
        engine = get_auth_engine()
        with engine.connect() as conn:
            result = conn.execute(
                text("SELECT id, name, email, mobile, created_at, last_login FROM users WHERE id = :id"),
                {"id": payload["user_id"]}
            ).fetchone()
            
            if not result:
                raise HTTPException(status_code=404, detail="User not found")
            
            user_id, name, email, mobile, created_at, last_login = result
            
            return {
                "success": True,
                "user": {
                    "id": user_id,
                    "name": name,
                    "email": email,
                    "mobile": mobile,
                    "created_at": created_at.isoformat() if created_at else None,
                    "last_login": last_login.isoformat() if last_login else None
                }
            }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch user: {str(e)}")


@app.put("/auth/update-profile")
async def update_profile(request: Request, payload: dict = Depends(verify_jwt_token)):
    """Update user profile information"""
    try:
        body = await request.json()
        name = body.get("name", "").strip()
        email = body.get("email", "").strip().lower()
        mobile = body.get("mobile", "").strip()
        
        if not name or not email:
            raise HTTPException(status_code=400, detail="Name and email are required")
        
        engine = get_auth_engine()
        with engine.begin() as conn:
            # Check if new email is already used by another user
            result = conn.execute(
                text("SELECT id FROM users WHERE email = :email AND id != :user_id"),
                {"email": email, "user_id": payload["user_id"]}
            ).fetchone()
            
            if result:
                raise HTTPException(status_code=400, detail="Email already in use")
            
            # Update user information
            conn.execute(
                text("UPDATE users SET name = :name, email = :email, mobile = :mobile WHERE id = :id"),
                {"name": name, "email": email, "mobile": mobile, "id": payload["user_id"]}
            )
        
        return {
            "success": True,
            "message": "Profile updated successfully",
            "user": {"id": payload["user_id"], "name": name, "email": email, "mobile": mobile}
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")


@app.put("/auth/change-password")
async def change_password(request: Request, payload: dict = Depends(verify_jwt_token)):
    """Change user password"""
    try:
        body = await request.json()
        current_password = body.get("current_password", "")
        new_password = body.get("new_password", "")
        
        if not current_password or not new_password:
            raise HTTPException(status_code=400, detail="Current and new passwords are required")
        
        if len(new_password) < 8:
            raise HTTPException(status_code=400, detail="New password must be at least 8 characters")
        
        engine = get_auth_engine()
        with engine.begin() as conn:
            # Get current password hash
            result = conn.execute(
                text("SELECT password_hash FROM users WHERE id = :id"),
                {"id": payload["user_id"]}
            ).fetchone()
            
            if not result:
                raise HTTPException(status_code=404, detail="User not found")
            
            stored_hash = result[0]
            
            # Verify current password
            if not verify_password(current_password, stored_hash):
                raise HTTPException(status_code=400, detail="Current password is incorrect")
            
            # Hash new password
            new_hash = hash_password(new_password)
            
            # Update password
            conn.execute(
                text("UPDATE users SET password_hash = :password_hash WHERE id = :id"),
                {"password_hash": new_hash, "id": payload["user_id"]}
            )
        
        return {
            "success": True,
            "message": "Password changed successfully"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to change password: {str(e)}")


# ===============================
# 🚀 RUN SERVER
# ===============================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)


