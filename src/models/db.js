import pg from "pg";
const { Pool } = pg;

console.log("Connecting to PostgreSQL...");

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000,
});

const testConnection = async () => {
    try {
        const result = await pool.query("SELECT NOW() as current_time");
        console.log("✅ Database connection successful!");
        console.log("   Server time:", result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        throw error;
    }
};

const db = {
    query: (text, params) => pool.query(text, params),
    close: () => pool.end()
};

export { db as default, testConnection };