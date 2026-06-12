-- ============================================================
-- TERRA AI — MySQL Database Schema
-- File   : database/schema.sql
-- Run    : mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS terra_ai
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE terra_ai;

-- ────────────────────────────────────────────
-- 1. USERS
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            INT          UNSIGNED NOT NULL AUTO_INCREMENT,
    name          VARCHAR(120) NOT NULL,
    email         VARCHAR(180) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('farmer','admin','researcher') NOT NULL DEFAULT 'farmer',
    status        ENUM('Active','Inactive')           NOT NULL DEFAULT 'Active',
    avatar_url    VARCHAR(255),
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_email  (email),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ────────────────────────────────────────────
-- 2. CROPS CATALOGUE
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS crops (
    id            INT          UNSIGNED NOT NULL AUTO_INCREMENT,
    name          VARCHAR(80)  NOT NULL UNIQUE,
    category      VARCHAR(80),
    base_yield    DECIMAL(8,2) COMMENT 'Expected baseline yield (t/ha)',
    grow_days     SMALLINT     COMMENT 'Avg days to maturity',
    water_req_mm  SMALLINT     COMMENT 'Water requirement (mm/season)',
    temp_opt_min  DECIMAL(4,1),
    temp_opt_max  DECIMAL(4,1),
    description   TEXT,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Seed the crops catalogue
INSERT IGNORE INTO crops (name, category, base_yield, grow_days, water_req_mm, temp_opt_min, temp_opt_max) VALUES
  ('Rice',      'Cereal',     5.50,  120, 1200, 20.0, 35.0),
  ('Wheat',     'Cereal',     4.00,  110,  450, 12.0, 25.0),
  ('Corn',      'Cereal',     7.00,  100,  600, 18.0, 32.0),
  ('Soybeans',  'Legume',     3.50,  100,  500, 20.0, 30.0),
  ('Cotton',    'Fibre',      1.80,  180,  700, 22.0, 35.0),
  ('Sugarcane', 'Cash crop', 65.00,  365, 1500, 24.0, 38.0),
  ('Barley',    'Cereal',     4.20,   90,  400, 10.0, 24.0),
  ('Potato',    'Tuber',     25.00,   90,  500, 14.0, 22.0);

-- ────────────────────────────────────────────
-- 3. PREDICTIONS
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS predictions (
    id              INT          UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id         INT          UNSIGNED NOT NULL,
    crop            VARCHAR(80)  NOT NULL,
    soil_type       VARCHAR(40)  NOT NULL,
    temperature     DECIMAL(5,1) NOT NULL,
    humidity        DECIMAL(5,1) NOT NULL,
    rainfall        DECIMAL(8,1) NOT NULL,
    fertilizer      DECIMAL(8,1) NOT NULL,
    irrigation      VARCHAR(40)  NOT NULL,
    predicted_yield DECIMAL(10,3) NOT NULL COMMENT 'tonnes per hectare',
    accuracy        DECIMAL(5,1)  NOT NULL COMMENT 'Model confidence %',
    status          ENUM('Excellent','Good','Fair','Poor') NOT NULL DEFAULT 'Good',
    notes           TEXT,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id   (user_id),
    INDEX idx_crop      (crop),
    INDEX idx_created   (created_at)
) ENGINE=InnoDB;

-- ────────────────────────────────────────────
-- 4. SOIL DATA
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS soil_data (
    id             INT          UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id        INT          UNSIGNED NOT NULL,
    field_name     VARCHAR(120),
    soil_type      VARCHAR(40)  NOT NULL,
    nitrogen       DECIMAL(6,2) DEFAULT 0  COMMENT 'mg/kg',
    phosphorus     DECIMAL(6,2) DEFAULT 0  COMMENT 'mg/kg',
    potassium      DECIMAL(6,2) DEFAULT 0  COMMENT 'mg/kg',
    ph_level       DECIMAL(4,2) DEFAULT 7.0,
    moisture       DECIMAL(5,2) DEFAULT 0  COMMENT 'percentage',
    organic_matter DECIMAL(5,2) DEFAULT 0  COMMENT 'percentage',
    recorded_at    DATE         NOT NULL DEFAULT (CURDATE()),
    notes          TEXT,
    created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_field (user_id, field_name),
    INDEX idx_date       (recorded_at)
) ENGINE=InnoDB;

-- ────────────────────────────────────────────
-- 5. WEATHER DATA
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weather_data (
    id              INT          UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id         INT          UNSIGNED NOT NULL,
    temperature     DECIMAL(5,1) NOT NULL  COMMENT 'Celsius',
    humidity        DECIMAL(5,1) NOT NULL  COMMENT 'percentage',
    rainfall        DECIMAL(7,1) DEFAULT 0 COMMENT 'mm',
    wind_speed      DECIMAL(5,1) DEFAULT 0 COMMENT 'km/h',
    uv_index        TINYINT      DEFAULT 0,
    condition_text  VARCHAR(80),
    recorded_date   DATE         NOT NULL,
    source          VARCHAR(40)  DEFAULT 'manual' COMMENT 'manual | api',
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, recorded_date)
) ENGINE=InnoDB;

-- ────────────────────────────────────────────
-- 6. NOTIFICATIONS
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
    id         INT          UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id    INT          UNSIGNED NOT NULL,
    type       ENUM('info','warning','success','error') NOT NULL DEFAULT 'info',
    title      VARCHAR(120) NOT NULL,
    message    TEXT         NOT NULL,
    is_read    TINYINT(1)   NOT NULL DEFAULT 0,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_unread (user_id, is_read)
) ENGINE=InnoDB;

-- ────────────────────────────────────────────
-- 7. SEED DEFAULT ADMIN
-- ────────────────────────────────────────────
-- Password: Admin@123  (bcrypt hash — change in production!)
INSERT IGNORE INTO users (name, email, password_hash, role) VALUES
  ('Terra Admin',
   'admin@terra.ai',
   '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36oSRiSQxFGJnzGABpuSJSO',
   'admin');

-- ────────────────────────────────────────────
-- DONE
-- ────────────────────────────────────────────
SELECT 'Terra AI schema created successfully ✅' AS result;