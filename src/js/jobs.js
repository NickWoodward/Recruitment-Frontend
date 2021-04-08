import * as headerView from "./views/headerView";
import * as jobView from "./views/jobView";
import * as JobListView from "./views/jobListView";
import * as jobsMenuView from "./views/jobsMenuView";
import * as loader from "./views/loader";
import * as utils from "./utils/utils";

import JobList from "./models/JobList";

import { elements } from "./views/base";
import { elementStrings } from "./views/base";

// Assets
import "../sass/jobs.scss";
import '../assets/icons/list-icon-test.svg';
import '../assets/icons/grid-icon-test.svg';
import '../assets/icons/arrow-right.svg';

// import "../assets/search-jobs.png";

export default class JobsController {
    constructor() {
        this.JobList = new JobList();
        this.menuItems = {
            titles: []
        }
        this.searchOptions = {
            index: 0,
            limit: 12,
            titles: [],
            locations: [],
            orderField: "title",
            orderDirection: "ASC"
        };

        this.searchSuggestions = {
            titles: [],
            locations: []
        }

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
        window.addEventListener("DOMContentLoaded", () => {
            utils.pageFadeIn();
            headerView.renderHeader("jobs");
        });

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
            // jobsMenuView.toggleMenu(e);
            jobsMenuView.toggleMenuAnimated(e);
        });

        // Job Controls
        elements.jobsTitleSearch.addEventListener("input", (e) => {

            const suggestions = this.getSuggestions(e.target.value);

            // #TODO: DEBOUNCE THIS
            if(suggestions.length > 0) {
                if(this.searchOptions.titles.length !== [...new Set(suggestions)].length) {
                    this.searchOptions.titles = [...new Set(suggestions)];
                    // Remove current Jobs
                    JobListView.clearJobs(elements.jobsGrid);

                    // Every time a filter is added restart the index
                    this.searchOptions.index = 0;
                    console.log(this.searchOptions.titles);
                    this.getJobs();
                }
            }
            
            // Return the suggestions to unfiltered menu items
            this.searchSuggestions.titles = this.menuItems.titles;
        });

        // Job Details Modal 
        document.body.addEventListener('click', (e) => {
            const viewJobBtn = e.target.closest(elementStrings.viewJobBtn);
            if(viewJobBtn) {
                const jobCard = viewJobBtn.closest(elementStrings.jobCard);
                this.JobList.getJob(jobCard.dataset.id)
                .then(job => {
                    jobView.renderJobDetails(job, elements.jobsContent);
                })
                .catch(err => console.log(err));
            }
        });

//         elements.jobsSort.addEventListener('change', e => {

// ******START HERE

//             if(e.target.value === 'A-Z &#8595') {
//                 this.searchOptions.orderField = 'title';
//                 this.searchOptions.orderDirection = 'ASC';
//             } else if (e.target.value === 'A-Z &#8593') {
//                 this.searchOptions.orderField = 'title';
//                 this.searchOptions.orderDirection = 'DESC';
//             }
//             this.getJobs();
//             console.log(this.searchOptions);
//         });

        // NB: Menu item listeners added once menu initialised (this.initialiseJobsMenu)
    }
    getSuggestions(input) {
        this.searchSuggestions.titles = this.searchSuggestions.titles.filter(suggestion => {
            const words = suggestion.split(" ");
            const temp = words.filter(word => this.compareTwoStrings(word, input));
            return temp.length > 0;
        });
        return this.searchSuggestions.titles;

    }

    compareTwoStrings(string, subString) {
        const temp = string.split("", subString.length).join("");
        if (subString.toLowerCase() == temp.toLowerCase()) return subString;
    }

    getJobs() {
        this.JobList.getJobs(this.searchOptions)
            .then(({ data, data: { jobs, totalJobs, message } } = {}) => {
                this.totalJobs = totalJobs;
                this.searchOptions.index += this.limit;
                // Passing the index to the render and animate functions allow gsap to animate only the most recent elements added to the page
                JobListView.renderJobs(jobs, elements.jobsGrid, this.searchOptions.index);
                JobListView.animateJobs(this.searchOptions.index);
            })
            .catch((err) => console.log(err));
    }

    clearJobs() {
        JobListView.clearJobs(elements.jobsGrid);
    }

    initialiseJobsMenu() {
        // Insert loader while data is retrieved
        elements.jobsMenuContents.forEach((item) => {
            loader.renderLoader(item, 'jobs-menu');
        });

        this.JobList.getMenuData()
            .then(({ data: { response: items } = {} } = {}) => {
                // Remove loaders
                elements.jobsMenuContents.forEach((item) => {
                    loader.clearLoader(item);
                });

                // Render content
                jobsMenuView.populateMenu(items);
                jobsMenuView.animateMenu();

                // Store menu items in the controller & add to the suggested search arrays
                this.menuItems.titles = items.uniqueTitles;
                // this.menuItems.titles = items.uniqueLocations;
                this.searchSuggestions.titles = items.uniqueTitles;
                this.searchSuggestions.locations = items.uniqueLocations;

                // Add listeners to the JobsMenu
                this.addMenuListeners();
            })
            .catch((err) => console.log(err));
    }

    addMenuListeners() {
        const checkboxes = document.querySelectorAll(
            elementStrings.jobsMenuCheckbox
        );
        // Add listeners to the checkboxes in the jobs menu
        checkboxes.forEach((input) => {
            input.addEventListener("change", (e) => {
                // Find out which submenu has been selected
                const submenu = jobsMenuView.findSelectedSubmenu(e);
                const checkboxTitle = e.target.value;

                // Update checkboxes based on selection
                jobsMenuView.updateCheckboxes(submenu, checkboxTitle);

                // Change the search object's options
                this.changeSearchOptions(submenu, checkboxTitle);
                
                // Remove current Jobs
                JobListView.clearJobs(elements.jobsGrid);

                // Every time a filter is added restart the index
                this.searchOptions.index = 0;

                // Query the database using the new search object
                this.getJobs();
            });
        });
    }

    changeSearchOptions(submenu, checkboxTitle) {
        // Reset the submenu search options if 'all' is selected
        if(checkboxTitle === 'all') {
            this.searchOptions[submenu] = [];
        // Else if the option doesn't exist, add it
        } else if(!this.searchOptions[submenu].includes(checkboxTitle)) {
            this.searchOptions[submenu].push(checkboxTitle);
        // Else remove it
        } else {
            const index = this.searchOptions[submenu].indexOf(checkboxTitle);
            this.searchOptions[submenu].splice(index, 1);
        }
    }
}

new JobsController();
