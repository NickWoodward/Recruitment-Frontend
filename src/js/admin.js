/* ASSETS */
import '../sass/common.scss';
import '../sass/admin.scss';
import '../assets/icons/alert-circled.svg';
import '../assets/icons/edit-solid.svg';
import '../assets/icons/delete-solid.svg';
import '../assets/icons/hubspot.svg';
import '../assets/icons/pin-ok.svg';
import '../assets/icons/pin-angle.svg';
import '../assets/icons/cross.svg';
import '../assets/icons/upload-np.svg';
import '../assets/icons/pdf.svg';
import '../assets/icons/doc.svg';
import '../assets/icons/save-np.svg';
import '../assets/icons/delete-np1.svg';
import '../assets/icons/edit-np1.svg';
import '../assets/icons/add.svg';
import '../assets/updated-icons/ios-minus-empty.svg';
import '../assets/updated-icons/ios-minus-outline.svg';
import '../assets/icons/success.svg';
import '../assets/icons/error.svg';
import '../assets/icons/copy.svg';
import '../assets/icons/applications.svg';
import '../assets/icons/search.svg';


import axios from 'axios';
import { gsap } from 'gsap';

import * as headerView from './views/headerView';
import * as adminView from './views/adminView';
import * as tableView from './views/tableView';
import * as summaryView from './views/summaryView';
import * as paginationView from './views/paginationView';
import * as userForm from './views/userForm';
import * as jobForm from './views/jobForm';
import * as jobView from './views/jobView';
import * as utils from './utils/utils';
import * as validator from './utils/validator';
import * as dummyData from './utils/dummyData';
import * as loader from './views/loader';
import * as modalView from './views/modalView';
import * as animation from './animations/adminAnimation';


import JobList from './models/JobList';
import UserModel from './models/User';
import Applications from './models/Applications';
import Companies from './models/Companies';
import Admin from './models/Admin';
import { cancelTokenSource } from './models/Admin';

import { elements, elementStrings } from './views/base';

class AdminController {
    constructor() {

        // JobList and UserModel return axios methods CRUD ops
        this.JobList = new JobList();
        this.UserModel = new UserModel();
        this.Applications = new Applications();
        this.Companies = new Companies();
        this.Admin = new Admin();

        this.jobTypes = Object.freeze({
            INTERIM: 'Interim',
            PERMANENT: 'Permanent'
        });
        this.jobPositions = Object.freeze({
            INHOUSE: 'In House',
            PRIVATE: 'Private Practice'
        });
        this.jobPqes = [1,2,3,4,5,6,7,8,9,10];

        this.state= {
            isActiveRequest: false,
            isActivePaginationAnimation: false,
            isActiveAnimation: false,
            companies: {
                companyNames: [],
                totalCompanies: 0,
                currentCompany: {},
                currentPage: 1,
                currentAddressIndex: 0,
                currentContactIndex: 0,
                activeTableArrow: null,
                searchOptions: {
                    index: 0,
                    limit: 6,
                    orderField: "id",
                    orderDirection: "ASC",
                    searchTerm: ''
                },

                // Nested sections pagination objects (similar to searchOption objects used for ajax requests)
                // Limits should be at least 1 (because one must be displayed)
                companyJobsPagination: {
                    currentPage: 1,
                    index: 0, 
                    limit: 1, 
                    totalJobs: 0,
                },
                companyContactsPagination: {
                    currentPage: 1,
                    index: 0,
                    limit: 1,
                    totalContacts: 0
                },
                companyAddressesPagination: {
                    currentPage: 1,
                    index: 0,
                    limit: 1,
                    totalAddresses: 0
                },
                paginatedJobs: []

            },
            jobs: {
                totalJobs: 0,
                currentJob: {},
                currentPage: 1,
                jobNames: [],
                activeTableArrow: null,
                searchOptions: {
                    index: 0,
                    limit: 6,
                    titles: [],
                    locations: [],
                    orderField: "id",
                    orderDirection: "DESC",
                    searchTerm: ''
                }
            },
            users: {
                totalUsers: 0,
                currentUser: {},
                currentPage: 1,
                applicantNames: [],
                activeTableArrow: null,
                searchOptions: {
                    index: 0,
                    limit: 6,
                    orderField: "createdAt",
                    orderDirection: "DESC"
                },
                userJobsPagination: {
                    currentPage: 1,
                    limit: 0,
                    index: 0,
                    totalJobs: 0
                },
                companyAddressesPagination: {
                    currentPage: 1,
                    index: 0,
                    limit: 0,
                    totalAddresses: 0
                },
                paginatedJobs: []
            },
            applications: {
                totalApplications: 0,
                currentApplication: {},
                currentPage: 1,
                activeTableArrow: null,
                searchOptions: {
                    index: 0,
                    limit: 6,
                    orderField: "id",
                    orderDirection: "DESC",
                    searchTerm: ''
                }
            },
            jobsTable: {
                index: 0
            }
        }

        
        // initSocket();

        this.handleCtrlQ = async (e) => {  
            let key;
            if (e.key === 'q' && e.ctrlKey) {
                key = e.key;
        
                const company = await dummyData.createCompany();
                const inputs = document.querySelectorAll('div[class$="item--editable"]');
                dummyData.insertData(inputs, company);
            }
        }
        this.handleCtrl1 = async (e) => {
            let key;
            if (e.key === '1' && e.ctrlKey) {
                key = e.key;
        
                await dummyData.createJob('new', this.state.jobs.totalCompanies);
            }
        }
        this.addEventListeners();
    }

    addEventListeners() {
        // ONLOAD
        window.addEventListener('DOMContentLoaded', async e => {
            utils.pageFadeIn();
            // Render Header
            headerView.renderHeader("admin");

            // // On first load get jobs and users for the application page (to allow adding new applications)
            // const { data: { names } } =  await this.Admin.getJobNames();
            //  this.state.jobs.jobNames = names;

            // const jobsResponse = await this.Admin.getJobs(this.state.jobs.searchOptions);
            // this.jobs = jobsResponse.data.jobs;

            // const usersResponse = await this.Admin.getUsers(this.state.users.searchOptions);
            // this.users = usersResponse.data.applicants;

            // adminView.initialiseAdminPage('jobs');

            // // Calculate # of rows to render
            // this.state.jobs.searchOptions.limit = adminView.calculateRows('jobs');

            // this.Admin.getJobs(this.state.jobs.searchOptions)
            //     .then(res => {
            //         this.jobs = res.data.jobs;
            //         this.state.jobs.totalJobs = res.data.total;
                    
            //         this.renderJobsTable();
            //         if(this.jobs.length > 0) {
            //             adminView.populateJobSummary(this.jobs[0]);
            //             this.addJobSummaryListeners();
            //             // adminView.addTableListeners('jobs');
            //         } else {
            //             // @TODO: Render placeholder
                        
            //         }
            //     })
            //     .catch(err => console.log(err));

            // this.Admin.getCompanies().then(res => {
            //     this.companies = res.data.companies;
            // }).catch(err => console.log(err));
        });

        // // Handle editable elements when a user clicks elsewhere
        // document.body.addEventListener('mousedown', (e) => {
                        
        //     if(this.editUserLostFocus(e)) {
        //         console.log('edit user lost focus');
        //         const userSummary = document.querySelector('.user-summary');

        //         adminView.makeEditable(document.querySelectorAll('.user-summary__item'), false);

        //         // Remove input listeners
        //         userSummary.removeEventListener('focusin', adminView.focusInEditUserHandler);
        //         userSummary.removeEventListener('focusout', this.boundFocusOutEditUserHandler);

        //         adminView.changeEditIcon('edit', 'user');
        //         adminView.addCvElement(this.state.users.currentUser);
        //     }
        //     if(this.createUserLostFocus(e)) {
        //         const userSummary = document.querySelector('.user-summary');
        //         const items = document.querySelectorAll('.user-summary__item');
        //         console.log('create user lost focus');
        //         adminView.makeEditable(items, false);

        //         // Remove the item listeners
        //         userSummary.removeEventListener('focusin', adminView.focusInNewUserHandler);
        //         userSummary.removeEventListener('focusout', adminView.focusOutNewUserHandler);

        //         // Add the original user values
        //         adminView.populateUserSummary(this.state.users.currentUser);

        //         adminView.changeNewIcon('new', 'user');
        //         adminView.addCvElement(this.state.users.currentUser);
        //     }
        //     if(this.editJobLostFocus(e)) {
        //         console.log('edit jobs lost focus');

        //         const jobSummary = document.querySelector('.job-summary');
        //         // Remove element listeners
        //         jobSummary.removeEventListener('focusin', adminView.focusInEditJobHandler);
        //         jobSummary.removeEventListener('focusout', adminView.focusOutEditJobHandler);
        //         document.removeEventListener('keydown', this.handleCtrl1);

        //         adminView.makeJobSummaryEditable(false, this.state.companies.currentCompany.featured);
        //         adminView.removeJobDropdowns(this.state.jobs.currentJob);
        //         adminView.changeSummaryIconState('edited', 'job');

        //         adminView.populateJobSummary(this.state.jobs.currentJob);

            
        //     }
        //     if(this.createJobLostFocus(e)) {
        //         console.log('create jobs lost focus');

        //         const jobSummary = document.querySelector('.job-summary');

        //         // Remove element listeners
        //         document.body.removeEventListener('keydown', this.handleCtrlQ);
        //         jobSummary.removeEventListener('focusin', adminView.focusInNewJobHandler);
        //         jobSummary.removeEventListener('focusout', adminView.focusOutNewJobHandler);
                
        //         // Remove the dropdown + replace with company div
        //         adminView.removeCompanyDropdown(this.state.jobs.currentJob.companyName);
        //         adminView.removeJobDropdowns(this.state.jobs.currentJob);
        //         adminView.populateJobSummary(this.state.jobs.currentJob);

        //         adminView.makeJobSummaryEditable(false, this.state.companies.currentCompany.featured);

        //         adminView.changeSummaryIconState('created', 'job');
        //     }
        //     if(this.createCompanyLostFocus(e)) {
        //         console.log('create company lost focus');

        //         const summaryWrapper = document.querySelector('.summary-wrapper');
        //         const companyItems = document.querySelectorAll('.company-summary__item');
        //         const contactItems = document.querySelectorAll('.contact-summary__item');

        //         adminView.makeEditable(companyItems, false);
        //         adminView.makeEditable(contactItems, false);

        //         // Remove the item listeners
        //         summaryWrapper.removeEventListener('focusin', adminView.focusInNewCompanyHandler);
        //         summaryWrapper.removeEventListener('focusout', adminView.focusOutNewCompanyHandler);

        //         // Add the original user values
        //         adminView.populateCompanySummary(this.state.companies.currentCompany);
        //         adminView.populateContactSummary(this.state.companies.currentCompany, this.state.companies.currentCompany.people[0]);
        //         adminView.makeAddressEditable(false, 'value', this.state.companies.currentCompany.addresses[0]);

        //         adminView.changeSummaryIconState('created', 'company');
        //     }
        //     if(this.editCompanyLostFocus(e)) {
        //         console.log('edit company lost focus');
        //         document.body.removeEventListener('keydown', this.handleCtrlQ);

        //         const summaryWrapper = document.querySelector('.summary-wrapper');
        //         const companyItems = document.querySelectorAll('.company-summary__item');
        //         const contactItems = document.querySelectorAll('.contact-summary__item');

        //         adminView.makeEditable(companyItems, false);
        //         adminView.makeEditable(contactItems, false);

        //         // Remove the item listeners
        //         summaryWrapper.removeEventListener('focusin', adminView.focusInNewCompanyHandler);
        //         summaryWrapper.removeEventListener('focusout', adminView.focusOutNewCompanyHandler);
        //         // Add the original user values
        //         adminView.populateCompanySummary(this.state.companies.currentCompany);
        //         adminView.populateContactSummary(this.state.companies.currentCompany, this.state.companies.currentCompany.people[0]);

        //         adminView.makeAddressEditable(false, 'value', this.state.companies.currentCompany.addresses[0]);

        //         adminView.changeSummaryIconState('edited', 'company');    

        //     }

        // })

        // MODALS
        document.body.addEventListener('click', this.checkModals.bind(this));

        // elements.adminSidebar.addEventListener('click', async(e) => {
        //     const applications = e.target.closest('.sidebar__item--applications');
        //     const jobs = e.target.closest('.sidebar__item--jobs');
        //     const companies = e.target.closest('.sidebar__item--companies');
        //     const users = e.target.closest('.sidebar__item--users');
        //     const settings = e.target.closest('.sidebar__item--settings');
            
        //     adminView.changeActiveMenuItem(e); 

        //     // If there's an active request, cancel it
        //     if(this.state.isActiveRequest) { 
        //         cancelTokenSource();
        //         this.state.isActiveRequest = false;
        //     }

        //     if(jobs && !document.querySelector('.admin__content--jobs')) {
        //         // Clear admin page / rename content class / render placeholders
        //         adminView.initialiseAdminPage('jobs');
        //         // Calculate # of rows to render / api limit
        //         this.state.companies.searchOptions.limit = adminView.calculateRows('jobs');

        //         // Jobs data initially loaded on DOMLoaded (+company data for editing)
        //         this.renderJobsTable();

        //         if(this.jobs.length > 0) {
        //             adminView.populateJobSummary(this.jobs[0]); 
        //             this.addJobSummaryListeners();
        //         } else { 
        //             // @TODO Placeholder for no jobs
        //         }
        //     }
        //     if(users && !document.querySelector('.admin__content--users')) {
        //         this.state.isActiveRequest = true;
        //         // Clear admin page / rename content class / render placeholders
        //         adminView.initialiseAdminPage('users');

        //         // Calculate # of rows to render / api limit
        //         this.state.users.searchOptions.limit = adminView.calculateRows('users');

        //         // Get User data
        //         try {
        //             const res = await this.Admin.getUsers(this.state.jobs.searchOptions);
        //             this.state.isActiveRequest = false;

        //             // Store and render data
        //             this.users = res.data.applicants;
        //             this.state.users.totalUsers = res.data.total;
                    
        //             this.renderUsersTable();
        //             if(this.users.length > 0) {
        //                 adminView.populateUserSummary(this.users[0]);
        //                 this.addUserSummaryListeners();
        //             } else {
        //                 // @TODO: Render placeholder
        //             }

        //         } catch(err) {
        //             this.state.isActiveRequest = false;
        //             if (axios.isCancel(err)) {
        //                 console.log('Request canceled', err.message);
        //             } else {
        //             // handle error
        //             console.log(err);
        //             }
        //         }       
        //     }
        //     if(applications) {


        //         // Clear admin page / rename content class / render placeholders
        //         adminView.initialiseAdminPage('applications');

        //         // Calculate # of rows to render / api limit
        //         this.state.applications.searchOptions.limit = adminView.calculateRows('applications');

        //         this.state.isActiveRequest = true;

        //         this.Admin
        //             .getApplications(this.state.applications.searchOptions)
        //             .then(res => {
        //                 this.state.isActiveRequest = false;
        //                 this.applications = res.data.applications.rows;
        //                 this.state.applications.totalApplications = res.data.applications.count;
        //                 this.renderApplicationTable();

        //                 adminView.populateApplicationSummary(this.applications[0]);
        //                 this.addApplicationSummaryListeners();
        //             })
        //             .catch(err => {
        //                 this.state.isActiveRequest = false;
        //                 if (axios.isCancel(err)) {
        //                     console.log('Request canceled', err.message);
        //                 } else {
        //                 // handle error
        //                 console.log(err);
        //                 }
        //             });
        //     }
        //     if(companies) {
        //         adminView.initialiseAdminPage('companies');

        //         // Calculate # of rows to render / api limit
        //         this.state.companies.searchOptions.limit = adminView.calculateRows('companies');

        //         this.state.isActiveRequest = true;
        //         this.Admin
        //             .getCompanies(this.state.companies.searchOptions)
        //             .then(res => {
        //                 this.state.isActiveRequest = false;
        //                 this.companies = res.data.companies;
        //                 this.state.companies.totalCompanies = res.data.total;
        //                 if(this.companies.length > 0) {
        //                     this.state.companies.currentCompany = this.companies[0];

        //                     this.renderCompaniesTable();
        //                     adminView.populateCompanySummary(this.companies[0]);

        //                     adminView.populateAddressSummary(this.companies[0].id, this.companies[0].addresses[0]);
        //                     adminView.populateContactSummary(this.companies[0].id, this.companies[0].people[0]);
        //                     this.addCompanySummaryListeners();
        //                 }
        //             }).catch(err => {
        //                 this.state.isActiveRequest = false;
        //                 if (axios.isCancel(err)) {
        //                     console.log('Request canceled', err.message);
        //                 } else {
        //                 // handle error
        //                 console.log(err);
        //                 }
        //             });
        //     }
        // });
        
        // MENU LISTENERS
        elements.adminSidebar.addEventListener('click', async(e) => {

            const applications = e.target.closest('.sidebar__item--applications');
            const jobs = e.target.closest('.sidebar__item--jobs');
            const companies = e.target.closest('.sidebar__item--companies');
            const users = e.target.closest('.sidebar__item--users');
            const settings = e.target.closest('.sidebar__item--settings');

            // Get the active item
            const currentItem = [applications, jobs, companies, users, settings].filter(item => {
                return item !== null;
            })[0];

            // If a sidebar item hasn't been clicked, return
            if(!currentItem) return;

            const itemName = currentItem.classList[1].substring(currentItem.classList[1].indexOf('--') + 2);
            this.displayAdminContent(itemName);
            adminView.changeActiveMenuItem(e.target.closest(elementStrings.adminMenuItem)); 
        });


        // PAGINATION CONTROLS
        document.body.addEventListener('click', this.handlePaginationEvent.bind(this));

            
    }

    async displayAdminContent(sectionName, indexId) {
        const tl = gsap.timeline({defaults: {duration: .4}});

        adminView.initAdminView(tl, sectionName);        

        try {
            // Index ID is only ever passed to getData from displayAdminContent
            // This sets the first element in the table, and is used to navigate to specific records from other admin summaries
            // EG: Clicking the application summary company href => company in the companies table
            tl.add(async () => {
                this.initAdminState(sectionName);

                await this.getData(sectionName, indexId);

                switch(sectionName) {
                    case 'applications': {
                        // Set current application
                        this.state.applications.currentApplication = this.applications[0];

                        // Init pagination
                        const { totalApplications, searchOptions: {index, limit} } = this.state.applications;
                        const pages = paginationView.getTotalPages(limit, totalApplications);
                        const page = paginationView.getCurrentPage(index, limit);
                        paginationView.initPagination(pages, page, 'applications');

                        // Render table
                        this.renderApplicationTable();

                        // Render summary
                        summaryView.insertNewApplicationSummary(this.applications[0]);

                        // Table and Summary animated in for the first time below this switch statement

                        // Add summary listeners
                        this.addApplicationSummaryListeners();

                        break;
                    }
                    case 'jobs': {
                        // Set current job
                        this.state.jobs.currentJob = this.jobs[0];

                        // Init pagination
                        const { totalJobs, searchOptions: {index, limit} } = this.state.jobs;
                        const pages = paginationView.getTotalPages(limit, totalJobs);
                        const page = paginationView.getCurrentPage(index, limit);
                        paginationView.initPagination(pages, page, 'jobs');

                        // Render table
                        this.renderJobsTable();

                        // Render summary
                        summaryView.insertNewJobSummary(this.jobs[0]);

                        // Table and Summary animated in for the first time below this switch statement

                        // Add summary listeners
                        this.addJobsSummaryListeners();
                        break;
                    }
                    case 'companies': {
                        this.state.companies.currentCompany = this.companies[0];
                        this.resetNestedCompanyState();

                    //// Main Company Table ////

                        // Render table 
                        this.renderCompaniesTable();

                        // Table and Summary animated in for the first time below this switch statement

                        // Add pagination for the company table
                        const { totalCompanies, searchOptions: {index, limit} } = this.state.companies;

                        const pages = paginationView.getTotalPages(limit, totalCompanies);
                        const page = paginationView.getCurrentPage(index, limit);
                        paginationView.initPagination(pages, page, 'companies');

                    //// End

                    //// Company Summary /////

                        // Add summary
                        summaryView.insertNewCompanySummary(this.companies[0]);

                        // Set the pagination state (This does to the company jobs array what limit and offset do in the api call)
                        this.initCompanyJobsState();

                        // // Add pagination for nested contacts, addresses, and jobs elements
                        this.addCompanyNestedPagination();

                        // Render the summary company jobs table
                        this.renderCompanyJobsTable();  

                        if(this.state.companies.paginatedJobs.length === 0) {
                            // render a placeholder saying 'no jobs'
                            document.querySelector('.table__content--company-jobs')
                            .insertAdjacentHTML('beforeend', adminView.createNoJobsPlaceholder());
                            // Animate the placeholder in
                            animation.animateTablePlaceholderIn(document.querySelector('.company-jobs-placeholder'));   

                        } 

                        this.addCompanySummaryListeners();

                        break;
                    }

                    case 'users': 
                        this.state.users.currentUser = this.users[0];
                        // Render table
                        this.renderUsersTable();

                        // Add pagination
                        const { totalUsers, searchOptions: {index: userIndex, limit: userLimit} } = this.state.users;
                        const { pages: numUserPages, current: currentUserPage } = adminView.calculatePagination(userIndex, userLimit, totalUsers);
                        adminView.renderPagination(numUserPages, currentUserPage, document.querySelector('.table-wrapper'), 'users');
                        // Add summary
                        const userSummary = adminView.createUserSummary(this.users[0]);

                        document.querySelector('.summary-wrapper').insertAdjacentHTML('afterbegin', userSummary);
                        
                        
                        // This paginates the results locally, much as the API call to getUsers does using limit and index
                        this.setUserJobsState();

                        // Render the summary user jobs table
                        if(this.state.users.paginatedJobs.length > 0) {
                            // remove any placeholders
                            const placeholder = document.querySelector('.user-jobs-placeholder');
                            if(placeholder) placeholder.parentElement.removeChild(placeholder);

                            this.renderUserJobsTable();
                        } else {
                            // render a placeholder saying 'no jobs'
                            // this shouldn't be needed, but is a safety net
                            document.querySelector('.table-wrapper--nested-user-jobs')
                                .insertAdjacentHTML('afterbegin', adminView.generateUserJobsPlaceholder());
                        } 
                        // Add pagination for nested contacts, addresses, and jobs elements
                        this.addUserNestedPagination();

                        // this.addCompanySummaryListeners();
                        break;
                }

                // Remove loaders
                const nestedTl = gsap.timeline();
                // nestedTl.to('.loader', {autoAlpha: 0, duration: .2, onComplete: () => loader.clearLoaders()});
                nestedTl.add(animation.animateAdminLoadersOut());

                // Animate summaries and tables in for the first time (different to switching)
                if(sectionName === 'companies') {
                    nestedTl.add(animation.animateSummaryIn(true), '<');
                    nestedTl.add(animation.animateTableContentIn('companies'), '<')                
                } else if(sectionName === 'applications') {
                    nestedTl.add(animation.animateSummaryIn(true), '<');
                    nestedTl.add(animation.animateTableContentIn('applications'), '<');
                } else if(sectionName === 'jobs') {
                    nestedTl.add(animation.animateSummaryIn(true), '<');
                    nestedTl.add(animation.animateTableContentIn('jobs'), '<')
                }

                // Animate the pagination in
                // nestedTl.fromTo('.pagination', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .6 }, '>');
            });

            // Request and store 
        } catch(err) {
            console.log(err);
        }









        

        // if(itemName === 'applications') {

        //     // Create and add a template to adminMain
        //     tl
        //       .add(() => {
        //         adminMain.appendChild(adminTemplate);

        //         // Add Loaders to the summaryWrapper and tableWrapper
        //         loader.renderLoader({
        //             parent: document.querySelector('.table-wrapper'),
        //             type: 'admin-table',
        //             inFlow: false
        //         });
        //         loader.renderLoader({
        //             parent: document.querySelector('.summary-wrapper'),
        //             type: 'admin-summary',
        //             inFlow: false
        //         });
        //       })
        //       .to(adminMain, {autoAlpha:1});
        // } else if(itemName === 'jobs') {
        //     // Create and add a template to adminMain
        //     tl
        //     .add(() => {
        //         adminMain.appendChild(adminTemplate);

        //         // Add Loaders to the summaryWrapper and tableWrapper
        //         loader.renderLoader({
        //             parent: document.querySelector('.table-wrapper'),
        //             type: 'admin-table',
        //             inFlow: false
        //         });
        //         loader.renderLoader({
        //             parent: document.querySelector('.summary-wrapper'),
        //             type: 'admin-summary',
        //             inFlow: false
        //         });
        //     })
        //     .to(adminMain, {autoAlpha: 1});
        // }

        // // Animate the previous content out, alter the contents, then pause the animation until the response has been received
        // tl
        // .to(adminMain, { autoAlpha: 0 })
        // .add(() => {
        //     adminView.clearAdminPage();

        //     // Add a template to the main page
        //     adminTemplate = adminView.createAdminTemplate('applications');
        //     adminMain.appendChild(adminTemplate);
        //     adminTable = document.querySelector('.applications-table__wrapper');
        //     adminSummary = document.querySelector('.summary-wrapper');

        //     // Add a loader to the table wrapper
        //     loader.renderLoader(
        //         adminTable,
        //         'admin-table',
        //         'afterbegin',
        //         false
        //     );
        //     // Add a loader to the summary wrapper
        //     loader.renderLoader(
        //         adminSummary,
        //         'admin-summary',
        //         'afterbegin',
        //         false
        //     );
        // })
        // .to(adminMain, {autoAlpha: 1})
        // .pause();
        
        // // Play the first part of the animation
        // tl.play();


        // if(itemName === 'applications') {
        //     console.log('ha');
        
        //     setTimeout(async()=>{
        //         this.state.applications.searchOptions.limit = adminView.calculateRows('applications');
    
        //         // Set active request flag to true
        //         this.state.isActiveRequest = true;
    
        //         try {
        //             // Request and store application data
        //             const { data: { applications: { rows, count } } } = await this.Admin.getApplications(this.state.applications.searchOptions);
        //             this.applications = rows;
        //             this.state.applications.totalApplications = count;
    
        //             // Change active request flag to false
        //             this.state.isActiveRequest = false;
    
        //             tl
        //             .to(adminMain, {autoAlpha: 0})
        //             .add(() => {
        //                 loader.clearLoaders();

        //                 this.renderApplicationTable();

        //                 // Add pagination
        //                 const { totalApplications, searchOptions: {index, limit} } = this.state.applications;
        //                 adminView.renderPagination(index, limit, totalApplications, document.querySelector('.applications-table__wrapper'), 'applications');

        //                 const applicationSummary = adminView.createApplicationSummary(this.applications[0]);
        //                 adminSummary.insertAdjacentHTML('afterbegin', applicationSummary);
            
        //             })
        //             .to(adminMain, { autoAlpha: 1 });
    
        //             tl.play();
                
    
    
        //         //    adminView.populateApplicationSummary(this.applications[0]);
        //         //    this.addApplicationSummaryListeners();
    
        //         } catch(err) {
        //             this.state.isActiveRequest = false;
        //             if (axios.isCancel(err)) {
        //                 console.log('Request canceled', err.message);
        //             } else {
        //                 // handle error
        //                 console.log(err);
        //             }
        //         }
        //     },200);
        // }














        
        
    //     if(applications) {
            
    //     setTimeout(async()=>{
    //         this.state.applications.searchOptions.limit = adminView.calculateRows('applications');

    //         // Set active request flag to true
    //         this.state.isActiveRequest = true;

    //         try {
    //            // Request and store application data
    //            const { data: { applications: { rows, count } } } = await this.Admin.getApplications(this.state.applications.searchOptions);
    //            this.applications = rows;
    //            this.state.applications.totalApplications = count;

    //             // Change active request flag to false
    //             this.state.isActiveRequest = false;

    //             tl
    //             .to(adminMain, {autoAlpha: 0})
    //             .add(() => {
    //                 loader.clearLoader();
    //                 this.renderApplicationTable();
    //                 const applicationSummary = adminView.createApplicationSummary(this.applications[0]);
    //                 newContent.insertAdjacentHTML('afterbegin', applicationSummary);
        
    //             })
    //             .to(adminMain, { autoAlpha: 1 });

    //             tl.play();
         


    //         //    adminView.populateApplicationSummary(this.applications[0]);
    //         //    this.addApplicationSummaryListeners();

    //         } catch(err) {
    //             this.state.isActiveRequest = false;
    //             if (axios.isCancel(err)) {
    //                 console.log('Request canceled', err.message);
    //             } else {
    //                 // handle error
    //                 console.log(err);
    //             }
    //         }
    //     },1000);
        
    }

