import db from "./db.js";

/**
 * Get all categories from the database
 * @returns {Promise<Array>} Array of category objects
 */
const getAllCategories = async () => {
    const query = "SELECT category_id, name, description FROM category ORDER BY name";
    const result = await db.query(query);
    return result.rows;
};

export { getAllCategories };
