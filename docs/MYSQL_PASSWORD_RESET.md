# MySQL Password Reset Guide for Windows

## Method 1: Using MySQL Command Line

1. **Stop MySQL Service:**
   ```powershell
   Stop-Service MySQL80
   ```

2. **Start MySQL in Safe Mode** (without password check):
   - Open Command Prompt as Administrator
   - Navigate to MySQL bin directory:
     ```cmd
     cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
     ```
   - Start MySQL without grant tables:
     ```cmd
     mysqld --console --skip-grant-tables --shared-memory
     ```

3. **Open Another Command Prompt** and connect to MySQL:
   ```cmd
   cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
   mysql -u root
   ```

4. **Reset the Password:**
   ```sql
   FLUSH PRIVILEGES;
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'Bhuvi@123';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. **Stop the Safe Mode MySQL** (Ctrl+C in the first command prompt)

6. **Restart MySQL Service:**
   ```powershell
   Start-Service MySQL80
   ```

## Method 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Click on "Server" → "Users and Privileges"
3. Select 'root' user
4. Reset the password to `Bhuvi@123`
5. Click "Apply"

## Method 3: Create New User (Recommended for App)

Instead of using root, create a dedicated user:

1. Login to MySQL with correct root password
2. Run these commands:
   ```sql
   CREATE USER 'asklytics'@'localhost' IDENTIFIED BY 'Bhuvi@123';
   GRANT ALL PRIVILEGES ON classicmodels.* TO 'asklytics'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. Update your `.env` file:
   ```env
   DB_USER=asklytics
   DB_PASSWORD=Bhuvi@123
   ```

## Method 4: Find Password in Config Files

Check these locations for saved passwords:
- MySQL Workbench connections: `%APPDATA%\MySQL\Workbench\`
- Other config files where you might have saved it

## After Fixing Password:

Update your `.env` file with the correct password and restart the backend server.
