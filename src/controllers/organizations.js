import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

/**
 * Controller for the organizations list page
 * GET /organizations
 */
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

/**
 * Controller for the organization details page
 * GET /organization/:id
 */
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

export { showOrganizationsPage, showOrganizationDetailsPage };