    initAdminState(sectionName) {
        switch(sectionName) {
            case 'applications': {
                // Reset the subpage search options / state before async call
                this.state.applications.currentPage = 1;
                this.state.applications.searchOptions.index = 0;
                this.state.applications.searchOptions.searchTerm = '';
                this.state.applications.searchOptions.orderDirection = 'ASC';
                this.state.applications.searchOptions.orderField = 'id';
                this.state.applications.activeTableArrow = null;

                // Calculate the # of rows that can fit in the table
                this.state.applications.searchOptions.limit = tableView.calculateRows(sectionName);
            }
            case 'companies': {
                // Reset the subpage search options / state before async call
                this.state.companies.currentPage = 1;
                this.state.companies.searchOptions.index = 0;
                this.state.companies.searchOptions.searchTerm = '';
                this.state.companies.searchOptions.orderDirection = 'ASC';
                this.state.companies.searchOptions.orderField = 'id';
                this.state.companies.activeTableArrow = null;

                // Calculate the # of rows that can fit in the table
                this.state.companies.searchOptions.limit = tableView.calculateRows(sectionName);
            }
            case 'jobs': {
                this.state.jobs.currentPage = 1;
                this.state.jobs.searchOptions.index = 0;
                this.state.jobs.searchOptions.searchTerm = '';
                this.state.jobs.searchOptions.orderDirection = 'ASC';
                this.state.jobs.searchOptions.orderField = 'id';
                this.state.jobs.activeTableArrow = null;

                // // Calculate the # of rows that can fit in the table
                this.state.jobs.searchOptions.limit = tableView.calculateRows(sectionName)

            }
            case 'applications': {
                // Calculate the # of rows that can fit in the table
                this.state.applications.searchOptions.limit = tableView.calculateRows(sectionName)
            }
            case 'users': {
                // Calculate the # of rows that can fit in the table
                this.state.users.searchOptions.limit = tableView.calculateRows(sectionName)

            }
        }
    } 

    addCompanyNestedPagination() {
        //// Nested Company Jobs table

        // Paginate companyJobs array
        const { totalJobs, index: jobsIndex, limit: jobsLimit } = this.state.companies.companyJobsPagination;
   
        // const jobsPagination = paginationView.calculatePagination(jobsIndex, jobsLimit, totalJobs);
        const currentJobsPage = paginationView.getCurrentPage(jobsIndex, jobsLimit);
        const jobsPages = paginationView.getTotalPages(jobsLimit, totalJobs);

        paginationView.initPagination(jobsPages, currentJobsPage, 'company-jobs');

        //// Nested Contacts pagination
        this.state.companies.companyContactsPagination.totalContacts = this.state.companies.currentCompany.contacts.length;
        const { totalContacts, index: contactIndex } = this.state.companies.companyContactsPagination;

        // No need to calculate contact pagination - displayed 1 at a time, so number of pages = contacts.length
        paginationView.initPagination(totalContacts, contactIndex + 1, 'company-contacts');

        //// Nested Addresses pagination
        this.state.companies.companyAddressesPagination.totalAddresses = this.state.companies.currentCompany.addresses.length;
        const { totalAddresses, index: addressIndex } = this.state.companies.companyAddressesPagination;
    
        // No need to calculate address pagination - displayed 1 at a time, so number of pages = address.length
        paginationView.initPagination(totalAddresses, addressIndex + 1, 'company-addresses');
    }

    addUserNestedPagination() {
        // Paginate userJobs array
        const { totalJobs, index: jobIndex, limit: jobLimit } = this.state.users.userJobsPagination;
        const { pages, current } = adminView.calculatePagination(jobIndex, jobLimit, totalJobs);
        // Render the userJobs pagination
        adminView.renderPagination(pages, current, document.querySelector('.table-wrapper--nested-user-jobs'), 'nested-user-jobs');

        //// Nested Addresses pagination
        // Displayed 1 at a time
        this.state.users.addressesPagination.totalAddresses = this.state.users.currentUser.addresses.length;
        const { totalAddresses, index: addressIndex } = this.state.users.addressesPagination;

        // No need to calculate contact pagination - displayed 1 at a time, so number of pages = contacts.length
        adminView.renderPagination(totalAddresses, addressIndex, document.querySelector('.pagination-wrapper--addresses'), 'addresses');
    }

    getNumOfRows(sectionName) {
        switch(sectionName) {
            case 'applications': 
                this.state.applications.searchOptions.limit = adminView.calculateRows(sectionName, true,false);
                break;
            case 'jobs': 
                this.state.jobs.searchOptions.limit = adminView.calculateRows(sectionName, true, false);
                break;
            case 'companies': 
                this.state.companies.searchOptions.limit = adminView.calculateRows(sectionName, true, false);
                break;
            case 'users':
                this.state.users.searchOptions.limit = adminView.calculateRows(sectionName, true, false);
                break;
            case 'company-jobs':
                this.state.companies.companyJobsPagination.limit = adminView.calculateRows(sectionName, true, false);
                break;
            case 'nested-user-jobs':
                this.state.users.userJobsPagination.jobLimit = adminView.calculateRows(sectionName, true, true);
        }
    }

    async getData(sectionName, indexId) {
        switch(sectionName) {
            case 'applications':
                const { data: { applications: { rows: appRows, count: appCount } } } = await this.Admin.getApplications(this.state.applications.searchOptions, indexId);
                this.applications = appRows;

                this.state.applications.totalApplications = appCount;
                break;
            case 'jobs':
                const { data: { jobs, total } } = await this.Admin.getJobs(this.state.jobs.searchOptions, indexId);
                this.jobs = jobs;
                this.state.jobs.totalJobs = total;
                break;
            case 'companies':
                const { data: { companies, companyTotal } } = await this.Admin.getCompanies(this.state.companies.searchOptions, indexId);
                this.companies = companies;
                this.state.companies.totalCompanies = companyTotal;

                break;
            case 'users':
                const { data: { applicants, applicantTotal } } = await this.Admin.getUsers(this.state.users.searchOptions, indexId);
                this.users = applicants;
                this.state.users.totalUsers = applicantTotal;
                break;
        }
    }

    // downloadCv(e) {
    //     const cvUrl = e.target.closest('.cv-wrapper').dataset.cvurl;
        
    //     // const cvUrl = e.target.closest('.cv-btn--table').dataset.cvurl;
    //     if(cvUrl !== 'null')
    //         this.Admin.getCv(cvUrl).then((res) => {
    //             const contentDisposition = res.headers['content-disposition'];
    //             let fileName = contentDisposition.split(';')[1].split('=')[1].toString();
    //             adminView.forceDownload(res, fileName);
    //         }).catch(err => console.log(err)); 
    // }

    checkModals(e) {
        const modal = e.target.closest('.modal');
        if(modal) {
            // Create User Modal Clicked
            e.preventDefault();

            if(e.target.closest('.user-form')) {
                switch(userForm.getAction(e)) {
                    case 'cancel':  modal.parentElement.removeChild(modal); break;                
                                    // The element Id is passed from the row to the modal button when rendered
                    case 'edit':    this.editUserAndUpdate(e.target.dataset.id); 
                                    // @TODO: validation might have to be done in the above method
                                    modal.parentElement.removeChild(modal);

                                    break;
                    case 'create':  this.createUserAndUpdate();
                                    modal.parentElement.removeChild(modal);
                                    break;
                }
            // Create Job Modal Clicked 
            } else if(e.target.closest('.job-form')) {
                
                switch(jobForm.getAction(e)) {
                    case 'cancel': modal.parentElement.removeChild(modal); break;
                    case 'edit':    this.editJobAndUpdate(e.target.dataset.id); 
                                    modal.parentElement.removeChild(modal);
                                    break;
                    case 'create':  this.createJobAndUpdate(); 
                                    modal.parentElement.removeChild(modal);
                                    break;
                }
            } else if(e.target.closest('.modal--warn')) {
                switch(adminView.getAction(e)) {
                    case 'cancel':      modal.parentElement.removeChild(modal); break;
                                        // The element Id is passed from the row to the modal button when rendered
                    case 'deleteUser':  this.deleteUserAndUpdate(e.target.dataset.id); 
                                        modal.parentElement.removeChild(modal);
                                        break;
                    case 'deleteJob':   this.deleteJobAndUpdate(e.target.dataset.id);
                                        modal.parentElement.removeChild(modal);
                                        break;
                    case 'addUser':     modal.parentElement.removeChild(modal); 
                                        this.addHubspotUser(e.target.dataset.id); break;
                }
            } else if(e.target.closest('.job-details')){
                switch(jobView.getAction(e)) {
                    case 'apply': console.log('apply'); break;
                    case 'cancel': utils.removeElement(modal); break;
                }
            }
        }
    }

    addHubspotUser(id) {
        this.JobList.addHubspotUser(id).then(res => console.log(res)).catch(err => console.log(err));
    }

    createJobAndUpdate() {
        const job = jobForm.getFormData();
        this.JobList
            .createJob(job)
            .then(res => {
                if(res.status === 201) {
                    // Update job list
                    this.jobs.unshift(res.data.job);
                    // Clear the table
                    utils.clearElement(elements.adminContent);
                    // Re-render the table
                    this.renderJobsTable();
                    // Re-add listeners
                    // adminView.addTableListeners('jobs');
                }
                // @TODO: display the validation response
            }).catch(err => {
                console.log(err)
            });
    }

