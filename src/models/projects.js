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
        JOIN project_category pc ON p.project_id = pc.project_id
        JOIN category c ON pc.category_id = c.category_id
        WHERE p.project_id = $1
        GROUP BY p.project_id, o.organization_id, o.name, o.contact_email, o.logo_filename
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
};

export { getAllProjects, getProjectById };