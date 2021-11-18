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
            locations: []
        }
        this.searchOptions = {
            index: 0,
            limit: 12,
            titles: [],
            locations: [],
            orderField: "title",
            orderDirection: "ASC"
        };
        this.tags = [];
        window.tagtest = this.tags;
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
        });

        // #TODO: Debounce / change to GSAP
        window.addEventListener("scroll", (e) => {
            // At bottom of screen && there are more jobs to retrieve
            if (
                jobListView.isAtBottom() &&
                this.totalJobs > document.querySelectorAll(".job-card").length
            ) {
                this.getJobs();
            }
        });

        window.addEventListener('click', (e) => {
            // Handle closing menu items
            if(!e.target.closest('.jobs-menu__item') && this.activeNavItem) {
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
            item.addEventListener('click', () => {

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
                this.totalJobs = totalJobs;
                this.searchOptions.index += this.limit;

                // Passing the index to the render and animate functions allow gsap to animate only the most recent elements added to the page
                jobListView.renderJobs(jobs, elements.jobsGrid, false, this.searchOptions.index);
                jobListView.animateJobs(this.searchOptions.index);
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

                // Render content
                jobsMenuView.populateMenu(items, { titleParam: this.titleParam, locationParam: this.locationParam });
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
// ******************************
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

///////////////
                // Deal with visual logic of checking/unchecking 'all', or unchecking the last checkbox
                jobsMenuView.handleCheckboxLogic(submenu, checkboxTitle);   

                // If a checkbox is checked that isn't 'All'
                if(checkbox.checked && checkboxTitle !== 'all') { 
                    // Add a new tag
                    this.addTag(submenu, checkboxTitle);

                    // Add as a search option if it doesn't already exist
                    if(!this.searchOptions[submenu].includes(checkboxTitle)) this.addSearchOption(submenu, checkboxTitle);

                // If the 'All' checkbox is checked
                } else if(checkbox.checked && checkboxTitle === 'all') {

                    // Remove all tags
                    this.removeAllTags(submenu);
                    // Remove tag from array
                    this.removeFromTagsArray(tag);

                    // Reset the search object
                    this.searchOptions[submenu] = [];
                
                // If a checkbox that isn't 'All' is unchecked
                } else if(!checkbox.checked && checkboxTitle !== 'all') {
                    // Remove the tag
                    const tag = this.findAndDeleteTagByText(checkboxTitle);
                    
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


///////////////


                // // Deal with visual logic of clicking 'all', or the last checkbox
                // jobsMenuView.handleCheckboxLogic(submenu, checkboxTitle);

                // // Update tags
                // this.updateTags(submenu, e.target, checkboxTitle);

                // // Change the search object's options
                // // this.changeSearchOptions(submenu, checkboxTitle);

                // // Reset the submenu search options if 'all' is selected
                // if(checkboxTitle === 'all') {
                //     this.searchOptions[submenu] = [];
                // // Else if the option doesn't exist, add it
                // } else if(!this.searchOptions[submenu].includes(checkboxTitle)) {
                //     this.addSearchOption(submenu, checkboxTitle)
                // // Else remove it
                // } else {
                //     this.removeSearchOption(submenu, checkboxTitle);
                // }

                // // Remove current Jobs
                // jobListView.clearJobs(elements.jobsGrid);

                // // Every time a filter is added restart the index
                // this.searchOptions.index = 0;

                // // Query the database using the new search object
                // this.getJobs();     
            });
        });
    }

    // changeSearchOptions(submenu, checkboxTitle) {
    //     // Reset the submenu search options if 'all' is selected
    //     if(checkboxTitle === 'all') {
    //         this.searchOptions[submenu] = [];
    //     // Else if the option doesn't exist, add it
    //     } else if(!this.searchOptions[submenu].includes(checkboxTitle)) {
    //         this.searchOptions[submenu].push(checkboxTitle);
    //     // Else remove it
    //     } else {
    //         const index = this.searchOptions[submenu].indexOf(checkboxTitle);
    //         this.searchOptions[submenu].splice(index, 1);
    //     }
    // }

    // updateTags(submenu, checkbox, checkboxTitle) {
    //     if(checkbox.checked && checkboxTitle !== 'all') {
    //         // Add the tag if checkbox checked
    //         this.addTag(submenu, checkboxTitle);
    //     } else if(!checkbox.checked && checkboxTitle !== 'all') {
    //         // Remove the tag if checkbox unchecked
    //         const tag = Array.from(document.querySelectorAll('.tag__text')).filter(tagText => {
    //             return tagText.textContent === filter;
    //         })[0].parentElement;

    //         utils.removeElement(tag);
    //     } else if(checkboxTitle === 'all') {
    //         // If 'all' selected close tag list and remove all submenu tags

    //         document.querySelectorAll('.tag').forEach(() => );
    //     }
    // }


    removeAllTags(submenu) {
        const tags = Array.from(document.querySelectorAll(`.tag--${submenu}`));
        this.tags = [];
        tags.forEach(tag => {
            jobsMenuView.closeTagsList(() => utils.removeElement(tag));
            this.removeFromTagsArray(tag);
        });
        console.log('deleted all' + this.tags)
    }

    findandDeleteTagByText(text) {
        const tag = Array.from(document.querySelectorAll('.tag__text')).filter(tagText => {
            return tagText.textContent === text;
        })[0].parentElement;

        utils.removeElement(tag);
        this.removeFromTagsArray(tag);

        console.log(`deleted one ${this.tags}`);
    }

    removeFromTagsArray(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
    }

    findAndSelectCheckboxByText(submenu, checkboxTitle) {
        const submenuElement = document.querySelector(`.jobs-menu__content--${submenu}`);
        Array.from(submenuElement.querySelectorAll('.jobs-menu__checkbox')).filter(checkbox => {
            return checkbox.value === checkboxTitle;
        })[0].checked = true;
    }

    addSearchOption(submenu, filter) {
        // If the filter doesn't already exist, add it to the search options 
        if(!this.searchOptions[submenu].includes(filter)) {
            this.searchOptions[submenu].push(filter);
            // Manually check the relevant checkbox
            // Array.from(document.querySelectorAll(elementStrings[`${submenu}Checkbox`])).forEach(checkbox => {
            //     if(checkbox.value === filter) {
            //         checkbox.checked = true;
            //         jobsMenuView.handleCheckboxLogic(submenu, filter);
            //     }
            // });
            // jobListView.clearJobs(elements.jobsGrid);
            // // Every time a filter is added restart the index
            // this.searchOptions.index = 0;
        }
        // jobsMenuView.handleCheckboxLogic(submenu, checkboxTitle);

        // // Change the search object's options
        // this.changeSearchOptions(submenu, checkboxTitle);
        
        // // Remove current Jobs
        // jobListView.clearJobs(elements.jobsGrid);

        // // Every time a filter is added restart the index
        // this.searchOptions.index = 0;
    }
    removeSearchOption(submenu, filter) {
        // If the filter already exists, remove it from the search options 
        if(this.searchOptions[submenu].includes(filter)) {
            this.searchOptions[submenu].splice(this.searchOptions[submenu].indexOf(filter), 1);
           
           
            // jobListView.clearJobs(elements.jobsGrid);
            // // Every time a filter is added restart the index
            // this.searchOptions.index = 0;
            // this.getJobs();
            // // Remove the checkbox from the relevent menu
            // Array.from(document.querySelectorAll(elementStrings[`${submenu}Checkbox`])).forEach(checkbox => {
            //     if(checkbox.value === filter) checkbox.checked = false;
            //     jobsMenuView.handleCheckboxLogic(submenu, filter);
            // });

            // const tag = Array.from(document.querySelectorAll('.tag__text')).filter(tagText => {
            //     return tagText.textContent === filter;
            // })[0].parentElement;

            // utils.removeElement(tag);
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
            data.forEach(item => {
                // If the value typed matches a data item
                if(inputUtils.isAutoCompleteMatch(item, input.value)) {
                    // Create a suggestion
                    autoCompleteItem = inputUtils.createAutoCompleteItem(item, input.value);

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
                                this.addTag('titles', input.value);
                                // Manually select the checkbox
                                this.findAndSelectCheckboxByText('titles', input.value);
                                // Handle checkbox logic
                                jobsMenuView.handleCheckboxLogic('titles', input.value);
                                break;
                            case 'autocomplete-list--location':
                                // Add the item to the search object
                                this.addSearchOption('locations', input.value);
                                // Add a tag
                                this.addTag('locations');
                                // Manually select the checkbox
                                this.findAndSelectCheckboxByText('locations', input.value);
                                // Handle checkbox logic
                                jobsMenuView.handleCheckboxLogic('locations', input.value);
                                break;
                        }

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

    // addTags() {
    //     const tagsList = document.querySelector('.tags-list');
    //     utils.clearElement(tagsList);

    //     this.searchOptions.titles.forEach(title => {
    //         this.addTag(title, 'titles');
    //     });
    //     this.searchOptions.locations.forEach(location => {
    //         this.addTag(location, 'locations');
    //     });

    //     // If this is the first tag, open the tag wrapper
    //     if(document.querySelectorAll('.tag').length === 1) jobsMenuView.openTagsWrapper();
    // }

    addTag(submenu, title) {

        console.log('adding tag' + this.tags);
        const container = document.querySelector('.tags-wrapper');
        const tagsList = document.querySelector('.tags-list');
        const closeIcon = `<svg class="tag__close-icon"><use xlink:href="svg/spritesheet.svg#close-icon"></svg>`;
        const tag = document.createElement('DIV');
        tag.setAttribute('class', `tag tag--${submenu}`);

        const tagText = document.createElement('DIV');
        tagText.setAttribute('class', `tag__text`);
        tagText.innerText = title;
        tag.appendChild(tagText);
        tag.insertAdjacentHTML('afterbegin', closeIcon);
        tagsList.append(tag);
        container.append(tagsList);

        // Add the tag to the tags array
        this.tags.push(title);
        // If this is the first tag, open the tag wrapper
        if(this.tags.length === 1) jobsMenuView.openTagsList();

        tag.addEventListener('click', (e) => {
            // Simulate checkbox-all click
            document.querySelector(`.jobs-menu__${submenu}-checkbox--all`).clicked = true;
            // Handle checkbox logic (unselect every other tag)
            jobsMenuView.handleCheckboxLogic(submenu, title);
            // Remove the tag from the array
            this.removeFromTagsArray(tag);

            // Remove the tag
            if(this.tags.length === 0) {
                // Close tags wrapper if it's the last tag
                jobsMenuView.closeTagsList(() => utils.removeElement(tag));
            } else {
                utils.removeElement(tag);
            }
        });
    }
}

new JobsController();
