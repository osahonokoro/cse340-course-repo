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

/**
 * Create a new category
 * @param {string} name - Category name
 * @returns {Promise<Object>} The created category
 */
const createCategory = async (name) => {
    const query = `
        INSERT INTO category (name)
        VALUES ($1)
        RETURNING *
    `;
    const result = await db.query(query, [name]);
    return result.rows[0];
};

/**
 * Update an existing category
 * @param {number} id - Category ID
 * @param {string} name - New category name
 * @returns {Promise<Object>} The updated category
 */
const updateCategory = async (id, name) => {
    const query = `
        UPDATE category
        SET name = $1
        WHERE category_id = $2
        RETURNING *
    `;
    const result = await db.query(query, [name, id]);

    if (result.rows.length === 0) {
        throw new Error(`Category not found with id: ${id}`);
    }

    return result.rows[0];
};

/**
 * Get all category IDs currently assigned to a project
 * @param {number} projectId
 * @returns {Promise<Array<number>>}
 */
const getCategoryIdsForProject = async (projectId) => {
    const query = `SELECT category_id FROM project_category WHERE project_id = $1`;
    const result = await db.query(query, [projectId]);
    return result.rows.map(row => row.category_id);
};

/**
 * Replace all category assignments for a project
 * @param {number} projectId
 * @param {Array<number>} categoryIds - the new full set of category ids for this project
 */
const assignCategoriesToProject = async (projectId, categoryIds) => {
    // Remove all existing assignments for this project
    await db.query(`DELETE FROM project_category WHERE project_id = $1`, [projectId]);

    // Insert the new set (if any were selected)
    for (const categoryId of categoryIds) {
        await db.query(
            `INSERT INTO project_category (project_id, category_id) VALUES ($1, $2)`,
            [projectId, categoryId]
        );
    }
};

export { getAllCategories, getCategoryById, getProjectsByCategoryId, createCategory, updateCategory, getCategoryIdsForProject, assignCategoriesToProject };