import * as headerView from './views/headerView';
import * as homeView from './views/homeView';

import { elements, elementStrings } from './views/base';
import * as loginView from './views/loginView';
import * as chatView from './views/chatView';
import * as registerView from './views/registerView';
import * as forgotPassView from './views/forgotPassView';
import * as applyView from './views/applyView';
import * as jobsListView from './views/jobListView';
import * as jobView from './views/jobView';

import { initSocket } from './socket';
import User from './models/User';
import JobList from './models/JobList';
import Applications from './models/Applications';

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
import '../assets/icons/info.svg';
import '../assets/icons/chatbubble.svg';
import '../assets/icons/arrow-up.svg';
import '../assets/icons/paperplane.svg';
import '../assets/icons/world.svg';
import '../assets/icons/copy.svg';
import '../assets/icons/cog.svg';

class IndexController {
    constructor() {
        this.jobsPerSlide = 2;
        this.JobList = new JobList();
        this.User = new User();
        this.Applications = new Applications();
        this.socket = initSocket();

        this.addEventListeners();
    }

    addEventListeners() {

        // ONLOAD
        window.addEventListener('DOMContentLoaded', (e) => {
            // this.applyForJob(1, { firstName: 'a', lastName: 'b', phone: '07384838238', email: 'nick@gmail', cv: {} })
            e.preventDefault();
            // Create Listener callbacks for header links
            const cbs = {
                renderLogin: loginView.renderLogin
            }
            headerView.renderHeader('index');
            headerView.addHeaderListeners(cbs);
            chatView.renderChat();
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
                // e.preventDefault();
                // Login Modal Clicked
                if(e.target.closest('.login')) {
                    switch(loginView.getAction(e)) {
                        case 'submit':      try {
                                                const res = await this.User.login(loginView.getLoginDetails());
                                                // window.location.replace('http://localhost:8082');
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
                        case 'register':    console.log('register'); 
                                            this.createUser(e.target.closest('.register'));
                                            break; 
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
                        case 'request':     const jobId = e.target.closest('.apply').dataset.id;
                                            const applicationDetails = applyView.getApplicationDetails();
                                            this.applyForJob(jobId, applicationDetails);
                                            break;
                        // case 'login':       console.log('login'); break;
                        // case 'forgot':      this.closeModal(modal);
                        //                     forgotPassView.renderForgotModal(); break;
                        // case 'register':    this.closeModal(modal);
                        //                     registerView.renderRegisterModal(); break;
                        case 'cancel':      this.closeModal(modal);
                    }
                }
                
            }
        });

        // CHATBOX
        document.body.addEventListener('click', (e) => {
            const chatboxHeader = e.target.closest('.chatbox__header');
            const chatboxHistory = e.target.closest('.chatbox__history');
            const chatboxInput = e.target.closest('.chatbox__input');

            switch(e.target) {
                case chatboxHeader : console.log('header'); chatView.closeChatbox(); break;
                case chatboxHistory: console.log('his'); break;
                case chatboxInput  : console.log('in'); break;
            }
        });
        document.body.addEventListener('submit', (e) => {
            e.preventDefault();
            const chatboxForm = e.target.closest('.chatbox__form');
            if(chatboxForm) {
                const message = document.querySelector('.chatbox__input').value;
                console.log(message);
                chatView.addChatResponse(message, true);
                this.socket.emit('chatbox', message );
            }
        });

        // KEYCOMBO
        document.addEventListener('keydown', (e) => {
            if(e.ctrlKey && e.shiftKey && e.key === 'L' && !document.querySelector('.login')) loginView.renderLogin();
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

        // SOCKETS
        this.socket.on('job', ({job}) => {
            jobView.renderJobNotification(job);
        });
        this.socket.on('response', (res) => {
            chatView.addChatResponse(res.message, false);
        })

        // jobView.renderJobNotification();

    }

    closeModal(modal) {
        modal.parentElement.removeChild(modal);
        document.body.style.overflow = "auto";
    }

    applyForJob(jobId, details) {
        for(let[key, value] of details.entries()) console.log(key, value);
        this.Applications.applyForJob(jobId, details)
    }

    createUser(modal) {
        this.User
            .createUser(registerView.getFormData())
            .then(res => {
                console.log(res);
                if(res.status === 201) {
                    // Close register Modal
                    this.closeModal(modal);
                    // @TODO: display success modal
                    console.log('User created!');
                }
            })
            .catch(err => {
                console.log(err);
                // @TODO: Implement form validation
            });
        
    }

    getFeaturedJobs() {
        this.JobList
            .getFeaturedJobs()
            .then(res => { 
                // @TODO: add loader
                // Check the condition here too
                if(res.data)
                    jobsListView.renderFeaturedJobs(res.data.jobs, elements.featuredJobsList, this.jobsPerSlide);
                    homeView.featuredAnimation();
                    homeView.jobSliderAnimation();
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
                                        // Set a listener on the file picker that appears on the apply modal
                                        const filePicker = document.querySelector('.request__input--cv');
                                        filePicker.onchange = function() {
                                            const path = document.querySelector('.request__input-path');
                                            path.textContent = '';
                                            path.insertAdjacentHTML('afterbegin', `<div>${filePicker.value.replace("C:\\fakepath\\", "")}</div>`);
                                        }
                                        
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

