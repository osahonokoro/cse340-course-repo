-- ============================================
-- CSE 340 Database Setup Script
-- Author: Osahon Okoro
-- Date: May 2026
-- ============================================

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS organization;
DROP TABLE IF EXISTS category;

-- ============================================
-- 1. Create organization table
-- ============================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ============================================
-- 2. Create category table
-- ============================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- ============================================
-- 3. Create project table (with foreign keys)
-- ============================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization(organization_id),
    category_id INTEGER NOT NULL REFERENCES category(category_id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    date_needed DATE,
    status VARCHAR(50) DEFAULT 'active' NOT NULL
);

-- ============================================
-- Insert organization data
-- ============================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES 
    ('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
    ('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
    ('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ============================================
-- Insert category data
-- ============================================
INSERT INTO category (name, description)
VALUES 
    ('Environmental', 'Projects focused on nature conservation, cleanup, and sustainability'),
    ('Educational', 'Projects involving tutoring, teaching, and knowledge sharing'),
    ('Community Service', 'Projects that directly benefit local neighborhoods and residents'),
    ('Health and Wellness', 'Projects promoting physical and mental health, healthcare access');

-- ============================================
-- Insert project data
-- ============================================
INSERT INTO project (organization_id, category_id, title, description, date_needed, status)
VALUES 
    (1, 1, 'Park Cleanup Initiative', 'Join BrightFuture Builders to clean and restore city parks. Supplies provided.', '2025-06-15', 'active'),
    (1, 3, 'Community Garden Project', 'Help build a sustainable community garden in downtown area.', '2025-07-01', 'active'),
    (2, 1, 'Urban Tree Planting', 'Plant trees in urban areas to improve air quality and green spaces.', '2025-06-30', 'active'),
    (2, 2, 'Farm Education Workshop', 'Teach local residents about sustainable farming techniques.', '2025-07-10', 'active'),
    (3, 3, 'Food Bank Distribution', 'Help sort and distribute food to families in need.', '2025-06-20', 'active'),
    (3, 4, 'Senior Center Visits', 'Spend time with seniors, assist with activities and companionship.', '2025-07-05', 'active');

-- ============================================
-- Verify data (optional - for testing)
-- ============================================
SELECT * FROM organization;
SELECT * FROM category;
SELECT * FROM project;

-- Join query to see all related data
SELECT 
    p.project_id,
    p.title,
    o.name AS organization_name,
    c.name AS category_name,
    p.date_needed,
    p.status
FROM project p
JOIN organization o ON p.organization_id = o.organization_id
JOIN category c ON p.category_id = c.category_id
ORDER BY p.date_needed;