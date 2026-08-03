import db from './db.js';

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

const getOrganizationDetails = async (organizationId) => {
    const query = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM organization
        WHERE organization_id = $1;
    `;
    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);
    
    return result.rows.length > 0 ? result.rows[0] : null;
};

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

/**
 * Create a new organization
 * @param {string} name
 * @param {string} description
 * @param {string} contactEmail
 * @returns {Promise<Object>} The created organization
 */
const createOrganization = async (name, description, contactEmail) => {
    const query = `
        INSERT INTO organization (name, description, contact_email, logo_filename)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const defaultLogo = 'default-logo.png';
    const result = await db.query(query, [name, description, contactEmail, defaultLogo]);
    return result.rows[0];
};

/**
 * Update an existing organization
 * @param {number} id
 * @param {string} name
 * @param {string} description
 * @param {string} contactEmail
 * @returns {Promise<Object>} The updated organization
 */
const updateOrganization = async (id, name, description, contactEmail) => {
    const query = `
        UPDATE organization
        SET name = $1, description = $2, contact_email = $3
        WHERE organization_id = $4
        RETURNING *
    `;
    const result = await db.query(query, [name, description, contactEmail, id]);

    if (result.rows.length === 0) {
        throw new Error(`Organization not found with id: ${id}`);
    }

    return result.rows[0];
};

export { getAllOrganizations, getOrganizationDetails, getOrganizationById, createOrganization, updateOrganization };