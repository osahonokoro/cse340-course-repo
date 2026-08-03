import { validationResult } from 'express-validator';
import { getAllCategories, getCategoryById, getProjectsByCategoryId, createCategory, updateCategory, getCategoryIdsForProject, assignCategoriesToProject } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

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

/**
 * Controller for the new category form
 * GET /new-category
 */
const showNewCategoryForm = (req, res) => {
    res.render('new-category', { title: 'New Category', errors: [], name: '' });
};

/**
 * Controller for processing the new category form
 * POST /new-category
 */
const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('new-category', {
            title: 'New Category',
            errors: errors.array(),
            name: req.body.name
        });
    }

    try {
        const { name } = req.body;
        await createCategory(name);
        req.flash('success', 'Category created successfully.');
        res.redirect('/categories');
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Controller for the edit category form
 * GET /edit-category/:id
 */
const showEditCategoryForm = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            return res.status(404).send('Category not found');
        }

        res.render('edit-category', { title: `Edit Category: ${category.name}`, errors: [], category });
    } catch (error) {
        console.error('Error loading edit category form:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Controller for processing the edit category form
 * POST /edit-category/:id
 */
const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('edit-category', {
            title: 'Edit Category',
            errors: errors.array(),
            category: { category_id: categoryId, name: req.body.name }
        });
    }

    try {
        const { name } = req.body;
        await updateCategory(categoryId, name);
        req.flash('success', 'Category updated successfully.');
        res.redirect('/categories');
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Controller for the assign categories to project form
 * GET /assign-categories/:id
 */
const showAssignCategoriesForm = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).send('Project not found');
        }

        const allCategories = await getAllCategories();
        const assignedCategoryIds = await getCategoryIdsForProject(projectId);

        res.render('assign-categories', {
            title: `Assign Categories: ${project.title}`,
            project,
            allCategories,
            assignedCategoryIds
        });
    } catch (error) {
        console.error('Error loading assign categories form:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Controller for processing the assign categories form
 * POST /assign-categories/:id
 */
const processAssignCategoriesForm = async (req, res) => {
    try {
        const projectId = req.params.id;
        let categoryIds = req.body.categoryIds || [];
        if (!Array.isArray(categoryIds)) {
            categoryIds = [categoryIds];
        }

        await assignCategoriesToProject(projectId, categoryIds);

        req.flash('success', 'Categories updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error assigning categories:', error);
        res.status(500).send('Server Error');
    }
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};