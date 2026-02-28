-- Users Authentication Table for Ask-Lytics
-- This table stores user credentials for the application

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_mobile (mobile)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample admin user (password: Admin@123)
-- Password hash generated using bcrypt with 12 rounds
INSERT INTO users (name, mobile, email, password_hash) VALUES
('Admin User', '9876543210', 'admin@asklytics.com', '$2b$12$7GrVJSieKz7FogHzxHUniOuUyfVgYdr/LUJ1cAz/AV8q99t/aRs.C')
ON DUPLICATE KEY UPDATE password_hash = '$2b$12$7GrVJSieKz7FogHzxHUniOuUyfVgYdr/LUJ1cAz/AV8q99t/aRs.C';

-- Sample test user (password: Test@123)
INSERT INTO users (name, mobile, email, password_hash) VALUES
('Test User', '8765432109', 'test@asklytics.com', '$2b$12$R1Yb4AJLJAS.vybX0X7bwuiH1w9JITqS3EQ11RFxs5fqu9VUGt0Tm')
ON DUPLICATE KEY UPDATE password_hash = '$2b$12$R1Yb4AJLJAS.vybX0X7bwuiH1w9JITqS3EQ11RFxs5fqu9VUGt0Tm';
-- NewTest123