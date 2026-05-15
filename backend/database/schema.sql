-- ============================================================
-- Database: cheng_kello
-- Fresh Fish Management System
-- ============================================================

CREATE DATABASE IF NOT EXISTS cheng_kello CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cheng_kello;

-- ------------------------------------------------------------
-- Users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150)    NOT NULL,
    email           VARCHAR(150)    NOT NULL UNIQUE,
    password        VARCHAR(255)    NOT NULL,
    role            ENUM('admin','director','cashier') NOT NULL DEFAULT 'cashier',
    phone           VARCHAR(20)     NULL,
    address         TEXT            NULL,
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    profile_picture VARCHAR(255)    NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Fish Categories
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fish_categories (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(10)     NOT NULL UNIQUE,
    description     VARCHAR(100)    NULL,
    unit_price      DECIMAL(12,2)   NOT NULL DEFAULT 0,
    purchase_cost   DECIMAL(12,2)   NULL,
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Purchases
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS purchases (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fish_category_id INT UNSIGNED   NOT NULL,
    quantity        INT UNSIGNED    NOT NULL,
    cost_price      DECIMAL(12,2)   NOT NULL,
    total_cost      DECIMAL(14,2)   NOT NULL,
    created_by      INT UNSIGNED    NOT NULL,
    purchase_date   DATE            NOT NULL,
    supplier_name   VARCHAR(150)    NULL,
    invoice_number  VARCHAR(50)     NULL,
    notes           TEXT            NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fish_category_id) REFERENCES fish_categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by)       REFERENCES users(id)           ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- Stock
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stocks (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fish_category_id INT UNSIGNED   NOT NULL,
    quantity        INT UNSIGNED    NOT NULL,
    cost_price      DECIMAL(12,2)   NULL,
    stock_date      DATE            NOT NULL,
    status          ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
    added_by        INT UNSIGNED    NOT NULL,
    approved_by     INT UNSIGNED    NULL,
    approved_at     TIMESTAMP       NULL,
    notes           TEXT            NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fish_category_id) REFERENCES fish_categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (added_by)         REFERENCES users(id)           ON DELETE RESTRICT,
    FOREIGN KEY (approved_by)      REFERENCES users(id)           ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- Sales
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sales (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fish_category_id INT UNSIGNED   NOT NULL,
    quantity        INT UNSIGNED    NOT NULL,
    unit_price      DECIMAL(12,2)   NOT NULL,
    total_amount    DECIMAL(14,2)   NOT NULL,
    sold_by         INT UNSIGNED    NOT NULL,
    sale_date       DATE            NOT NULL,
    customer_name   VARCHAR(150)    NULL,
    customer_phone  VARCHAR(20)     NULL,
    notes           TEXT            NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fish_category_id) REFERENCES fish_categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (sold_by)          REFERENCES users(id)           ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- Seed: default admin user  (password: admin123)
-- ------------------------------------------------------------
INSERT IGNORE INTO users (name, email, password, role, phone, is_active) VALUES
('OPIYO CHARLES WATMON', 'charlesopiyo446@gmail.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '0782621870', 1),
('OTIM FRED',            'fred@gmail.com',             '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cashier', '0777981262', 1),
('OPIYO ISAAC',          'isaac@fresfish.com',          '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'director', '0786366197', 1);

-- Seed: fish categories
INSERT IGNORE INTO fish_categories (name, description, unit_price, purchase_cost) VALUES
('M',   'Medium',            13000, 10000),
('L',   'Large',             14000, 10000),
('XL',  'Extra Large',       15000, 11000),
('SXL', 'Super Extra Large', 16500, 12000);
