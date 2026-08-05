import db from './db.js';
import bcrypt from 'bcrypt';

/**
 * Create a new user with the default 'user' role
 * @param {string} name
 * @param {string} email
 * @param {string} passwordHash
 * @returns {Promise<Object>} The created user
 */
const createUser = async (name, email, passwordHash) => {
    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = 'user'))
        RETURNING user_id, name, email, role_id
    `;
    const result = await db.query(query, [name, email, passwordHash]);
    return result.rows[0];
};

/**
 * Find a user by email, including their role name
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const queryParams = [email];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

/**
 * Verify a plain text password against a hash
 * @param {string} password
 * @param {string} passwordHash
 * @returns {Promise<boolean>}
 */
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

/**
 * Authenticate a user by email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object|null>} User object (without password_hash) or null
 */
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
        return null;
    }

    delete user.password_hash;
    return user;
};

/**
 * Get all registered users with their role name
 * @returns {Promise<Array>}
 */
const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.name
    `;
    const result = await db.query(query);
    return result.rows;
};

export { createUser, authenticateUser, getAllUsers };