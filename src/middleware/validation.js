import { body } from 'express-validator';

const categoryValidationRules = () => {
    return [
        body('name')
            .trim()
            .notEmpty().withMessage('Category name is required.')
            .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters.')
    ];
};

const organizationValidationRules = () => {
    return [
        body('name')
            .trim()
            .notEmpty().withMessage('Organization name is required.')
            .isLength({ min: 3, max: 150 }).withMessage('Organization name must be between 3 and 150 characters.'),
        body('description')
            .trim()
            .notEmpty().withMessage('Description is required.'),
        body('contactEmail')
            .trim()
            .notEmpty().withMessage('Contact email is required.')
            .isEmail().withMessage('Please enter a valid email address.')
    ];
};

const projectValidationRules = () => {
    return [
        body('title')
            .trim()
            .notEmpty().withMessage('Project title is required.')
            .isLength({ min: 3, max: 200 }).withMessage('Project title must be between 3 and 200 characters.'),
        body('description')
            .trim()
            .notEmpty().withMessage('Description is required.'),
        body('dateNeeded')
            .notEmpty().withMessage('Date needed is required.')
            .isDate().withMessage('Please enter a valid date.'),
        body('status')
            .trim()
            .notEmpty().withMessage('Status is required.')
            .isIn(['active', 'completed', 'cancelled']).withMessage('Please select a valid status.'),
        body('organizationId')
            .notEmpty().withMessage('Please select an organization.')
            .isInt().withMessage('Invalid organization selected.'),
        body('location')
            .trim()
            .notEmpty().withMessage('Location is required.')
            .isLength({ max: 255 }).withMessage('Location must be under 255 characters.')
    ];
};

export { categoryValidationRules, organizationValidationRules, projectValidationRules };

