import db from './db.js';

/**
 * Add a user as a volunteer for a project
 * @param {number} userId
 * @param {number} projectId
 */
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
    `;
    await db.query(query, [userId, projectId]);
};

/**
 * Remove a user as a volunteer for a project
 * @param {number} userId
 * @param {number} projectId
 */
const removeVolunteer = async (userId, projectId) => {
    const query = `DELETE FROM volunteer WHERE user_id = $1 AND project_id = $2`;
    await db.query(query, [userId, projectId]);
};

/**
 * Check if a user is volunteering for a specific project
 * @param {number} userId
 * @param {number} projectId
 * @returns {Promise<boolean>}
 */
const isVolunteering = async (userId, projectId) => {
    const query = `SELECT 1 FROM volunteer WHERE user_id = $1 AND project_id = $2`;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

/**
 * Get all projects a user has volunteered for
 * @param {number} userId
 * @returns {Promise<Array>}
 */
const getVolunteerProjectsForUser = async (userId) => {
    const query = `
        SELECT p.project_id, p.title, p.date_needed, p.status, p.location
        FROM project p
        JOIN volunteer v ON p.project_id = v.project_id
        WHERE v.user_id = $1
        ORDER BY p.date_needed
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

export { addVolunteer, removeVolunteer, isVolunteering, getVolunteerProjectsForUser };