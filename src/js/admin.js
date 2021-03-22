/* ASSETS */
import '../sass/common.scss';
import '../sass/admin.scss';
import '../assets/icons/edit-solid.svg';
import '../assets/icons/delete-solid.svg';

import * as headerView from './views/headerView';
import * as adminView from './views/adminView';
import * as tableView from './views/tableView';
import * as createUserView from './views/createUserForm';
import * as createJobView from './views/createJobForm';
import * as utils from './utils/utils';

import JobList from './models/JobList';
import UserList from './models/User';

import { elements, elementStrings } from './views/base';

class AdminController {
    constructor() {
        this.content = 'jobs';

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
            headerView.renderHeader("admin")
        
            // @TODO: move to admin view

            try {
                const { data: { jobs } } = await this.getJobs() || [];
                // @TODO: reduce info returned by the db query rather than mapping it here
                this.jobs = jobs.map(({id, title, wage, location, description, createdAt}) => ({id, title, wage, location, description, createdAt}));
            
                const { data: { users } } = await this.getUsers() || [];
                this.users = users;

            } catch (e) {
                console.log(e);
            }

            this.renderJobsTable();   
        });

        // MODALS
        document.body.addEventListener('click', this.checkModals);

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
            adminView.addTableListeners(e, ()=>console.log('delete'), ()=>console.log('edit'));
        });



        // BUTTON LISTENERS
        elements.createUser.addEventListener('click', (e) => {
            createUserView.renderCreateUser();
        });
        elements.createJob.addEventListener('click', (e) => {
            createJobView.renderCreateJob();
        });

    }

    checkModals(e) {
        const modal = e.target.closest('.modal');
        if(modal) {

            // Create User Modal Clicked
            if(e.target.closest('.create-user')) {
                switch(createUserView.getAction(e)) {
                    case 'cancel': modal.parentElement.removeChild(modal); break;
                    case 'submit': console.log('submit');
                }
            } else if(e.target.closest('.create-job')) {
                switch(createJobView.getAction(e)) {
                    case 'cancel': modal.parentElement.removeChild(modal); break;
                    case 'submit': console.log('submit');
                }
            }
        }
    }

    getJobs() {
        return new JobList().getJobs(this.searchOptions);
    }

    getUsers() {
        return new UserList().getUsers();
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
                    [editBtn, deleteBtn]
                ),
                elements.adminTableWrapper
            );
        }
    }
}

new AdminController();