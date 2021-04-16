import * as headerView from './views/headerView';
import * as homeView from './views/homeView';

import { elements, elementStrings } from './views/base';
import * as loginView from './views/loginView';
import * as registerView from './views/registerView';
import * as forgotPassView from './views/forgotPassView';
import * as applyView from './views/applyView';
import * as jobsListView from './views/jobListView';
import * as jobView from './views/jobView';

import User from './models/User';
import JobList from './models/JobList';

/* ASSETS */
import '../sass/index.scss';

import '../assets/hero.webp';
import '../assets/legal.png';
import '../assets/search-jobs.png';

import '../assets/icons/permanent.svg';
import '../assets/icons/clock.svg';
import '../assets/icons/location.svg';
import '../assets/icons/ios-telephone.svg';
import '../assets/icons/ios-email.svg';
import '../assets/icons/sterling.svg';
import '../assets/icons/location-solid.svg';
import '../assets/icons/clock-solid.svg';
import '../assets/icons/search.svg';


class IndexController {
    constructor() {

        this.JobList = new JobList();
        this.User = new User();
        this.addEventListeners();
        // homeView.initParallax();
    }

    addEventListeners() {

        // ONLOAD
        window.addEventListener('DOMContentLoaded', (e) => {
            // Create Listener callbacks for header links
            const cbs = {
                renderLogin: loginView.renderLogin
            }
            headerView.renderHeader('index');
            headerView.addHeaderListeners(cbs);
            homeView.loadingAnimation();
            homeView.initialiseScrollAnimations();
            homeView.initParallax();

            this.JobList.getMenuData()
                .then(data => {
                    homeView.populateSearchInputs(data.data.response);
                })
                .catch(err => console.log(err));

            // Separated from the renderHeader method for page resizing
            headerView.setParallaxHeaderWidth();

            this.getFeaturedJobs();
        });  

        // RESIZE
        window.addEventListener('resize', (e) => {
            // #TODO: Debounce
            headerView.setParallaxHeaderWidth();
        });

        // CHECK MODAL CLICKED
        document.body.addEventListener('click', async (e) => {
            const modal = e.target.closest('.modal');
            const header = e.target.closest('.header');
            // if there's a modal and the header is clicked, close it
            if(header && document.querySelector('.modal')) this.closeModal(document.querySelector('.modal'));
            if(modal) {
                e.preventDefault();
                // Login Modal Clicked
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
                        case 'register':    this.closeModal(modal); 
                                            registerView.renderRegisterModal();
                                            break;
                        case 'cancel':      this.closeModal(modal); break;
                        case 'forgot':      this.closeModal(modal); 
                                            forgotPassView.renderForgotModal(); break;
                    }

                // Register Modal Clicked
                } else if(e.target.closest('.register')) {
                    switch(registerView.getAction(e)) {
                        case 'register':    console.log('register'); break; 
                        case 'cancel':      this.closeModal(modal); break;
                        case 'sign-in':       this.closeModal(modal); loginView.renderLogin(); break;
                    }
                } else if(e.target.closest('.forgot-password')) {
                    switch(forgotPassView.getAction(e)) {
                        case 'submit': console.log('submit'); break;
                        case 'cancel': this.closeModal(modal); break;
                    }
                } else if(e.target.closest('.job-details')) {
                    switch(jobView.getAction(e)) {
                        case 'apply'    : applyView.renderApplyForm(); break;
                        case 'cancel'   : this.closeModal(modal); break;
                        case 'sign-in'  : this.closeModal(modal); loginView.renderLogin(); break;  
                    }
                } else if(e.target.closest('.apply')) {

                    switch(applyView.getAction(e)) {
                        case 'request':     console.log('request'); break;
                        case 'login':       console.log('login'); break;
                        case 'forgot':      this.closeModal(modal);
                                            forgotPassView.renderForgotModal(); break;
                        case 'register':    this.closeModal(modal);
                                            registerView.renderRegisterModal(); break;
                        case 'cancel':      this.closeModal(modal);
                    }
                }
                
            }
        });

        // BUTTONS
        elements.signupBtns.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
            registerView.renderRegisterModal();
        }));
        elements.browseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'http://localhost:8081/jobs.html';
        });
        elements.contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            elements.footerContent.scrollIntoView({ behavior: 'smooth' });
        });
        // Job card button listeners set after the request is made below

    }

    closeModal(modal) {
        modal.parentElement.removeChild(modal);
        document.body.style.overflow = "auto";
    }

    getFeaturedJobs() {
        this.JobList
            .getFeaturedJobs()
            .then(res => { 
                // @TODO: add loader
                if(res.data)
                    jobsListView.renderJobs(res.data.jobs, elements.featuredJobsList, true);
                    homeView.featuredAnimation();
                    // Add listeners to the cards
                    document.querySelectorAll(`${elementStrings.jobCard}`)
                            .forEach(card => {
                                card.addEventListener('click', (e) => {
                                    const viewMoreBtn = e.target.closest(`${elementStrings.viewJobBtn}`);
                                    const applyBtn = e.target.closest(`${elementStrings.applyBtn}`);

                                    if(viewMoreBtn) {
                                        this.JobList.getJob(card.dataset.id)
                                            .then(res => {
                                                if(res.data.job) {
                                                    jobView.renderJobDetails(res.data.job, document.body, true);
                                                }
                                            })
                                            .catch(err => console.log(err));
                                    } else if(applyBtn) {
                                        applyView.renderApplyForm(card.dataset.id);
                                    }
                                });
                            });
            })
            .catch(err => {
                console.log(err);
            });
    }
}

new IndexController();

