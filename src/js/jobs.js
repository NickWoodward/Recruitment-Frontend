import * as headerView from "./views/headerView";
import * as jobView from "./views/jobView";
import * as loginView from "./views/loginView";
import * as applyView from "./views/applyView";
import * as registerView from "./views/registerView";
import * as forgotPassView from "./views/forgotPassView";
import * as JobListView from "./views/jobListView";
import * as jobsMenuView from "./views/jobsMenuView";
import * as loader from "./views/loader";
import * as utils from "./utils/utils";

import JobList from "./models/JobList";
import User from './models/User';

import { elements } from "./views/base";
import { elementStrings } from "./views/base";

// Assets
import "../sass/jobs.scss";
import '../assets/icons/list-icon-test.svg';
import '../assets/icons/grid-icon-test.svg';
import '../assets/icons/arrow-right.svg';
import '../assets/icons/arrow-left.svg';

// import "../assets/search-jobs.png";

export default class JobsController {
    constructor() {
        // TEST: LOG OUT USER
        new User().logout();
        this.searchParams = new URLSearchParams(window.location.search);
        this.titleParam = this.searchParams.get('title');
        this.locationParam = this.searchParams.get('location');

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
        // If the page has search params from the search form on index.html add them to the seachParams (update menus once populated)
        if(this.titleParam) this.searchOptions.titles.push(this.titleParam);
        if(this.locationParam) this.searchOptions.locations.push(this.locationParam);

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

        // Job Card btns
        document.body.addEventListener('click', (e) => {
            const viewJobBtn = e.target.closest(elementStrings.viewJobBtn);
            const applyBtn = e.target.closest(elementStrings.applyBtn);
            if(viewJobBtn) {
                const jobCard = viewJobBtn.closest(elementStrings.jobCard);
                this.JobList.getJob(jobCard.dataset.id)
                .then(job => {
                    if(job) {
                        jobView.renderJobDetails(job.data.job, elements.jobsMain);
                    }
                })
                .catch(err => console.log(err));
            } else if(applyBtn) {
                const jobCard = applyBtn.closest(elementStrings.jobCard);
                applyView.renderApplyForm(jobCard.dataset.id);
            }
        });

        // Handle Modal Events
        document.body.addEventListener('click', async (e) => {
            const modal = e.target.closest('.modal');
            const header = e.target.closest('.header');
            const menu = e.target.closest('.jobs__menu-wrapper');
            // If there's a modal, but the user has clicked on the menu or header, close it
            if((header || menu) && document.querySelector('.modal')) {
                document.querySelector('.modal').parentElement.removeChild(document.querySelector('.modal'));
            }
           
            // Handle events generated inside the modals
            if(modal) {
                if(e.target.closest('.login')) {
                    switch(loginView.getAction(e)) {
                        case 'submit':      try {
                                                // @TODO: REFRESH TOKENS
                                                const res = await this.User.login(loginView.getLoginDetails());
                                                // window.location.replace('http://localhost:8082');
                                                console.log(res.data.token);
                                            } catch(error) { 
                                                if (error.response) {
                                                    // Server responded with a status code that falls out of the range of 2xx
                                                    if(!error.response.data.success) 
                                                        console.log(error.response.data.message);

                                                        // @TODO: REFRESH TOKENS
                                                        // If the token is invalid send the refresh token
                                                    
                                                } else if (error.request) {
                                                    // The request was made but no response was received
                                                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                                                    // http.ClientRequest in node.js
                                                    console.log(error.request);
                                                } else {
                                                    // Something happened in setting up the request that triggered an Error
                                                    console.log('Error', error.message);
                                                }
                                            }
                                            break;
                        case 'register':    modal.parentElement.removeChild(modal); 
                                            registerView.renderRegisterModal();
                                            break;
                        case 'cancel':      modal.parentElement.removeChild(modal); break;
                        case 'forgot':      modal.parentElement.removeChild(modal); 
                                            forgotPassView.renderForgotModal(); break;
                    }
                } else if(e.target.closest('.job-details')) {
                    switch(jobView.getAction(e)) {
                        case 'apply'    : applyView.renderApplyForm(); break;
                        case 'cancel'   : modal.parentElement.removeChild(modal); break;
                        case 'sign-in'  : modal.parentElement.removeChild(modal); loginView.renderLogin(); break;  
                    }
                } else if(e.target.closest('.apply')) {
                    switch(applyView.getAction(e)) {
                        case 'request':     console.log('request'); break;
                        case 'login':       console.log('login'); break;
                        case 'forgot':      modal.parentElement.removeChild(modal);
                                            forgotPassView.renderForgotModal(); break;
                        case 'register':    modal.parentElement.removeChild(modal);
                                            registerView.renderRegisterModal(); break;
                        case 'cancel':      modal.parentElement.removeChild(modal);
                    }
                } else if(e.target.closest('.register')) {
                    switch(registerView.getAction(e)) {
                        case 'register':    console.log('register'); break; 
                        case 'cancel':      modal.parentElement.removeChild(modal); break;
                        case 'sign-in':       modal.parentElement.removeChild(modal); loginView.renderLogin(); break;
                    }
                } else if(e.target.closest('.forgot-password')) {
                    switch(forgotPassView.getAction(e)) {
                        case 'submit': console.log('submit'); break;
                        case 'cancel': modal.parentElement.removeChild(modal); break;
                    }
                }
            }
            // Re-enable scrolling
            document.body.style.overflow = "auto";
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
                JobListView.renderJobs(jobs, elements.jobsGrid, false, this.searchOptions.index);
                // JobListView.animateJobs(this.searchOptions.index);
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
                jobsMenuView.populateMenu(items, { titleParam: this.titleParam, locationParam: this.locationParam });
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
