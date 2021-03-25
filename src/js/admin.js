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
import * as createJobView from './views/createJobForm';
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
            limit: 4,
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
            
        });
        elements.adminMenuUsersItem.addEventListener('click', (e) => {
            adminView.changeActiveMenuItem(e);
            this.renderUsersTable();
            // Add table listeners
            adminView.addUserTableListeners(e);
        });

        // Buttons
        document.querySelector('.create-user-btn').addEventListener('click', (e) => {
            userForm.renderUserForm(e, 'create')
        })
    }

    checkModals(e) {
        const modal = e.target.closest('.modal');
        if(modal) {
            // Create User Modal Clicked
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
            } else if(e.target.closest('.create-job')) {
                switch(createJobView.getAction(e)) {
                    case 'cancel': modal.parentElement.removeChild(modal); break;
                    case 'submit': console.log('submit');
                }
            } else if(e.target.closest('.modal--warn')) {
                switch(adminView.getAction(e)) {
                    case 'cancel':  modal.parentElement.removeChild(modal); break;
                                    // The element Id is passed from the row to the modal button when rendered
                    case 'delete':  this.deleteUserAndUpdate(e.target.dataset.id); 
                                    modal.parentElement.removeChild(modal);
                                    break;
                }
            }
        }
    }

    // @TODO: change from calling the DB to just removing the user from the array
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
                    adminView.addUserTableListeners();
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
                    adminView.addUserTableListeners();

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
                    adminView.addUserTableListeners();
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

        // If the table doesn't exist
        if(!document.querySelector(elementStrings.adminJobsTable)) {
            // Clear the table wrapper
            utils.clearElement(elements.adminTableWrapper);
            // Render the table
            adminView.renderContent(
                tableView.createTable(
                    'jobs',
                    Object.keys(this.jobs[0]),  
                    this.jobs,
                    false,
                    [editBtn, deleteBtn]
                ),
                elements.adminTableWrapper
            );
        }
    }

    renderUsersTable() {
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
                tableView.createTable(
                    'users',
                    Object.keys(this.users[0]),  
                    this.users,
                    false,
                    [editBtn, deleteBtn, hubspotBtn]
                ),
                elements.adminTableWrapper
            );
        }
    }
}

new AdminController();