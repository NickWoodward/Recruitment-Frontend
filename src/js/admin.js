/* ASSETS */
import '../sass/common.scss';
import '../sass/admin.scss';

import * as headerView from './views/headerView';
import * as tableView from './views/tableView';
import * as createUserView from './views/createUserForm';
import * as createJobView from './views/createJobForm';

import JobList from './models/JobList';
import UserList from './models/User';
import { elements } from './views/base';

class AdminController {
    constructor() {
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

            // tableView.renderTable(
            //     'jobs',
            //     Object.keys(this.jobs[0]),  // An array of job attributes
            //     this.jobs,
            //     elements.adminTableWrapper
            // );
            // tableView.renderTable(
            //     'users',
            //     Object.keys(this.users[0]),  // An array of job attributes
            //     this.users,
            //     elements.adminContent
            // );
        });

        // MODALS
        document.body.addEventListener('click', this.checkModals);

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
}

new AdminController();