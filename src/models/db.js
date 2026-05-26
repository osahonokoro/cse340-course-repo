import pg from "pg";
const { Pool } = pg;

console.log("Connecting to PostgreSQL...");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DB_URL exists:", !!process.env.DB_URL);

let poolConfig;

// For local development (NODE_ENV is NOT production)
if (process.env.NODE_ENV === "production") {
    // On Render: Use SSL with rejectUnauthorized false
    console.log("Using Render (production) database configuration.");
    poolConfig = {
        connectionString: process.env.DB_URL,
        ssl: {
            rejectUnauthorized: false,
        },
        connectionTimeoutMillis: 10000,
    };
} else {
    // On local computer: No SSL, simple configuration
    console.log("Using local (development) database configuration.");
    poolConfig = {
        host: "localhost",
        port: 5432,
        database: "cse340_db",
        user: "postgres",
        password: "Gal2v20@78",
        ssl: false,
        connectionTimeoutMillis: 10000,
    };
}

const pool = new Pool(poolConfig);

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
    close: () => pool.end(),
};

export { db as default, testConnection };