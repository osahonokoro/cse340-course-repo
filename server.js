import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import router from './src/routes.js';

// DEBUG: Check if .env is loading properly
console.log('=== DEBUG INFO ===');
console.log('DB_URL exists:', !!process.env.DB_URL);
console.log('DB_URL value:', process.env.DB_URL ? process.env.DB_URL.substring(0, 50) + '...' : 'NOT FOUND');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('=================');

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded form data (needed for all POST form submissions)
app.use(express.urlencoded({ extended: true }));

// Session support (required for flash messages)
app.use(session({
    secret: process.env.SESSION_SECRET || 'cse340-service-network-secret',
    resave: false,
    saveUninitialized: false
}));

// Flash messages
app.use(flash());

// Make flash messages available to all views
app.use((req, res, next) => {
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    next();
});

// ============================================
// MIDDLEWARE
// ============================================

// Middleware 1: Log all incoming requests (development only)
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Middleware 2: Make NODE_ENV available to all templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

// ============================================
// ROUTES - Using the router from routes.js
// ============================================

// Use the imported router to handle all routes
app.use(router);

// ============================================
// ERROR HANDLERS
// ============================================

// Catch-all route for 404 errors
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    const status = err.status || 500;
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };
    res.status(status).render(`errors/${status}`, context);
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});