    deleteJobAndUpdate(id) {
        this.JobList
            .deleteJob(id)
            .then(res => {
                if(res.status === 200) {
                    return this.JobList.getJobs(this.state.jobs.searchOptions)
                }
            })
            .then(res => {
                if(res) {
                    this.jobs = res.data.jobs.map(({featured, id, title, wage, location, description, createdAt}) => ({featured, id, title, wage, location, description, createdAt}));
                    // Clear table
                    utils.clearElement(elements.adminContent);
                    // Render table
                    this.renderJobsTable();
                    // Re-add table listeners
                    // adminView.addTableListeners('jobs'); 
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    editJobAndUpdate(id) {
        const job = jobForm.getFormData();
        this.JobList
            .editJob(id, job)
            .then(res => {
                if(res.status === 200) {
                    // Update the job record
                    this.jobs.forEach(job => {
                        if(job.id === parseInt(res.data.job.id)) {
                            job.title = res.data.job.title;
                            job.wage = res.data.job.wage;
                            job.location = res.data.job.location;
                            job.description = res.data.job.description;
                        }
                    });
                    // Clear the job table
                    utils.clearElement(elements.adminContent);
                    // Render job table
                    this.renderJobsTable();
                    // Re-add table listeners 
                    // adminView.addTableListeners('jobs');
                }
                // @TODO: add validation response
            })
            .catch(err => {
                console.log(err);
            });
    }

    deleteUserAndUpdate(id) {
        this.UserModel
            .deleteUser(id)
            .then(res => {
                // Clear the table wrapper
                utils.clearElement(elements.adminContent);
                return this.UserModel.getUsers();
            })
            .then(res => {
                if(res.data.users) {
                    // Update the users array
                    this.users = res.data.users;
                    // Rerender the table
                    this.renderUsersTable();
                    // Re-add table listeners
                    // adminView.addTableListeners('users');
                }   // @TODO: add a placeholder image for no users
            })
            .catch(err => console.log(err));
    }

    // @TODO: Not used?
    editUserAndUpdate(id) {
        // Get data from modal
        const { fname, lname, email, phone } = userForm.getFormData('edit');
        this.UserModel
            .editUser(id, fname, lname, email, phone)
            .then(res => {
                if(res.status === 200) {
                    // Update the user in the user array
                    this.users.forEach(user => {
                        if(user.id == parseInt(id)) {
                            user.firstName = fname;
                            user.lastName = lname;
                            user.email = email;
                            user.phone = phone;
                        }
                    });
                    // Clear the table wrapper
                    utils.clearElement(elements.adminContent);
                    // Rerender the table
                    this.renderUsersTable();
                    // Re-add listeners
                    // adminView.addTableListeners('users');

                }
                // @TODO validation
            })
            .catch(err => {
                console.log(err);
            });
    }

    createUserAndUpdate() {
        const { fname, lname, email, phone, password, confirm } = userForm.getFormData('create');
        this.UserModel
            .createUser( fname, lname, email, phone, password, confirm )
            .then(res => {
                if(res.status === 201) {
                    const user = res.data.user;
                    // Add the new user 
                    this.users.push(user);
                    // Clear the table
                    utils.clearElement(elements.adminContent);
                    // Rerender table
                    this.renderUsersTable();
                    // Re-add listeners
                    // adminView.addTableListeners('users');
                }
            })
            .catch(err => console.log(err));
    }

    getJobs() {
        return this.JobList.getJobs(this.state.jobs.searchOptions);
    }

    getUsers() {
        return this.UserModel.getUsers(this.state.users.searchOptions);
    }

    getApplications(){
        return this.Admin.getApplications(this.state.applications.searchOptions);
    }

    // renderApplicationsContent() {
    //     // Already on the applications page, return
    //     if(document.querySelector('.admin__content--applications')) return;

    //     // Remove existing content
    //     utils.clearElement(elements.adminContent);

    //     // Replace existing classname
    //     elements.adminContent.className = "admin__content admin__content--applications";

    //     // Create table contents
    //     const {headers, rows} = adminView.formatApplications(this.applications);

    //     adminView.renderContent([ 
    //             tableView.createTableTest('applications', headers, rows, false),
    //         ],  elements.adminContent
    //     );
    // }

    renderApplicationTable() {
  
        // Format applications/headers into html elements
        const {headers, rows} = adminView.formatApplications(this.applications);

        const table = document.querySelector('.table--applications');
        const tableContent = document.querySelector('.table__content--applications');

       // If no table visible, render both the header and content
        if(!table) { 
            console.log('No Table')
            // Heading content added here to animate at the same time as the data comes in
            const headerContent = `<div class="table__heading">Applications</div>`;
            document.querySelector('.table__header').insertAdjacentHTML('afterbegin', headerContent);
            const newTable = tableView.createTableTest('applications', headers, rows, false);
            tableContent.insertAdjacentHTML('afterbegin',newTable);

            // Insert order arrows
            tableView.insertTableArrows('applications', this.state.applications);

            const thead = document.querySelector('.thead--applications');
            thead.addEventListener('click', async e => {
                // Get the header
                const header = e.target.closest('th');
                if(!header) return;

                this.state.applications.currentPage = 1;

                // Change the table arrow direction, the searchOption direction
                tableView.updateTableOrder(header, this.state.applications, 'applications');

                this.handleApplicationsPagination(this.state.applications.currentPage, null, null);
            });

            // Else remove the tbody and render just the content
        } else {
            console.log('update table');
            utils.removeElement(document.querySelector('tbody'));
            document.querySelector('thead').insertAdjacentHTML('afterend', tableView.updateTableContent('applications', rows));

        }

        // //@TODO: why is this animated here?
        // if(!document.querySelector('.pagination__content')){
        //     paginationView.animatePaginationContentIn('applications');
        // }

        const applicationRows = document.querySelectorAll('.row--applications');
       
        const activeRow = Array.from(applicationRows).find(row => row.querySelector(`[data-id="${this.state.applications.currentApplication.applicationId}"]`)) || applicationRows[0];

        utils.changeActiveRow(activeRow, applicationRows);

        applicationRows.forEach(row => {
            row.addEventListener('click', (e) => {
                const tl = gsap.timeline({ paused: true });

                // // Remove any modals if present
                // if(document.querySelector('.summary__modal')) tl.add(gsap.to('.summary__modal', { autoAlpha: 0, onComplete: () => adminView.removeSummaryModals() }), '<')
                // if(document.querySelector('.confirmation')) tl.add(gsap.to('.confirmation', { autoAlpha: 0, onComplete: () => adminView.removeSummaryModals() }), '<');
        
                tl.add(animation.animateSummaryOut());
                tl.add(() => {
                    // Putting the row selection and switching logic inside the timeline
                    // should minimise issues with fast successive clicks

                    // Set the new row
                    const targetRow = e.target.closest('.row');
                    const rowId = targetRow.querySelector('.td-data--applicationId').dataset.application;
                    const application = this.applications.filter(application => {
                        return parseInt(rowId) === application.id;
                    });
                    utils.changeActiveRow(targetRow, applicationRows);
                    this.state.applications.currentApplication = application[0];

                    // Remove old summary items, add new ones
                    summaryView.switchApplicationSummary(application[0]);

                    // Animate the summary back in
                    animation.animateSummaryIn();
                });
                tl.play(0); 
            });
        });
    }

    updateApplicationTable() {
        this.renderApplicationTable();
        // Update pagination
        const { totalApplications, searchOptions: {index: appIndex, limit: appLimit} } = this.state.applications;
        adminView.renderPagination(appIndex, appLimit, totalApplications, document.querySelector('.table__content'), 'applications');
    }

    addApplicationSummaryListeners() {
        const applicationSummary = document.querySelector('.summary--applications-page');

        applicationSummary.addEventListener(
            'click', 
            this.applicationSummaryListener.bind(this)
        );

    }

    async applicationSummaryListener (e) {

        // Buttons
        const newBtn = e.target.closest('.summary__new-application-btn--applications');
        const deleteBtn = e.target.closest('.summary__delete-application-btn--applications');
        const cvBtn = e.target.closest('.summary__cv-btn--applications');

        // Applicant/Job/Company links
        const jobLink = e.target.closest('.summary__link--job');
        const companyLink = e.target.closest('.summary__link--company');
        const applicantLink = e.target.closest('.summary__link--applicant');

        // Copy links
        const emailCopy = e.target.closest('.summary__field--contact-email');

        if(emailCopy){
            const text = emailCopy.firstElementChild.text;

            this.copyLink(emailCopy, text);
        }

        if(jobLink) {
            const jobId = jobLink.parentElement.dataset.id;

            this.displayAdminContent('jobs', jobId);
            adminView.changeActiveMenuItem(document.querySelector('.sidebar__item--jobs')); 

        }
        if(companyLink) {
            const companyId = companyLink.parentElement.dataset.id;
            this.displayAdminContent('companies', companyId);
            adminView.changeActiveMenuItem(document.querySelector('.sidebar__item--companies'));
        }
        if(applicantLink) {
            // Applicant link wraps around two divs with the data element
            const applicantId = applicantLink.firstElementChild.dataset.id;
        }
        if(cvBtn) {
            try {
                const res = await this.Admin.getCv(cvBtn.dataset.id);
                const contentDisposition = res.headers['content-disposition'];
                let fileName = contentDisposition.split(';')[1].split('=')[1].toString();
                adminView.forceDownload(res, fileName);
            } catch(err) {
                console.log(err);
            }
        }

        if(newBtn) {
            let errorAnimation;
            let successAnimation;

            // Get Job names for the job select
            const { data: { names } } =  await this.Admin.getJobNames();
            this.state.jobs.jobNames = names;

            // Get User names for the applicant select
            const { data: { applicants: applicantNames } } =  await this.Admin.getUserNames();
            this.state.users.applicantNames = applicantNames;

            modalView.renderNewApplicationModal({jobs: this.state.jobs.jobNames, users: this.state.users.applicantNames, applications: this.applications, appNumber: this.getNextId('applications')});
            const applicationSummaryModal = document.querySelector('.summary__modal--new-application');
            animation.animateSummaryModalIn(applicationSummaryModal)

            // Modal Elements
            const submitNewBtn = document.querySelector('.new-application__submit');
            const closeBtn = document.querySelector('.new-application__close');
            const alertWrapper = document.querySelector('.alert-wrapper');

            // Get the animation for the application alerts (paused)
            errorAnimation = animation.animateAlert(alertWrapper, false);
            // Success animation is the same, but appended later (paused)
            successAnimation = animation.animateAlert(alertWrapper, true);
                
            closeBtn.addEventListener('click', () => {
                modalView.removeAdminModal('applications');
            });
        
            submitNewBtn.addEventListener('click',  async (e) => {
                e.preventDefault();
                // Clear the alert wrapper
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                // Get the job id from the select
                const jobId = document.querySelector('.new-application__input--job').value;
                const personId = document.querySelector('.new-application__input--applicant').value;
                let msg;

                // If the values are the placeholders, return
                if(jobId ==='Jobs' || personId === 'Applicants') {
                    msg = jobId === 'Jobs'? 'No Job Selected':'No Applicant Selected';

                    const alert = modalView.getAlert(msg, false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);
                    errorAnimation.play(0);
                    return;
                }

                try {
                    const res = await this.Admin.createApplication(jobId, personId);
                    if(res.status === 200) {                                 
                        // Display successful alert      
                        const alert = modalView.getAlert('Application Created', true);
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        successAnimation.play(0);

                        // set up animation timeline (before data updated)
                        const tl = gsap.timeline();
                        adminView.renderAdminLoaders('applications');
                        tl
                        .add(animation.animateAdminLoadersIn())
                        .add(animation.animateTableContentOut('applications'), '<')
                        .add(async () => {

                            // Get data (Updates the total applications)
                            // Pass the indexId to return the new row first
                            await this.getData('applications', res.data.application.id);
                            // Update the current application
                            this.state.applications.currentApplication = this.applications[0];
                            

                        // TABLE RENDERING/ANIMATIONs
                            this.renderApplicationTable();
                            // Animate table body in (body, not content, because the table will already be present
                            // if adding an applicant), and the loaders out
                            gsap
                            .timeline()
                            .add(animation.animateTableBodyIn('applications'))
                            .add(animation.animateAdminLoadersOut(), '<')
                            
                        // SUMMARY RENDERING/ANIMATION
                            // Switch summary (No animation needed as behind the modal, should happen prior to animation of modal itself)
                            summaryView.switchApplicationSummary(this.applications[0]);

                            // Add to the successAnimation once the getData() call has now completed
                            // NB: animating the modal out, not the summary out (which would also animate the modal)
                            successAnimation.add(animation.animateSummaryModalOut(applicationSummaryModal));

                        // PAGINATION RENDERING
                            // Update pagination
                            const { totalApplications, searchOptions: {index, limit} } = this.state.applications;
                            const { pages, page: current } = paginationView.calculatePagination(index, limit, totalApplications);
                            paginationView.initPagination(pages, current, 'applications');
                        })

                    }

                } catch (err) {
                    let alert;
                    console.log(err);
                    if(err.response?.data?.message === 'Application already made') {
                        alert = modalView.getAlert(`Application Exists, ID: ${err.response.data.data.applicationId}`, false);
                    } else {
                        alert = modalView.getAlert('Contact the administrator', false);
                    }
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);
                    errorAnimation.play(0);
                }
            });

        }
        if(deleteBtn) {
            let errorAnimation;
            let successAnimation;

            const applicationId = document.querySelector('.summary__id').innerText;

            // Create, insert and animate the confirmation modal into the DOM
            const summaryWrapper = document.querySelector('.summary__content');
            const confirmationHtml = adminView.getDeleteApplicationHtml(applicationId);
            summaryWrapper.insertAdjacentHTML('afterbegin', confirmationHtml);
            const confirmation = document.querySelector('.confirmation');
            
            // Confirmation animation 
            gsap.from(confirmation, {
                autoAlpha: 0,
                duration: .2
            });

            const alertWrapper = document.querySelector('.alert-wrapper');

            // Get the animation for the application alerts
            errorAnimation = animation.animateAlert(alertWrapper, false);
            // Success animation is the same, but is added to after async call to get data
            successAnimation = animation.animateAlert(alertWrapper, true);

            const confirm = document.querySelector('.confirmation__btn--confirm');
            const cancel = document.querySelector('.confirmation__btn--cancel');

            confirm.addEventListener('click', async(e) => {
                e.preventDefault();
                // console.clear();
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                try {
                    const res = await this.Admin.deleteApplication(applicationId);

                    if(res.status === 200) {
                        console.log('DELETING', 'Applications left: ', this.applications.length)
                        // Display successful alert
                        const alert = modalView.getAlert(`Application ${applicationId} deleted`, true);
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        successAnimation.play(0);

                        // If it's the last item on the page
                        if(this.applications.length === 1) {
                            this.handleApplicationPagination(null, true, null)
                        } else {

                            adminView.renderAdminLoaders('applications');

                            const tl = gsap.timeline();
                            tl.add(animation.animateAdminLoadersIn())
                            .add(animation.animateTableContentOut('applications'), '<')
                            .add(async() => {
                                // Update the data
                                await this.getData('applications');

                                // Update the current application 
                                this.state.applications.currentApplication = this.applications[0];

                            // TABLE RENDERING/ANIMATION
                                this.renderApplicationTable();
                                // Animate table body in (body, not content, because the table will already be present
                                // if adding an applicant), and the loaders out
                                gsap
                                .timeline()
                                .add(animation.animateTableBodyIn('applications'))
                                .add(animation.animateAdminLoadersOut(), '<')    
                                    
                            // SUMMARY RENDERING
                                // Switch the summary (No animation needed)
                                summaryView.switchApplicationSummary(this.applications[0]);
                                
                                // Add to the successAnimation once the getData() call has now completed
                                // NB: animating the modal out, not the summary out (which would also animate the modal)
                                successAnimation.add(animation.animateSummaryModalOut(confirmation));
                                // console.log('Added to the success animation', successAnimation.getChildren());

                                const { totalApplications, searchOptions: {index, limit} } = this.state.applications;
                                const { pages, page: current } = paginationView.calculatePagination(index, limit, totalApplications);
                                paginationView.initPagination(pages, current, 'applications');
                            
                            })   
                        }

                    } else {
                        throw new Error();
                    }

                } catch (err) {
                    // Clear the alert wrapper contents
                    while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);
                    
                    const alert = modalView.getAlert(`Please contact the administrator`, false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);
                    errorAnimation.play(0);

                    console.log(err)
                }
            });

            cancel.addEventListener('click', () => {
                animation.animateSummaryModalOut(confirmation)
                // gsap.to(confirmation, {
                //     autoAlpha: 0,
                //     duration: .2,
                //     onComplete: () => {
                //         confirmation.parentElement.removeChild(confirmation);
                //     }
                // })
            });

        }
    }

    copyLink(element, value) {
        navigator.clipboard.writeText(value).then(function() {
            console.log('Async: Copying to clipboard was successful!');
            gsap.timeline()
            .to(element, {
                scale: 1.1,
                opacity: 0,
                duration: .4
            })
            .fromTo(element, {
                scale: 0.9,
                opacity: 0
            }, {
                scale: 1,
                opacity: 1,
                immediateRender: false
            }, '>');
        }, function(err) {
        console.error('Async: Could not copy text: ', err);
        });
    }

    getNextId(arr) {
        return this[arr].reduce((previous, current) => {
            return current.id > previous? current.id:previous;
        }, this[arr][0].id) + 1;
    }

    renderJobsTable() {
        // Format jobs/header into html elements
        const {headers, rows} = adminView.formatJobs(this.jobs, this.state.jobs.searchOptions.searchTerm);
        
        const table = document.querySelector('.table--jobs');
        const tableContent = document.querySelector('.table__content--jobs');

        // If no table visible, render both the header and content
        if(!table) {
            console.log('No Table')
            // Heading content added here to animate at the same time as the data comes in
            const headerContent = `<div class="table__heading">Jobs</div>`;
            document.querySelector('.table__header').insertAdjacentHTML('afterbegin', headerContent);

            // Create and insert the table
            const newTable = tableView.createTableTest('jobs', headers, rows, false);
            tableContent.insertAdjacentHTML('afterbegin', newTable);

            // Insert order arrows
            tableView.insertTableArrows('jobs', this.state.jobs);

            const thead = document.querySelector('.thead--jobs');
            thead.addEventListener('click', async e => {
                // Get the header
                const header = e.target.closest('th');
                if(!header) return;

                this.state.jobs.currentPage = 1;

                // Change the table arrow direction, the searchOption direction
                tableView.updateTableOrder(header, this.state.jobs, 'jobs');

                this.changeJobsPage(this.state.jobs.currentPage, null, null);
            });
        } else {
            console.log('update table');

            // Else remove the tbody and render just the content
            utils.removeElement(document.querySelector('tbody'));
            document.querySelector('thead').insertAdjacentHTML('afterend', tableView.updateTableContent('jobs', rows));
        }

        const jobRows = document.querySelectorAll('.row--jobs');
        const activeRow = Array.from(jobRows).find(row => {
            return row.querySelector(`[data-id="${this.state.jobs.currentJob.id}"]`)
        }) || jobRows[0];

        utils.changeActiveRow(activeRow, jobRows);

        // Add table row listeners
        jobRows.forEach(row => {
            row.addEventListener('click', e => {

                const tl = gsap.timeline({ paused: true });

                tl.add(animation.animateSummaryOut('jobs'));

                tl.add(() => {
                    // Putting the row selection and switching logic inside the timeline
                    // should prevent issues with fast successive clicks

                    // Set the new row
                    const targetRow = e.target.closest('.row');
                    const rowId = row.querySelector('.td-data--company').dataset.id;
                    const job = this.jobs.filter((job, index) => {
                        if(parseInt(rowId) === job.id) this.state.jobsTable.index = index;
                        return parseInt(rowId) === job.id;
                    })[0];

                    utils.changeActiveRow(targetRow, jobRows);
                    this.state.jobs.currentJob = job;
    
                    // Remove old summary items, add new ones
                    summaryView.switchJobSummary(job);
                    // // Animate the summary back in
                    animation.animateJobSummaryIn();
                })
                tl.play(0); 

                // const targetRow = e.target.closest('.row');
                // const rowId = row.querySelector('.td-data--company').dataset.id;
                // const job = this.jobs.filter((job, index) => {
                //     if(parseInt(rowId) === job.id) this.state.jobsTable.index = index;
                //     return parseInt(rowId) === job.id;
                // })[0];

                // utils.changeActiveRow(targetRow, jobRows);
                // this.state.jobs.currentJob = job;

                // // Change the summary
                // const summary = document.querySelector('.summary');
                // const newSummary = adminView.createJobSummary(job);

                // const tl = gsap.timeline();

                // tl.add(adminView.animateSummaryWrapperOut());
                // tl.add(() => {
                //     // Switch the summary
                //     adminView.switchSummary(summary, newSummary);
                                
                //     // Add the listener to the new summary
                //     this.addJobsSummaryListeners();
                // });
                // tl.add(adminView.animateSummaryWrapperIn());
            });
        });







        // // Format jobs/header into html elements
        // const {headers, rows} = adminView.formatJobs(this.jobs);
        // const { totalJobs, searchOptions: { index, limit } } = this.state.jobs;
        
        // const tableWrapper = document.querySelector('.table-wrapper');

        // // Remove table and pagination if they exist already
        // const table = document.querySelector('.table--jobs');
        // // const pagination = document.querySelector('.pagination--jobs');
        // if(table) utils.removeElement(table);
        // // if(pagination) utils.removeElement(pagination);

        // tableWrapper.insertAdjacentHTML('afterbegin', tableView.createTableContent('jobs', headers, rows, false));

        // // adminView.renderPagination(index, limit, totalJobs, tableWrapper, 'jobs');

        // const jobRows = document.querySelectorAll('.row--jobs');

        // const activeRow = Array.from(jobRows).find(row => {
        //     return row.querySelector(`[data-id="${this.state.jobs.currentJob.id}"]`)
        // }) || jobRows[0];

        // utils.changeActiveRow(activeRow, jobRows);

        // // Add table row listeners
        // jobRows.forEach(row => {
        //     row.addEventListener('click', e => {
        //         const rowId = row.querySelector('.td-data--company').dataset.id;
        //         const job = this.jobs.filter((job, index) => {
        //             if(parseInt(rowId) === job.id) this.state.jobsTable.index = index;
        //             return parseInt(rowId) === job.id;
        //         })[0];

        //         adminView.populateJobSummary(job);
        //         utils.changeActiveRow(row, jobRows);
        //     });
        // });
    }

    addJobsSummaryListeners() {
        const jobSummary = document.querySelector('.summary--jobs-page');

        jobSummary.addEventListener('focusout', this.handleJobSearchFocusEvent.bind(this));
        jobSummary.addEventListener('submit', this.handleJobSearchSubmitEvent.bind(this));
        // jobSummary.addEventListener('click', this.handleJobSearchSubmitEvent.bind(this));

        jobSummary.addEventListener(
            'click', 
            this.handleJobSummaryEvent.bind(this)
        );

    }

    async handleJobSearchSubmitEvent(e) {
        const inputOpen = document.querySelector('.summary__search-input.open');

        const searchBtn = e.target.closest('.summary__search');
        const searchForm = e.target.closest('.summary__item--header-search');

        // Check the type, the origin of the event, and if we want to respond to it (if the input is open)
        const submitEvent = e.type === 'submit' && searchForm && inputOpen;
        const clickEvent = e.type === 'click' && searchBtn && inputOpen;

        // Click events are already toggled, do the same with submit events
        if(submitEvent) this.toggleSearch();

        if((submitEvent || clickEvent) && inputOpen.value) {
            this.state.jobs.searchOptions.searchTerm = inputOpen.value;
            inputOpen.value = "";

            summaryView.addSearchTag(this.state.jobs.searchOptions.searchTerm);
            
            await this.getData('jobs');
            // const selectOption = document.querySelector(`.custom-select-option--jobs[data-value="1"]`);
            this.changeJobsPage(this.state.jobs.currentPage, null, null);
        }

    }

    handleJobSearchFocusEvent(e) {
        const searchInput = e.target.closest('.summary__search-input');
        const searchBtn = document.querySelector('.summary__search');
        if(searchInput){
            console.log(e.relatedTarget === searchBtn);
            // If the input loses focus to the submit button, return (the click listener will handle it)
            if(e.relatedTarget === searchBtn) return;

            // If the input loses focus to anything else, close it
            this.toggleSearch();
        }
        
    }

    async handleJobSummaryEvent(e) {

        // Buttons
        const newBtn = e.target.closest('.summary__new-job-btn--jobs');
        const deleteBtn = e.target.closest('.summary__delete-job-btn--jobs');
        const editBtn = e.target.closest('.summary__edit-job-btn--jobs');
        const hubspotBtn = e.target.closest('.summary__hubspot-btn--jobs');

        const searchBtn = e.target.closest('.summary__search');
        const searchTag = e.target.closest('.summary__tag');

        // Links
        const companyLink = e.target.closest('.summary__link--company');

        if(searchBtn) {
            this.toggleSearch();
        }
        if(searchTag) {
            // Remove the searchTerm 
            this.state.jobs.searchOptions.searchTerm = '';

            this.changeJobsPage(this.state.jobs.currentPage, null, null);
        }

        if(newBtn) {
            let errorAnimation;
            let successAnimation;

            let alert;

            // Get company list
            const { data: { companyNames } } = await this.Admin.getCompanyNames();
            this.state.companies.companyNames = companyNames;

            // Render and animate the job modal in
            modalView.renderJobModal({ 
                companies: this.state.companies.companyNames, 
                jobTypes: this.jobTypes, 
                jobPositions: this.jobPositions,
                jobPqes: this.jobPqes,
                jobNumber: this.getNextId('jobs')
            }, 'new');
            const jobSummaryModal = document.querySelector('.summary__modal--new-job');
            const jobSummaryHeader = document.querySelector('.summary__modal-header--jobs');

            //@TODO: defend against rendering twice
            animation.animateSummaryModalIn(jobSummaryModal);
            animation.animateSummaryModalIn(jobSummaryHeader);

            // Modal Elements
            const alertWrapper = document.querySelector('.alert-wrapper');
            const jobForm = document.querySelector('.form--new-job');
            const closeBtn = document.querySelector('.form__close--new-job');
            const submitBtn = document.querySelector('.form__submit--new-job');

            // Custom selects and fields need to be separated for validation
            const fields = adminView.getJobFields('new');
            const { titleField, locationField, wageField, descriptionField } = fields;
            const selects = adminView.getJobCustomSelects('new');
            const { companyField, typeField, positionField, pqeField, featuredField } = selects;

            // Get the animation for the application alerts (paused)
            errorAnimation = animation.animateAlert(alertWrapper, false, 'paused');
            // Success animation is the same, but appended later (paused)
            successAnimation = animation.animateAlert(alertWrapper, true, 'paused');
  
            closeBtn.addEventListener('click', () => {
                // Removes the header, modal + animates
                modalView.removeAdminModal('jobs');
            });
           
            jobForm.addEventListener('submit', async e => {
                e.preventDefault();
                // Remove searchTerms
                this.state.jobs.searchOptions.searchTerm = '';

                // Clear the alert wrapper contents
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                const data = adminView.getJobValues(fields, selects); 
                const { changed, companyName, ...values } = data;
                const errors = validator.validateJob(values);

                // Re-add the company name
                values.companyName = companyName;

                // If no errors, submit the form
                if(!errors) {
                    try {
                        const res = await this.Admin.createJob(values);

                        if(res.status !== 201) {
                            throw new Error();
                        } else {
                            // Display the success modal
                            alert = modalView.getAlert('Job Created', true);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            
                            successAnimation.play(0);

                            const newPage = this.state.jobs.totalJobs % this.state.jobs.searchOptions.limit === 0;
                            const pages = paginationView.getTotalPages(this.state.jobs.searchOptions.limit, this.state.jobs.totalJobs);
                            if(newPage) {
                                this.changeJobsPage(pages+1, null, null, 'new', res.data.job);
                            } else {
                               this.changeJobsPage(pages, null, null, null, res.data.job);
                            }
                        }
                    } catch(err) {
                        console.log(err);
                        // Display the failure modal
                        alert = modalView.getAlert('Job Not Created', false);
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        errorAnimation.play(0);
                    }
                    return;
                }
                
                // Else if there are errors, set the field error status
                if(errors.title) 
                  validator.setErrorFor(titleField, errors.title); 
                else validator.setSuccessFor(titleField);

                if(errors.companyId)     
                  validator.setErrorFor(companyField, errors.companyId);
                else validator.setSuccessFor(companyField);

                if(errors.location)  
                  validator.setErrorFor(locationField, errors.location);
                else validator.setSuccessFor(locationField);

                if(errors.wage) 
                  validator.setErrorFor(wageField, errors.wage);
                else validator.setSuccessFor(wageField);

                if(errors.type) 
                  validator.setErrorFor(typeField, errors.type);
                else validator.setSuccessFor(typeField);

                if(errors.position) 
                  validator.setErrorFor(positionField, errors.position);
                else validator.setSuccessFor(positionField);

                if(errors.pqe) 
                  validator.setErrorFor(pqeField, errors.pqe);
                else validator.setSuccessFor(pqeField);

                if(errors.featured) 
                  validator.setErrorFor(featuredField, errors.featured);
                else validator.setSuccessFor(featuredField);

                if(errors.description) 
                  validator.setErrorFor(descriptionField, errors.description); 
                else validator.setSuccessFor(descriptionField);

            });


            jobForm.addEventListener('focusout', (e) => {
                if(e.target === submitBtn) return;
                const data = adminView.getJobValues(fields, selects);
                const { value, name } = this.getJobDataToValidate(e, data, fields, selects);
                const error = validator.validateJobField({value: value, name: name});

                if(error) validator.setErrorFor(e.target, error);
                else validator.setSuccessFor(e.target);
            });

            // This is why fields and custom selects had to be split
            // The focus listener has to be on the custom select, not the hidden source select
            Object.values(fields).forEach(field => {
                field.addEventListener('focus', e => {
                    if(field.parentElement.classList.contains('success')) {
                        field.parentElement.classList.remove('success');
                    }
                    if(field.parentElement.classList.contains('error')) {
                        field.parentElement.classList.remove('error');
                    }
                    // Remove the success msg
                    field.nextElementSibling.nextElementSibling.nextElementSibling.innerText = '';
                });
            });
            // The selects need both validation removal on focus, and revalidation on change
            Object.values(selects).forEach(field => {
                field.nextElementSibling.addEventListener('focus', e => {
                    if(field.parentElement.classList.contains('success')) {
                        field.parentElement.classList.remove('success');
                    }
                    if(field.parentElement.classList.contains('error')) {
                        field.parentElement.classList.remove('error');
                    }
                    // Remove the success msg
                    field.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText = '';
                });
            });

            jobForm.addEventListener('change', (e) => {                
                const data = adminView.getJobValues(fields, selects);
                const { value, name } = this.getJobDataToValidate(e, data, fields, selects);   
             
                const error = validator.validateJobField({value: value, name: name});

                if(error) validator.setErrorFor(e.target, error);
                else validator.setSuccessFor(e.target);
            });
        }

        if(deleteBtn) {
            let errorAnimation;
            let successAnimation;
            let alert;

            const jobId = document.querySelector('.summary__header-content').dataset.id;

            // Create, insert and animate the confirmation modal into the DOM
            const summaryWrapper = document.querySelector('.summary__content');
            const confirmationHtml = adminView.getDeleteJobHtml(jobId);
            summaryWrapper.insertAdjacentHTML('afterbegin', confirmationHtml);
            const confirmation = document.querySelector('.confirmation');

            // Confirmation animation 
            gsap.from(confirmation, {
                autoAlpha: 0,
                duration: .2
            });

            // Alert animation
            const alertWrapper = document.querySelector('.alert-wrapper');

            // Get the animation for the job alerts
            errorAnimation = animation.animateAlert(alertWrapper, false, 'paused');
            // Success animation is the same, but is added to after async call to get data
            successAnimation = animation.animateAlert(alertWrapper, true, 'paused');
        
            const confirm = document.querySelector('.confirmation__btn--confirm');
            const cancel = document.querySelector('.confirmation__btn--cancel');

            confirm.addEventListener('click', async() => {
                e.preventDefault();

                // Clear the alert wrapper contents
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                try {
                    const { status } = await this.Admin.deleteJob(jobId);

                    if(status === 200) {
                        alert = modalView.getAlert(`Job ${jobId} deleted`, true);
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        successAnimation.play(0);

                        const lastRow = this.state.jobs.totalJobs % this.state.jobs.searchOptions.limit === 1;
                        // If it's the last item on the page
                        if(lastRow) {
                            const onLastPage = paginationView.onLastPage(this.state.jobs.searchOptions.index, this.state.jobs.searchOptions.limit, this.state.jobs.totalJobs);
                            const page = paginationView.getCurrentPage(this.state.jobs.searchOptions.index, this.state.jobs.searchOptions.limit);
                            this.changeJobsPage(onLastPage? null:page, onLastPage? true:null, null, 'delete');
                        } else {

                           this.changeJobsPage(this.state.jobs.currentPage, null, null);
                        }
                
                    } else {
                        throw new Error();
                    }

                } catch(err) {
                    // Clear the alert wrapper contents
                    while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);
                    
                    alert = modalView.getAlert(`Error: Job ${jobId} not deleted`, false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);
                    errorAnimation.play(0);

                    console.log(err)
                }
            });
            cancel.addEventListener('click', () => {
                animation.animateSummaryModalOut(confirmation)
            });
        }
        if(editBtn) {
            let errorAnimation;
            let successAnimation;
            let alert;

            const jobId = document.querySelector('.summary__header-content').dataset.id;

            // Get companies list
            const { data: { companyNames } } = await this.Admin.getCompanyNames();
            this.state.companies.companyNames = companyNames;

            modalView.renderJobModal({ 
                companies: this.state.companies.companyNames, 
                job: this.state.jobs.currentJob,
                jobTypes: this.jobTypes, 
                jobPositions: this.jobPositions,
                jobPqes: this.jobPqes,
                jobNumber: this.getNextId('jobs')
            }, 'edit');
            const jobSummaryModal = document.querySelector('.summary__modal--edit-job');
            const jobSummaryModalHeader = document.querySelector('.summary__modal-header--jobs');
            animation.animateSummaryModalIn(jobSummaryModal)
            animation.animateSummaryModalIn(jobSummaryModalHeader)

            const alertWrapper = document.querySelector('.alert-wrapper');
            const jobForm = document.querySelector('.form--edit-job');
            const closeBtn = document.querySelector('.form__close--edit-job');

            // Custom selects and fields need to be separated for validation
            const fields = adminView.getJobFields('edit');
            const { titleField, locationField, wageField, descriptionField } = fields;
            const selects = adminView.getJobCustomSelects('edit');
            const { companyField, typeField, positionField, pqeField, featuredField } = selects;

            // Get the animation for the application alerts (paused)
            errorAnimation = animation.animateAlert(alertWrapper, false, 'paused');
            // Success animation is the same, but appended later (paused)
            successAnimation = animation.animateAlert(alertWrapper, true, 'paused');

            closeBtn.addEventListener('click', () => {
                // Removes the header, modal + animates
                modalView.removeAdminModal('jobs');
            });

            jobForm.addEventListener('submit', async e => {
                e.preventDefault();
                // Clear the alert wrapper contents
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);
                const data = adminView.getJobValues(fields, selects, 'edit'); 
                // Split the values to validate
                const { changed, companyName, ...values } = data;
                const errors = validator.validateJob(values);
                // Re-add the company name
                values.companyName = companyName;

                if(!changed.length > 0) {
                    alert = modalView.getAlert(`No Fields Changed`, false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);

                    errorAnimation.play(0);
                    return;
                }
                if(!errors) {
                    try {
                        const res = await this.Admin.editJob(jobId, values);
                        if(res.status !== 200) {
                            throw new Error();

                        } else {
                            alert = modalView.getAlert('Job Edited', true);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            successAnimation.play(0);

                            const page = paginationView.getCurrentPage(this.state.jobs.searchOptions.index, this.state.jobs.searchOptions.limit);
                            this.changeJobsPage(page, null, null, null, res.data.job);

                        }
                    } catch(err) {
                        console.log(err);
                        // Display the failure modal
                        alert = modalView.getAlert('Job Not Edited', false);
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        errorAnimation.play(0);
                    }
                    return;
                }


                if(errors.title) 
                    validator.setErrorFor(titleField, errors.title); 
                else validator.setSuccessFor(titleField);

                if(errors.companyId)     
                    validator.setErrorFor(companyField, errors.companyId);
                else validator.setSuccessFor(companyField);

                if(errors.location)  
                    validator.setErrorFor(locationField, errors.location);
                else validator.setSuccessFor(locationField);

                if(errors.wage) 
                    validator.setErrorFor(wageField, errors.wage);
                else validator.setSuccessFor(wageField);

                if(errors.type) 
                    validator.setErrorFor(typeField, errors.type);
                else validator.setSuccessFor(typeField);

                if(errors.position) 
                    validator.setErrorFor(positionField, errors.position);
                else validator.setSuccessFor(positionField);

                if(errors.pqe) 
                    validator.setErrorFor(pqeField, errors.pqe);
                else validator.setSuccessFor(pqeField);

                if(errors.featured) 
                    validator.setErrorFor(featuredField, errors.featured);
                else validator.setSuccessFor(featuredField);

                if(errors.description) 
                    validator.setErrorFor(descriptionField, errors.description); 
                else validator.setSuccessFor(descriptionField);
            });
        }
        if(hubspotBtn) {
            console.log('hubspotBtn');
        }
        if(companyLink) {
            const companyId = document.querySelector('.summary__field--company').dataset.id;

            this.displayAdminContent('companies', companyId);
            adminView.changeActiveMenuItem(document.querySelector('.sidebar__item--companies'));

        }
    }

