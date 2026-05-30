import { getAllCategories } from '../models/categories.js';

/**
 * Controller for the categories list page
 * GET /categories
 */
const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';
        res.render('categories', { title, categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Server Error');
    }
};

export { showCategoriesPage };
