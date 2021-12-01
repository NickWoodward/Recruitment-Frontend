import * as headerView from "./views/headerView";
import * as jobView from "./views/jobView";
import * as loginView from "./views/loginView";
import * as applyView from "./views/applyView";
import * as registerView from "./views/registerView";
import * as forgotPassView from "./views/forgotPassView";
import * as jobListView from "./views/jobListView";
import * as jobsMenuView from "./views/jobsMenuView";
import * as loader from "./views/loader";
import * as utils from "./utils/utils";
import * as inputUtils from "./utils/inputUtils";

import JobList from "./models/JobList";

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
        this.searchParams = new URLSearchParams(window.location.search);
        this.titleParam = this.searchParams.get('title');
        this.locationParam = this.searchParams.get('location');

        this.JobList = new JobList();
        this.activeNavItem;
        this.navItems;
        this.searchInputs = Array.from(document.querySelectorAll('.search-input'));
        this.activeSearchInput;
        this.menuItems = {
            titles: [],
            locations: [],
            salaries: [],
            types: [ "Interim", "Permanent" ]
        }
        this.searchOptions = {
            index: 0,
            limit: 12,
            titles: [],
            locations: [],
            salaries: [],
            orderField: "title",
            orderDirection: "ASC"
        };
        this.tags = {
            titles: [],
            salaries:[],
            locations:[],
            types:[]
        };

        // If the page has search params from the search form on index.html add them to the seachParams (update menus once populated)
        if(this.titleParam) this.searchOptions.titles.push(this.titleParam);
        if(this.locationParam) this.searchOptions.locations.push(this.locationParam);


        this.searchSuggestions = {
            titles: [],
            locations: []
        }

        this.searchInputValues = {
            title: "",
            location: ""
        }
        // this.tagsListAnimation = jobsMenuView.getTagsListAnimation();

        // Used to determine if infinite scroll effect should continue by comparing to # job-card elements
        this.totalJobs = 0;

        // Max # items loaded: 3 rows of 4 (No need to vary with columns as not bandwidth heavy)
        this.limit = 12;
        this.getJobs();
        this.currentJob;
        this.featuredJobs;
        this.featuredJobsAside;
        // Get unique column entries and initialise
        this.initialiseJobsMenu();
        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener("DOMContentLoaded", () => {
            utils.pageFadeIn();
            headerView.renderHeader("jobs");
            jobListView.initialiseScrollAnimation();
            jobsMenuView.initialiseTagsListAnimation();
            this.getFeaturedJobs();
        });

        // #TODO: Debounce / change to GSAP
        window.addEventListener("scroll", (e) => {
            // At bottom of screen && there are more jobs to retrieve
            if (
                jobListView.isAtBottom() 
            ) {
                this.getJobs();
            }
        });

        window.addEventListener('click', (e) => {
            // Handle closing menu items
            if(!e.target.closest('.jobs-menu__item') && this.activeNavItem && !e.target.closest('.jobs-menu__content')) {
                this.activeNavItem.animation.reverse();
                this.activeNavArrow.animation.reverse();
                jobsMenuView.setMenuActive(this.activeNavItem, false);
                this.activeNavItem = null;
                this.activeNavArrow = null;
            }

            // Handle search inputs if clicked
            const input = e.target.closest('.search-input');
            let value;

            // Reset the input default value if focus is lost, but not if it's the autocomplete list

            if(this.activeSearchInput  && !e.target.closest('.autocomplete-items')) {
                switch(this.activeSearchInput.classList[0]) {
                    case "search-input--title":     value = this.searchInputValues.title? this.searchInputValues.title : "Job Title"; break;
                    case "search-input--location":  value = this.searchInputValues.location? this.searchInputValues.location : "Location"; break;
                }
                // console.log(e.target.closest('.search-input'), this.activeSearchInput);
                inputUtils.setInput(this.activeSearchInput, value);
            }
            // Set the active input if clicked and clear the value
            if(input) {
                this.activeSearchInput = input;
                inputUtils.clearInput(this.activeSearchInput);
            }            
        });

        // Sort Input
        document.querySelector('.sort').addEventListener('change', (e) => {
            switch(e.target.value) {
                case 'Newest':
                    this.searchOptions.orderField = 'createdAt';
                    this.searchOptions.orderDirection = 'DESC'; 
                    break;
                case 'Oldest':
                    this.searchOptions.orderField = 'createdAt'; 
                    this.searchOptions.orderDirection = 'ASC'; 
                    break;
                case 'A-Z Desc':
                    this.searchOptions.orderField = 'title';
                    this.searchOptions.orderDirection = "DESC"; 
                    break;
                case 'A-Z Asc': 
                    this.searchOptions.orderField = 'title';
                    this.searchOptions.orderDirection = "ASC"; 
                    break;
            }
            this.clearJobs();
            this.searchOptions.index = 0;
            this.getJobs();
        });

        // Job Controls
        // elements.jobsTitleSearch.addEventListener("input", (e) => {

        //     const suggestions = this.getSuggestions(e.target.value);

        //     // #TODO: DEBOUNCE THIS
        //     if(suggestions.length > 0) {
        //         if(this.searchOptions.titles.length !== [...new Set(suggestions)].length) {
        //             this.searchOptions.titles = [...new Set(suggestions)];
        //             // Remove current Jobs
        //             jobListView.clearJobs(elements.jobsGrid);

        //             // Every time a filter is added restart the index
        //             this.searchOptions.index = 0;
        //             console.log(this.searchOptions.titles);
        //             this.getJobs();
        //         }
        //     }
            
        //     // Return the suggestions to unfiltered menu items
        //     this.searchSuggestions.titles = this.menuItems.titles;
        // });

        // Job Card btns
        // document.body.addEventListener('click', async (e) => {
        //     const viewJobBtn = e.target.closest(elementStrings.viewJobBtn);
        //     const applyBtn = e.target.closest(elementStrings.applyBtn);
        //     if(viewJobBtn) {
        //         const jobCard = viewJobBtn.closest(elementStrings.jobCard);
        //         console.log('yes');
        //         try {
        //             // Get the selected job
        //             const { data: { job } } = await this.JobList.getJob(jobCard.dataset.id);
        //             this.currentJob = job;

        //             // Filter out this job from the Featured Array, and shorten it to the number of featured jobs to display
        //             this.featuredJobsAside = this.featuredJobs.filter(job => job.id !== this.currentJob.id);
                    
        //             // Render the Current Job and the aside
        //             jobView.renderJobDetails(this.currentJob, document.body, this.featuredJobsAside, e);
        //         } catch(e) {
        //             console.log(e);
        //         }


        //         // this.JobList.getJob(jobCard.dataset.id)
        //         // .then(response => {
        //         //     console.log(response);
        //         //     // if(response.data.job) {
        //         //     //     this.currentJob = response.data.job;
        //         //     //      // Filter out the current job from the featured array passed to the details view
        //         //     //      this.featuredJobsAside = this.featuredJobs.filter(job => job.id !== response.data.job.id).slice(0, this.state.numFeaturedAside);
                                                
        //         //     //     jobView.renderJobDetails(response.data.job, document.body, this.featuredJobsAside);
        //         //     // }
        //         // })
        //         // .catch(err => console.log(err));
        //     } else if(applyBtn) {
        //         const jobCard = applyBtn.closest(elementStrings.jobCard);
        //         applyView.renderApplyForm(jobCard.dataset.id);
        //     }
        // });

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
                        case 'view'     : this.swapJobs(e); break
                        case 'cancel'   : jobView.animateJobDetailsOut(this.closeModal.bind(null, modal)); break;
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
    }
    closeModal(modal) {
        modal.parentElement.removeChild(modal);
        document.body.style.overflow = "auto";
    }
    
    swapJobs(e) {
        const viewMoreBtn = e.target.closest('.job-card__view-btn--details');

        // Get the id of the jobs that has been chosen to swap in
        const jobId = viewMoreBtn.parentElement.parentElement.parentElement.dataset.id;

        // Find the job in the featured aside array (NB: Non-featured jobs can be swapped *in* to the featured aside array)
        const job = this.featuredJobsAside.find(job => { return job.id === parseInt(jobId)});
        const jobIndex = this.featuredJobsAside.findIndex(job => { return job.id === parseInt(jobId)});

        // Pick a job that exists in the featured array, but isn't currently in the aside array
        let newJobIndex = this.featuredJobs.findIndex(job => !this.featuredJobsAside.includes(job) && job.id !== this.currentJob.id);
        // If no job can be found, pick the previously featured job
        const newJob = newJobIndex !== -1? this.featuredJobs[newJobIndex] : this.currentJob;


        // Remove the old job and add the job to the featured aside
        this.featuredJobsAside.splice(jobIndex, 1, newJob);

        this.currentJob = job;

        // console.log(jobId, job, newJob)

        if(!jobView.getAnimationState())
            jobView.updateJobView(jobId, job, newJob);
    }
    initialiseMenuItems() {
        this.navItems = Array.from(document.querySelectorAll('.jobs-menu__item-wrapper'));

        this.navItems.forEach((item) => {
            const itemContent = item.querySelector('.jobs-menu__content');

            // Calculate max visible height
            const yPos = itemContent.getBoundingClientRect().y;
            const contentHeight = window.innerHeight - yPos;
            itemContent.style.maxHeight = contentHeight + 'px';

            // Add the animation to each item's content element + the arrow element
            jobsMenuView.addMenuAnimation(itemContent);

            // Add listeners to each element that trigger the animations
            item.addEventListener('click', (e) => {
                if(e.target.closest('.jobs-menu__content')) { console.log('return'); return; }

                if(this.activeNavItem) {
                    // Close any item that's open
                    this.activeNavItem.animation.reverse();
                    // Rotate the arrow back
                    this.activeNavArrow.animation.reverse();
                    // Alter the DOM classes
                    jobsMenuView.setMenuActive(this.activeNavItem, false);

                    if(this.activeNavItem !== itemContent) {
                        // If the clicked item is different to the active one
                        // Set the new active item
                        this.activeNavItem = itemContent;
                        // Set the new active item arrow
                        this.activeNavArrow = itemContent.parentElement.parentElement.querySelector('.jobs-menu__title-icon');
                        // Alter the DOM classes
                        jobsMenuView.setMenuActive(this.activeNavItem, true);
                        // Animate the menu
                        this.activeNavItem.animation.play();
                        this.activeNavArrow.animation.play();
                    } else {
                        // Else the same item has been clicked, 
                        // set the active items to null
                        this.activeNavItem = null;
                        this.activeNavArrow = null;
                    }

                } else if(!this.activeNavItem) {
                    // If there's no active item, set and open it
                    this.activeNavItem = itemContent;
                    this.activeNavArrow = itemContent.parentElement.parentElement.querySelector('.jobs-menu__title-icon');

                    jobsMenuView.setMenuActive(this.activeNavItem, true);
                    this.activeNavItem.animation.play();
                    this.activeNavArrow.animation.play();
                }
            });
        })
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
                if(jobs.length === 0) return;
                this.totalJobs = totalJobs;
                this.searchOptions.index += jobs.length;
                // Passing the index to the render and animate functions allow gsap to animate only the most recent elements added to the page
                jobListView.renderJobs(jobs, elements.jobsGrid, this.searchOptions.index);
                jobListView.animateJobs(this.searchOptions.index);

                document.querySelectorAll(`${elementStrings.jobCard}`).forEach(card => {
                    card.addEventListener('click', async (e) => {
                        const viewJobBtn = e.target.closest(elementStrings.viewJobBtn);
                        const applyBtn = e.target.closest(elementStrings.applyBtn);
                        if(viewJobBtn) {
                            const jobCard = viewJobBtn.closest(elementStrings.jobCard);
                            try {
                                // Get the selected job
                                const { data: { job } } = await this.JobList.getJob(jobCard.dataset.id);
                                this.currentJob = job;
            
                                // Filter out this job from the Featured Array, and shorten it to the number of featured jobs to display
                                this.featuredJobsAside = this.featuredJobs.filter(job => job.id !== this.currentJob.id);
                                
                                // Render the Current Job and the aside
                                jobView.renderJobDetails(this.currentJob, document.body, this.featuredJobsAside, e);
                            } catch(e) {
                                console.log(e);
                            }
            
            
                        } else if(applyBtn) {
                            const jobCard = applyBtn.closest(elementStrings.jobCard);
                            applyView.renderApplyForm(jobCard.dataset.id);
                        }
                    });
                })


            })
            .catch((err) => console.log(err));
    }


    clearJobs() {
        jobListView.clearJobs(elements.jobsGrid);
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

                const min = 0;
                let range = 20000;
                const max = 200000;
                // Populate salary array 
                for(let x = min; x <= max; x+=range) {
                    if(x === 20000) range = 10000;
                    if(x === 100000) range = 20000;
                    if(x === max) this.menuItems.salaries.push(`${utils.formatSalary(x)} +`);
                    else this.menuItems.salaries.push(`${utils.formatSalary(x)} - ${utils.formatSalary(x + range)}`);
                }

                items.salaries = this.menuItems.salaries;
                items.types = this.menuItems.types;

                // Render content
                jobsMenuView.populateMenu(items, { titleParam: this.titleParam, locationParam: this.locationParam});
                jobsMenuView.animateMenu();

                // Store menu items in the controller & add to the suggested search arrays
                this.menuItems.titles = items.uniqueTitles;
                this.menuItems.locations = items.uniqueLocations;
                this.searchSuggestions.titles = items.uniqueTitles;
                this.searchSuggestions.locations = items.uniqueLocations;

                // Add listeners to the JobsMenu
                this.addMenuListeners();

                this.initialiseMenuItems();

                // this.initialiseSearchAutoComplete();
                
                // Initialise search autoComplete
                document.querySelectorAll('.search-input').forEach(input => {
                    let data;
                    let inputName;
                    switch(input.classList[0]) {
                        case 'search-input--title': data = this.menuItems.titles; inputName = 'title'; break;
                        case 'search-input--location': data = this.menuItems.locations; inputName = 'location'; break;
                    }
                    // Logic for typing in the input
                    this.handleAutoComplete(input, inputName, data);
                });

            })
            .catch((err) => console.log(err));
    }

    initialiseSearchAutoComplete() {
        inputUtils.autoComplete(document.querySelector('.search-input--title'), this.menuItems.titles);
        inputUtils.autoComplete(document.querySelector('.search-input--location'), this.menuItems.locations);

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
                const checkbox = e.target;
                const checkboxTitle = e.target.value;
                const checkboxId = checkbox.dataset.id;
                
                // Deal with visual logic of checking/unchecking 'all', or unchecking the last checkbox
                jobsMenuView.handleCheckboxLogic(submenu, checkboxTitle);   

                // If a checkbox is checked that isn't 'All'
                if(checkbox.checked && checkboxTitle !== 'all') { 
                    // Add a new tag
                    this.addTag(submenu, checkboxId, checkboxTitle);

                    // Add as a search option if it doesn't already exist
                    if(!this.searchOptions[submenu].includes(checkboxTitle)) this.addSearchOption(submenu, checkboxTitle);

                // If the 'All' checkbox is checked
                } else if(checkbox.checked && checkboxTitle === 'all') {
                    // Remove all tags
                    this.removeAllTags(submenu);
                    
                    // Reset the search object
                    this.searchOptions[submenu] = [];
                // If a checkbox that isn't 'All' is unchecked
                } else if(!checkbox.checked && checkboxTitle !== 'all') {

                    // Remove the tag from screen and tagsArray
                    const tag = document.querySelectorAll(`.tag--${submenu}[data-id="${checkboxId}"]`)[0];
                    this.removeFromTagsArray(tag, submenu);
                    this.removeTag(tag);

                    // Remove the search option
                    this.removeSearchOption(submenu, checkboxTitle);
                
                // If the 'All' checkbox is unchecked, recheck it, because why?
                } else if(!checkbox.checked && checkboxTitle === 'all') {
                    // Remove all tags
                    this.removeAllTags(submenu);
                    checkbox.checked = true;
                }

                // Remove current Jobs
                jobListView.clearJobs(elements.jobsGrid);

                // Every time a filter is added restart the index
                this.searchOptions.index = 0;

                // Query the database using the new search object
                this.getJobs();    
            });
        });
    }

    removeAllTags(submenu) {
        const tags = Array.from(document.querySelectorAll(`.tag--${submenu}`));
        this.tags[submenu] = [];
        tags.forEach((tag, index) => {
            // if it's the last tag in any submenu, close the tags wrapper
            if(document.querySelectorAll('.tag').length === 1)
                jobsMenuView.closeTagsList(() => utils.removeElement(tag));
            else 
                utils.removeElement(tag)

            this.removeFromTagsArray(tag, submenu);
        });
    }

    removeTag(tag) {
        if(document.querySelectorAll('.tag').length === 0) {
            // Close tags wrapper if it's the last tag
            jobsMenuView.closeTagsList(() => utils.removeElement(tag));
        } else {
            utils.removeElement(tag);
        }
    }

    removeFromTagsArray(tag, submenu) {
        this.tags[submenu].splice(this.tags[submenu].indexOf(tag), 1);
    }

    findAndSelectCheckboxByText(submenu, checkboxTitle) {
        const submenuElement = document.querySelector(`.jobs-menu__content--${submenu}`);
        Array.from(submenuElement.querySelectorAll('.jobs-menu__checkbox')).filter(checkbox => {
            return checkbox.value === checkboxTitle;
        })[0].checked = true;
    }

    addSearchOption(submenu, filter) {
        // If the filter is a salary range, split on the " - ", and strip it of non numeric digits
        if(submenu === 'salaries') {
            filter = utils.removeSalaryFormatting(filter);
        }

        // If the filter doesn't already exist, add it to the search options 
        if(!this.searchOptions[submenu].includes(filter)) {
            this.searchOptions[submenu].push(filter);
        }
 
    }
    removeSearchOption(submenu, filter) {
        console.log(submenu);
        if(submenu === 'salaries') {
            // Strip it of non numeric digits and return as a min/max array
            filter = utils.removeSalaryFormatting(filter);

            // this.searchOptions[salary] = [][]; 
            // filter = [min/max]
            // So use `findIndex()/every()`
            const index = this.searchOptions[submenu].findIndex(arr => arr.every((item, i) => filter[i] === item));
            
            this.searchOptions[submenu].splice(index, 1);
        } else {
            // If the filter already exists, remove it from the search options 
            if(this.searchOptions[submenu].includes(filter)) {
                this.searchOptions[submenu].splice(this.searchOptions[submenu].indexOf(filter), 1);
            }
        }
    }

    handleAutoComplete(input, inputName, data) {
        // inputUtils.initialiseAutoComplete.bind(this, input, data);
        let currentFocus;

        input.addEventListener('input', e => {
            let autoCompleteList, autoCompleteItem;
            // Close all open autocomplete lists
            // inputUtils.closeAllLists(null, input);
            if(!input.value) return;
            currentFocus = -1;
            // Create a div container for the suggestions
            autoCompleteList = inputUtils.createAutoCompleteList(inputName);

            // For each data item
            data.forEach(entry => {
                const id = entry.id;
                const item = entry[inputName];

                // If the value typed matches a data item
                if(inputUtils.isAutoCompleteMatch(item, input.value)) {
                    // Create a suggestion
                    autoCompleteItem = inputUtils.createAutoCompleteItem(id, item, input.value);

                    // Append it to the list
                    autoCompleteList.appendChild(autoCompleteItem);
                    // Handle clicks on the suggestion
                    autoCompleteItem.addEventListener('click', e => {
                        input.value = e.target.getElementsByTagName('input')[0].value;
                        inputUtils.closeAllLists(null, input);

                        switch(e.target.parentElement.classList[1]) {
                            case 'autocomplete-list--title':
                                // Add the item to the search object
                                this.addSearchOption('titles', input.value);
                                // Add a tag
                                this.addTag('titles', id, input.value);
                                // Manually select the checkbox
                                this.findAndSelectCheckboxByText('titles', input.value);
                                // Handle checkbox logic
                                jobsMenuView.handleCheckboxLogic('titles', input.value);

                                break;
                            case 'autocomplete-list--location':
                                // Add the item to the search object
                                this.addSearchOption('locations', input.value);
                                // Add a tag
                                this.addTag('locations', id, input.value);
                                // Manually select the checkbox
                                this.findAndSelectCheckboxByText('locations', input.value);
                                // Handle checkbox logic
                                jobsMenuView.handleCheckboxLogic('locations', input.value);

                                break;
                        }
                        // Remove current Jobs
                        jobListView.clearJobs(elements.jobsGrid);

                        // Every time a filter is added restart the index
                        this.searchOptions.index = 0;
                        this.getJobs();

                        // // Set the input value for when focus is lost & push filter to the relevant array
                        // switch(e.target.parentElement.classList[1]) {
                        //     case 'autocomplete-list--title' :   this.searchInputValues.title = input.value;  
                        //                                         // Add to search options if it doesn't already exist
                        //                                         this.addSearchOption('titles', input.value);
                        //                                         this.addTag('titles', input.value);

                        //                                         this.getJobs();
                        //                                         break;
                        //     case 'autocomplete-list--location': this.searchInputValues.location = input.value;
                        //                                         // Add to search options if it doesn't already exist
                        //                                         this.addSearchOption('locations', input.value);
                        //                                         this.addTag('locations', input.value);

                        //                                         this.getJobs();
                        //                                         break;
                        // }
                    });
                }
            });

            // Append to container
            input.parentNode.appendChild(autoCompleteList);
        });

        input.addEventListener('keydown', e => {
            const list = document.querySelector(`.autocomplete-list--${inputName}`);
            let suggestions;
            if(document.querySelector(`.autocomplete-list--${inputName}`)) {
                suggestions = list.getElementsByTagName('div');

                if(e.keyCode == 40) {
                    // DOWN key
                    currentFocus++;
                    updateSuggestionFocus(suggestions);
                } else if(e.keyCode == 38) {
                    // UP key
                    currentFocus--;
                    updateSuggestionFocus(suggestions);
                } else if(e.keyCode == 13) {
                    e.preventDefault(); // ENTER
                    if(currentFocus > -1) {
                        // Simulate click
                        if(suggestions) suggestions[currentFocus].click();
                    }
                }
            }
        });

        function updateSuggestionFocus(suggestions) {
            // Remove all active classes
            inputUtils.removeActive(suggestions);
            // CurrentFocus edge cases
            if(currentFocus >= suggestions.length) currentFocus = 0;
            if(currentFocus < 0) currentFocus = suggestions.length - 1;
            // Add active class
            suggestions[currentFocus].classList.add('autocomplete-active');
        }


        document.addEventListener("click", function (e) {
            inputUtils.closeAllLists(e.target, input);
        });
    }

    addTag(submenu, id, title) {
        // console.log(submenu, this.tags[submenu]);
        // If the tag already exists, return
        if(this.tags[submenu].includes(title)) return;

        const container = document.querySelector('.tags-wrapper');
        const tagsList = document.querySelector('.tags-list');
        const closeIcon = `<svg class="tag__close-icon"><use xlink:href="svg/spritesheet.svg#close-icon"></svg>`;
        const tag = document.createElement('DIV');
        tag.setAttribute('class', `tag tag--${submenu}`);
        tag.setAttribute('data-id', id);

        const tagText = document.createElement('DIV');
        tagText.setAttribute('class', `tag__text`);
        tagText.innerText = title;
        tag.appendChild(tagText);
        tag.insertAdjacentHTML('afterbegin', closeIcon);
        tagsList.append(tag);
        container.append(tagsList);

        // Add the tag to the tags array
        this.tags[submenu].push(title);
        // If this is the first tag, open the tag wrapper
        if(document.querySelectorAll('.tag').length === 1) jobsMenuView.openTagsList();

        // console.log('tags after addition: ', this.tags[submenu]);

        tag.addEventListener('click', (e) => {
            // // Simulate click of corresponding checkbox
            const checkboxes = Array.from(document.querySelectorAll(`.jobs-menu__${submenu}-checkbox`));
            const checkbox = checkboxes.filter(checkbox => checkbox.dataset.id == id)[0];
            checkbox.checked = false;
            
            // Handle checkbox logic/edgecases
            jobsMenuView.handleCheckboxLogic(submenu, title);
            // Remove the tag from the array
            this.removeFromTagsArray(tag, submenu);

            // Remove the tag
            this.removeTag(tag);

            this.removeSearchOption(submenu, title);

            // Remove current Jobs
            jobListView.clearJobs(elements.jobsGrid);

            // Every time a filter is added restart the index
            this.searchOptions.index = 0;

            this.getJobs();

        });
    }

    async getFeaturedJobs() {
        const { data: { jobs } } = await this.JobList.getFeaturedJobs();
        this.featuredJobs = jobs;
    }
}

new JobsController();
