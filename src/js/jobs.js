import * as headerView from "./views/headerView";
import * as JobListView from "./views/jobListView";
import * as jobsMenuView from "./views/jobsMenuView";
import * as loader from "./views/loader";

import JobList from "./models/JobList";

import { elements } from "./views/base";
import { elementStrings } from  "./views/base";

// Assets
import "../sass/jobs.scss";

export default class JobsController {
    constructor() {
        this.JobList = new JobList();
        this.searchOptions = { 
            index: 0, 
            limit: 12, 
            jobType: '' 
        };
        
        // Used to determine if infinite scroll effect should continue by comparing to # job-card elements
        this.totalJobs = 0;

        // Max # items loaded: 3 rows of 4 (No need to vary with columns as not bandwidth heavy)
        this.limit = 12;
        this.getJobs();
        // Get unique column entries and initialise
        this.initialiseJobsMenu();

        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener("DOMContentLoaded", () =>
            headerView.renderHeader("jobs")
        );

        // #TODO: Debounce / change to GSAP
        window.addEventListener("scroll", (e) => {
            // At bottom of screen && there are more jobs to retrieve
            if (
                JobListView.isAtBottom() &&
                this.totalJobs > document.querySelectorAll(".job-card").length
            ) {
                this.getJobs();
            }
        });

        // Menu Accordion
        elements.jobsMenu.addEventListener('click', (e) => {
            jobsMenuView.toggleMenu(e);
        });

        // Menu item listeners added once menu initialised
    }

    getJobs() {
        this.JobList.getJobs(this.searchOptions)
            .then(({ data: { jobs, totalJobs, message } } = {}) => {
                this.totalJobs = totalJobs;
                this.searchOptions.index += this.limit;
                JobListView.renderJobs(jobs, elements.jobsDisplay);
            })
            .catch((err) => console.log(err));
    }

    clearJobs() {
        JobListView.clearJobs(elements.jobsDisplay);
    }

    initialiseJobsMenu() {
        // Insert loader while data is retrieved
        elements.jobsMenuContents.forEach((item) => {
            loader.renderLoader(item);
        });

        this.JobList.getMenuData()
            .then(({ data: { response: items } = {} } = {}) => {
                // Remove loaders
                elements.jobsMenuContents.forEach((item) => {
                    loader.clearLoader(item);
                });

                // Render content
                jobsMenuView.initialise(items);

                // Add listeners to the JobsMenu
                this.addMenuListeners();
                
            })
            .catch((err) => console.log(err));
    }

    addMenuListeners() {
        // Add listener to the radio buttons in the jobs menu
        document.querySelectorAll(elementStrings.jobsMenuRadioButtons).forEach((input) => {
            input.addEventListener("change", (e) => this.changeSearchOptions(e));
        });
    }

    changeSearchOptions(e) {
        // Discover which submenu the selection was made from
        const titlesMenu = e.target.closest(elementStrings.titlesMenu);
        const salariesMenu = e.target.closest(elementStrings.salariesMenu);
        const locationsMenu = e.target.closest(elementStrings.locationsMenu);
        const vacanciesMenu = e.target.closest(elementStrings.vacanciesMenu);
        

        // Update the job type
        this.searchOptions.jobType = e.target.value;
        // Remove current Jobs
        JobListView.clearJobs(elements.jobsDisplay);
        // Every time a filter is added restart the index
        this.searchOptions.index = 0;
        // Query the database with the search term
        this.getJobs();
        
    }
}

new JobsController();
