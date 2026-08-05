import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';

const saltRounds = 10;

/**
 * GET /register
 */
const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

/**
 * POST /register
 */
const processUserRegistrationForm = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'Registration failed. That email may already be in use.');
        res.redirect('/register');
    }
};

/**
 * GET /login
 */
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

/**
 * POST /login
 */
const processLoginForm = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authenticateUser(email, password);

        if (user) {
            req.session.user = user;
            console.log('Logged in user:', user);
            req.flash('success', 'Login successful.');
            res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        req.flash('error', 'Something went wrong logging in.');
        res.redirect('/login');
    }
};

/**
 * GET /logout
 */
const processLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

/**
 * Middleware: require a logged-in user
 */
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'Please log in to access that page.');
        return res.redirect('/login');
    }
    next();
};

/**
 * Middleware factory: require a specific role
 * @param {string} role
 */
const requireRole = (role) => {
    return (req, res, next) => {
        if (req.session.user && req.session.user.role_name === role) {
            return next();
        }
        req.flash('error', 'You do not have permission to access that page.');
        res.redirect('/');
    };
};

/**
 * GET /dashboard
 */
const showDashboard = (req, res) => {
    const { name, email } = req.session.user;
    res.render('dashboard', { title: 'Dashboard', name, email });
};

/**
 * GET /users (admin only)
 */
const showUsersPage = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.render('users', { title: 'Registered Users', users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server Error');
    }
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
};