    getJobDataToValidate(
        e, 
        data, 
        {
            titleField,
            locationField,
            wageField,
            descriptionField
        }, 
        {
            companyField,
            typeField,
            positionField,
            pqeField,
            featuredField
        }
    ) {
        let name;
        let value;
        if(e.target === titleField) {
            name = 'title';
            value = data[name]
        } 
        // CompanyField is a select, the following element is the custom select that's focused
        if(e.target === companyField.nextElementSibling) {
            name = 'companyId';
            value = data[name]
        }
        if(e.target === locationField) {
            name = 'location';
            value = data[name]
        }
        if(e.target === wageField) {
            name = 'wage';
            value = data[name]
        }
        if(e.target === typeField.nextElementSibling) {
            name = 'type';
            value = data[name]
        }
        if(e.target === positionField.nextElementSibling) {
            name = 'position';
            value = data[name]
        }
        if(e.target === pqeField.nextElementSibling) {
            name = 'pqe';
            value = data[name]
        }
        if(e.target === featuredField.nextElementSibling) {
            name = 'featured';
            value = data[name]
        }
        if(e.target === descriptionField) {
            name = 'description';
            value = data[name]
        }

        return { name, value }
    }

    renderUsersTable() {
        // Format applications/headers into html elements
        const {headers, rows} = adminView.formatUsers(this.users);

        const tableWrapper = document.querySelector('.table-wrapper');
        const table = document.querySelector('.table--users');

        // If no table visible, render both the header and content
        if(!table) { 
            tableWrapper.insertAdjacentHTML('afterbegin', tableView.createTableTest('users', headers, rows, false));
            adminView.animateTableContentIn('users')
            // Else remove the tbody and render just the content
        } else {
            utils.removeElement(document.querySelector('tbody'));
            document.querySelector('thead').insertAdjacentHTML('afterend', tableView.updateTableContent('users', rows));
            adminView.animateTableBodyIn('users');
        }

        
        // Set active row
        const userRows = document.querySelectorAll('.row--users');
        const activeRow = Array.from(userRows).find(row => {
            return row.querySelector(`[data-id="${this.state.users.currentUser.id}"]`);
        }) || userRows[0];

        utils.changeActiveRow(activeRow, userRows);

        // Add table row listeners
        userRows.forEach(row => {
            row.addEventListener('click', e => {
                const targetRow = e.target.closest('.row');
                const rowId = row.querySelector('.td-data--first-name').dataset.id;
                const user = this.users.filter((user, index) => {
                    return parseInt(rowId) === user.id;
                });
                utils.changeActiveRow(targetRow, userRows);
                this.state.users.currentUser = user[0];


                // Change the summary
                const summary = document.querySelector('.summary');
                const newSummary = adminView.createUserSummary(user[0])

                const tl = gsap.timeline();

                // adminView.swapSummary(summary, adminView.createCompanySummary(company[0]), this.handleCompanySummaryEvent.bind(this), tl);
                tl.add(adminView.animateSummaryWrapperOut());
                tl.add(() => {
                    // Switch the summary
                    adminView.switchSummary(summary, newSummary);

                    // // Set the pagination state (This does to the company jobs array what limit and offset do in the api call)
                    this.setUserJobsState();

                    // Render the summary user jobs table
                    if(this.state.users.paginatedJobs.length > 0) {
                        // remove any placeholders
                        const placeholder = document.querySelector('.user-jobs-placeholder');
                        if(placeholder) placeholder.parentElement.removeChild(placeholder);

                        this.renderUserJobsTable();
                    } else {
                        // render a placeholder saying 'no jobs'
                        // this shouldn't be needed, but is a safety net
                        document.querySelector('.table-wrapper--nested-user-jobs')
                            .insertAdjacentHTML('afterbegin', adminView.generateUserJobsPlaceholder());
                    } 
                    // Add pagination for nested contacts, addresses, and jobs elements
                    this.addUserNestedPagination();
                    
                    // Add the listener to the new summary
                    document.querySelector('.summary').addEventListener('click', (e) => this.userSummaryListener(e))

                    // Remove any modals
                    adminView.removeSummaryModals();
            
                  })
                  tl.add(adminView.animateSummaryWrapperIn());

            });
        });
    }

    // renderUsersTable() {
    //     const { totalUsers, searchOptions: {index, limit} } = this.state.users;
    //     // Offset is subtracted from the user id to get the current item
    //     // const page = index / limit;
    //     // const offset = page * limit;
    //     // Format users/headers into html elements
    //     const {headers, rows} = adminView.formatUsers(this.users);
    //     const tableWrapper = document.querySelector('.users-table__wrapper');

    //     // removeUserTable & pagination if it exists
    //     const table = document.querySelector('.table--users');
    //     const pagination = document.querySelector('.pagination--users');
    //     if(table) utils.removeElement(table);
    //     if(pagination) utils.removeElement(pagination);

    //     // elements.adminContent.insertAdjacentHTML('afterbegin', tableView.createTableTest('users', headers, rows, false))
    //     tableWrapper.insertAdjacentHTML('afterbegin', tableView.createTableTest('users', headers, rows, false));
    //     // Add pagination
    //     adminView.renderPagination(index, limit, totalUsers, tableWrapper, 'users');

    //     const userRows = document.querySelectorAll('.row--users');
    //     const activeRow = Array.from(userRows).find(row => row.querySelector(`[data-id="${this.state.users.currentUser.applicantId}"]`)) || userRows[0];
    //     utils.changeActiveRow(activeRow, userRows);

    //     userRows.forEach(row => {
    //         row.addEventListener('click', (e) => {
    //             const targetRow = e.target.closest('.row');
    //             const rowId = targetRow.querySelector('.td-data--first-name').dataset.id;
    //             const user = this.users.filter(user => {
    //                 return parseInt(rowId) === user.applicantId;
    //             });

    //             utils.changeActiveRow(targetRow, userRows);
    //             this.state.users.currentUser = user[0];
    //             adminView.populateUserSummary(user[0]);
    //         });
    //     });
    // }
    addUserSummaryListeners() {
        const userSummary = document.querySelector('.user-summary');

        userSummary.addEventListener('click', (e) => {
            const newBtn = e.target.closest('.user-summary__btn--new');
            const editBtn = e.target.closest('.user-summary__btn--edit');
            const deleteBtn = e.target.closest('.user-summary__btn--delete');
            const saveBtn = e.target.closest('.user-summary__btn--save');
            const hubspotBtn = e.target.closest('.user-summary__btn--hubspot');
            const cvDownloadWrapper = e.target.closest('.user-summary__cv-download');
            const cvBtn = document.querySelector('.user-summary__btn--cv');
            const uploadBtn = e.target.closest('.user-summary__file-picker');
            const saveNewBtn = e.target.closest('.user-summary__btn--save-new');
            const offScreenInput = document.querySelector('.user-summary__input');

            const userElements = userSummary.querySelectorAll('.user-summary__item');

            // Ignore synthetic clicks from the offscreen input element
            if(e.target === offScreenInput) return;
            
            if(newBtn) {
                // Save current user values
                const userId = document.querySelector('.user-summary').dataset.id;
                this.state.users.currentUser = this.users.find(user => user.applicantId === parseInt(userId));

                const iconsToIgnore = [
                    'user-summary__btn--upload',
                    'user-summary__btn--save-new'
                ];
                // Alter the summary form
                adminView.changeNewIcon('save', 'user', iconsToIgnore);
                adminView.makeEditable(userElements, true);
                adminView.togglePlaceholders(userElements, true, []);
                // adminView.addFocusInListeners(userElements, adminView.clearText);


                userSummary.addEventListener('focusin', adminView.focusInNewUserHandler);
                userSummary.addEventListener('focusout', adminView.focusOutNewUserHandler);

                // Change the cv element to a file picker
                adminView.addUploadElement(this.state.users.currentUser.cvName);
                // Clear current user
                // adminView.clearUserSummary();

            }
            if(saveNewBtn) {
                // Get edited values
                const formData = adminView.getNewUser(this.state.users.currentUser);
                let formUser;

                // Flow: 
                    // Create user > post to server > get and store updated user list > render jobs table 
                    // If the newly created user is in the paginated list of jobs returned, make it the currentJob/active row
                if(formData) {
                    this.Admin.createApplicant(formData).then(res => {
                        if(res.status !== 201) { 
                            throw new Error('Applicant not created') 
                        }// @TODO: show error message
                        // @TODO: show success message
                        formUser = res.data.user;

                        return this.Admin.getUsers(this.state.users.searchOptions);
                        
                    }).then(res => {
                        // @TODO: show error msg
                        if(res.status !== 200) {
                            throw new Error('Problem displaying applicants');
                        } 
                        this.users = res.data.applicants;
                        this.state.users.totalUsers = res.data.total;

                        // Look for the recently created user in the visible users array
                        const user = this.users.find(user => user.applicantId === formUser.applicantId);


                        if(user) {
                            // Means the newly created user is visible
                            this.state.users.currentUser = user;

                        } else {
                            // If the newly created user isn't visible, set the current user to the first in the array + populate summary
                            this.state.users.currentUser = this.users[0];
                            adminView.populateUserSummary(this.state.users.currentUser);
                        }
                        
                        this.renderUsersTable();

                        const iconsToIgnore = [
                            'user-summary__btn--upload',
                            'user-summary__btn--save-new'
                        ];
                        adminView.changeNewIcon('new', 'user', iconsToIgnore);
                        adminView.makeEditable(userElements, false);

                    })
                    .catch(err => console.log(err));
                } else {
                    adminView.populateUserSummary(this.state.users.currentUser);

                    const iconsToIgnore = [
                        'user-summary__btn--upload',
                        'user-summary__btn--save-new'
                    ];
                    adminView.changeNewIcon('new', 'user', iconsToIgnore);
                    adminView.makeEditable(userElements, false);
                }

                // Remove focus listeners
                userSummary.removeEventListener('focusin', adminView.focusInNewUserHandler);
                userSummary.removeEventListener('focusout', adminView.focusOutNewUserHandler);

            }
            if(editBtn) {
                const userId = document.querySelector('.user-summary').dataset.id;
                // Save current user values
                this.state.users.currentUser = this.users.find(user => user.applicantId === parseInt(userId));

                // Set the elements to editable
                // Removing contenteditable is done in a listener on the body
                if(userElements[0].getAttribute('contenteditable') === 'false') {
                    // Make the content divs editable
                    adminView.makeEditable(userElements, true);
                    // Add focusin/focusout listeners
                    userSummary.addEventListener('focusin', adminView.focusInEditUserHandler);
                    this.boundFocusOutEditUserHandler = adminView.focusOutEditUserHandler.bind(this, this.state.users.currentUser);
                    userSummary.addEventListener('focusout', this.boundFocusOutEditUserHandler);

                    // Change the cv element to a file picker
                    adminView.addUploadElement(this.state.users.currentUser.cvName);

                    
                    // Btns to ignore if the edit state is changed
                    const elementsToSkip = [
                        'user-summary__btn--save', 
                        'user-summary__btn--upload'
                    ];

                    // Change the edit icon to a save icon
                    adminView.changeEditIcon('save', 'user', elementsToSkip);
                }
            } 
            if(saveBtn) {
                // Get edited values
                const formData = adminView.getUserEdits(this.state.users.currentUser);

                //Remove input listeners
                userSummary.removeEventListener('focusin', adminView.focusInEditUserHandler);
                userSummary.removeEventListener('focusout', this.boundFocusOutEditUserHandler);


                if(formData) {                    
                    this.Admin
                            .editApplicant(this.state.users.currentUser.applicantId, formData)
                            .then(applicant => {

                                // Update the currentUser
                                for(let [key, value] of formData.entries()){
                                    if(key !== 'cv')
                                        this.state.users.currentUser[key] = value;
                                    
                                    if(key === 'cv' && value) {
                                        this.state.users.currentUser.cvType = value.name.indexOf('doc') !== -1 ? '.doc':'.pdf';
                                        this.state.users.currentUser.cvName = value.name;
                                    }
                                }
                                this.renderUsersTable();
                                adminView.addCvElement(this.state.users.currentUser);

                            })
                            .catch(err => {
                                console.log(err);
                            });
                }
                else {
                    console.log('dont save');
                }
                adminView.makeEditable(userElements, false);

                const iconsToIgnore = [
                    'user-summary__btn--upload',
                    'user-summary__btn--edit'
                ];
                adminView.changeEditIcon('edit', 'user', iconsToIgnore);
            }
        
            if(deleteBtn) {
                console.log('delete');
                const userId = document.querySelector('.user-summary').dataset.id;
                this.state.users.currentUser = this.users.find(user => user.applicantId === parseInt(userId));
                
                this.Admin
                    .deleteApplicant(userId)
                    .then(response => {
//@TODO: modal if not successful

                        // @TODO: Both getUsers and remove from local array?
                        // Remove the current user from the local array
                        // this.users = this.users.filter(user => {
                        //     return user !== this.state.users.currentUser;
                        // }) 

                        // If the local array only has 1 element left in it, move the pagination (which updates searchOptions)
                        //@TODO: handle 0 users here
                        if(this.users.length <= 1) {
                            this.movePageBackwards(this.state.users);
                        }

                        return this.Admin.getUsers(this.state.users.searchOptions);                      
                    }).then((res) => {
                        // Store and render data
                        this.users = res.data.applicants;
                        this.state.users.totalUsers = res.data.total;

                        this.renderUsersTable();
                        
                        adminView.populateUserSummary(this.users[0]);

                    })
                    .catch(err => console.log(err));
            }
            if(hubspotBtn) console.log('hubspot');
            if(cvDownloadWrapper && cvBtn) {
                // id on the child cv-btn
                this.Admin.getCv(cvBtn.dataset.id)
                    .then(res => {
                        const contentDisposition = res.headers['content-disposition'];
                        let fileName = contentDisposition.split(';')[1].split('=')[1].toString();
                        adminView.forceDownload(res, fileName);
                     })
                     .catch(err => console.log(err));
             }
            if(uploadBtn) {
                console.log('upload');
                // OffScreenInput is explicitly removed from the dom so the listener is removed 
                offScreenInput.addEventListener('change', adminView.inputChangeHandler);
            }
        });
    }

    setUserJobsState() {
        // Set the state for the summary's nested table
        this.getNumOfRows('nested-user-jobs');
        this.state.users.userJobsPagination.totalJobs = this.state.users.currentUser.jobs.length;
        const { index, limit } = this.state.users.userJobsPagination;

        // Paginate the company jobs
        this.state.users.paginatedJobs = this.state.users.currentUser.jobs.slice(index, index + limit);

    }

    renderUserJobsTable() {
        // Format the paginated jobs into html elements
        const {headers, rows} = adminView.formatUserJobs(this.state.users.paginatedJobs);

        const tableWrapper = document.querySelector('.table-wrapper--nested-user-jobs');
        const table = document.querySelector('.table--nested-user-jobs');
        // If no table visible, render both the header and content
        if(!table) { 
            tableWrapper.insertAdjacentHTML('afterbegin', tableView.createTableTest('nested-user-jobs', headers, rows, false));
            // Else remove the tbody and render just the content
        } else {
            utils.removeElement(document.querySelector('tbody'));
            document.querySelector('thead').insertAdjacentHTML('afterend', tableView.updateTableContent('nested-user-jobs', rows));
        }

        adminView.animateTableContentIn('nested-user-jobs')
    }

    initCompanyJobsState() {
        this.state.companies.companyJobsPagination.limit = tableView.calculateRows('company-jobs');
        this.state.companies.companyJobsPagination.totalJobs = this.state.companies.currentCompany.jobs.length;

        const { index, limit } = this.state.companies.companyJobsPagination;

        // Paginate the company jobs
        this.state.companies.paginatedJobs = this.state.companies.currentCompany.jobs.slice(index, index + limit);
    }

//     setCompanyJobsState(companyJobsOption, companyJobsPrevious, companyJobsNext, companyJobsState, pages) {
// console.log(companyJobsState);
//         if(companyJobsPrevious && !(companyJobsState.currentPage < 1)) {
//             console.log('backwards');

//             this.movePageBackwards(companyJobsState);
//         }
//         if(companyJobsNext && !(companyJobsState.currentPage >= pages)) {
//             console.log('forwards');

//             this.movePageForwards(companyJobsState);
//         }
//         if(companyJobsOption) {
//             console.log('move');
//             const page = companyJobsOption.dataset.value;

//             this.movePage(companyJobsState, page);
//         }
      
//     }

    renderCompanyJobsTable() {
        // Format the paginated jobs into html elements
        const {headers, rows} = adminView.formatCompanyJobs(this.state.companies.paginatedJobs);

        const tableWrapper = document.querySelector('.table__content--company-jobs');
        const table = document.querySelector('.table--company-jobs');
        const tbody = document.querySelector('.tbody--company-jobs');


        // If no table visible, render both the header and content
        if(!table) { 
            console.log('no table');
            tableWrapper.insertAdjacentHTML('afterbegin', tableView.createTableTest('company-jobs', headers, rows, false));
        } else {
            console.log('table');

            if(tbody) tbody.parentElement.removeChild(tbody);
            if(rows.length > 0) document.querySelector('.thead--company-jobs').insertAdjacentHTML('afterend', tableView.updateTableContent('company-jobs', rows));
        }

        const placeholder = document.querySelector('.company-jobs-placeholder');
        if(this.state.companies.paginatedJobs.length === 0 && !placeholder) {
            document.querySelector('.table__content--company-jobs').insertAdjacentHTML('beforeend', adminView.createNoJobsPlaceholder());
        } else if(placeholder) {
            placeholder.parentElement.removeChild(placeholder);
        }

    };

    renderCompaniesTable() {
        // Format applications/headers into html elements
        const {headers, rows} = adminView.formatCompanies(this.companies, this.state.companies.searchOptions.searchTerm);
        const tableContent = document.querySelector('.table__content--companies');
        const table = document.querySelector('.table--companies');

        // If no table visible, render both the header and content
        if(!table) { 
            // Heading content added here to animate at the same time as the data comes in
            const headerContent = `<div class="table__heading">Companies</div>`;
            document.querySelector('.table__header').insertAdjacentHTML('afterbegin', headerContent);
            const newTable = tableView.createTableTest('companies', headers, rows, false);
            tableContent.insertAdjacentHTML('afterbegin', newTable);
            // Insert order arrows
            tableView.insertTableArrows('companies', this.state.companies);

            const thead = document.querySelector('.thead--companies');
            thead.addEventListener('click', async e => {
                // Get the header
                const header = e.target.closest('th');
                if(!header) return;

                this.state.companies.currentPage = 1;

                // Change the table arrow direction, the searchOption direction
                tableView.updateTableOrder(header, this.state.companies, 'companies');

                await this.getData('companies');
                this.changeCompaniesPage(this.state.companies.currentPage, null, null);
            });

            // Render the controls the first time the table is created
            
            document.querySelector('.summary__company-controls--companies-page')
                .insertAdjacentHTML('beforeend', adminView.createCompaniesControls());

            const tableControls = document.querySelector('.summary__company-controls--companies-page');
            tableControls.addEventListener('click', (e) => {this.companyControlsListener(e)});

            // Else remove the tbody and render just the content
        } else {
            utils.removeElement(document.querySelector('tbody'));
            document.querySelector('thead').insertAdjacentHTML('afterend', tableView.updateTableContent('companies', rows));
        }
    

        // Set active row
        const companyRows = document.querySelectorAll('.row--companies');

        const activeRow = Array.from(companyRows).find(row => {
            return row.querySelector(`[data-id="${this.state.companies.currentCompany.id}"]`);
        }) || companyRows[0];

        utils.changeActiveRow(activeRow, companyRows);

        // Add table row listeners
        companyRows.forEach(row => {
            row.addEventListener('click', e => {
                // Reset the nested pagination state
                this.resetNestedCompanyState();

                // if(this.state.isActiveAnimation) return;
                // this.state.isActiveAnimation = true;
                const tl = gsap.timeline({ paused: true });

                tl.add(animation.animateSummaryOut('companies'))
                  
                tl.add(() => {
                    // Putting the row selection and switching logic inside the timeline
                    // should minimise issues with fast successive clicks
                    const targetRow = e.target.closest('.row');
                    const rowId = row.querySelector('.td-data--company-name').dataset.id;
                    const company = this.companies.filter((company, index) => {
                        return parseInt(rowId) === company.id;
                    });
                    utils.changeActiveRow(targetRow, companyRows);
                    this.state.companies.currentCompany = company[0];

                    // Remove old summary items, add new ones
                    summaryView.switchCompanySummary(this.state.companies.currentCompany, this.state.companies.searchOptions.searchTerm);

                    // Unlike the Jobs and Apps summaries, clicking another row has to re-calculate pagination
                    // on nested tables and contact/address sections

                    // Set the pagination state (This does to the company jobs array what limit and offset do in the api call)
                    this.initCompanyJobsState();
                    
                    // // Add pagination for nested contacts, addresses, and jobs elements
                    this.addCompanyNestedPagination();

                    this.renderCompanyJobsTable()
                    // // // Render the summary company jobs table
                    // if(this.state.companies.paginatedJobs.length > 0) {
                    //     this.renderCompanyJobsTable();
                    //     // animation.animateTableBodyIn('company-jobs')
                    // } else {
                    //     // render a placeholder saying 'no jobs'
                    //     document.querySelector('.table__content--company-jobs')
                    //         .insertAdjacentHTML('beforeend', adminView.createNoJobsPlaceholder());
                    //     // // Animate the placeholder in
                    //     // animation.animateTablePlaceholderIn(document.querySelector('.company-jobs-placeholder'));
                
                    // } 

                    // Animate the summary back in
                    animation.animateCompanySummaryIn(this.state.companies.paginatedJobs.length)
                });

                tl.play(0); 





                // // Change the summary
                // const summary = document.querySelector('.summary');
                // const newSummary = adminView.createCompanySummary(company[0])
                // console.log(summary, newSummary);

                // const tl = gsap.timeline();

                // adminView.swapSummary(summary, adminView.createCompanySummary(company[0]), this.handleCompanySummaryEvent.bind(this), tl);
                
                
                // tl.add(adminView.animateSummaryWrapperOut());
                // tl.add(() => {
                //     // Switch the summary
                //     adminView.switchSummary(summary, newSummary);

                //     // Set the pagination state (This does to the company jobs array what limit and offset do in the api call)
                //     this.initCompanyJobsState();

                //     // Render the summary company jobs table
                //     if(this.state.companies.paginatedJobs.length > 0) {
                //         // remove any placeholders
                //         const placeholder = document.querySelector('.company-jobs-placeholder')

                //         if(placeholder) placeholder.parentElement.removeChild(placeholder);

                //         this.renderCompanyJobsTable();
                //     } else {
                //         // render a placeholder saying 'no jobs'
                //         document.querySelector('.table-wrapper--nested-jobs')
                //             .insertAdjacentHTML('afterbegin', adminView.generateCompanyJobsPlaceholder());
                //     } 

                //     // Add pagination for nested contacts, addresses, and jobs elements
                //     this.addCompanyNestedPagination();

                //     // Add the listener to the new summary
                //     document.querySelector('.summary').addEventListener('click', (e) => this.handleCompanySummaryEvent(e))

                //     // Remove any modals
                //     adminView.removeSummaryModals();
            
                //   })
                //   tl.add(adminView.animateSummaryWrapperIn());

            });
        });

        // // Extract state
        // const { totalCompanies, searchOptions: { index, limit } } = this.state.companies;

        // // Format data into html elements
        // const { headers, rows } = adminView.formatCompanies(this.companies);

        // // Select html elements
        // const tableWrapper = document.querySelector('.companies-table__wrapper');
        // const table = document.querySelector('.table--companies');
        // const pagination = document.querySelector('.pagination--companies');

        // // If the elements exist, remove them
        // if(table) utils.removeElement(table);
        // if(pagination) utils.removeElement(pagination);
        // tableWrapper.insertAdjacentHTML('afterbegin', tableView.createTableTest('companies', headers, rows, false));
        
        // // Add pagination
        // adminView.renderPagination(index, limit, totalCompanies, tableWrapper, 'companies');



        // // Change active 
        // const companyRows = document.querySelectorAll('.row--companies');
        // const activeRow = Array.from(companyRows).find(row => row.querySelector(`[data-id="${this.state.companies.currentCompany.id}"]`)) || companyRows[0];
        

        // utils.changeActiveRow(activeRow, companyRows);

        // companyRows.forEach(row => {
        //     row.addEventListener('click', (e) => {
        //         const targetRow = e.target.closest('.row');
        //         const rowId = targetRow.querySelector('.td-data--company-name').dataset.id;
        //         const company = this.companies.filter(company => {
        //             return parseInt(rowId) === company.id;
        //         })[0];

        //         utils.changeActiveRow(targetRow, companyRows);
        //         this.state.companies.currentCompany = company;
        //         adminView.populateCompanySummary(company);
        //         adminView.populateAddressSummary(company.id, company.addresses[0]);
        //         adminView.populateContactSummary(company.id, company.people[0])
        //     });
        // });
    }

