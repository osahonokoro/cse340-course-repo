import db from './db.js';

/**
 * Get all active projects with their organization and multiple categories
 * @returns {Promise<Array>} Array of project objects
 */
const getAllProjects = async () => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.date_needed,
            p.status,
            o.organization_id,
            o.name as organization_name,
            o.contact_email as organization_email,
            o.logo_filename,
            ARRAY_AGG(c.name) as categories,
            ARRAY_AGG(c.category_id) as category_ids
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        JOIN project_category pc ON p.project_id = pc.project_id
        JOIN category c ON pc.category_id = c.category_id
        WHERE p.status = 'active'
        GROUP BY p.project_id, o.organization_id, o.name, o.contact_email, o.logo_filename
        ORDER BY p.date_needed
    `;
    const result = await db.query(query);
    return result.rows;
};

/**
 * Get the next N upcoming active projects
 * @param {number} numberOfProjects - How many upcoming projects to retrieve
 * @returns {Promise<Array>} Array of upcoming project objects
 */
const getUpcomingProjects = async (numberOfProjects) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.date_needed,
            p.status,
            o.organization_id,
            o.name as organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.status = 'active' AND p.date_needed >= CURRENT_DATE
        ORDER BY p.date_needed ASC
        LIMIT $1
    `;
    const result = await db.query(query, [numberOfProjects]);
    return result.rows;
};

/**
 * Get full details for a single project by ID (title, description, date, org)
 * @param {number} id - Project ID
 * @returns {Promise<Object|null>} Project object or null
 */
const getProjectDetails = async (id) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.date_needed,
            p.status,
            o.organization_id,
            o.name as organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
};

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            date_needed,
            status
        FROM project
        WHERE organization_id = $1
        ORDER BY date_needed;
    `;
    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);
    
    return result.rows;
};

/**
 * Get a single project by ID with its organization and categories
 * @param {number} id - Project ID
 * @returns {Promise<Object>} Project object
 */
const getProjectById = async (id) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.date_needed,
            p.status,
            o.organization_id,
            o.name as organization_name,
            o.contact_email as organization_email,
            o.logo_filename,
            ARRAY_AGG(c.name) as categories,
            ARRAY_AGG(c.category_id) as category_ids
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        LEFT JOIN project_category pc ON p.project_id = pc.project_id
        LEFT JOIN category c ON pc.category_id = c.category_id
        WHERE p.project_id = $1
        GROUP BY p.project_id, o.organization_id, o.name, o.contact_email, o.logo_filename
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
};

export { getAllProjects, getProjectById, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails };
