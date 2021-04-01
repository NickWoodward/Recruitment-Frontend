/* ASSETS */
import '../sass/common.scss';
import '../sass/admin.scss';
import '../assets/icons/edit-solid.svg';
import '../assets/icons/delete-solid.svg';
import '../assets/icons/hubspot.svg';

import * as headerView from './views/headerView';
import * as adminView from './views/adminView';
import * as tableView from './views/tableView';
import * as userForm from './views/userForm';
import * as jobForm from './views/jobForm';
import * as utils from './utils/utils';

import JobList from './models/JobList';
import UserModel from './models/User';

import { elements, elementStrings } from './views/base';
import User from './models/User';

class AdminController {
    constructor() {
        // JobList and UserModel return axios methods CRUD ops
        this.JobList = new JobList();
        this.UserModel = new UserModel();

        this.addEventListeners();

        // @TODO: Add defaults on the back end?
        // Search options for jobs query
        this.searchOptions = {
            index: 0,
            limit: 6,
            titles: [],
            locations: [],
            orderField: "title",
            orderDirection: "ASC"
        };
    }

    addEventListeners() {

        // ONLOAD
        window.addEventListener('DOMContentLoaded', async e => {
            // Render Header
            headerView.renderHeader("admin")
        
            // Get User data
            this.UserModel.getUsers()
                .then(res => this.users = res.data.users)
                .catch(err => console.log(err));

            // Get Job data and render table
            this.JobList.getJobs(this.searchOptions)
                .then(res => {
                    if(res.data.jobs) {
                        this.jobs = res.data.jobs.map(({id, title, wage, location, description, createdAt}) => ({id, title, wage, location, description, createdAt}));
                        this.renderJobsTable();   
                        adminView.addTableListeners('jobs');
                    }
                })
                .catch(err => console.log(err));
        });

        // MODALS
        document.body.addEventListener('click', this.checkModals.bind(this));

        // MENU LISTENERS
        elements.adminMenuJobsItem.addEventListener('click', (e) => {
            // Change the active menu item
            adminView.changeActiveMenuItem(e);

            // Change the content displayed
            this.renderJobsTable();
            adminView.addTableListeners('jobs');
            
        });
        elements.adminMenuUsersItem.addEventListener('click', (e) => {
            adminView.changeActiveMenuItem(e);
            this.renderUsersTable();
            // Add table listeners
            adminView.addTableListeners('users');
        });
    }

    checkModals(e) {
        const modal = e.target.closest('.modal');
        if(modal) {
            // Create User Modal Clicked
            e.preventDefault();

            if(e.target.closest('.user-form')) {
                switch(userForm.getAction(e)) {
                    case 'cancel':  modal.parentElement.removeChild(modal); break;                
                                    // The element Id is passed from the row to the modal button when rendered
                    case 'edit':    this.editUserAndUpdate(e.target.dataset.id); 
                                    // @TODO: validation might have to be done in the above method
                                    modal.parentElement.removeChild(modal);

                                    break;
                    case 'create':  this.createUserAndUpdate();
                                    modal.parentElement.removeChild(modal);
                                    break;
                }
            // Create Job Modal Clicked 
            } else if(e.target.closest('.job-form')) {
                
                switch(jobForm.getAction(e)) {
                    case 'cancel': modal.parentElement.removeChild(modal); break;
                    case 'edit':    this.editJobAndUpdate(e.target.dataset.id); 
                                    modal.parentElement.removeChild(modal);
                                    break;
                    case 'create':  this.createJobAndUpdate(); 
                                    modal.parentElement.removeChild(modal);
                                    break;
                }
            } else if(e.target.closest('.modal--warn')) {
                switch(adminView.getAction(e)) {
                    case 'cancel':      modal.parentElement.removeChild(modal); break;
                                        // The element Id is passed from the row to the modal button when rendered
                    case 'deleteUser':  this.deleteUserAndUpdate(e.target.dataset.id); 
                                        modal.parentElement.removeChild(modal);
                                        break;
                    case 'deleteJob':   this.deleteJobAndUpdate(e.target.dataset.id);
                                        modal.parentElement.removeChild(modal);
                                        break;
                }
            }
        }
    }

    createJobAndUpdate() {
        const job = jobForm.getFormData();
        this.JobList
            .createJob(job)
            .then(res => {
                console.log(res.data.job);
                if(res.status === 201) {
                    // Update job list
                    this.jobs.unshift(res.data.job);
                    // Clear the table
                    utils.clearElement(elements.adminTableWrapper);
                    // Re-render the table
                    this.renderJobsTable();
                    // Re-add listeners
                    adminView.addTableListeners('jobs');
                }
                // @TODO: display the validation response
            }).catch(err => {
                console.log(err)
            });
    }

    deleteJobAndUpdate(id) {
        this.JobList
            .deleteJob(id)
            .then(res => {
                if(res.status === 200) {
                    return this.JobList.getJobs(this.searchOptions)
                }
            })
            .then(res => {
                if(res) {
                    this.jobs = res.data.jobs;
                    // Clear table
                    utils.clearElement(elements.adminTableWrapper);
                    // Render table
                    this.renderJobsTable();
                    // Re-add table listeners
                    adminView.addTableListeners('jobs'); 
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    editJobAndUpdate(id) {
        const job = jobForm.getFormData();
        this.JobList
            .editJob(id, job)
            .then(res => {
                if(res.status === 200) {
                    // Update the job record
                    this.jobs.forEach(job => {
                        if(job.id === parseInt(res.data.job.id)) {
                            job.title = res.data.job.title;
                            job.wage = res.data.job.wage;
                            job.location = res.data.job.location;
                            job.description = res.data.job.description;
                        }
                    });
                    // Clear the job table
                    utils.clearElement(elements.adminTableWrapper);
                    // Render job table
                    this.renderJobsTable();
                    // Re-add table listeners 
                    adminView.addTableListeners('jobs');
                }
                // @TODO: add validation response
            })
            .catch(err => {
                console.log(err);
            });
    }

    deleteUserAndUpdate(id) {
        this.UserModel
            .deleteUser(id)
            .then(res => {
                // Clear the table wrapper
                utils.clearElement(elements.adminTableWrapper);
                return this.UserModel.getUsers();
            })
            .then(res => {
                if(res.data.users) {
                    // Update the users array
                    this.users = res.data.users;
                    // Rerender the table
                    this.renderUsersTable();
                    // Re-add table listeners
                    adminView.addTableListeners('users');
                }   // @TODO: add a placeholder image for no users
            })
            .catch(err => console.log(err));
    }

    editUserAndUpdate(id) {
        // Get data from modal
        const { fname, lname, email, phone } = userForm.getFormData('edit');
        this.UserModel
            .editUser(id, fname, lname, email, phone)
            .then(res => {
                if(res.status === 200) {
                    // Update the user in the user array
                    this.users.forEach(user => {
                        if(user.id == parseInt(id)) {
                            user.firstName = fname;
                            user.lastName = lname;
                            user.email = email;
                            user.phone = phone;
                        }
                    });
                    // Clear the table wrapper
                    utils.clearElement(elements.adminTableWrapper);
                    // Rerender the table
                    this.renderUsersTable();
                    // Re-add listeners
                    adminView.addTableListeners('users');

                }
                // @TODO validation
            })
            .catch(err => {
                console.log(err);
            });
    }

    createUserAndUpdate() {
        const { fname, lname, email, phone, password, confirm } = userForm.getFormData('create');
        this.UserModel
            .createUser( fname, lname, email, phone, password, confirm )
            .then(res => {
                if(res.status === 201) {
                    const user = res.data.user;
                    // Add the new user 
                    this.users.push(user);
                    // Clear the table
                    utils.clearElement(elements.adminTableWrapper);
                    // Rerender table
                    this.renderUsersTable();
                    // Re-add listeners
                    adminView.addTableListeners('users');
                }
            })
            .catch(err => console.log(err));
    }

    getJobs() {
        return this.JobList.getJobs(this.searchOptions);
    }

    getUsers() {
        return this.UserModel.getUsers()
            .then(res => {
                return res;
            })
            .catch(err => console.log(err));
    }

    renderJobsTable() {
        // Table controls
        const tableControls = `
            <div class="btn-wrapper btn-wrapper--admin">
                <button class="create-job-btn btn">Create Job</button>
            </div>`;
        // Row buttons
        const editBtn = [
            'edit', 
            `<div class="edit-btn edit-btn--table">
                <svg class="edit-icon">
                    <use xlink:href="svg/spritesheet.svg#edit-solid">
                </svg>
            </div>`
        ];
        const deleteBtn = [
            'delete', 
            `<div class="delete-btn delete-btn--table">
                <svg class="delete-icon">
                    <use xlink:href="svg/spritesheet.svg#delete-solid">
                </svg>
            </div>`
        ];

        // If the table doesn't exist
        if(!document.querySelector(elementStrings.adminJobsTable)) {
            // Clear the table wrapper
            utils.clearElement(elements.adminTableWrapper);
            // Render the table
            adminView.renderContent(
                [
                    tableView.createTable(
                        'jobs',
                        Object.keys(this.jobs[0]),  
                        this.jobs,
                        false,
                        [editBtn, deleteBtn]
                    ),
                    tableControls
                ],
                elements.adminTableWrapper
            );
        }
    }

    renderUsersTable() {
        // Table controls
        const tableControls = `
            <div class="btn-wrapper btn-wrapper--admin">
                <button class="create-user-btn btn">Create User</button>
            </div>`;
        // Row buttons
        const editBtn = [
            'edit', 
            `<div class="edit-btn edit-btn--table">
                <svg class="edit-icon">
                    <use xlink:href="svg/spritesheet.svg#edit-solid">
                </svg>
            </div>`
        ]
        const deleteBtn = [
            'delete', 
            `<div class="delete-btn delete-btn--table">
                <svg class="delete-icon">
                    <use xlink:href="svg/spritesheet.svg#delete-solid">
                </svg>
            </div>`
        ]
        const hubspotBtn = [
            'upload',
            `<div class="delete-btn delete-btn--table">
                <svg class="delete-icon">
                    <use xlink:href="svg/spritesheet.svg#hubspot">
                </svg>
            </div>`
        ]

        if(!document.querySelector(elementStrings.adminUsersTable)) {
             // Clear the table wrapper
             utils.clearElement(elements.adminTableWrapper);
            // Render the table
            adminView.renderContent(
                [
                    tableView.createTable(
                        'users',
                        Object.keys(this.users[0]),  
                        this.users,
                        false,
                        [editBtn, deleteBtn, hubspotBtn]
                    ),
                    tableControls
                ],
                elements.adminTableWrapper
            );
        }
    }
}

new AdminController();