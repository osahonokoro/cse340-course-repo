import { validationResult } from 'express-validator';
import { getAllProjects, getProjectById, getUpcomingProjects, updateProject, getProjectDetails, createProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { addVolunteer, removeVolunteer, isVolunteering } from '../models/volunteers.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

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

const showProjectDetailsPage = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);
        
        if (!project) {
            return res.status(404).send('Project not found');
        }

        let isUserVolunteering = false;
        if (req.session.user) {
            isUserVolunteering = await isVolunteering(req.session.user.user_id, projectId);
        }
        
        const title = project.title;
        res.render('project', { title, project, isUserVolunteering });
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).send('Server Error');
    }
};

const showEditProjectForm = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);
        
        if (!project) {
            return res.status(404).send('Project not found');
        }
        
        const organizations = await getAllOrganizations();
        const title = `Edit Project: ${project.title}`;
        
        res.render('edit-project', { title, project, organizations, errors: [] });
    } catch (error) {
        console.error('Error loading edit project form:', error);
        res.status(500).send('Server Error');
    }
};

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        try {
            const organizations = await getAllOrganizations();
            return res.render('edit-project', {
                title: 'Edit Project',
                errors: errors.array(),
                organizations,
                project: {
                    project_id: projectId,
                    title: req.body.title,
                    description: req.body.description,
                    date_needed: req.body.dateNeeded,
                    status: req.body.status,
                    organization_id: req.body.organizationId,
                    location: req.body.location
                }
            });
        } catch (error) {
            console.error('Error reloading edit form after validation failure:', error);
            return res.status(500).send('Server Error');
        }
    }

    try {
        const { title, description, dateNeeded, status, organizationId, location } = req.body;

        await updateProject(
            projectId,
            title,
            description,
            dateNeeded,
            status,
            organizationId,
            location
        );

        req.flash('success', 'Project updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).send('Server Error');
    }
};

const showNewProjectForm = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('new-project', {
            title: 'New Project',
            errors: [],
            organizations,
            title_field: '',
            description: '',
            dateNeeded: '',
            status: 'active',
            organizationId: '',
            location: ''
        });
    } catch (error) {
        console.error('Error loading new project form:', error);
        res.status(500).send('Server Error');
    }
};

const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        try {
            const organizations = await getAllOrganizations();
            return res.render('new-project', {
                title: 'New Project',
                errors: errors.array(),
                organizations,
                title_field: req.body.title,
                description: req.body.description,
                dateNeeded: req.body.dateNeeded,
                status: req.body.status,
                organizationId: req.body.organizationId,
                location: req.body.location
            });
        } catch (error) {
            console.error('Error reloading new project form after validation failure:', error);
            return res.status(500).send('Server Error');
        }
    }

    try {
        const { title, description, dateNeeded, status, organizationId, location } = req.body;
        const newProject = await createProject(title, description, dateNeeded, status, organizationId, location);
        req.flash('success', 'Project created successfully.');
        res.redirect(`/project/${newProject.project_id}`);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Controller to add the logged-in user as a volunteer for a project
 * POST /volunteer/:id
 */
const processAddVolunteer = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id;

        await addVolunteer(userId, projectId);

        req.flash('success', 'You are now volunteering for this project.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error adding volunteer:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Controller to remove the logged-in user as a volunteer for a project
 * POST /unvolunteer/:id
 */
const processRemoveVolunteer = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id;

        await removeVolunteer(userId, projectId);

        req.flash('success', 'You have been removed as a volunteer.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error removing volunteer:', error);
        res.status(500).send('Server Error');
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showEditProjectForm,
    processEditProjectForm,
    showNewProjectForm,
    processNewProjectForm,
    processAddVolunteer,
    processRemoveVolunteer
};