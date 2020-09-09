import * as headerView from "./views/headerView";
import * as JobListView from "./views/jobListView";

import JobList from "./models/JobList";

import { elements } from './views/base';

// Assets
import "../sass/jobs.scss";

class JobsController {
    constructor() {
        this.addEventListeners();

        // Render Available Jobs
        new JobList().getJobs().then((jobs) => {
            JobListView.renderJobs(jobs, elements.jobList);
        })
        .catch(err => console.log(err));
    }

    addEventListeners() {
        window.addEventListener("DOMContentLoaded", () =>
            headerView.renderHeader("jobs")
        );
    }
}

new JobsController();
