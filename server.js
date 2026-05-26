import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import { testConnection } from './src/models/db.js';
import { getAllCategories } from './src/models/categories.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjects } from './src/models/projects.js';

// Load environment variables
dotenv.config();

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

/**
 * Routes
 */
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

app.get('/organizations', async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('organizations', { 
            title: 'Organizations',
            organizations: organizations 
        });
    } catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/projects', async (req, res) => {
    try {
        const projects = await getAllProjects();
        res.render('projects', { 
            title: 'Service Projects',
            projects: projects 
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).send('Server Error');
    }
});

/**app.get('/categories', (req, res) => {
    res.render('categories', { title: 'Categories' });
}); */

app.get('/categories', async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { 
            title: 'Categories',
            categories: categories 
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Server Error');
    }
});

// Start the server
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});