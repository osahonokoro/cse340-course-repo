import db from './db.js';

/**
 * Get all organizations from the database
 * @returns {Promise<Array>} Array of organization objects
 */
const getAllOrganizations = async () => {
    const query = `
        SELECT 
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM organization
        ORDER BY name
    `;
    const result = await db.query(query);
    return result.rows;
};

/**
 * Get organization by ID with its projects
 * @param {number} id - Organization ID
 * @returns {Promise<Object>} Organization object with projects
 */
const getOrganizationById = async (id) => {
    const query = `
        SELECT 
            o.organization_id,
            o.name,
            o.description,
            o.contact_email,
            o.logo_filename,
            p.project_id,
            p.title,
            p.description as project_description,
            p.date_needed,
            p.status
        FROM organization o
        LEFT JOIN project p ON o.organization_id = p.organization_id
        WHERE o.organization_id = $1
        ORDER BY p.date_needed
    `;
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) return null;
    
    // Transform rows into organization object with projects array
    const organization = {
        organization_id: result.rows[0].organization_id,
        name: result.rows[0].name,
        description: result.rows[0].description,
        contact_email: result.rows[0].contact_email,
        logo_filename: result.rows[0].logo_filename,
        projects: result.rows
            .filter(row => row.project_id !== null)
            .map(row => ({
                project_id: row.project_id,
                title: row.title,
                description: row.project_description,
                date_needed: row.date_needed,
                status: row.status
            }))
    };
    
    return organization;
};

export { getAllOrganizations, getOrganizationById };