    getCompanyDataToValidate(e, data, { 
        companyNameField, 
        contactFirstNameField,
        contactSurnameField,
        contactPositionField,
        phoneField,
        emailField,
        firstLineField,
        secondLineField,
        cityField,
        countyField,
        postcodeField
     }) {
        let name;
        let value;

        if(e.target === companyNameField) {
            name = 'companyName';
            value = data[name];
        }
        if(e.target === contactFirstNameField) {

            name = 'firstName';
            value = data[name];
        }
        if(e.target === contactSurnameField) {
            name = 'lastName';
            value = data[name];
        }
        if(e.target === contactPositionField) {
            name = 'position';
            value = data[name];
        }
        if(e.target === phoneField) {
            name = 'phone';
            value = data[name];
        }
        if(e.target === emailField) {
            name = 'email';
            value = data[name];
        }
        if(e.target === firstLineField) {
            name = 'firstLine';
            value = data[name];
        }
        if(e.target === secondLineField) {
            name = 'secondLine';
            value = data[name];
        }
        if(e.target === cityField) {
            name = 'city';
            value = data[name];}
        if(e.target === countyField) {
            name = 'county';
            value = data[name];
        }
        if(e.target === postcodeField) {
            name = 'postcode';
            value = data[name];
        }
        return { name: name, value: value }
    }

    addCompanySummaryListeners() {

        const companySummary = document.querySelector('.summary--companies-page');


        companySummary.addEventListener('focusout', this.handleCompanySearchFocusEvent.bind(this));
        companySummary.addEventListener('submit', this.handleCompanySearchSubmitEvent.bind(this));
        companySummary.addEventListener('click', this.handleCompanySearchSubmitEvent.bind(this));
        // Has to be after the submit listener as it changes the search input classname
        companySummary.addEventListener(
            'click',
            (e) => {this.handleCompanySummaryEvent(e);}
        );
    }

    async handleCompanySearchSubmitEvent(e) {

        const inputOpen = document.querySelector('.summary__search-input.open');

        const searchBtn = e.target.closest('.summary__search');
        const searchForm = e.target.closest('.summary__item--header-search');

        // Check the type, the origin of the event, and if we want to respond to it (if the input is open)
        const submitEvent = e.type === 'submit' && searchForm && inputOpen;
        const clickEvent = e.type === 'click' && searchBtn && inputOpen;

        // Click events are already toggled, do the same with submit events
        if(submitEvent) this.toggleSearch();

        if((submitEvent || clickEvent) && inputOpen.value) {

            this.state.companies.searchOptions.searchTerm = inputOpen.value;
            inputOpen.value = "";

            summaryView.addSearchTag(this.state.companies.searchOptions.searchTerm);
            
            await this.getData('companies');

            // Move to the first page
            this.changeCompaniesPage(1, null, null);
        }





        // console.log(searchBtn, e.type==='click', inputOpen);
        // If input not open && click event


//         e.preventDefault();
//         const searchForm = e.target.closest('.summary__item--header-search');
//         const searchInputOpen = document.querySelector('.summary__search-input.open');
// console.log(typeof e);
// console.log('input open', searchInputOpen, 'searchForm:', searchForm);
//         // Search input checks the input is open, form captures both submit and click events (from input and btn respectively)
//         if(searchInputOpen && searchForm ){

//             if(!searchInputOpen.value) {
//                 searchInputOpen.animation.reverse(); 
//                 searchInputOpen.classList.remove('open');
//                 return
//             }

//             this.state.companies.searchOptions.searchTerm = searchInputOpen.value;
//             searchInputOpen.value = "";
//             searchInputOpen.animation.reverse(); 
//             summaryView.addSearchTag(this.state.companies.searchOptions.searchTerm);
            
//             const close = document.querySelector('.summary__tag-close');
//             close.addEventListener('click', e => {
//                 gsap.to(close, { opacity: 0, duration: .4, onComplete: () => close.parentElement.removeChild(close) })
//             });

//             await this.getData('companies');

//             const selectOption = document.querySelector(`.custom-select-option--companies[data-value="1"]`);
//             this.changeCompaniesPage(selectOption, null, null);
//         }
    } 

    handleCompanySearchFocusEvent(e) {
        const searchInput = e.target.closest('.summary__search-input');

        const searchBtn = document.querySelector('.summary__search');
        if(searchInput){
            // const searchBtn = document.querySelector('.summary__search');
            // if(searchInput && e.relatedTarget !== searchBtn) {
            //     searchInput.value = "";
            //     searchInput.animation.reverse();
            //     searchInput.classList.remove('open');
            // }

            // If the input loses focus to the submit button, return (the click listener will handle it)
            if(e.relatedTarget === searchBtn) return;

            // If the input loses focus to anything else, close it
            this.toggleSearch();
        }
        

        // searchInput.addEventListener('blur', () => {
        //     searchInput.value = "";
        //     searchInput.animation.reverse();
        // });
        // searchContainer.addEventListener('submit', async (e) => {
        //     e.preventDefault();
        //     this.state.companies.searchOptions.searchTerm = searchInput.value;
        //     searchInput.value = "";
        //     searchInput.animation.reverse(); 
        //     summaryView.addSearchTag(this.state.companies.searchOptions.searchTerm);
            
        //     const close = document.querySelector('.summary__tag-close');
        //     close.addEventListener('click', e => {
        //         gsap.to(close, { opacity: 0, duration: .4, onComplete: () => close.parentElement.removeChild(close) })
        //     });

        //     await this.getData('companies');

        //     const selectOption = document.querySelector(`.custom-select-option--companies[data-value="1"]`);
        //     this.changeCompaniesPage(selectOption, null, null);
        // });
    }
    toggleSearch() {
        // If there's a searchTag, don't toggle
        const tag = document.querySelector('.summary__tag');
        if(tag) return

        const searchInput = document.querySelector('.summary__search-input')
        searchInput.classList.toggle('open');
        if(searchInput.classList.contains('open')) {searchInput.animation.play(0)}
        else {
            searchInput.animation.reverse();
        }
    }

    async handleCompanySummaryEvent(e) {
        // Buttons
        const newContactBtn = e.target.closest('.summary__new-contact-btn--companies');
        const newAddressBtn = e.target.closest('.summary__new-address-btn--companies');

        const editContactBtn = e.target.closest('.summary__edit-contact-btn--companies');
        const editAddressBtn = e.target.closest('.summary__edit-address-btn--companies');

        const deleteContactBtn = e.target.closest('.summary__delete-contact-btn--companies');
        const deleteAddressBtn = e.target.closest('.summary__delete-address-btn--companies');

        const jobBtn = e.target.closest('.row');

        const searchBtn = e.target.closest('.summary__search');
        const searchTag = e.target.closest('.summary__tag');

        // Links
        const addJobLink = e.target.closest('.company-jobs-placeholder__add-link');
        if(addJobLink) {
            this.displayAdminContent('jobs')
            const select = document.querySelector('.form__company-input--job');
        }

        // Copy Links
        const emailCopy = e.target.closest('.company-summary__field--contact-email');
        if(emailCopy) {
            const text = emailCopy.firstElementChild.text;
            this.copyLink(emailCopy, text);
        }
        if(searchBtn) {
            this.toggleSearch();
        }
        if(searchTag) {
            // Remove the searchTerm 
            this.state.companies.searchOptions.searchTerm = '';

            // Move to first page
            this.changeCompaniesPage(1, null, null);
        }

        if(jobBtn) {
            const jobId = jobBtn.firstElementChild.dataset.id;
            this.displayAdminContent('jobs', jobId);
            adminView.changeActiveMenuItem(document.querySelector('.sidebar__item--jobs')); 
        }

        if(newContactBtn) {
            let errorAnimation;
            let successAnimation;
            let alert;

            const { 
                id,
                companyName,
                addresses,
                contacts
            } = this.state.companies.currentCompany;

            modalView.renderCompanyModal({
                companyNumber: id,
                companyName,
                contact: contacts[this.state.companies.companyContactsPagination.index],
                address: addresses[this.state.companies.companyAddressesPagination.index]
            }, 'new-contact');

            const companySummaryModal = document.querySelector('.summary__modal--new-contact');
            const companySummaryModalHeader = document.querySelector('.summary__modal-header--new-contact');

            // Don't have to worry about modals already existing as they would cover the buttons needed to get here
            animation.animateSummaryModalIn(companySummaryModal);
            animation.animateSummaryModalIn(companySummaryModalHeader);

            const alertWrapper = document.querySelector('.alert-wrapper');
            const companyForm = document.querySelector('.form--new-contact');
            const closeBtn = document.querySelector('.form__close--new-contact');
            const submitBtn = document.querySelector('.form__submit--new-contact');

            const fields = adminView.getCompanyFields('new-contact');
            const { contactFirstNameField, contactSurnameField, contactPositionField, phoneField, emailField } = fields;

            // Get the animation for the application alerts (paused)
            errorAnimation = animation.animateAlert(alertWrapper, false, 'paused');
            // Success animation is the same, but appended later (paused)
            successAnimation = animation.animateAlert(alertWrapper, true, 'paused');
            successAnimation.add(animation.animateSummaryModalOut(companySummaryModal));
            successAnimation.add(animation.animateSummaryModalOut(companySummaryModalHeader));

            // closeBtn.addEventListener('click', ()=>adminView.removeCompanyModal());
            closeBtn.addEventListener('click', () => {
                modalView.removeAdminModal('company-contacts');
            });

            companyForm.addEventListener('submit', async e => {
                e.preventDefault();
                this.state.companies.searchOptions.searchTerm = '';

                // Clear the alert wrapper
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                const data = adminView.getCompanyValues(fields); 
                // Remove the changed field, and others not applicable to the new contact form
                const { changed, companyName, firstLine, secondLine, city, county, postcode, ...values } = data;
                const errors = validator.validateContact(values);

                if(!errors) {
                    try {
                        const res = await this.Admin.createContact({id, ...values});

                        if(res.status !== 201) {
                            alert = modalView.getAlert('Contact Not Created', false);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            errorAnimation.play(0);
                        } else {
                            alert = modalView.getAlert('Contact Created', true);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            successAnimation.play(0);

                           // Because there's no call to the db with contacts (which updates the total elements and adds to the array)
                           // it should be done manually
                            this.state.companies.currentCompany.contacts.push(res.data.contact);
                            this.state.companies.companyContactsPagination.totalContacts++;

                            // Company Contacts are 1 per page, so will always have a new page themselves
                            this.handleCompanyContactsPagination(this.state.companies.companyContactsPagination.totalContacts, null, null, 'new');
                            
                        }
                    } catch(err) {
                        console.log(err);

                        if(err?.response?.data?.validationErrors.length > 0){
                            alert = modalView.getAlert(err.response.data.validationErrors[0].msg, false);
                        } else {
                            alert = modalView.getAlert('Contact Not Created', false);
                        }
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        errorAnimation.play(0);
                    } 
                    
                    
                } else {
                    if(errors.firstName) 
                        validator.setErrorFor(contactFirstNameField, errors.firstName); 
                    else validator.setSuccessFor(contactFirstNameField);

                    if(errors.lastName) 
                        validator.setErrorFor(contactSurnameField, errors.lastName);
                    else validator.setSuccessFor(contactSurnameField);

                    if(errors.position) 
                        validator.setErrorFor(contactPositionField, errors.position);
                    else validator.setSuccessFor(contactPositionField);

                    if(errors.phone) 
                        validator.setErrorFor(phoneField, errors.phone);
                    else validator.setSuccessFor(phoneField);

                    if(errors.email) 
                        validator.setErrorFor(emailField, errors.email);
                    else validator.setSuccessFor(emailField);
                }

            });

            // Validate each field on lost focus
            companyForm.addEventListener('focusout', e => {
                if(e.target === submitBtn) return;
                const data = adminView.getCompanyValues(fields);
                const {name, value} = this.getCompanyDataToValidate(e, data, fields);
                
                const error = validator.validateCompanyField({ name,  value });

                if(error) validator.setErrorFor(e.target, error);
                else validator.setSuccessFor(e.target);
            });

            Object.values(fields).forEach(field => {
                field.addEventListener('focus', e => {
                    if(field.parentElement.classList.contains('success')) {
                        field.parentElement.classList.remove('success');
                    }
                    if(field.parentElement.classList.contains('error')) {
                        field.parentElement.classList.remove('error');
                    }
                    // Remove the success msg
                    field.nextElementSibling.nextElementSibling.nextElementSibling.innerText = '';
                });
            });

        }
        if(newAddressBtn) {
            let errorAnimation;
            let successAnimation;
            let alert;

            const { 
                id,
                companyName,
                addresses,
                contacts
            } = this.state.companies.currentCompany;

            modalView.renderCompanyModal({
                companyNumber: id,
                companyName,
                contact: contacts[this.state.companies.companyContactsPagination.index],
                address: addresses[this.state.companies.companyAddressesPagination.index]
            }, 'new-address');

            const companySummaryModal = document.querySelector('.summary__modal--new-address');
            const companySummaryModalHeader = document.querySelector('.summary__modal-header--new-address');
          
            // Don't have to worry about modals already existing as they would cover the buttons needed to get here
            animation.animateSummaryModalIn(companySummaryModal);
            animation.animateSummaryModalIn(companySummaryModalHeader);

            const alertWrapper = document.querySelector('.alert-wrapper');
            const companyForm = document.querySelector('.form--new-address');
            const closeBtn = document.querySelector('.form__close--new-address');
            const submitBtn = document.querySelector('.form__submit--new-address');

            const fields = adminView.getCompanyFields('new-address');
            const { firstLineField, secondLineField, cityField, countyField, postcodeField } = fields;

            // Get the animation for the application alerts (paused)
            errorAnimation = animation.animateAlert(alertWrapper, false, true);
            // Success animation is the same, but appended later (paused)
            successAnimation = animation.animateAlert(alertWrapper, true, true);      
            successAnimation.add(animation.animateSummaryModalOut(companySummaryModal));
            successAnimation.add(animation.animateSummaryModalOut(companySummaryModalHeader));

            closeBtn.addEventListener('click', () => modalView.removeAdminModal('company-addresses'));

            companyForm.addEventListener('submit', async e => {
                e.preventDefault();

                // Clear the alert wrapper
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                const data = adminView.getCompanyValues(fields); 
                const { changed, companyName, firstName, lastName, position, phone, email, ...values } = data;
                const errors = validator.validateAddress(values);

                if(!errors) {
                    try {
                        const res = await this.Admin.createAddress({id, ...values});

                        if(!res.status === 201) {
                            alert = modalView.getAlert('Address Not Created', false);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            errorAnimation.play(0);
                        } else {
                            alert = modalView.getAlert('Address Created', true);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);

                            successAnimation.play(0);

                            this.state.companies.currentCompany.addresses.push(res.data.address);
                            this.state.companies.companyAddressesPagination.totalAddresses++;

                            // Company Addresses are 1 per page, so will always have a new page themselves
                            this.handleCompanyAddressesPagination(this.state.companies.companyAddressesPagination.totalAddresses, null, null, 'new');
                            
                        }
                    } catch(err) {
                        console.log(err);
                        if(err?.response?.data?.validationErrors.length > 0){
                            alert = modalView.getAlert(err.response.data.validationErrors[0].msg, false);
                        } else if(err.response.data.message === 'Address already exists') {
                            console.log(err.response);
                            alert = modalView.getAlert(err.response.data.message, false);
                        } else {
                            alert = modalView.getAlert('Address not created', false);
                        }
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        errorAnimation.play(0);

                    }
                } else {
                    if(errors.firstLine) 
                        validator.setErrorFor(firstLineField, errors.firstLine); 
                    else validator.setSuccessFor(firstLineField);

                    if(errors.secondLine) 
                        validator.setErrorFor(secondLineField, errors.secondLine);
                    else validator.setSuccessFor(secondLineField);

                    if(errors.city) 
                        validator.setErrorFor(cityField, errors.city);
                    else validator.setSuccessFor(cityField);

                    if(errors.county) 
                        validator.setErrorFor(countyField, errors.county);
                    else validator.setSuccessFor(countyField);

                    if(errors.postcode) 
                        validator.setErrorFor(postcodeField, errors.postcode);
                    else validator.setSuccessFor(postcodeField);
                }
            });    

            // Validate each field on lost focus
            companyForm.addEventListener('focusout', e => {
                if(e.target === submitBtn) return;
                const data = adminView.getCompanyValues(fields);
                const {name, value} = this.getCompanyDataToValidate(e, data, fields);
                
                const error = validator.validateCompanyField({ name,  value });

                if(error) validator.setErrorFor(e.target, error);
                else validator.setSuccessFor(e.target);
            });

            Object.values(fields).forEach(field => {
                field.addEventListener('focus', e => {
                    if(field.parentElement.classList.contains('success')) {
                        field.parentElement.classList.remove('success');
                    }
                    if(field.parentElement.classList.contains('error')) {
                        field.parentElement.classList.remove('error');
                    }
                    // Remove the success msg
                    field.nextElementSibling.nextElementSibling.nextElementSibling.innerText = '';
                });
            });
            
        }
    
