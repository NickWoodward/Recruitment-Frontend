import * as headerView from './views/headerView';
import * as homeView from './views/homeView';

import { elements, elementStrings } from './views/base';
import * as loginView from './views/loginView';
import * as chatView from './views/chatView';
import * as registerView from './views/registerView';
import * as forgotPassView from './views/forgotPassView';
import * as footer from './views/footerView';
import * as applyView from './views/applyView';
import * as jobsListView from './views/jobListView';
import * as jobView from './views/jobView';
import * as modal from './views/modalView';
import * as utils from './utils/utils';

import { initSocket } from './socket';
import User from './models/User';
import JobList from './models/JobList';
import Applications from './models/Applications';
import Contact from './models/Contact';

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
import '../assets/icons/close-icon.svg';
import '../assets/icons/copy.svg';
import '../assets/icons/cog.svg';
import '../assets/icons/tick.svg';


class IndexController {
    constructor() {
        this.jobsPerSlide = 2;
        this.JobList = new JobList();
        this.User = new User();
        this.Applications = new Applications();
        this.Contact = new Contact();
        // this.socket = initSocket();

        this.state = {
            featuredJobs: [],
            featuredJobsAside: [],
            currentJob: {}
        }
        this.addEventListeners();
    }

    addEventListeners() {
        console.log(window.devicePixelRatio)
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
            // homeView.initLocomotiveScroll();
            homeView.whyUsHoverAnimation();

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
            // @TODO: don't need to set header width any more
            // @TODO: Debounce
            headerView.setParallaxHeaderWidth();
            // sets the layout
            homeView.initWhyUsSection();

            if(document.querySelector('.modal')) {
                // jobView.animateJobDetailsOut(this.closeModal.bind(null, modal));
            }

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
                        case 'apply': 
                            // Get the jobId from the details or aside card
                            const jobDetailsCard = e.target.closest('.job-details__table');
                            const jobAsideCard = e.target.closest('.job-card--details');
                            const jobId = jobDetailsCard? jobDetailsCard.dataset.id : jobAsideCard.dataset.id;
                            this.renderApplyForm(jobId); 
                            break;               
                        case 'view': 
                            this.swapJobs(e); break
                        case 'cancel': 
                            jobView.animateJobDetailsOut(this.closeModal.bind(null, modal)); break;
                        case 'sign-in': 
                            this.closeModal(modal); loginView.renderLogin(); break;  
                    }
                } else if(e.target.closest('.apply')) {
                    switch(applyView.getAction(e)) {
                        case 'request':     const jobId = e.target.closest('.apply').dataset.id;
                                            const applicationDetails = applyView.getApplicationDetails();
                                            this.applyForJob(jobId, applicationDetails);
                                            console.log('sending application');
                                            break;
                        // case 'login':       console.log('login'); break;
                        // case 'forgot':      this.closeModal(modal);
                        //                     forgotPassView.renderForgotModal(); break;
                        // case 'register':    this.closeModal(modal);
                        //                     registerView.renderRegisterModal(); break;
                        case 'cancel':         applyView.animateApplyFormOut(this.closeModal.bind(null, modal));
                                            
                    }
                }
                
            }
        });

        // CHATBOX / CONTACT FORM
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
            const contactForm = e.target.closest('.footer__contact');

            if(chatboxForm) {
                const message = document.querySelector('.chatbox__input').value;
                console.log(message);
                chatView.addChatResponse(message, true);
                // this.socket.emit('chatbox', message );
            } else if(contactForm) {
                const formData = footer.getContactForm();

                footer.addContactLoader();

                if(formData) {
                    for(let values of formData.entries()) {
                        console.log(values);
                    }
                    this.Contact.sendContactForm(formData)
                        .then(res => {
                            footer.removeContactLoader();

                            if(res.status === 200) {
                                // Remove loader
                                utils.displayLoaderMessage(document.querySelector('.footer__contact'), 'contact', res.data.msg);
                                const message = document.querySelector('.loader__message-close--contact');

                                this.boundRemoveContactMessage = utils.removeElement.bind(null, document.querySelector('.loader__message-wrapper--contact'));
                                message.addEventListener('click', this.boundRemoveContactMessage);
                                footer.clearContactForm();
                            } else {
                                throw new Error();
                            }
                        }).catch(err => {
                            utils.displayLoaderMessage(document.querySelector('.footer__contact'), 'contact', 'Unable to send message, please email or contact us on 0203 7780 191');
                            const message = document.querySelector('.loader__message-close--contact');

                            this.boundRemoveContactMessage = utils.removeElement.bind(null, document.querySelector('.loader__message-wrapper--contact'));
                            message.addEventListener('click', this.boundRemoveContactMessage);
                        }) 
                }
            }
        });

        // KEYCOMBO
        document.addEventListener('keydown', (e) => {
            if(e.ctrlKey && e.shiftKey && e.key === 'L' && !document.querySelector('.login')) loginView.renderLogin();
        });

        //@TODO: REMOVE TESTING
        document.addEventListener('keydown', (e) => {
            if(e.key === 'm' && e.ctrlKey) {
                // modal.displayAlert('Job created', true, document.querySelector('.featured-jobs'));
                modal.displayAlert('Cannot find job', false, document.querySelector('.featured-jobs'));


            };
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
        // elements.contactBtn.addEventListener('click', (e) => {
        //     e.preventDefault();
        //     elements.footerContent.scrollIntoView({ behavior: 'smooth' });
        // });
        // Job card button listeners set after the request is made below

        // SOCKETS
        // this.socket.on('job', ({job}) => {
        //     jobView.renderJobNotification(job);
        // });
        // this.socket.on('response', (res) => {
        //     chatView.addChatResponse(res.message, false);
        // })

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
                    this.state.featuredJobs = res.data.jobs;
                    
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
                                        .then(response => {
                                            if(response.data.job) {
                                                this.state.currentJob = response.data.job;
                                                // Filter out the current job from the featured array passed to the details view
                                                this.state.featuredJobsAside = this.state.featuredJobs.filter(job => job.id !== response.data.job.id);
                                                jobView.renderJobDetails(response.data.job, document.body, this.state.featuredJobsAside, e);

                                                // Add btn listeners
                                                // this.addJobDetailsBtnListeners();
                                            }
                                        })
                                        .catch(err => console.log(err));
                                } else if(applyBtn) {
                                    this.renderApplyForm(card.dataset.id); 
                                }
                            });
                        });
            })
            .catch(err => {
                console.log(err);
            });
    }

    swapJobs(e) {
        const viewMoreBtn = e.target.closest('.job-card__view-btn--details');

        const jobId = viewMoreBtn.parentElement.parentElement.parentElement.dataset.id;
        const job = this.state.featuredJobs.find(job => job.id === parseInt(jobId));
        const jobIndex = this.state.featuredJobsAside.findIndex(job => job.id === parseInt(jobId));

        // Pick a job that exists in the featured array, but isn't currently in the aside array
        const newJobIndex = this.state.featuredJobs.findIndex(job => !this.state.featuredJobsAside.includes(job) && job.id !== this.state.currentJob.id);
        // If no job can be found, pick the previously featured job
        const newJob = newJobIndex !== -1? this.state.featuredJobs[newJobIndex] : this.state.currentJob;

        // Remove the old job and add the job to the featured aside
        this.state.featuredJobsAside.splice(jobIndex, 1, newJob);

        this.state.currentJob = job;
        console.log(jobId, job, newJob)

        if(!jobView.getAnimationState())
            jobView.updateJobView(jobId, job, newJob);
    }

    // renderApplyForm(e) {
    //     // From the Job Details card or an aside
    //     const jobDetailsCard = e.target.closest('.job-details__table');
    //     const jobAsideCard = e.target.closest('.job-card--details');

    //     const jobId = jobDetailsCard? jobDetailsCard.dataset.id : jobAsideCard.dataset.id;

    //     console.log(jobId);

    //     applyView.renderApplyForm(jobId);
    // }
    renderApplyForm(id) {
        applyView.renderApplyForm(id);
        // Set a listener on the file picker that appears on the apply modal
        const filePicker = document.querySelector('.request__input--cv');
        filePicker.onchange = function() {
            const path = document.querySelector('.request__input-path');
            path.textContent = '';
            path.insertAdjacentHTML('afterbegin', `<div>${filePicker.value.replace("C:\\fakepath\\", "")}</div>`);
        }
    }


    // addJobDetailsBtnListeners() {
    //     const jobModal = document.querySelector('.job-details');

    //     jobModal.addEventListener('click', (e) => {

    //         if(viewMoreBtn) {
    //             const jobId = viewMoreBtn.parentElement.parentElement.parentElement.dataset.id;
    //             const job = this.state.featuredJobs.find(job => job.id === parseInt(jobId));
    //             const jobIndex = this.state.featuredJobsAside.findIndex(job => job.id === parseInt(jobId));

    //             // Pick a job that exists in the featured array, but isn't currently in the aside array
    //             const newJobIndex = this.state.featuredJobs.findIndex(job => !this.state.featuredJobsAside.includes(job) && job.id !== this.state.currentJob.id);
    //             // If no job can be found, pick the previously featured job
    //             const newJob = newJobIndex !== -1? this.state.featuredJobs[newJobIndex] : this.state.currentJob;

    //             // Remove the old job and add the job to the featured aside
    //             this.state.featuredJobsAside.splice(jobIndex, 1, newJob);

    //             this.state.currentJob = job;

    //             if(!jobView.getAnimationState())
    //                 jobView.updateJobView(jobId, job, newJob);
    //         }
    //     });
    // }
}

new IndexController();

