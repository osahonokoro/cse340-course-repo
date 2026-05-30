import { getAllOrganizations } from '../models/organizations.js';

/**
 * Controller for the home page
 * GET /
 */
const showHomePage = async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
};

export { showHomePage };
