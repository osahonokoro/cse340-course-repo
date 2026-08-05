-- ============================================
-- CSE 340 Database Setup Script
-- Author: Osahon Okoro
-- Date: May 2026
-- ============================================

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS project_category;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS organization;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

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
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    date_needed DATE,
    status VARCHAR(50) DEFAULT 'active' NOT NULL,
    location VARCHAR(255)
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
-- 4. Create junction table (many-to-many)
--    Allows one project to have multiple categories
-- ============================================
CREATE TABLE project_category (
    project_id INTEGER REFERENCES project(project_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- ============================================
-- Insert project data (5+ per organization = 15+ total)
-- ============================================
INSERT INTO project (organization_id, title, description, date_needed, status, location)
VALUES 
    -- BrightFuture Builders (organization_id = 1) - 5 projects
    (1, 'Park Cleanup Initiative', 'Join BrightFuture Builders to clean and restore city parks. Supplies provided.', '2025-06-15', 'active', 'Riverside Park, Springfield'),
    (1, 'Community Garden Project', 'Help build a sustainable community garden in downtown area.', '2025-07-01', 'active', 'Downtown Community Lot, Springfield'),
    (1, 'School Playground Build', 'Build a new playground at Lincoln Elementary School.', '2025-08-10', 'active', 'Lincoln Elementary School, Springfield'),
    (1, 'Senior Center Renovation', 'Help renovate the local senior center with new paint and furniture.', '2025-09-05', 'active', 'Maple Street Senior Center, Springfield'),
    (1, 'Affordable Housing Project', 'Assist in building affordable homes for low-income families.', '2025-10-15', 'active', 'Oakwood District, Springfield'),
    
    -- GreenHarvest Growers (organization_id = 2) - 5 projects
    (2, 'Urban Tree Planting', 'Plant trees in urban areas to improve air quality and green spaces.', '2025-06-30', 'active', 'Elm Avenue Greenway, Springfield'),
    (2, 'Farm Education Workshop', 'Teach local residents about sustainable farming techniques.', '2025-07-10', 'active', 'GreenHarvest Learning Farm, Springfield'),
    (2, 'Community Composting Program', 'Establish a composting program for local restaurants and homes.', '2025-08-20', 'active', 'Westside Composting Yard, Springfield'),
    (2, 'School Garden Initiative', 'Create teaching gardens at three elementary schools.', '2025-09-15', 'active', 'Roosevelt Elementary School, Springfield'),
    (2, 'Farmers Market Support', 'Help organize and run the weekly farmers market.', '2025-10-01', 'active', 'Town Square Market, Springfield'),
    
    -- UnityServe Volunteers (organization_id = 3) - 5 projects
    (3, 'Food Bank Distribution', 'Help sort and distribute food to families in need.', '2025-06-20', 'active', 'UnityServe Food Bank, Springfield'),
    (3, 'Senior Center Visits', 'Spend time with seniors, assist with activities and companionship.', '2025-07-05', 'active', 'Maple Street Senior Center, Springfield'),
    (3, 'Clothing Drive', 'Organize and sort donated clothing for homeless shelters.', '2025-08-15', 'active', 'UnityServe Donation Center, Springfield'),
    (3, 'After-School Tutoring', 'Tutor elementary students in reading and math.', '2025-09-10', 'active', 'Jefferson Public Library, Springfield'),
    (3, 'Disaster Relief Preparation', 'Prepare emergency kits and train volunteers for disaster response.', '2025-10-20', 'active', 'Emergency Services Warehouse, Springfield');

-- ============================================
-- Insert project-category associations (many-to-many)
-- ============================================
INSERT INTO project_category (project_id, category_id) VALUES
    -- Park Cleanup (project 1): Environmental
    (1, 1),
    
    -- Community Garden (project 2): Environmental, Community Service
    (2, 1), (2, 3),
    
    -- School Playground (project 3): Community Service
    (3, 3),
    
    -- Senior Center Renovation (project 4): Community Service
    (4, 3),
    
    -- Affordable Housing (project 5): Community Service
    (5, 3),
    
    -- Urban Tree Planting (project 6): Environmental
    (6, 1),
    
    -- Farm Education (project 7): Environmental, Educational
    (7, 1), (7, 2),
    
    -- Community Composting (project 8): Environmental
    (8, 1),
    
    -- School Garden (project 9): Environmental, Educational
    (9, 1), (9, 2),
    
    -- Farmers Market (project 10): Community Service
    (10, 3),
    
    -- Food Bank (project 11): Community Service
    (11, 3),
    
    -- Senior Visits (project 12): Community Service, Health & Wellness
    (12, 3), (12, 4),
    
    -- Clothing Drive (project 13): Community Service
    (13, 3),
    
    -- After-School Tutoring (project 14): Educational
    (14, 2),
    
    -- Disaster Relief (project 15): Community Service, Health & Wellness
    (15, 3), (15, 4);

-- ============================================
-- 5. Create roles table
-- ============================================
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- ============================================
-- 6. Create users table
-- ============================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Verification queries (optional — for manual testing only)
-- Commented out so this script only performs setup when run.
-- Uncomment locally in pgAdmin if you want to sanity-check the data.
-- ============================================

-- SELECT * FROM organization;
-- SELECT * FROM category;
-- SELECT * FROM project;
-- SELECT * FROM roles;
-- SELECT * FROM users;

-- SELECT 
--     p.project_id,
--     p.title,
--     o.name AS organization_name,
--     c.name AS category_name,
--     p.date_needed,
--     p.status
-- FROM project p
-- JOIN organization o ON p.organization_id = o.organization_id
-- JOIN project_category pc ON p.project_id = pc.project_id
-- JOIN category c ON pc.category_id = c.category_id
-- ORDER BY p.date_needed;