"""
Quick MySQL Connection Test
This script tests your MySQL credentials before starting the app.
"""

import pymysql
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "classicmodels")

print("=" * 60)
print("🔍 TESTING MYSQL CONNECTION")
print("=" * 60)
print(f"Host: {DB_HOST}")
print(f"Port: {DB_PORT}")
print(f"User: {DB_USER}")
print(f"Database: {DB_NAME}")
print(f"Password: {'*' * len(DB_PASSWORD) if DB_PASSWORD else '(empty)'}")
print("=" * 60)

try:
    # Test connection
    conn = pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    
    print("✅ CONNECTION SUCCESSFUL!")
    print()
    
    # Test query
    with conn.cursor() as cursor:
        cursor.execute("SELECT VERSION()")
        version = cursor.fetchone()[0]
        print(f"MySQL Version: {version}")
        
        cursor.execute("SELECT DATABASE()")
        current_db = cursor.fetchone()[0]
        print(f"Current Database: {current_db}")
        
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        print(f"Tables in {current_db}: {len(tables)}")
        for table in tables:
            print(f"  - {table[0]}")
        
        # Check if users table exists
        cursor.execute("SHOW TABLES LIKE 'users'")
        users_table = cursor.fetchone()
        if users_table:
            print("\n✅ Users table exists (authentication ready)")
            cursor.execute("SELECT COUNT(*) FROM users")
            user_count = cursor.fetchone()[0]
            print(f"   Total users: {user_count}")
        else:
            print("\n⚠️  Users table NOT found!")
            print("   Run: mysql -u root -p classicmodels < users_authentication.sql")
    
    conn.close()
    print()
    print("=" * 60)
    print("✅ ALL CHECKS PASSED - You can start the app now!")
    print("=" * 60)
    
except pymysql.err.OperationalError as e:
    error_code, error_msg = e.args
    print()
    print("=" * 60)
    print("❌ CONNECTION FAILED!")
    print("=" * 60)
    print(f"Error Code: {error_code}")
    print(f"Error Message: {error_msg}")
    print()
    
    if error_code == 1045:
        print("🔧 SOLUTION:")
        print("1. Your password is incorrect!")
        print("2. Check your .env file and update DB_PASSWORD")
        print("3. Or reset MySQL password (see MYSQL_PASSWORD_RESET.md)")
        print()
        print("Common issues:")
        print("  - Password has special characters? Make sure .env is correct")
        print("  - Using root? Consider creating a dedicated user")
        print("  - Forgot password? Use MySQL Workbench to reset it")
    elif error_code == 1049:
        print("🔧 SOLUTION:")
        print(f"Database '{DB_NAME}' does not exist!")
        print("1. Create the database:")
        print(f"   mysql -u root -p -e \"CREATE DATABASE {DB_NAME}\"")
        print("2. Import sample data:")
        print(f"   mysql -u root -p {DB_NAME} < mysqlsampledatabase.sql")
    elif error_code == 2003:
        print("🔧 SOLUTION:")
        print("MySQL server is not running or cannot be reached!")
        print("1. Start MySQL service: Get-Service MySQL80 | Start-Service")
        print("2. Check if MySQL is installed")
        print(f"3. Verify host '{DB_HOST}' and port '{DB_PORT}'")
    else:
        print("🔧 SOLUTION:")
        print("Check your MySQL configuration and credentials")
        print("See .env.example for required settings")
    
    print("=" * 60)
    
except Exception as e:
    print()
    print("=" * 60)
    print("❌ UNEXPECTED ERROR!")
    print("=" * 60)
    print(f"Error: {str(e)}")
    print()
    print("Check your .env file configuration")
    print("=" * 60)
