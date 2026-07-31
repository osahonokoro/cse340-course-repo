import db from "./db.js";

const getAllCategories = async () => {
    const query = "SELECT category_id, name, description FROM category ORDER BY name";
    const result = await db.query(query);
    return result.rows;
};

/**
 * Get a single category by ID
 * @param {number} id - Category ID
 * @returns {Promise<Object|null>} Category object or null
 */
const getCategoryById = async (id) => {
    const query = "SELECT category_id, name, description FROM category WHERE category_id = $1";
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
};

/**
 * Get all projects belonging to a given category
 * @param {number} categoryId - Category ID
 * @returns {Promise<Array>} Array of project objects
 */
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.date_needed,
            p.status
        FROM project p
        JOIN project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.date_needed
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

export { getAllCategories, getCategoryById, getProjectsByCategoryId };