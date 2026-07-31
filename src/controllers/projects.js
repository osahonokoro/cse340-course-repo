import { getAllProjects, getProjectById, getUpcomingProjects, updateProject, getProjectDetails } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js'; // Add this import

const NUMBER_OF_UPCOMING_PROJECTS = 5;

/**
 * Controller for the projects list page
 * GET /projects
 */
const showProjectsPage = async (req, res) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';
        res.render('projects', { title, projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Controller for the project details page
 * GET /project/:id
 */
const showProjectDetailsPage = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);
        
        if (!project) {
            return res.status(404).send('Project not found');
        }
        
        const title = project.title;
        res.render('project', { title, project });
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Controller for the edit project form
 * GET /edit-project/:id
 */
const showEditProjectForm = async (req, res) => {
    try {
        const projectId = req.params.id;
        
        // Get the project data
        const project = await getProjectDetails(projectId);
        
        if (!project) {
            return res.status(404).send('Project not found');
        }
        
        // Get all organizations for the dropdown
        const organizations = await getAllOrganizations();
        
        const title = `Edit Project: ${project.title}`;
        
        res.render('edit-project', { 
            title, 
            project, 
            organizations 
        });
    } catch (error) {
        console.error('Error loading edit project form:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Controller for processing the edit project form
 * POST /edit-project/:id
 */
const processEditProjectForm = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { title, description, dateNeeded, status, organizationId, location } = req.body;

        const updatedProject = await updateProject(
            projectId,
            title,
            description,
            dateNeeded,
            status,
            organizationId,
            location
        );

        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).send('Server Error');
    }
};

// EXPORT - Only ONE export statement!
export { showProjectsPage, showProjectDetailsPage, showEditProjectForm, processEditProjectForm };