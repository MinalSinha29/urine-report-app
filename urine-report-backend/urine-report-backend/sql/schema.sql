-- Urine Report Portal — schema
-- Run via `npm run db:migrate` (see src/db/migrate.js), or paste into any
-- MySQL client. Safe to re-run: every statement is idempotent.

CREATE DATABASE IF NOT EXISTS urine_report_portal
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE urine_report_portal;

-- Doctors log in with these credentials (Phase 2, Part 3 - Auth).
CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  username VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  department VARCHAR(120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- One row per person. patient_id is the human-facing business key
-- (e.g. "PT-1042") shown throughout the UI; `id` is the internal FK target.
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  age INT NOT NULL,
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_patients_name (name)
) ENGINE=InnoDB;

-- One row per generated report. The rule-based (or later, ML) evaluation
-- output is stored here so a report's result never has to be recomputed
-- to be displayed — it's a historical record, not a live query.
CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_id VARCHAR(20) NOT NULL UNIQUE,
  patient_id INT NOT NULL,
  doctor_id INT,
  doctor_name VARCHAR(120) NOT NULL,
  report_date DATE NOT NULL,
  overall_status ENUM('Normal', 'Abnormal') NOT NULL,
  overall_assessment VARCHAR(255) NOT NULL,
  flags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
  INDEX idx_reports_date (report_date),
  INDEX idx_reports_status (overall_status)
) ENGINE=InnoDB;

-- One row per parameter per report (10 rows per report). Normalized rather
-- than a JSON blob so the API can query/aggregate on individual parameters
-- later (e.g. "how many reports had High glucose this month").
CREATE TABLE IF NOT EXISTS report_parameters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT NOT NULL,
  param_key VARCHAR(40) NOT NULL,
  label VARCHAR(60) NOT NULL,
  unit VARCHAR(20),
  value DECIMAL(10, 4) NOT NULL,
  low_value DECIMAL(10, 4) NOT NULL,
  normal_max DECIMAL(10, 4) NOT NULL,
  status ENUM('Normal', 'Low', 'High') NOT NULL,
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
  INDEX idx_report_parameters_report (report_id)
) ENGINE=InnoDB;
