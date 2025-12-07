-- Migration: Initial Schema
-- Created: 2025-12-07
-- Description: Creates all initial tables for the CMS system

-- Users table for CMS authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio items
CREATE TABLE IF NOT EXISTS portfolio_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  link VARCHAR(500),
  category VARCHAR(100) NOT NULL,
  order_index INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills/Expertise
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  items TEXT[] NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Experience/Job History
CREATE TABLE IF NOT EXISTS experiences (
  id SERIAL PRIMARY KEY,
  job_title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  period VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- About section content
CREATE TABLE IF NOT EXISTS about_content (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hero section content
CREATE TABLE IF NOT EXISTS hero_content (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT NOT NULL,
  cta_primary_text VARCHAR(100),
  cta_primary_link VARCHAR(500),
  cta_secondary_text VARCHAR(100),
  cta_secondary_link VARCHAR(500),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact information
CREATE TABLE IF NOT EXISTS contact_info (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  linkedin VARCHAR(500),
  github VARCHAR(500),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog settings (for Medium/Substack RSS)
CREATE TABLE IF NOT EXISTS blog_settings (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  rss_url VARCHAR(500) NOT NULL,
  username VARCHAR(255),
  enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_published ON portfolio_items(published);
CREATE INDEX IF NOT EXISTS idx_portfolio_order ON portfolio_items(order_index);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills(order_index);
CREATE INDEX IF NOT EXISTS idx_experiences_order ON experiences(order_index);
