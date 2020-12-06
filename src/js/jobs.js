import * as headerView from "./views/headerView";
import * as JobListView from "./views/jobListView";
import * as jobsMenuView from "./views/jobsMenuView";
import * as loader from "./views/loader";

import JobList from "./models/JobList";

import { elements } from "./views/base";
import { elementStrings } from "./views/base";

// Assets
import "../sass/jobs.scss";

export default class JobsController {
    constructor() {
        this.JobList = new JobList();
        this.searchOptions = {
            index: 0,
            limit: 12,
            jobTypes: [],
            locations: [],
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
        elements.jobsMenu.addEventListener("click", (e) => {
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
        const titleCheckboxes = document.querySelectorAll(
            // elementStrings.titleCheckbox
            elementStrings.jobsMenuCheckbox
        );
        // Add listeners to the checkboxes in the jobs menu
        titleCheckboxes.forEach((input) => {
            input.addEventListener("change", (e) => {
                this.changeSearchOptions(e)
                // Remove current Jobs
                JobListView.clearJobs(elements.jobsDisplay);
                // Every time a filter is added restart the index
                this.searchOptions.index = 0;
                // Query the database with the search term
                this.getJobs();
            });
        });
    }

    // #TODO: move to jobsMenuView
    changeSearchOptions(e) {
        const value = e.target.value;
        // Discover which submenu the selection was made from
        const titlesSubmenu = e.target.closest(elementStrings.titlesContent);
        const salariesSubmenu = e.target.closest(elementStrings.salariesContent);
        const locationsSubmenu = e.target.closest(elementStrings.locationsContent);
        const vacanciesSubmenu = e.target.closest(elementStrings.vacanciesContent);

            // const selectedMenu = tit
        // Job Titles Submenu
        if (titlesSubmenu) {
            // Uncheck other options
            this.uncheckOptions('titles', value);

            // Clear jobType searchOptions if no filter needed
            if(value === "all") {
                this.searchOptions.jobTypes = [];
            }
            // Else if value not present in jobTypes array, add it
            else if (!this.searchOptions.jobTypes.includes(value)) {
                this.searchOptions.jobTypes.push(value);
            // Else remove it if already present
            } else {
                const index = this.searchOptions.jobTypes.indexOf(value);
                this.searchOptions.jobTypes.splice(index, 1);
            }
        // Locations Submenu 
        } else if(locationsSubmenu) {
            // Uncheck other options
            this.uncheckOptions('locations', value);
            // Clear 'locations' parameter in searchOptions if not needed
            if(value === 'all') {
                this.searchOptions.locations = [];
            } 
            // Else if value not present in locations array, add it
            else if(!this.searchOptions.locations.includes(value)) {
                this.searchOptions.locations.push(value);
            // Else remove it if already present
            } else {
                const index = this.searchOptions.locations.indexOf(value);
                this.searchOptions.locations.splice(index, 1);
            }
        }
    }

    uncheckOptions(submenu, value) {
        // Select the submenu's checkboxes (except 'all') 
        const checkboxArray = Array.from(document.querySelectorAll(elementStrings[`${submenu}Checkbox`]))
                                    .filter((element) => !element.classList.contains(elementStrings[`${submenu}CheckboxAll`]))
        const checkboxAll = document.querySelector("."+elementStrings[`${submenu}CheckboxAll`]);
        // If 'all' is selected, uncheck the other options in the Submenu
        if (value === "all") {
            // Uncheck each element
            checkboxArray.forEach(checkbox => checkbox.checked = false);
        }  
        // If it's the last checkbox, select 'all', else just uncheck 
        else if(this.isLastCheckbox(checkboxArray)) {
            checkboxAll.checked = true;
        } else {
        // Uncheck the 'all' option if any other checkbox is selected
            checkboxAll.checked = false;
        }
    }

    isLastCheckbox(checkboxes) {
        let count = 0;
        checkboxes.forEach(checkbox => count = checkbox.checked? count+1:count);
        return count === 0;
    }
}

new JobsController();
