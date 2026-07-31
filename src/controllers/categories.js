import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

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

/**
 * Controller for the category details page
 * GET /category/:id
 */
const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            return res.status(404).send('Category not found');
        }

        const projects = await getProjectsByCategoryId(categoryId);
        const title = category.name;

        res.render('category', { title, category, projects });
    } catch (error) {
        console.error('Error fetching category details:', error);
        res.status(500).send('Server Error');
    }
};

export { showCategoriesPage, showCategoryDetailsPage };