        if(editContactBtn) {
            let errorAnimation;
            let successAnimation;
            let alert;

            const { 
                id,
                companyName,
                addresses,
                contacts
            } = this.state.companies.currentCompany;

            modalView.renderCompanyModal({
                companyNumber: id,
                companyName,
                contact: contacts[this.state.companies.companyContactsPagination.index],
                address: addresses[this.state.companies.companyAddressesPagination.index]
            }, 'edit-contact');

            const companySummaryModal = document.querySelector('.summary__modal--edit-contact');
            const companySummaryModalHeader = document.querySelector('.summary__modal-header--edit-contact');

            // Don't have to worry about modals already existing as they would cover the buttons needed to get here
            animation.animateSummaryModalIn(companySummaryModal);
            animation.animateSummaryModalIn(companySummaryModalHeader);

            const alertWrapper = document.querySelector('.alert-wrapper');
            const companyForm = document.querySelector('.form--edit-contact');
            const closeBtn = document.querySelector('.form__close--edit-contact');

            const fields = adminView.getCompanyFields('edit-contact');
            const { 
                contactFirstNameField,
                contactSurnameField,
                contactPositionField,
                phoneField,
                emailField,
            } = fields;

            
            // Get the animation for the application alerts (paused)
            errorAnimation = animation.animateAlert(alertWrapper, false, true);
            // Success animation is the same, but appended later (paused)
            successAnimation = animation.animateAlert(alertWrapper, true, true);
            successAnimation.add(animation.animateSummaryModalOut(companySummaryModal));
            successAnimation.add(animation.animateSummaryModalOut(companySummaryModalHeader));

            closeBtn.addEventListener('click', () => {
                modalView.removeAdminModal('company-contacts');
            });

            companyForm.addEventListener('submit', async e => {
                console.log('submit edit')
                e.preventDefault();
                // Clear the alert wrapper
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                const data = adminView.getCompanyValues(fields, true); 

                // Remove the changed field, and others not applicable to the new contact form
                const { changed, companyName, firstLine, secondLine, city, county, postcode, ...values } = data;
                if(!changed.length > 0) {
                    alert = modalView.getAlert(`No Fields Changed`, false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);

                    errorAnimation.play(0);

                    // Reset validation fields (edge case where a field is changed from and then back to the placeholder value)
                    [
                        contactFirstNameField, 
                        contactSurnameField,
                        contactPositionField,
                        phoneField,
                        emailField
                    ].forEach(field => validator.setSuccessFor(field))
                    return;
                }

                const contactId = this.state.companies.currentCompany.contacts[this.state.companies.companyContactsPagination.currentPage-1].contactId;

                const errors = validator.validateContact(values);

                if(!errors) {
                    try {
                        const res = await this.Admin.editContact({id, contactId, ...values});

                        if(res.status !== 201) {
                            alert = modalView.getAlert('Contact Not Edited', false);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            errorAnimation.play(0);
                        } else {
                            alert = modalView.getAlert('Contact Edited', true);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);

                            const contactIndex = this.state.companies.currentCompany.contacts.map(contact => contact.contactId).indexOf(res.data.contact.contactId);

                            this.state.companies.currentCompany.contacts[contactIndex] = res.data.contact;

                            successAnimation.play(0);

                            // Update the contact - although we're editing, so not swapping pages, this will rerender the contacts section
                            this.handleCompanyContactsPagination(this.state.companies.companyContactsPagination.currentPage, null, null);
                            
                        }
                    } catch(err) {
                        console.log(err);
                        if(err?.response?.data?.validationErrors.length > 0){
                            alert = modalView.getAlert(err.response.data.validationErrors[0].msg, false);
                        } else {
                            alert = modalView.getAlert('Contact Not Edited', false);
                        }
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        errorAnimation.play(0);
                    }
                } else {
                    if(errors.firstName)  
                        validator.setErrorFor(contactFirstNameField, errors.firstName);
                    else validator.setSuccessFor(contactFirstNameField);

                    if(errors.lastName) 
                        validator.setErrorFor(contactSurnameField, errors.lastName);
                    else validator.setSuccessFor(contactSurnameField);

                    if(errors.position) 
                        validator.setErrorFor(contactPositionField, errors.position);
                    else validator.setSuccessFor(contactPositionField);

                    if(errors.phone) 
                        validator.setErrorFor(phoneField, errors.phone);
                    else validator.setSuccessFor(phoneField);

                    if(errors.email) 
                        validator.setErrorFor(emailField, errors.email);
                    else validator.setSuccessFor(emailField);
                }
            });
        }
        if(editAddressBtn) {
            console.log('edit');
            let errorAnimation;
            let successAnimation;
            let alert;

            const { 
                id,
                companyName,
                addresses,
                contacts
            } = this.state.companies.currentCompany;

            modalView.renderCompanyModal({
                companyNumber: id,
                companyName,
                contact: contacts[this.state.companies.companyContactsPagination.index],
                address: addresses[this.state.companies.companyAddressesPagination.index]
            }, 'edit-address');

            const companySummaryModal = document.querySelector('.summary__modal--edit-address');
            const companySummaryModalHeader = document.querySelector('.summary__modal-header--edit-address');

            // Don't have to worry about modals already existing as they would cover the buttons needed to get here
            animation.animateSummaryModalIn(companySummaryModal);
            animation.animateSummaryModalIn(companySummaryModalHeader);

            const alertWrapper = document.querySelector('.alert-wrapper');
            const companyForm = document.querySelector('.form--edit-address');
            const closeBtn = document.querySelector('.form__close--edit-address');

            const fields = adminView.getCompanyFields('edit-address');
            const { 
                firstLineField, secondLineField, cityField, countyField, postcodeField 
            } = fields;

            // Get the animation for the application alerts (paused)
            errorAnimation = animation.animateAlert(alertWrapper, false, true);
            // Success animation is the same, but appended later (paused)
            successAnimation = animation.animateAlert(alertWrapper, true, true);
            successAnimation.add(animation.animateSummaryModalOut(companySummaryModal));
            successAnimation.add(animation.animateSummaryModalOut(companySummaryModalHeader));

            closeBtn.addEventListener('click', () => {
                modalView.removeAdminModal('company-addresses');
            });

            companyForm.addEventListener('submit', async e => {
                e.preventDefault();

                // Clear the alert wrapper
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                const data = adminView.getCompanyValues(fields, true); 
                // Remove the changed field, and others not applicable to the new address form
                const { changed, companyName, firstName, lastName, position, email, phone, ...values } = data;

                if(!changed.length > 0) {
                    alert = modalView.getAlert(`No Fields Changed`, false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);

                    errorAnimation.play(0);

                    // Reset validation fields (edge case where a field is changed from and then back to the placeholder value)
                    [
                        firstLineField, 
                        secondLineField, 
                        cityField, 
                        countyField, 
                        postcodeField
                    ].forEach(field => validator.setSuccessFor(field))
                    return;
                }
                const addressId = this.state.companies.currentCompany.addresses[this.state.companies.companyAddressesPagination.currentPage -1].id;

                const errors = validator.validateAddress(values);

                if(!errors) {
                    try {
                        const res = await this.Admin.editAddress({id, addressId, ...values});
                        if(res.status !== 201) {
                            alert = modalView.getAlert('Address Not Edited', false);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            errorAnimation.play(0);
                        } else {
                            alert = modalView.getAlert('Address Edited', true);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
 
                            const addressIndex = this.state.companies.currentCompany.addresses.map(address => address.id).indexOf(res.data.address.id);
                            this.state.companies.currentCompany.addresses[addressIndex] = res.data.address;

                            successAnimation.play(0);

                            // Update the contact - although we're editing, so not swapping pages, this will rerender the contacts section
                            this.handleCompanyAddressesPagination(this.state.companies.companyAddressesPagination.currentPage, null, null);
                        
                        }
                    } catch(err) {
                        console.log(err);
                        if(err?.response?.data?.validationErrors.length > 0){
                            alert = modalView.getAlert(err.response.data.validationErrors[0].msg, false);
                        } else if(err.response.data.message === 'Address already exists') {
                            alert = modalView.getAlert(err.response.data.message, false);
                        } else {
                            alert = modalView.getAlert('Address not created', false);
                        }
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        errorAnimation.play(0);
                    }
                } else {
                    if(errors.firstLine)  
                        validator.setErrorFor(firstLineField, errors.firstLine);
                    else validator.setSuccessFor(firstLineField);

                    if(errors.secondLine) 
                        validator.setErrorFor(secondLineField, errors.secondLine);
                    else validator.setSuccessFor(secondLineField);

                    if(errors.city) 
                        validator.setErrorFor(cityField, errors.city);
                    else validator.setSuccessFor(cityField);

                    if(errors.county) 
                        validator.setErrorFor(countyField, errors.county);
                    else validator.setSuccessFor(countyField);

                    if(errors.postcode) 
                        validator.setErrorFor(postcodeField, errors.postcode);
                    else validator.setSuccessFor(postcodeField);
                    
                }
            });
        }

        if(deleteContactBtn) {
            const modalExists = document.querySelector('.summary__modal');
            const modalHeaderExists = document.querySelector('.summary__modal-header');
            let errorAnimation;
            let successAnimation;
            let alert;
            
            const contactId = document.querySelector('.summary__section-content--contacts').dataset.id;
            // Create, insert and animate the confirmation modal into the DOM
            const summaryWrapper = document.querySelector('.summary__content');
            const confirmationHtml = adminView.getDeleteContactHtml(contactId);
            summaryWrapper.insertAdjacentHTML('afterbegin', confirmationHtml);

            const confirmation = document.querySelector('.summary__modal--delete-contact');

            // If a modal exists, the modal above will render behind the existing one, so animate it out
            // to give a smooth transition. Otherwise animate the new modal in
            if(modalExists) {
                gsap.timeline()
                    // AnimateModalOut removes the modal from the dom
                    .add(animation.animateSummaryModalOut(modalExists))
                    .add(animation.animateSummaryModalOut(modalHeaderExists), '<')
            } else {
                animation.animateSummaryModalIn(confirmation);
            }

            // Alert animation
            const alertWrapper = document.querySelector('.alert-wrapper');

            // Get the animation for the job alerts
            errorAnimation = animation.animateAlert(alertWrapper, false, true);
            successAnimation = animation.animateAlert(alertWrapper, true, true);
            successAnimation.add(animation.animateSummaryModalOut(confirmation));

            const confirm = document.querySelector('.confirmation__btn--confirm');
            const cancel = document.querySelector('.confirmation__btn--cancel');

            cancel.addEventListener('click', () => {
                if(errorAnimation.isActive()) {errorAnimation.pause(0);}
                if(successAnimation.isActive()) {successAnimation.pause(0);}

                animation.animateSummaryModalOut(confirmation)
            });

            confirm.addEventListener('click', async () => {
                // Clear the alert wrapper contents
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                if(this.state.companies.currentCompany.contacts.length === 1) {
                    alert = modalView.getAlert(`Cannot delete last remaining contact`, false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);
                    errorAnimation.add(animation.animateSummaryModalOut(confirmation));
                    errorAnimation.play(0);
                    return;
                }

                try {
                    const res = await this.Admin.deleteContact(contactId);

                    if(res.status === 200) {
                        // Set the alert
                        alert = modalView.getAlert(`Contact ${contactId} deleted`, true);
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);

                        successAnimation.play(0);

                        // Check if last page before changing contact array and # contacts
                        const onLastPage = paginationView.onLastPage(this.state.companies.companyContactsPagination.index, this.state.companies.companyContactsPagination.limit, this.state.companies.companyContactsPagination.totalContacts);
                                            
                        // No need to update the company array or the company table
                        // Just remove the contact from the current company
                        const index = this.state.companies.currentCompany.contacts.findIndex(contact => contact.contactId === parseInt(contactId));
                        this.state.companies.currentCompany.contacts.splice(index, 1);
                        this.state.companies.companyContactsPagination.totalContacts--;

                        this.handleCompanyContactsPagination(onLastPage? null:this.state.companies.companyContactsPagination.currentPage, onLastPage? true:null, null, 'delete');

                    } else {
                        throw new Error();
                    }
                } catch(err) {
                    console.log(err);
                    while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                    alert = modalView.getAlert(`Cannot delete contact`, false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);
                    errorAnimation.add(animation.animateSummaryModalOut(confirmation));
                    errorAnimation.play(0);
                }
            }); 

        }
        if(deleteAddressBtn) {
            const modalExists = document.querySelector('.summary__modal');
            const modalHeaderExists = document.querySelector('.summary__modal-header');
            let errorAnimation;
            let successAnimation;
            let alert;

            const addressId = document.querySelector('.summary__section-content--addresses').dataset.id;
            
            // Render confirmation modal
            const confirmationHtml = adminView.getDeleteAddressHtml(addressId);
            const summaryWrapper = document.querySelector('.summary__content');
            summaryWrapper.insertAdjacentHTML('afterbegin', confirmationHtml);

            // Select and animate confirmation modal
            const confirmation = document.querySelector('.confirmation');
            // If a modal exists, the modal above will render behind the existing one, so animate it out
            // to give a smooth transition. Otherwise animate the new modal in
            if(modalExists) {
                gsap.timeline()
                    // AnimateModalOut removes the modal from the dom
                    .add(animation.animateSummaryModalOut(modalExists))
                    .add(animation.animateSummaryModalOut(modalHeaderExists), '<')
            } else {
                animation.animateSummaryModalIn(confirmation);
            }
          
            // Alert animation
            const alertWrapper = document.querySelector('.alert-wrapper');
            // Get the animation for the job alerts
            errorAnimation = animation.animateAlert(alertWrapper, false, true);
            successAnimation = animation.animateAlert(alertWrapper, true, true);
            successAnimation.add(animation.animateSummaryModalOut(confirmation));

            const confirm = document.querySelector('.confirmation__btn--confirm');
            const cancel = document.querySelector('.confirmation__btn--cancel');

            cancel.addEventListener('click', () => {
                if(errorAnimation.isActive()) {errorAnimation.pause(0);}
                if(successAnimation.isActive()) {successAnimation.pause(0);}

                animation.animateSummaryModalOut(confirmation)
            });

            confirm.addEventListener('click', async () => {
                // Clear the alert wrapper contents
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                if(this.state.companies.currentCompany.addresses.length === 1) {
                    alert = modalView.getAlert(`Cannot delete last remaining address`, false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);
                    errorAnimation.add(animation.animateSummaryModalOut(confirmation));
                    errorAnimation.play(0);
        
                    return;
                }

                try {
                    const res = await this.Admin.deleteAddress(addressId);

                    if(res.status === 200) {
                        // Set the alert
                        alert = modalView.getAlert(`Address ${addressId} deleted`, true);
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);

                        successAnimation.play(0);

                        // Check if last page before changing contact array and # contacts
                        const onLastPage = paginationView.onLastPage(this.state.companies.companyAddressesPagination.index, this.state.companies.companyAddressesPagination.limit, this.state.companies.companyAddressesPagination.totalAddresses);
                                          
                        // No need to update the company array or the company table
                        // Just remove the address from the current company
                        const index = this.state.companies.currentCompany.addresses.findIndex(address => address.id === parseInt(addressId));
                        this.state.companies.currentCompany.addresses.splice(index, 1);
                        this.state.companies.companyAddressesPagination.totalAddresses--;

                        this.handleCompanyAddressesPagination(onLastPage? null:this.state.companies.companyAddressesPagination.currentPage, onLastPage? true:null, null, 'delete');
                    } else {
                        const error = new Error();
                        error.statusCode = res.status;
                        throw error;

                    }
                } catch(err) {
                    console.log(err);
                    alert = modalView.getAlert('Address Not Deleted', false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);
                    errorAnimation.play(0);
                }
            }); 

        }
    }

    async companyControlsListener(e) {
        console.log('company table event');
        // Buttons
        const newBtn = e.target.closest('.summary__new-company-btn--companies');
        const editBtn = e.target.closest('.summary__edit-company-btn--companies');
        const hubspotBtn = e.target.closest('.company-summary__btn--hubspot');
        const deleteBtn = e.target.closest('.summary__delete-company-btn--companies');

        if(newBtn) {
            const modalExists = document.querySelector('.summary__modal');
            const modalHeaderExists = document.querySelector('.summary__modal-header');
            let errorAnimation;
            let successAnimation;

            let alert;
            const { 
                id,
                companyName,
                addresses,
                contacts
            } = this.state.companies.currentCompany;

            modalView.renderCompanyModal({
                companyNumber: this.getNextId('companies'),
                id,
                companyName,
                contact: contacts[this.state.companies.companyContactsPagination.index],
                address: addresses[this.state.companies.companyAddressesPagination.index]
            }, 'new-company');

            const companySummaryModal = document.querySelector('.summary__modal--new-company');
            const companySummaryModalHeader = document.querySelector('.summary__modal-header--new-company');

            // If a modal exists, the modal above will render behind the existing one, so animate it out
            // to give a smooth transition. Otherwise animate the new modal in
            if(modalExists) {
                gsap.timeline()
                    // AnimateModalOut removes the modal from the dom
                    .add(animation.animateSummaryModalOut(modalExists))
                    .add(animation.animateSummaryModalOut(modalHeaderExists), '<')
            } else {
                animation.animateSummaryModalIn(companySummaryModal);
                animation.animateSummaryModalIn(companySummaryModalHeader);
            }


            const alertWrapper = document.querySelector('.alert-wrapper');
            const companyForm = document.querySelector('.form--new-company');
            const closeBtn = document.querySelector('.form__close--new-company');
            const submitBtn = document.querySelector('.form__submit--new-company');

            // Get the field elements
            const fields = adminView.getCompanyFields('new-company');
            const { 
                companyNameField, 
                contactFirstNameField,
                contactSurnameField,
                contactPositionField,
                phoneField,
                emailField,
                firstLineField,
                secondLineField,
                cityField,
                countyField,
                postcodeField
            } = fields;

            // Get the animation for the application alerts (paused)
            errorAnimation = animation.animateAlert(alertWrapper, false);
            // Success animation is the same, but appended later (paused)
            successAnimation = animation.animateAlert(alertWrapper, true);

            closeBtn.addEventListener('click', () => {
                modalView.removeAdminModal('companies');
            });
            companyForm.addEventListener('submit', async e => {
                console.log('submit new');
                e.preventDefault();
                // Clear the alert wrapper contents
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                const data = adminView.getCompanyValues(fields); 
                const { changed, ...values } = data;
                const errors = validator.validateCompany(values);

                if(!errors) {
                    try {
                        const res = await this.Admin.createCompany(values);

                        if(res.status !== 201) {
                            throw new Error();
                        }else {  
                            alert = modalView.getAlert('Company Created', true);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);

                            successAnimation.play(0);

                            const newPage = this.state.companies.totalCompanies % this.state.companies.searchOptions.limit === 0;
                            const pages = paginationView.getTotalPages(this.state.companies.searchOptions.limit, this.state.companies.totalCompanies);
                            if(newPage) {
                                this.changeCompaniesPage(pages+1, null, null, 'new', res.data.company);
                            } else {
                               this.changeCompaniesPage(pages, null, null, null, res.data.company);
                            }

                            // // Set up an animation tl before data updated
                            // const tl = gsap.timeline();
                            // // Add loaders outside of animation
                            // adminView.renderAdminLoaders('companies');

                            // tl
                            //   .add(animation.animateAdminLoadersIn())
                            //   .add(animation.animateTableContentOut('companies'), '<')
                            //   .add(async() => {
                            //       // Get data (updates total companies)
                            //       await this.getData('companies', res.data.company.id);
                            //       this.state.companies.currentCompany = res.data.company;
                            //       this.resetNestedCompanyState();

                            //       // TABLE RENDERING/ANIMATION
                            //       this.renderCompaniesTable();

                            //     // Animate table body in (body, not content, because the table will already be present
                            //     // if adding a company), and the loaders out
                            //     gsap
                            //     .timeline()
                            //     .add(animation.animateTableBodyIn('companies'))
                            //     .add(animation.animateAdminLoadersOut(), '<')

                            //     // SUMMARY RENDERING/ANIMATION
                            //     // Switch summary (No animation needed as behind the modal)
                            //     summaryView.switchCompanySummary(this.companies[0], this.state.companies.searchOptions.searchTerm);

                            //     // // Set the pagination state (This does to the company jobs array what limit and offset do in the api call)
                            //     // this.initCompanyJobsState();

                            //     // // Add pagination for nested contacts, addresses, and jobs elements
                            //     this.addCompanyNestedPagination();

                            //     // Render the summary company jobs table
                            //     this.renderCompanyJobsTable();  

                            //     if(this.state.companies.paginatedJobs.length === 0) {
                            //         // render a placeholder saying 'no jobs'
                            //         document.querySelector('.table__content--company-jobs')
                            //         .insertAdjacentHTML('beforeend', adminView.createNoJobsPlaceholder());
                            //         // Animate the placeholder in
                            //         animation.animateTablePlaceholderIn(document.querySelector('.company-jobs-placeholder'));   

                            //     } 

                            //     // Add to the successAnimation once the getData() call has now completed
                            //     // NB: animating the modal out, not the summary out (which would also animate the modal)
                            //     successAnimation.add(animation.animateSummaryModalOut(companySummaryModal));
                            //     successAnimation.add(animation.animateSummaryModalOut(companySummaryModalHeader));

                            // // PAGINATION RENDERING
                            //     // Update pagination
                            //     const { totalCompanies, searchOptions: {index, limit} } = this.state.companies;
                            //     const { pages, page } = paginationView.calculatePagination(index, limit, totalCompanies);

                            //     console.log({pages}, {page}, {total});
                            //     paginationView.initPagination(pages, page, 'companies');

                            //   })


                        }
                    } catch(err) {
                        console.log(err)

                        if(err?.response?.data?.validationErrors.length > 0){
                            alert = modalView.getAlert(err.response.data.validationErrors[0].msg, false);
                        } else {
                            alert = modalView.getAlert('Company Not Created', false);
                        }
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        errorAnimation.play(0);
                    }
                } else {
                    if(errors.companyName) 
                        validator.setErrorFor(companyNameField, errors.companyName); 
                    else validator.setSuccessFor(companyNameField);
    
                    if(errors.firstName)  
                        validator.setErrorFor(contactFirstNameField, errors.firstName);
                    else validator.setSuccessFor(contactFirstNameField);
    
                    if(errors.lastName) 
                        validator.setErrorFor(contactSurnameField, errors.lastName);
                    else validator.setSuccessFor(contactSurnameField);
    
                    if(errors.position) 
                        validator.setErrorFor(contactPositionField, errors.position);
                    else validator.setSuccessFor(contactPositionField);
    
                    if(errors.phone) 
                        validator.setErrorFor(phoneField, errors.phone);
                    else validator.setSuccessFor(phoneField);
    
                    if(errors.email) 
                        validator.setErrorFor(emailField, errors.email);
                    else validator.setSuccessFor(emailField);
    
                    if(errors.firstLine) 
                        validator.setErrorFor(firstLineField, errors.firstLine);
                    else validator.setSuccessFor(firstLineField);
    
                    if(errors.secondLine) 
                        validator.setErrorFor(secondLineField, errors.secondLine); 
                    else validator.setSuccessFor(secondLineField);

                    if(errors.city) 
                        validator.setErrorFor(cityField, errors.city); 
                    else validator.setSuccessFor(cityField);
                    if(errors.county) 
                        validator.setErrorFor(countyField, errors.county); 
                    else validator.setSuccessFor(countyField);
                    if(errors.postcode) 
                        validator.setErrorFor(postcodeField, errors.postcode); 
                    else validator.setSuccessFor(postcodeField);
                }
            });

            // Validate each field on lost focus
            companyForm.addEventListener('focusout', e => {
                if(e.target === submitBtn) return;
                const data = adminView.getCompanyValues(fields);
                const {name, value} = this.getCompanyDataToValidate(e, data, fields);
                const error = validator.validateCompanyField({ name,  value });

                if(error) validator.setErrorFor(e.target, error);
                else validator.setSuccessFor(e.target);
            });

            Object.values(fields).forEach(field => {
                field.addEventListener('focus', e => {
                    if(field.parentElement.classList.contains('success')) {
                        field.parentElement.classList.remove('success');
                    }
                    if(field.parentElement.classList.contains('error')) {
                        field.parentElement.classList.remove('error');
                    }
                    // Remove the success msg
                    field.nextElementSibling.nextElementSibling.nextElementSibling.innerText = '';
                });
            });

        }
        if(editBtn) {
            const modalExists = document.querySelector('.summary__modal');
            const modalHeaderExists = document.querySelector('.summary__modal-header');
            let errorAnimation;
            let successAnimation;
            let alert;

            const { 
                id,
                companyName,
                addresses,
                contacts
            } = this.state.companies.currentCompany;

            modalView.renderCompanyModal({
                companyNumber: id,
                companyName,
                companyDate: this.state.companies.currentCompany.companyDate,
                contact: contacts[this.state.companies.companyContactsPagination.index],
                address: addresses[this.state.companies.companyAddressesPagination.index]
            }, 'edit-company');

            const companySummaryModal = document.querySelector('.summary__modal--edit-company');
            const companySummaryModalHeader = document.querySelector('.summary__modal-header--edit-company');

            // If a modal exists, the modal above will render behind the existing one, so animate it out
            // to give a smooth transition. Otherwise animate the new modal in
            if(modalExists) {
                gsap.timeline()
                    // AnimateModalOut removes the modal from the dom
                    .add(animation.animateSummaryModalOut(modalExists))
                    .add(animation.animateSummaryModalOut(modalHeaderExists), '<')
                    // .add(() => { modalView.removeAdminModal('existing', [ modalExists, modalHeaderExists ]) })
            } else {
                animation.animateSummaryModalIn(companySummaryModal);
                animation.animateSummaryModalIn(companySummaryModalHeader);
            }

            const alertWrapper = document.querySelector('.alert-wrapper');
            const companyForm = document.querySelector('.form--edit-company');
            const closeBtn = document.querySelector('.form__close--edit-company');

            const fields = adminView.getCompanyFields('edit-company');
            const { 
                companyNameField, 
                contactFirstNameField,
                contactSurnameField,
                contactPositionField,
                phoneField,
                emailField,
                firstLineField,
                secondLineField,
                cityField,
                countyField,
                postcodeField
            } = fields;

            // Get the animation for the application alerts (paused)
            errorAnimation = animation.animateAlert(alertWrapper, false, 'paused');
            // Success animation is the same, but appended later (paused)
            successAnimation = animation.animateAlert(alertWrapper, true, 'paused');

            closeBtn.addEventListener('click', () => {
                modalView.removeAdminModal('companies');
            });
            
            companyForm.addEventListener('submit', async e => {
                e.preventDefault();
                // Clear the alert wrapper contents
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                const data = adminView.getCompanyValues(fields, 'edit'); 
                const { changed, ...values } = data;

                
                if(!changed.length > 0) {
                    alert = modalView.getAlert(`No Fields Changed`, false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);

                    errorAnimation.play(0);
                    return;
                }

                const contactId = this.state.companies.currentCompany.contacts[this.state.companies.currentContactIndex].contactId;

                const addressId = this.state.companies.currentCompany.addresses[this.state.companies.currentAddressIndex].id;

                const errors = validator.validateCompany(values);

                if(!errors) {
                    try {
                        const res = await this.Admin.editCompany({ id, contactId, addressId, ...values });

                        if(res.status !== 201) throw new Error();

                        this.state.companies.currentCompany = res.data.company;

                        // Display the success modal
                        alert = modalView.getAlert('Company Edited', true);
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        successAnimation.play(0);

                        const page = paginationView.getCurrentPage(this.state.companies.searchOptions.index, this.state.companies.searchOptions.limit);

                        this.changeCompaniesPage(page, null, null, null, res.data.company);      

                        // // The animation should start before the updated data is fetched
                        // const tl = gsap.timeline();

                        // // Add loaders outside of animation
                        // adminView.renderAdminLoaders('companies');

                        // tl
                        //   .add(animation.animateAdminLoadersIn())
                        //   .add(animation.animateTableContentOut('companies'), '<')
                        //   .add(async() => {
                        //     // Get data (updates total companies)
                        //     await this.getData('companies');
                        //     // this.state.companies.currentCompany = res.data.company;

                        //   // TABLE RENDERING/ANIMATION
                        //     this.renderCompaniesTable();
                        //     // Animate table body in (body, not content, because the table will already be present
                        //     // if adding a company), and the loaders out
                        //     gsap
                        //       .timeline()
                        //       .add(animation.animateTableBodyIn('companies'))
                        //       .add(animation.animateAdminLoadersOut(), '<')

                        //   // SUMMARY RENDERING/ANIMATION
                        //     // Switch summary (No animation needed as behind the modal)
                        //     summaryView.switchCompanySummary(this.state.companies.currentCompany, this.state.companies.searchOptions.searchTerm);

                        //     // Add pagination for nested contacts, addresses, and jobs elements
                        //     this.addCompanyNestedPagination();

                        //     // Render the summary company jobs table
                        //     this.renderCompanyJobsTable();  

                        //     if(this.state.companies.paginatedJobs.length === 0) {
                        //         // render a placeholder saying 'no jobs'
                        //         document.querySelector('.table__content--company-jobs')
                        //         .insertAdjacentHTML('beforeend', adminView.createNoJobsPlaceholder());
                        //         // Animate the placeholder in
                        //         animation.animateTablePlaceholderIn(document.querySelector('.company-jobs-placeholder'));   
                        //     } 

                        //     // this.addCompanySummaryListeners();

                        //     // Add to the successAnimation once the getData() call has now completed
                        //     // NB: animating the modal out, not the summary out (which would also animate the modal)
                        //     successAnimation.add(animation.animateSummaryModalOut(companySummaryModal));
                        //     successAnimation.add(animation.animateSummaryModalOut(companySummaryModalHeader));
                            
                        //   // PAGINATION RENDERING
                        //     // Update pagination
                        //     const { totalCompanies, searchOptions: {index, limit} } = this.state.companies;
                        //     const { pages, page: current } = paginationView.calculatePagination(index, limit, totalCompanies);
                        //     paginationView.initPagination(pages, current, 'companies');

                        // })
                        





                    } catch(err) {
                        console.log(err);

                        if(err?.response?.data?.validationErrors.length > 0){
                            alert = modalView.getAlert(err.response.data.validationErrors[0].msg, false);
                        } else {
                            alert = modalView.getAlert('Company Not Edited', false);
                        }
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        errorAnimation.play(0);
                    }
                } else {
                    if(errors.companyName) 
                        validator.setErrorFor(companyNameField, errors.companyName); 
                    else validator.setSuccessFor(companyNameField);

                    if(errors.firstName)  
                        validator.setErrorFor(contactFirstNameField, errors.firstName);
                    else validator.setSuccessFor(contactFirstNameField);

                    if(errors.lastName) 
                        validator.setErrorFor(contactSurnameField, errors.lastName);
                    else validator.setSuccessFor(contactSurnameField);

                    if(errors.position) 
                        validator.setErrorFor(contactPositionField, errors.position);
                    else validator.setSuccessFor(contactPositionField);

                    if(errors.phone) 
                        validator.setErrorFor(phoneField, errors.phone);
                    else validator.setSuccessFor(phoneField);

                    if(errors.email) 
                        validator.setErrorFor(emailField, errors.email);
                    else validator.setSuccessFor(emailField);

                    if(errors.firstLine) 
                        validator.setErrorFor(firstLineField, errors.firstLine);
                    else validator.setSuccessFor(firstLineField);

                    if(errors.secondLine) 
                        validator.setErrorFor(secondLineField, errors.secondLine); 
                    else validator.setSuccessFor(secondLineField);

                    if(errors.city) 
                        validator.setErrorFor(cityField, errors.city); 
                    else validator.setSuccessFor(cityField);
                    if(errors.county) 
                        validator.setErrorFor(countyField, errors.county); 
                    else validator.setSuccessFor(countyField);
                    if(errors.postcode) 
                        validator.setErrorFor(postcodeField, errors.postcode); 
                    else validator.setSuccessFor(postcodeField);
                }
            });
        }
        if(deleteBtn) {
            const modalExists = document.querySelector('.summary__modal');
            const modalHeaderExists = document.querySelector('.summary__modal-header');
            let errorAnimation;
            let successAnimation;
            let alert;

            const companyId = document.querySelector('.summary__header-content').dataset.id;

            // Create, insert and animate the confirmation modal into the DOM
            const summaryWrapper = document.querySelector('.summary__content');
            const confirmationHtml = adminView.getDeleteCompanyHtml(companyId);
            summaryWrapper.insertAdjacentHTML('afterbegin', confirmationHtml);
            const confirmation = document.querySelector('.summary__modal--delete-company');

            // If a modal exists, the modal above will render behind the existing one, so animate it out
            // to give a smooth transition. Otherwise animate the new modal in
            if(modalExists) {
                gsap.timeline()
                    // AnimateModalOut removes the modal from the dom
                    .add(animation.animateSummaryModalOut(modalExists))
                    .add(animation.animateSummaryModalOut(modalHeaderExists), '<')
            } else {
                animation.animateSummaryModalIn(confirmation);
            }

            // Alert animation
            const alertWrapper = document.querySelector('.alert-wrapper');

            // Get the animation for the job alerts
            errorAnimation = animation.animateAlert(alertWrapper, false, true);
            // Success animation is the same, but is added to after async call to get data
            successAnimation = animation.animateAlert(alertWrapper, true, true);
        
            const confirm = document.querySelector('.confirmation__btn--confirm');
            const cancel = document.querySelector('.confirmation__btn--cancel');
            
            confirm.addEventListener('click', async() => {
                e.preventDefault();

                // Clear the alert wrapper contents
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                try {
                    const { status } = await this.Admin.deleteCompany(companyId);

                    if(status === 200) {
                        // Reset the nested pagination state
                        this.resetNestedCompanyState();
                        // Remove any search terms
                        this.state.companies.searchOptions.searchTerm = '';

                        alert = modalView.getAlert(`Company ${companyId} deleted`, true);
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        successAnimation.play(0);

                        const lastRow = this.state.companies.totalCompanies % this.state.companies.searchOptions.limit === 1;

                        // If it's the last item on the page
                        if(lastRow) {
                            const onLastPage = paginationView.onLastPage(this.state.companies.searchOptions.index, this.state.companies.searchOptions.limit, this.state.companies.totalCompanies);

                            const currentPage = paginationView.getCurrentPage(this.state.companies.searchOptions.index, this.state.companies.searchOptions.limit);
                            // LastPage? moveback. !LastPage? Stay on currentPage
                            this.changeCompaniesPage(onLastPage? null:currentPage, onLastPage? true:null, null, 'page-change');
                             
                        } else {
                            this.changeCompaniesPage(this.state.companies.currentPage, null, null);
                        }

                    } else {
                        throw new Error();
                    }

                } catch(err) {
                    // Clear the alert wrapper contents
                    while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);
                    
                    alert = modalView.getAlert(`Error: Job ${jobId} not deleted`, false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);
                    errorAnimation.play(0);

                    console.log(err)
                }
            });

            cancel.addEventListener('click', () => {
                animation.animateSummaryModalOut(confirmation)
            });
        }
    }


    // addCompanySummaryListeners() {
    //     const summaryWrapper = document.querySelector('.summary-wrapper');

    //     summaryWrapper.addEventListener('click', e => {
    //         const newBtn = e.target.closest('.company-summary__btn--new');
    //         const editBtn = e.target.closest('.company-summary__btn--edit');
    //         const deleteBtn = e.target.closest('.company-summary__btn--delete');
    //         const saveBtn = e.target.closest('.company-summary__btn--save');
    //         const hubspotBtn = e.target.closest('.company-summary__btn--hubspot');
    //         const saveNewBtn = e.target.closest('.company-summary__btn--save-new');
    
    //         const companyElements = summaryWrapper.querySelectorAll('.company-summary__item');
    //         const contactElements = summaryWrapper.querySelectorAll('.contact-summary__item');
    
    //         if(newBtn) {
    //             console.log('newBtn');
    //             // Save current company values
    //             const companyId = document.querySelector('.company-summary').dataset.id;
    //             this.state.companies.currentCompany = this.companies.find(company => company.id === parseInt(companyId));

    //             document.body.addEventListener('keydown', this.handleCtrlQ);

    //             adminView.changeSummaryIconState('creating', 'company');

    //             adminView.makeEditable(companyElements, true, []);
    //             adminView.makeAddressEditable(true, 'placeholder', this.state.companies.currentCompany.addresses[0]);
    //             adminView.makeEditable(contactElements, true, []);

    //             adminView.togglePlaceholders(companyElements, true, []);
    //             adminView.togglePlaceholders(document.querySelectorAll('.address-summary__item'), true, []);
    //             adminView.togglePlaceholders(contactElements, true, []);

    //             summaryWrapper.addEventListener('focusin', adminView.focusInNewCompanyHandler);
    //             summaryWrapper.addEventListener('focusout', adminView.focusOutNewCompanyHandler);
    //         };
    //         if(editBtn) {
    //             console.log('edit');
    //             // Save current company values
    //             const companyId = document.querySelector('.company-summary').dataset.id;
    //             this.state.companies.currentCompany = this.companies.find(company => company.id === parseInt(companyId));


    //             adminView.changeSummaryIconState('editing', 'company');

    //             adminView.makeEditable(companyElements, true, []);
    //             adminView.makeAddressEditable(true, 'value', this.state.companies.currentCompany.addresses[0]);
    //             adminView.makeEditable(contactElements, true, []);



    //             // adminView.togglePlaceholders(companyElements, true, []);
    //             // adminView.togglePlaceholders(document.querySelectorAll('.address-summary__item'), true, []);
    //             // adminView.togglePlaceholders(contactElements, true, []);

    //             document.body.addEventListener('keydown', this.handleCtrlQ);

    //             this.boundFocusOutEditCompanyHandler = adminView.focusOutEditCompanyHandler.bind(this, this.state.companies.currentCompany);
    //             summaryWrapper.addEventListener('focusin', adminView.focusInEditCompanyHandler);
    //             summaryWrapper.addEventListener('focusout', this.boundFocusOutEditCompanyHandler);
    //         }
    //         if(deleteBtn) {
    //             console.log('delete');
    //             // Get company id
    //             const companyId = document.querySelector('.company-summary').dataset.id;

    //             this.Admin.deleteCompany(companyId).then(res => {
    //                 // @TODO: handle success/failure
                    
    //                 // If it's the last company in the table, move back one page
    //                 if(this.companies.length <= 1) {
    //                     this.movePageBackwards(this.state.companies);
    //                 }

    //                 return this.Admin.getCompanies(this.state.companies.searchOptions);
    //             }).then(res => {
    //                 // @TODO: handle success/failure
    //                 this.companies = res.data.companies;
    //                 this.state.companies.totalCompanies = res.data.total;

    //                 this.state.companies.currentCompany = this.companies[0];

    //                 this.renderCompaniesTable();

    //                 // Repopulate the summaries
    //                 adminView.populateCompanySummary(this.state.companies.currentCompany);
    //                 adminView.populateAddressSummary(this.state.companies.currentCompany.id, this.state.companies.currentCompany.addresses[0]);
    //                 adminView.populateContactSummary(this.state.companies.currentCompany.id, this.state.companies.currentCompany.people[0]);
    //             }).catch(err => console.log(err));

    //         }
    //         if(saveBtn) {
    //             console.log('save');
    //             // Remove the item listeners
    //             document.body.removeEventListener('keydown', this.handleCtrlQ);

    //             summaryWrapper.removeEventListener('focusin', adminView.focusInNewCompanyHandler);
    //             summaryWrapper.removeEventListener('focusout', adminView.focusOutNewCompanyHandler);

    //             // Get all user input
    //             const companyForm = adminView.getNewCompany();
    //             const addressForm = adminView.getNewAddress();
    //             const contactForm = adminView.getNewContact();
                
    //             const formData = new FormData();

    //             for(let [key, value] of companyForm.entries()) formData.append(`${key}`, value);
    //             for(let [key, value] of addressForm.entries()) formData.append(`${key}`, value);
    //             for(let [key, value] of contactForm.entries()) formData.append(`${key}`, value);

    //             // for(let [key, value] of addressForm.entries()) console.log(`${key}`, value);
    //             // for(let [key, value] of contactForm.entries()) console.log(`${key}`, value);

                
    //             // Get Company, Address and Contact ids
    //             const companyId = adminView.getSummaryCompanyId();
    //             const addressId = adminView.getSummaryAddressId();
    //             const contactId = adminView.getSummaryContactId();

    //             if(companyForm && addressForm && contactForm) {
    //                 let formCompany;

    //                 // Make API call here to create company
    //                 this.Admin.editCompany(companyId, contactId, addressId, formData)
    //                     .then(response => {
    //                         if(response.status !== 200) {
    //                             // @TODO: error handling
    //                             console.log('error');
    //                         }
    //                         formCompany = response.data.company;

    //                         return this.Admin.getCompanies(this.state.companies.searchOptions);
    //                     })
    //                     .then(response => {
    //                         this.state.companies.totalCompanies = response.data.total;
    //                         this.companies = response.data.companies;

    //                         // Search for the recently created company in the returned company list
    //                         const currentCompany = this.companies.find(company => {
    //                             return formCompany.id === company.id;
    //                         });

    //                         this.state.companies.currentCompany = currentCompany? currentCompany : this.companies[0];

    //                         // Change the address summary back to a text area
    //                         // Change the contact and company summary inputs to non editable
    //                         adminView.makeEditable(companyElements, false, []);
    //                         adminView.makeAddressEditable(false, '', this.state.companies.currentCompany.addresses[0]);
    //                         adminView.makeEditable(contactElements, false, []);

    //                         // Repopulate the summaries
    //                         adminView.populateCompanySummary(this.state.companies.currentCompany);
    //                         adminView.populateAddressSummary(this.state.companies.currentCompany.id, this.state.companies.currentCompany.addresses[0]);
    //                         adminView.populateContactSummary(this.state.companies.currentCompany.id, this.state.companies.currentCompany.people[0]);

    //                         adminView.changeSummaryIconState('edited', 'company');

    //                         this.renderCompaniesTable();
    //                     }).catch(err => {
    //                         console.log(err);
    //                     })
    //             }
    //         }
    //         if(hubspotBtn) console.log('hub');
    //         if(saveNewBtn) {
    //             console.log('savenewBtn');
    //             document.body.removeEventListener('keydown', this.handleCtrlQ);
    //             summaryWrapper.removeEventListener('focusin', adminView.focusInNewCompanyHandler);
    //             summaryWrapper.removeEventListener('focusout', adminView.focusOutNewCompanyHandler);

    //             // Get all user input
    //             const companyForm = adminView.getNewCompany();
    //             const addressForm = adminView.getNewAddress();
    //             const contactForm = adminView.getNewContact();

    //             const formData = new FormData();

    //             for(let [key, value] of companyForm.entries()) formData.append(`${key}`, value);
    //             for(let [key, value] of addressForm.entries()) formData.append(`${key}`, value);
    //             for(let [key, value] of contactForm.entries()) formData.append(`${key}`, value);

    //             for(let [key, value] of addressForm.entries()) console.log(`${key}`, value);

    //             if(companyForm && addressForm && contactForm) {
    //                 let formCompany;

    //                 // Make API call here to create company
    //                 this.Admin
    //                     .createCompany(formData)
    //                     .then(response => {
    //                         if(response.status !== 201) {
    //                             // @TODO: error handling
    //                             console.log('error');
    //                         }
    //                         formCompany = response.data.company;

    //                         return this.Admin.getCompanies(this.state.companies.searchOptions);
    //                     })
    //                     .then(response => {
    //                         this.state.companies.totalCompanies = response.data.total;
    //                         this.companies = response.data.companies;

    //                         // Search for the recently created company in the returned company list
    //                         const currentCompany = this.companies.find(company => {
    //                             return formCompany.id === company.id;
    //                         });

    //                         this.state.companies.currentCompany = currentCompany? currentCompany : this.companies[0];

    //                         // Change the address summary back to a text area
    //                         // Change the contact and company summary inputs to non editable
    //                         adminView.makeEditable(companyElements, false, []);
    //                         adminView.makeAddressEditable(false, '', this.state.companies.currentCompany.addresses[0]);
    //                         adminView.makeEditable(contactElements, false, []);

    //                         // Repopulate the summaries
    //                         adminView.populateCompanySummary(this.state.companies.currentCompany);
    //                         adminView.populateAddressSummary(this.state.companies.currentCompany.id, this.state.companies.currentCompany.addresses[0]);
    //                         adminView.populateContactSummary(this.state.companies.currentCompany.id, this.state.companies.currentCompany.people[0]);

    //                         adminView.changeSummaryIconState('created', 'company');

    //                         this.renderCompaniesTable();

    //                     })
    //                     .catch(err => console.log(err));
    //                 // Get companies and render companies table

    //                 // Populate the summary forms with the created company if visible in the table, [0] if not
    //             } else {
    //                 // @TODO: handle validation problems here (make the form methods return an array with problem fields)
    //             }
    //         }
    
    //     });
    // }

    resetNestedCompanyState() {
        // Limit should be at least 1 (because one must be displayed)
        this.state.companies.companyJobsPagination.index = 0;
        this.state.companies.companyJobsPagination.limit = 1;
        this.state.companies.companyJobsPagination.totalJobs = 0;
        this.state.companies.companyJobsPagination.currentPage = 1;

        this.state.companies.companyContactsPagination.index = 0;
        this.state.companies.companyContactsPagination.limit = 1;
        this.state.companies.companyContactsPagination.totalContacts = 0;
        this.state.companies.companyContactsPagination.currentPage = 1;

        this.state.companies.companyAddressesPagination.index = 0;
        this.state.companies.companyAddressesPagination.limit = 1;
        this.state.companies.companyAddressesPagination.totalAddresses = 0;
        this.state.companies.companyAddressesPagination.currentPage = 1;

        this.state.companies.paginatedJobs = [];
    }

    // saveBtn + newBtn = currently editing
    // saveBtn + editBtn = currently creating
    createUserLostFocus(e) {
        const userSummary = document.querySelector('.user-summary');
        const editableContent = document.querySelector('.user-summary__item--editable');

        // Targets are items that are ok to click on (ie won't return true)
        const editBtnTarget = e.target.closest('.user-summary__btn--edit');
        const itemTarget = e.target.closest('.user-summary__item');
        const saveTarget = e.target.closest('.user-summary__btn--save-new');
        const uploadTarget = e.target.closest('.user-summary__file-picker');

        
        const editBtn = document.querySelector('.user-summary__btn--edit');
        if(userSummary && editableContent && !editBtnTarget && !itemTarget && !saveTarget && !uploadTarget && editBtn) return true;
        return false;
    }
    editUserLostFocus(e) {
        const userSummary = document.querySelector('.user-summary');
        const editableContent = document.querySelector('.user-summary__item--editable');
        const editBtnTarget = e.target.closest('.user-summary__btn--edit');
        const itemTarget = e.target.closest('.user-summary__item');
        const saveTarget = e.target.closest('.user-summary__btn--save');
        const uploadCv = e.target.closest('.user-summary__file-picker');

        const newBtn = document.querySelector('.user-summary__btn--new');

        // If user summary is present, editable, and the edit btn, editable elements, or save btn have not been clicked
        if(userSummary && editableContent && !editBtnTarget && !itemTarget && !saveTarget && !uploadCv && newBtn) {
            return true;
        } 
        
        return false;
    }
    createJobLostFocus(e) {
        const jobSummary = document.querySelector('.job-summary');
        const editableContent = document.querySelector('[class*="--editable"]');
        const editBtnTarget = e.target.closest('.job-summary__btn--edit');
        const itemTarget = e.target.closest('.job-summary__field');
        const saveTarget = e.target.closest('.job-summary__btn--save-new');
        const checkboxTarget = e.target.closest('.job-summary__featured-checkbox');
        // Returns false if present, ie if the newBtn is on screen 
        // The newBtn is present when both adding a new job && editing a current job
        const editBtn = document.querySelector('.job-summary__btn--edit');

        if(jobSummary && editableContent && !editBtnTarget && !itemTarget && !saveTarget && !checkboxTarget && editBtn) {
            return true;
        } 
        return false;
    }
    editJobLostFocus(e) {
        const jobSummary = document.querySelector('.job-summary');
        const editableContent = document.querySelector('[class*="--editable"]');
        const editBtnTarget = e.target.closest('.job-summary__btn--edit');
        const itemTarget = e.target.closest('[class*="--editable"]');
        const saveTarget = e.target.closest('.job-summary__btn--save');
        const checkboxTarget = e.target.closest('.job-summary__featured-checkbox');

        // Returns false if present, ie if editBtn on screen
        // Present whenever not editing
        const newBtn = document.querySelector('.job-summary__btn--new');

        if(jobSummary && editableContent && !editBtnTarget && !itemTarget && !checkboxTarget && !saveTarget && newBtn) {
            return true;
        }
        return false;
    }
    createCompanyLostFocus(e) {
        const summaryWrapper = document.querySelector('.summary-wrapper');
        const editableContent = document.querySelector('.company-summary__item--editable');
        
        const itemTarget = e.target.closest('.company-summary__item') || e.target.closest('.contact-summary__item') || e.target.closest('.address-summary__item');
        const saveTarget = e.target.closest('.company-summary__btn--save-new');

        const editBtn = document.querySelector('.company-summary__btn--edit');

        if(summaryWrapper && editableContent && !itemTarget && !saveTarget && editBtn) {
            return true;
        } 
        return false;
    }
    editCompanyLostFocus(e) {
        const summaryWrapper = document.querySelector('.summary-wrapper');
        const editableContent = document.querySelector('.company-summary__item--editable');
        const companySummarySaveBtn = document.querySelector('.company-summary__btn--save');

        const saveTarget = e.target.closest('.company-summary__btn--save');
        const itemTarget = e.target.closest('.company-summary__item') || e.target.closest('.contact-summary__item') || e.target.closest('.address-summary__item');

        if(summaryWrapper && editableContent && companySummarySaveBtn && !saveTarget && !itemTarget)
            return true;
        
        return false;
    }

    async handlePaginationEvent(e) {
        // Check if the pagaination component has been clicked on
        if(!e.target.closest('.pagination-wrapper')) return;

        // Find the element that has been clicked

        // Applications Table
        const applicationsOption = e.target.closest('.pagination__item--applications');
        const applicationsPrevious = e.target.closest('.pagination__previous--applications');
        const applicationsNext = e.target.closest('.pagination__next--applications');
        
        // Users Table
        const usersOption = e.target.closest('.pagination__item--users');
        const usersPrevious = e.target.closest('.pagination__previous--users');
        const usersNext = e.target.closest('.pagination__next--users');

        // Jobs Table
        const jobsOption = e.target.closest('.custom-select-option--jobs');
        const jobsOptionValue = jobsOption? jobsOption.dataset.value : null;
        const jobsPrevious = e.target.closest('.pagination__previous--jobs');
        const jobsNext = e.target.closest('.pagination__next--jobs');

        // Companies Table
        const companiesOption = e.target.closest('.custom-select-option--companies');
        const companiesOptionValue = companiesOption? companiesOption.dataset.value : null;
        const companiesPrevious = e.target.closest('.pagination__previous--companies');
        const companiesNext = e.target.closest('.pagination__next--companies');

        // Company Summary Jobs Table
        const companyJobsOption = e.target.closest('.custom-select-option--company-jobs');
        const companyJobsPrevious = e.target.closest('.pagination__previous--company-jobs');
        const companyJobsNext = e.target.closest('.pagination__next--company-jobs');

        // Company Summary Contacts
        const companyContactsOption = e.target.closest('.custom-select-option--company-contacts');
        const companyContactsOptionValue = companyContactsOption? companyContactsOption.dataset.value : null;
        const companyContactsPrevious = e.target.closest('.pagination__previous--company-contacts');
        const companyContactsNext = e.target.closest('.pagination__next--company-contacts');

        // Company Summary Contacts
        const companyAddressesOption = e.target.closest('.custom-select-option--company-addresses');
        const companyAddressesPrevious = e.target.closest('.pagination__previous--company-addresses');
        const companyAddressesNext = e.target.closest('.pagination__next--company-addresses');

        const applications = applicationsPrevious || applicationsNext || applicationsOption;
        const jobs = jobsPrevious || jobsNext || jobsOption;
        const companies = companiesPrevious || companiesNext || companiesOption;
        const companyJobs = companyJobsPrevious || companyJobsNext || companyJobsOption;
        const companyContacts = companyContactsPrevious || companyContactsNext || companyContactsOption;
        const companyAddresses = companyAddressesPrevious || companyAddressesNext || companyAddressesOption;
        const users = usersPrevious || usersNext || usersOption;

        // If no pagination btns are clicked, return
        if(!applications && !jobs && !companies && !users && !companyJobs && !companyContacts && !companyAddresses) return;

        // // if there's an animation still running, ignore input
        // if(this.state.isActivePaginationAnimation) {
        //     console.log('ignoring');
        //     return;
        // }
        // // if there's an active request already, cancel the request and return
        // if(this.state.isActiveRequest){
        //     cancelTokenSource();
        //     this.state.isActiveRequest = false;
        //     console.log('cancelled');
        //     return;
        // }

        // set both animation and request state
        this.state.isActivePaginationAnimation = true;
        this.state.isActiveRequest = true;

        // Choose which table's pagination is being updated, and with which functions
        if(users) {
            this.handleUsersPagination(usersOption, usersPrevious, usersNext);
        } else if(jobs){
            this.changeJobsPage(jobsOptionValue, jobsPrevious, jobsNext);
        } else if(companies) {
            this.changeCompaniesPage(companiesOptionValue, companiesPrevious, companiesNext);
        } else if(companyJobs) {
            this.handleCompanyJobsPagination(companyJobsOption, companyJobsPrevious, companyJobsNext);
        } else if(companyContacts){
            this.handleCompanyContactsPagination(companyContactsOptionValue, companyContactsPrevious, companyContactsNext);
        } else if(companyAddresses) {
            this.handleCompanyAddressesPagination(companyAddressesOption, companyAddressesPrevious, companyAddressesNext);
        } else if(applications) {
            this.handleApplicationsPagination(applicationsOption, applicationsPrevious, applicationsNext);
        } else {
            return;
        }
    };

    handleUsersPagination(option, previous, next) {
        const userState = this.state.users;
        // If the page changes the active user should be the first in the table
        userState.currentUser = this.users[0];
        const pages = Math.ceil(userState.totalUsers / userState.searchOptions.limit);

        if(previous && !(userState.currentPage === 1)) {
            this.movePageBackwards(userState);
        }
        if(next && !(userState.currentPage === pages) ) {
            this.movePageForwards(userState);
        }
        if(option) {
            this.movePage(userState, option);
        }
        this.Admin.getUsers(this.state.users.searchOptions)
            .then((res) => {
                if(res.data.applicants) {
                    // Store and render data
                    this.users = res.data.applicants;
                    this.state.users.totalUsers = res.data.total;

                    this.renderUsersTable();

                    // Initialise user summary
                    adminView.populateUserSummary(this.users[0]);
                }
            })
            .catch(err => console.log(err));
    };

    setJobsPaginationState(option, previous, next) {
        const jobState = this.state.jobs;
        // // Changing page = new current job
        // jobState.currentJob = this.jobs[0];

        const pages = Math.ceil(jobState.totalJobs / jobState.searchOptions.limit);

        if(previous && !(jobState.currentPage === 1)) {
            console.log('backwards');

            this.movePageBackwards(jobState);
        }
        if(next && !(jobState.currentPage === pages)) {
            console.log('forwards');

            this.movePageForwards(jobState);
        }
        if(option) {
            console.log('move');

            this.movePage(jobState, option);
        }

    }

    // async handleJobPagination(jobBtn, jobPrevious, jobNext) {
    //     console.log('here?');
    //     adminView.renderAdminLoaders();

    //     const tl = gsap.timeline();
    //     tl.add(adminView.animateTableContentOut())
    //       .add(adminView.animateAdminLoadersIn(), '<')

    //     // Set the state
    //     this.setJobsPaginationState(jobBtn, jobPrevious, jobNext);
    //     // Update the view
    //     paginationView.updatePaginationBtns(this.state.jobs.currentPage -1);

    //     // get the new data
    //     await this.getData('jobs');
    //     this.state.isActiveRequest = false;

    //     // Update the current job state
    //     this.state.jobs.currentJob = this.jobs[0];
    //     this.state.isActiveRequest = false;

    //     console.log('test');
    //     this.changeTablePageAnimation(tl, 'jobs');
    // }



    // Add to function above
    //     // If there's an active request, cancel it
    //     if(this.state.isActiveRequest) { 
    //         cancelTokenSource();
    //         this.state.isActiveRequest = false;
    //         console.log('cancelled')
    //     }



    // setCompanyPaginationState(companyOption, companyPrevious, companyNext) {
    //     const companyState = this.state.companies;
    //     const pages = Math.ceil(companyState.totalCompanies / companyState.searchOptions.limit);

    //     if(companyPrevious && !(companyState.currentPage < 1)) {
    //         console.log('backwards');

    //         this.movePageBackwards(companyState);
    //     }
    //     if(companyNext && !(companyState.currentPage >= pages)) {
    //         console.log('forwards');

    //         this.movePageForwards(companyState);
    //     }
    //     if(companyOption) {
    //         console.log('move');
    //         const page = companyOption.dataset.value;

    //         this.movePage(companyState, page);
    //     }
    // }

    // setCompanyContactsState(option, previous, next, state, pages) {
    //     console.log(state.currentPage, pages);

    //     if(previous && !(state.currentPage < 1)) {
    //         console.log('backwards');

    //         this.movePageBackwards(state);
    //     }
    //     if(next && !(state.currentPage >= pages)) {
    //         console.log('forwards');

    //         this.movePageForwards(state);
    //     }
    //     if(option) {
    //         console.log('move');
    //         const page = option.dataset.value;

    //         this.movePage(state, page);
    //     }
    // }

    setCurrentPage(option, previous, next, state, pages) {

        if(previous && !(state.currentPage === 1)) {
            console.log('backwards');

            this.movePageBackwards(state);
        }
        if(next && !(state.currentPage === pages)) {
            console.log('forwards');

            this.movePageForwards(state);
        }
        if(option) {
            console.log('move');
            this.movePage(state, option);
        }
    }

    // Pagination Changed means the number of pages has changed
    // A new contact means the page has changed to an existing one
    // Null for both means the existing page is being updated
    handleCompanyContactsPagination(option, previous, next, paginationChanged) {

        const companyContactsState = this.state.companies.companyContactsPagination;
        const pages = paginationView.getTotalPages(companyContactsState.limit, companyContactsState.totalContacts);

        const tl = gsap.timeline();
        tl.add(animation.animateContactSectionOut())
          .add(() => {
            // Set the pagination state (This does to the company jobs array what limit and offset do in the api call
            // and sets the paginatedJobs array for the company
            this.setCurrentPage(option, previous, next, companyContactsState, pages);

            // Set the current contact (because only 1 is displayed it's just the index)
            // If called from a fn that adds/deletes a contact, the index is changed there, otherwise it's changed by the 'setCurrentPage' fn 
            const currentContact = this.state.companies.currentCompany.contacts[companyContactsState.index]
            summaryView.switchContact(currentContact);

            // Animate the company jobs table back in
            animation.animateContactSectionIn();

            if(paginationChanged) {
                const page = paginationView.getCurrentPage(companyContactsState.index, companyContactsState.limit);
                // Pages calculated before total updated by call to getData
                const newTotalPages = paginationView.getTotalPages(companyContactsState.limit, companyContactsState.totalContacts);

                paginationView.initPagination(newTotalPages, page, 'company-contacts');
            } else {
                paginationView.changePagination(companyContactsState.index, companyContactsState.limit, companyContactsState.totalContacts, 'company-contacts');
            }
        })
    }

    handleCompanyAddressesPagination(option, previous, next, paginationChanged) {
        const companyAddressesState = this.state.companies.companyAddressesPagination;
        // const pages = Math.ceil(companyAddressesState.totalAddresses / companyAddressesState.limit);
        const pages = paginationView.getTotalPages(companyAddressesState.limit, companyAddressesState.totalAddresses);

        // Pagination flow:
        const tl = gsap.timeline();
        tl.add(animation.animateAddressSectionOut())
          .add(() => {
            // Set the pagination state (This does to the company jobs array what limit and offset do in the api call
            // and sets the paginatedJobs array for the company
            this.setCurrentPage(option, previous, next, companyAddressesState, pages);
            // Set the current contact (because only 1 is displayed it's just the index)
            const currentAddress = this.state.companies.currentCompany.addresses[companyAddressesState.index]
            summaryView.switchAddress(currentAddress);

            // Animate the company jobs table back in
            animation.animateAddressSectionIn();

            if(paginationChanged) {
                const page = paginationView.getCurrentPage(companyAddressesState.index, companyAddressesState.limit);
                // Previous pages calculated before total updated by call to getData
                const newTotalPages = paginationView.getTotalPages(companyAddressesState.limit, companyAddressesState.totalAddresses);
                paginationView.initPagination(newTotalPages, page, 'company-addresses');
            } else {
                paginationView.changePagination(companyAddressesState.index, companyAddressesState.limit, companyAddressesState.totalAddresses, 'company-addresses');
            }
        })
    }

    handleCompanyJobsPagination(option, previous, next) {
        const companyJobsState = this.state.companies.companyJobsPagination;
        const pages = paginationView.getTotalPages(companyJobsState.totalJobs, companyJobsState.limit);

        const tl = gsap.timeline();
        tl.add(animation.animateCompanyJobSectionOut())
          .add(() => {
            // Set the pagination state (This does to the company jobs array what limit and offset do in the api call
            // and sets the paginatedJobs array for the company
            this.setCurrentPage(option, previous, next, companyJobsState, pages);

            // Paginate the companyJobs array
            const { index, limit } = this.state.companies.companyJobsPagination;
            this.state.companies.paginatedJobs = this.state.companies.currentCompany.jobs.slice(index, index + limit);

            this.renderCompanyJobsTable();

            // Animate the company jobs table back in
            animation.animateCompanyJobSectionIn();

            paginationView.updatePaginationBtns(pages, companyJobsState.currentPage, 'company-jobs');

            // Get the custom select / eventTarget
            const customSelect = document.querySelector('.custom-select-container--company-jobs');

            if(previous) {
                const eventBackwards = new CustomEvent('companyJobsBackwards', { detail: { page: companyJobsState.currentPage } });
                customSelect.dispatchEvent(eventBackwards, { bubbles: true });
            }
            if(next) {
                const eventForwards = new CustomEvent('companyJobsForwards', { detail: { page: companyJobsState.currentPage } });
                customSelect.dispatchEvent(eventForwards, { bubbles: true });
            }
        })
    }

    // Pagination Changed means the number of pages has changed
    // A new company means the page has changed to an existing one
    async changeCompaniesPage(option, previous, next, paginationChanged, newCompany) {
        const tl = gsap.timeline();
        // Set the pagination state
        const companyState = this.state.companies;
        const pages = paginationView.getTotalPages(companyState.searchOptions.limit, companyState.totalCompanies);
        this.setCurrentPage(option, previous, next, companyState, pages);

        // ANIMATION ORDER/LOGIC
        // 1: Place the loaders in the DOM
        // 2: Animate the loaders in, while animating the table body out
        // 3: The following functions have to be called in a function added to the main timeline
        //    which will execute in order (& wait for the async call)
        //    4: Update the data/state

        // SUMMARY (NESTED TL)
        //    5: Animate the summary out
        //    6: Switch summary in a function nested in the new timeline
        //    7: Animate the summary back in

        // TABLE (NESTED TL)
        //    8: Render the table
        //    9: Animate the new table body in / and the loaders out in a new nested timeline


        // 1: Render loaders
        adminView.renderAdminLoaders('companies');

        // 2: Animate the loaders in / table body out
        tl.add(animation.animateTableContentOut('companies'))
          .add(animation.animateAdminLoadersIn(), '<')
          // 3: Nest subsequent functions so they execute after the above animations
          .add(async () => {
              // 4: Update the data and state (getData fn also updates the total count)
              await this.getData('companies', newCompany?.id);
              this.state.companies.currentCompany = newCompany || this.companies[0];

              // @TODO: Should it reset the totals?
              this.resetNestedCompanyState();
              this.state.isActiveRequest = false;
            // SUMMARY (NESTED TL)
              // 5: Animate the Summary out (modal animation handled in animateSummaryOut)
              gsap
                .timeline().add(animation.animateSummaryOut('companies'))
                // 6: Switch the summary *after* the out animation has occurred
                .add(() => {
                    summaryView.switchCompanySummary(newCompany || this.companies[0], this.state.companies.searchOptions.searchTerm);

                    // Unlike the Jobs and Apps summaries, clicking another row has to re-calculate pagination
                    // on nested tables and contact/address sections

                        // Set the pagination state (This does to the company jobs array what limit and offset do in the api call)
                        this.initCompanyJobsState();
                    //  Add pagination for nested contacts, addresses, and jobs elements
                        this.addCompanyNestedPagination();
                        this.renderCompanyJobsTable()

                    // 7: Animate the summary back in
                    animation.animateCompanySummaryIn(this.state.companies.paginatedJobs.length);

                    
                    // If there's a search tag re-add the listener
                    const tag = document.querySelector('.summary__tag');

                    if(tag) {
                        tag.addEventListener('click', e => {
            
                            // // Tag is embedded in the search div, if it propagates it toggles the search input
                            gsap.to(tag, { opacity: 0, duration: .4, onComplete: () => tag.parentElement.removeChild(tag) })
                        });
                    }


              })  

            // TABLE (NESTED TL) 
              // 8: Change table
              this.renderCompaniesTable();
              // 9: Animate table body in (body, not content, because the table will already be present)
              //    and the loaders out
              gsap
                .timeline()
                .add(animation.animateTableBodyIn('companies'))
                .add(animation.animateAdminLoadersOut(), '<')

            // CALCULATE/RENDER PAGINATION
            const { totalCompanies, searchOptions: {index, limit} } = this.state.companies;

            // const { pages, page: current } = paginationView.calculatePagination(index, limit, totalCompanies);

            // If the pagination event came from a deletion, reinitialise the pagination view (removing a select option)
            // Adding is dealt with in a separate fn, not by calling handlePagination
            if(paginationChanged) {
                const page = paginationView.getCurrentPage(index, limit);
                // Pages calculated before total updated by call to getData
                const newTotalPages = paginationView.getTotalPages(limit, totalCompanies);
                paginationView.initPagination(newTotalPages, page, 'companies');
            } else {
                paginationView.changePagination(index, limit, totalCompanies, 'companies');

            }

            // const customSelect = document.querySelector('.custom-select-container--companies');
            // paginationView.updatePaginationBtns(pages, current, 'companies', customSelect);

            // if(previous || next || option) {
            //     const moveEvent = new CustomEvent('companiesChange', { detail: { page: companyState.currentPage } });
            //     customSelect.dispatchEvent(moveEvent, { bubbles: true });
            // }

        })

        // const companyState = this.state.companies;
        // // New page, new current company
        // companyState.currentCompany = this.companies[0];
        // const pages = Math.ceil(companyState.totalCompanies / companyState.searchOptions.limit);
 
        // if(companyPrevious && !(companyState.currentPage < 1)) {
        //     this.movePageBackwards(companyState);
        // }
        // if(companyNext && !(companyState.currentPage >= pages-1) ) {
        //     this.movePageForwards(companyState);
        // }
        // if(companyBtn) {
        //     this.movePage(companyState, companyBtn);
        // }
        // this.Admin.getCompanies(this.state.companies.searchOptions)
        //     .then((res) => {
        //         if(res.data.companies) {
        //             // Store and render data
        //             this.companies = res.data.companies;
        //             this.state.companies.totalCompanies = res.data.total;

        //             this.renderCompaniesTable();
        //             // Initialise company summary
        //             adminView.populateCompanySummary(this.companies[0]);
        //             adminView.populateAddressSummary(this.companies[0].id, this.companies[0].addresses[0]);
        //             adminView.populateContactSummary(this.companies[0].id, this.companies[0].people[0]);
        //         }
        //     })
        //     .catch(err => console.log(err));
    };

    // The handler to run when a pagination button is clicked
    async requestApplicationsData() {
        
        try {
            const { data: { applications: { rows, count } } } = await this.Admin.getApplications(this.state.applications.searchOptions);
        
            this.applications = rows;
            this.state.applications.totalApplications = count;

        } catch(err) {
            this.state.isActiveRequest = false;
            if (axios.isCancel(err)) {
                console.log('Request canceled', err.message);
            } else {
                // handle error
                console.log(err);
            }
        }
        
    }

    setApplicationsPagination(option, previous, next) {
        const applicationState = this.state.applications;
      
        // // New page, new application
        // applicationState.currentApplication = this.applications[0];

        const pages = Math.ceil(applicationState.totalApplications / applicationState.searchOptions.limit);

        if(previous && !(applicationState.currentPage === 1)) {
            console.log('backwards');
            this.movePageBackwards(applicationState);
        } else if(next && !(applicationState.currentPage === pages)) {
            console.log('forwards');
            this.movePageForwards(applicationState);
        } else if(option) {
            console.log('move');
            this.movePage(applicationState, option);
        }

    }

    async handleApplicationsPagination(option, previous, next, paginationChanged, newApplication) {
        const tl = gsap.timeline();

        // Set the new page
        const applicationsState = this.state.applications;

        const pages = paginationView.getTotalPages(applicationsState.searchOptions.limit,applicationsState.totalApplications);
        this.setCurrentPage(option, previous, next, applicationsState, pages);
       
        // // Set the pagination state
        // this.setApplicationsPagination(option, previous, next);
        
        // ANIMATION ORDER/LOGIC
        // 1: Place the loaders in the DOM
        // 2: Animate the loaders in, while animating the table body out
        // 3: The following functions have to be called in a function added to the main timeline
        //    which will execute in order (& wait for the async call)
        //    4: Update the data/state

        // SUMMARY (NESTED TL)
        //    5: Animate the summary out
        //    6: Switch summary in a function nested in the new timeline
        //    7: Animate the summary back in

        // TABLE (NESTED TL)
        //    8: Render the table
        //    9: Animate the new table body in / and the loaders out in a new nested timeline

        
        // 1: Render loaders
        adminView.renderAdminLoaders('applications');

        // 2: Animate the loaders in / table body out
        tl.add(animation.animateTableContentOut('applications'))
          .add(animation.animateAdminLoadersIn(), '<')
          // 3: Nest subsequent functions so they execute after the above animations
          .add(async () => {
              // 4: Update the data and state (getData fn also updates the total count)
              await this.getData('applications', newApplication?.id);
              this.state.applications.currentApplication = this.applications[0];
              this.state.isActiveRequest = false;

            // SUMMARY (NESTED TL)
              // 5: Animate the Summary out (modal animation handled in animateSummaryOut)
              gsap
                .timeline().add(animation.animateSummaryOut('applications'))
                // 6: Switch the summary *after* the out animation has occurred
                .add(() => {
                    summaryView.switchApplicationSummary(newApplication || this.applications[0], this.state.applications.searchOptions.searchTerm);
                    // 7: Animate the summary back in
                    animation.animateSummaryIn();
                })  

            // TABLE (NESTED TL) 
              // 8: Change table
              this.renderApplicationTable();
              // 9: Animate table body in (body, not content, because the table will already be present)
              //    and the loaders out
              gsap
                .timeline()
                .add(animation.animateTableBodyIn('applications'))
                .add(animation.animateAdminLoadersOut(), '<')

            
            // CHANGE PAGINATION
              const { totalApplications, searchOptions: {index, limit} } = this.state.applications;

              // If the pagination event came from a deletion or addition that changed the number of pages, 
              // reinitialise the pagination view (removing/adding a select option)
              if(paginationChanged) {
                const page = paginationView.getCurrentPage(index, limit);
                // Pages calculated before total updated by call to getData                    
                const newTotalPages = paginationView.getTotalPages(limit, totalApplications);
                    paginationView.initPagination(newTotalPages, page, 'applications');
              } else {
                  paginationView.changePagination(index, limit, totalApplications, 'applications');
              }

          })





        // await this.getData('applications');
        // // Update the current application state
        // this.state.applications.currentApplication = this.applications[0];

        // this.state.isActiveRequest = false;

        // // this.changeTablePageAnimation(tl, 'applications');

        // // Change table
        // this.renderApplicationTable()
        // // Animate table content (body, not content, because the table will already be present)
        // tl.add(adminView.animateTableBodyIn('applications'))
        // tl.add(adminView.animateAdminLoadersOut(), '<')

        // // Switch Summary
        // tl.add(adminView.animateSummaryOut())
        // .add(() => {
        //     summaryView.switchApplicationSummary(this.applications[0]);
        // })
        // .add(adminView.animateSummaryIn())
    }

    // Pagination Changed means the number of pages has changed
    // A new job means the page has changed to an existing one
    async changeJobsPage(option, previous, next, paginationChanged, newJob) {
        const tl = gsap.timeline();
        // // Set the pagination state
        // this.setJobsPaginationState(option, previous, next);
        
        // Set the new page
        const jobsState = this.state.jobs;

        const pages = paginationView.getTotalPages(jobsState.searchOptions.limit,jobsState.totalJobs);
        this.setCurrentPage(option, previous, next, jobsState, pages);

        // ANIMATION ORDER/LOGIC
        // 1: Place the loaders in the DOM
        // 2: Animate the loaders in, while animating the table body out
        // 3: The following functions have to be called in a function added to the main timeline
        //    which will execute in order (& wait for the async call)
        //    4: Update the data/state

        // SUMMARY (NESTED TL)
        //    5: Animate the summary out
        //    6: Switch summary in a function nested in the new timeline
        //    7: Animate the summary back in

        // TABLE (NESTED TL)
        //    8: Render the table
        //    9: Animate the new table body in / and the loaders out in a new nested timeline

        // 1: Render loaders
        adminView.renderAdminLoaders('jobs');

        // 2: Animate the loaders in / table body out
        tl.add(animation.animateTableContentOut('jobs'))
          .add(animation.animateAdminLoadersIn(), '<')
          // 3: Nest subsequent functions so they execute after the above animations
          .add(async () => {
              // 4: Update the data and state (getData fn also updates the total count)
              await this.getData('jobs', newJob?.id);
              this.state.jobs.currentJob = newJob || this.jobs[0];
              this.state.isActiveRequest = false;

            // SUMMARY (NESTED TL)
              // 5: Animate the Summary out (modal animation handled in animateSummaryOut)
              gsap
                .timeline().add(animation.animateSummaryOut('jobs'))
                // 6: Switch the summary *after* the out animation has occurred
                .add(() => {
                    summaryView.switchJobSummary(newJob || this.jobs[0], this.state.jobs.searchOptions.searchTerm);
                    // 7: Animate the summary back in
                    animation.animateJobSummaryIn();
                })  

            // TABLE (NESTED TL) 
              // 8: Change table
              this.renderJobsTable();
              // 9: Animate table body in (body, not content, because the table will already be present)
              //    and the loaders out
              gsap
                .timeline()
                .add(animation.animateTableBodyIn('jobs'))
                .add(animation.animateAdminLoadersOut(), '<')

            // CHANGE PAGINATION
            const { totalJobs, searchOptions: {index, limit} } = this.state.jobs;

            // If the pagination event came from a deletion or addition that changed the number of pages, 
            // reinitialise the pagination view (removing/adding a select option)
            if(paginationChanged) {
                const page = paginationView.getCurrentPage(index, limit);
                // Pages calculated before total updated by call to getData
                const newTotalPages = paginationView.getTotalPages(limit, totalJobs);
                paginationView.initPagination(newTotalPages, page, 'jobs');
            } else {
                paginationView.changePagination(index, limit, totalJobs, 'jobs');
            }
          })
    }

    changeTablePageAnimation(timeline, table) {
        let switchSummary;

        // Set the function to switch the summary
        // Executed in the animation timeline below
        switch(table) {
            case 'applications': 
                switchSummary = () => {
                    // Remove old summary items, add new ones
                    summaryView.switchApplicationSummary(this.applications[0]);

                    // Animate the summary back in
                    adminView.animateSummaryIn();

                }
                break;
            case 'jobs':
                switchSummary = () => {
                    // Remove old summary items, add new ones
                    summaryView.switchJobSummary(this.jobs[0]);

                    // Animate the summary back in
                    adminView.animateSummaryIn();
                }
                break;
            case 'companies': 
                switchSummary = () => {
                    // Remove old summary items, add new ones
                    summaryView.switchCompanySummary(this.companies[0], this.state.companies.searchOptions.searchTerm);

                    // Animate the summary back in
                    adminView.animateSummaryIn(); 
                }
        }

        // timeline
        //   .add(adminView.animateAdminLoadersOut())
          
        if(document.querySelector('.summary__modal')) timeline.add(gsap.to('.summary__modal', { autoAlpha: 0, onComplete: () => adminView.removeSummaryModals() }), '<')
        if(document.querySelector('.confirmation')) timeline.add(gsap.to('.confirmation', { autoAlpha: 0, onComplete: () => adminView.removeSummaryModals() }), '<');

        timeline  
          .add(adminView.animateSummaryOut())
          .add(() => {
                switchSummary();

                // Update the table
                switch(table) {
                    case 'applications': 
                        this.renderApplicationTable();
                        break;
                    case 'jobs':
                        this.renderJobsTable();
                        break;
                    case 'companies': 
                        this.renderCompaniesTable();
                }
    
                this.state.isActivePaginationAnimation = false;
            });
    }

    // async handleApplicationPagination(applicationBtn, applicationPrevious, applicationNext) {
    //     const tl = gsap.timeline();
    //     // // If there's an active request, cancel it
    //     // if(this.state.isActiveRequest) { 
    //     //     cancelTokenSource();
    //     //     this.state.isActiveRequest = false;
    //     //     console.log('cancelled');
    //     //     return;
    //     // }

    //     // If there's an active animation, ignore the click
    //     // if(this.state.isActivePaginationAnimation) return;
    //     // this.state.isActivePaginationAnimation = true;

    //     const applicationState = this.state.applications;
    //     // New page, new application
    //     applicationState.currentApplication = this.applications[0];

    //     const pages = Math.ceil(applicationState.totalApplications / applicationState.searchOptions.limit);

    //     if(applicationPrevious && !(applicationState.currentPage < 1)) {
    //         this.movePageBackwards(applicationState);
    //     } else if(applicationNext && !(applicationState.currentPage >= pages - 1)) {
    //         this.movePageForwards(applicationState);
    //     } else if(applicationBtn) {
    //         this.movePage(applicationState, applicationBtn);
    //     }

    //     // Update pagination items
    //      adminView.updatePagination(applicationState.currentPage);
        
    //     //  // set activeAnimation flag
    //     // this.state.isActivePaginationAnimation = true;

    //     // adminView.renderAdminLoaders();

    //     // tl
    //     //   .add(adminView.animateTableContentOut())
    //     //   .add(adminView.animateSummaryOut(), '>')
    //     //   .add(adminView.animateAdminLoadersIn(), '>')

    //     // try {

    //     //     const { data: { applications: { rows, count } } } = await this.Admin.getApplications(this.state.applications.searchOptions);

    //     //     // this.state.isActiveRequest = false;
    //     //     this.state.isActivePaginationAnimation = false;
    //     //     tl.add(adminView.animateAdminLoadersOut());

    //     //     this.applications = rows;
    //     //     this.state.applications.totalApplications = count;

    //     //     tl.add(() => {
    //     //         // Populate summary while not visible
    //     //         adminView.populateApplicationSummary(this.applications[0]);

    //     //         // Animate summary in
    //     //         gsap.fromTo('.summary', {autoAlpha: 0}, {autoAlpha: 1});

    //     //         // Update the table
    //     //         this.renderApplicationTable();

    //     //         // Animate table in
    //     //         adminView.animateAdminContentIn();

    //     //         this.state.isActivePaginationAnimation = false;
    //     // });

    //     // } catch(err) {
    //     //     this.state.isActiveRequest = false;
    //     //     if (axios.isCancel(err)) {
    //     //         console.log('Request canceled', err.message);
    //     //     } else {
    //     //         // handle error
    //     //         console.log(err);
    //     //     }
    //     // }
    // }

    movePageBackwards(state) {
        state.currentPage--;

        // Ajax requests (for main tables) use a searchOption object
        // Nested tables/summary sections just have the index/limit property
        if(state.searchOptions) state.searchOptions.index -= state.searchOptions.limit;
        else state.index -= state.limit;

    }
    movePageForwards(state) {

        state.currentPage++;

        // Ajax requests (for main tables) use a searchOption object
        // Nested tables/summary sections just have the index/limit property
        if(state.searchOptions) state.searchOptions.index += state.searchOptions.limit;
        else state.index += state.limit

    }
    movePage(state, page) {
        console.log('MOVE PAGE', page)
        // Ajax requests (for main tables) use a searchOption object
        // Nested tables/summary sections just have the index/limit property
        if(state.searchOptions) {
            state.searchOptions.index = (page -1) * state.searchOptions.limit;
            state.currentPage = state.searchOptions.index / state.searchOptions.limit + 1;
        }    
        else {
            state.index = (page -1) * state.limit;
            state.currentPage = state.index / state.limit + 1;
        } 

    }

    simulateMouseEVent(type, elem) {
        elem.dispatchEvent(new MouseEvent(type, {
          view: window,
          bubbles: true,
          cancelable: true
        }));
        return elem; // make it chainable
      }
}

new AdminController();