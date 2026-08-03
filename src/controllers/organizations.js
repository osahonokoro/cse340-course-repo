import { validationResult } from 'express-validator';
import { getAllOrganizations, getOrganizationDetails, getOrganizationById, createOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';
        res.render('organizations', { title, organizations });
    } catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).send('Server Error');
    }
};

const showOrganizationDetailsPage = async (req, res) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationDetails(organizationId);
        
        if (!organizationDetails) {
            return res.status(404).send('Organization not found');
        }
        
        const projects = await getProjectsByOrganizationId(organizationId);
        const title = organizationDetails.name;
        
        res.render('organization', { title, organizationDetails, projects });
    } catch (error) {
        console.error('Error fetching organization details:', error);
        res.status(500).send('Server Error');
    }
};

const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';
    res.render('new-organization', { title, errors: [], name: '', description: '', contactEmail: '' });
};

/**
 * Controller for processing the new organization form
 * POST /new-organization
 */
const processNewOrganizationForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('new-organization', {
            title: 'Add New Organization',
            errors: errors.array(),
            name: req.body.name,
            description: req.body.description,
            contactEmail: req.body.contactEmail
        });
    }

    try {
        const { name, description, contactEmail } = req.body;
        const newOrg = await createOrganization(name, description, contactEmail);
        req.flash('success', 'Organization created successfully.');
        res.redirect(`/organization/${newOrg.organization_id}`);
    } catch (error) {
        console.error('Error creating organization:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Controller for the edit organization form
 * GET /edit-organization/:id
 */
const showEditOrganizationForm = async (req, res) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationDetails(organizationId);

        if (!organizationDetails) {
            return res.status(404).send('Organization not found');
        }

        res.render('edit-organization', {
            title: `Edit Organization: ${organizationDetails.name}`,
            errors: [],
            organizationDetails
        });
    } catch (error) {
        console.error('Error loading edit organization form:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Controller for processing the edit organization form
 * POST /edit-organization/:id
 */
const processEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('edit-organization', {
            title: 'Edit Organization',
            errors: errors.array(),
            organizationDetails: {
                organization_id: organizationId,
                name: req.body.name,
                description: req.body.description,
                contact_email: req.body.contactEmail
            }
        });
    }

    try {
        const { name, description, contactEmail } = req.body;
        await updateOrganization(organizationId, name, description, contactEmail);
        req.flash('success', 'Organization updated successfully.');
        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        console.error('Error updating organization:', error);
        res.status(500).send('Server Error');
    }
};

export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm
};