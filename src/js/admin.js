/* ASSETS */
import '../sass/common.scss';
import '../sass/admin.scss';

import * as headerView from './views/headerView';
import * as tableView from './views/tableView';

import JobList from './models/JobList';

class AdminController {
    constructor() {
        this.addEventListeners();

        // @TODO: Add defaults on the back end?
        // Search options for jobs query
        this.searchOptions = {
            index: 0,
            limit: 5,
            titles: [],
            locations: [],
            orderField: "title",
            orderDirection: "ASC"
        };

    }

    addEventListeners() {
        window.addEventListener('DOMContentLoaded', async e => {
            headerView.renderHeader('admin');
            // @TODO: move to admin view

            try {
                const { data: { jobs } } = await this.getJobs();
                // @TODO: reduce info returned by the db query rather than mapping it here
                this.jobs = jobs.map(({id, title, wage, location, description, createdAt}) => ({id, title, wage, location, description, createdAt}));
            } catch (e) {
                console.log(e);
            }

            tableView.renderTable(
                'jobs',
                Object.keys(this.jobs[0]),  // An array of job attributes
                this.jobs,
                document.querySelector('.admin-wrapper')
            );
        })
    }

    getJobs() {
        return new JobList().getJobs(this.searchOptions);
    }
}

new AdminController();