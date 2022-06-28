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


import axios from 'axios';
import gsap from 'gsap';

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
            companies: {
                companyNames: [],
                totalCompanies: 0,
                currentCompany: {},
                currentAddressIndex: 0,
                currentContactIndex: 0,
                searchOptions: {
                    index: 0,
                    limit: 6,
                    orderField: "createdAt",
                    orderDirection: "ASC"
                },
                companyJobPagination: {
                    jobIndex: 0, 
                    jobLimit: 0, 
                    totaljobs: 0,
                },
                contactPagination: {
                    contactIndex: 0,
                    contactLimit: 0,
                    totalContacts: 0
                },
                addressPagination: {
                    addressIndex: 0,
                    addressLimit: 0,
                    totalAddresses: 0
                },
                paginatedJobs: []

            },
            jobs: {
                totalJobs: 0,
                currentJob: {},
                currentPage: 0,
                jobNames: [],
                searchOptions: {
                    index: 0,
                    limit: 6,
                    titles: [],
                    locations: [],
                    orderField: "createdAt",
                    orderDirection: "DESC"
                }
            },
            users: {
                totalUsers: 0,
                currentUser: {},
                currentPage: 0,
                applicantNames: [],
                searchOptions: {
                    index: 0,
                    limit: 6,
                    orderField: "createdAt",
                    orderDirection: "DESC"
                },
                userJobsPagination: {
                    jobLimit: 0,
                    jobIndex: 0,
                    totalJobs: 0
                },
                addressPagination: {
                    addressIndex: 0,
                    addressLimit: 0,
                    totalAddresses: 0
                },
                paginatedJobs: []
            },
            applications: {
                totalApplications: 0,
                currentApplication: {},
                currentPage: 1,
                searchOptions: {
                    index: 0,
                    limit: 6,
                    orderField: "createdAt",
                    orderDirection: "DESC"
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

        // Handle editable elements when a user clicks elsewhere
        document.body.addEventListener('mousedown', (e) => {
                        
            if(this.editUserLostFocus(e)) {
                console.log('edit user lost focus');
                const userSummary = document.querySelector('.user-summary');

                adminView.makeEditable(document.querySelectorAll('.user-summary__item'), false);

                // Remove input listeners
                userSummary.removeEventListener('focusin', adminView.focusInEditUserHandler);
                userSummary.removeEventListener('focusout', this.boundFocusOutEditUserHandler);

                adminView.changeEditIcon('edit', 'user');
                adminView.addCvElement(this.state.users.currentUser);
            }
            if(this.createUserLostFocus(e)) {
                const userSummary = document.querySelector('.user-summary');
                const items = document.querySelectorAll('.user-summary__item');
                console.log('create user lost focus');
                adminView.makeEditable(items, false);

                // Remove the item listeners
                userSummary.removeEventListener('focusin', adminView.focusInNewUserHandler);
                userSummary.removeEventListener('focusout', adminView.focusOutNewUserHandler);

                // Add the original user values
                adminView.populateUserSummary(this.state.users.currentUser);

                adminView.changeNewIcon('new', 'user');
                adminView.addCvElement(this.state.users.currentUser);
            }
            if(this.editJobLostFocus(e)) {
                console.log('edit jobs lost focus');

                const jobSummary = document.querySelector('.job-summary');
                // Remove element listeners
                jobSummary.removeEventListener('focusin', adminView.focusInEditJobHandler);
                jobSummary.removeEventListener('focusout', adminView.focusOutEditJobHandler);
                document.removeEventListener('keydown', this.handleCtrl1);

                adminView.makeJobSummaryEditable(false, this.state.companies.currentCompany.featured);
                adminView.removeJobDropdowns(this.state.jobs.currentJob);
                adminView.changeSummaryIconState('edited', 'job');

                adminView.populateJobSummary(this.state.jobs.currentJob);

            
            }
            if(this.createJobLostFocus(e)) {
                console.log('create jobs lost focus');

                const jobSummary = document.querySelector('.job-summary');

                // Remove element listeners
                document.body.removeEventListener('keydown', this.handleCtrlQ);
                jobSummary.removeEventListener('focusin', adminView.focusInNewJobHandler);
                jobSummary.removeEventListener('focusout', adminView.focusOutNewJobHandler);
                
                // Remove the dropdown + replace with company div
                adminView.removeCompanyDropdown(this.state.jobs.currentJob.companyName);
                adminView.removeJobDropdowns(this.state.jobs.currentJob);
                adminView.populateJobSummary(this.state.jobs.currentJob);

                adminView.makeJobSummaryEditable(false, this.state.companies.currentCompany.featured);

                adminView.changeSummaryIconState('created', 'job');
            }
            if(this.createCompanyLostFocus(e)) {
                console.log('create company lost focus');

                const summaryWrapper = document.querySelector('.summary-wrapper');
                const companyItems = document.querySelectorAll('.company-summary__item');
                const contactItems = document.querySelectorAll('.contact-summary__item');

                adminView.makeEditable(companyItems, false);
                adminView.makeEditable(contactItems, false);

                // Remove the item listeners
                summaryWrapper.removeEventListener('focusin', adminView.focusInNewCompanyHandler);
                summaryWrapper.removeEventListener('focusout', adminView.focusOutNewCompanyHandler);

                // Add the original user values
                adminView.populateCompanySummary(this.state.companies.currentCompany);
                adminView.populateContactSummary(this.state.companies.currentCompany, this.state.companies.currentCompany.people[0]);
                adminView.makeAddressEditable(false, 'value', this.state.companies.currentCompany.addresses[0]);

                adminView.changeSummaryIconState('created', 'company');
            }
            if(this.editCompanyLostFocus(e)) {
                console.log('edit company lost focus');
                document.body.removeEventListener('keydown', this.handleCtrlQ);

                const summaryWrapper = document.querySelector('.summary-wrapper');
                const companyItems = document.querySelectorAll('.company-summary__item');
                const contactItems = document.querySelectorAll('.contact-summary__item');

                adminView.makeEditable(companyItems, false);
                adminView.makeEditable(contactItems, false);

                // Remove the item listeners
                summaryWrapper.removeEventListener('focusin', adminView.focusInNewCompanyHandler);
                summaryWrapper.removeEventListener('focusout', adminView.focusOutNewCompanyHandler);
                // Add the original user values
                adminView.populateCompanySummary(this.state.companies.currentCompany);
                adminView.populateContactSummary(this.state.companies.currentCompany, this.state.companies.currentCompany.people[0]);

                adminView.makeAddressEditable(false, 'value', this.state.companies.currentCompany.addresses[0]);

                adminView.changeSummaryIconState('edited', 'company');    

            }

        })

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

        adminView.initAdminSection(tl, sectionName);        

        try {
            // Index ID is only ever passed to getData from displayAdminContent
            // This sets the first element in the table, and is used to navigate to specific records from other admin summaries
            // EG: Clicking the application summary company href => company in the companies table
            tl.add(async () => {
                // Calculate the # of rows that can fit on the page
                this.getNumOfRows(sectionName);
                await this.getData(sectionName, indexId);

                switch(sectionName) {
                    case 'applications': 
                        // Set current application
                        this.state.applications.currentApplication = this.applications[0];

                        // Add pagination
                        const { totalApplications, searchOptions: {index: appIndex, limit: appLimit} } = this.state.applications;
                        const { pages: numAppPages, current: currentAppPage } = paginationView.calculatePagination(appIndex, appLimit, totalApplications);
                        paginationView.renderPagination(numAppPages, currentAppPage, 'applications');

                        // Render table
                        this.renderApplicationTable();

                        // Render summary
                        summaryView.insertNewApplicationSummary(this.applications[0]);

                        // // The elements are created when the admin page is initialised, this is content
                        // const { headerContent, applicantContent, positionContent, controlContent } = summaryView.createApplicationSummaryContent(this.applications[0]);
                        // document.querySelector('.summary__header').insertAdjacentHTML('afterbegin', headerContent);
                        // document.querySelector('.summary__section--application-person').insertAdjacentHTML('beforeend', applicantContent);
                        // document.querySelector('.summary__section--application-job').insertAdjacentHTML('beforeend', positionContent);
                        // document.querySelector('.summary__controls').insertAdjacentHTML('beforeend', controlContent);
            
                        this.addApplicationSummaryListeners();

                        break;

                    case 'jobs':
                        this.state.jobs.currentJob = this.jobs[0];

                        // Render table
                        this.renderJobsTable();

                        // Add pagination
                        const { totalJobs, searchOptions: {index: jobIndex, limit: jobLimit} } = this.state.jobs;
                        const { pages: numJobPages, current: currentJobPage } = adminView.calculatePagination(jobIndex, jobLimit, totalJobs);
                        adminView.renderPagination(numJobPages, currentJobPage, document.querySelector('.table-wrapper'), 'jobs');
                        // Add summary
                        const jobSummary = adminView.createJobSummary(this.jobs[0]);
                        document.querySelector('.summary-wrapper').insertAdjacentHTML('afterbegin', jobSummary);

                        this.addJobsSummaryListeners();
                        // this.addJobSummaryListeners();
                        break;

                    case 'companies': 
                        this.state.companies.currentCompany = this.companies[0];


                    //// Main Company Table ////

                        // Render table 
                        this.renderCompaniesTable();


                        // Add pagination for the company table
                        const { totalCompanies, searchOptions: {index: companiesIndex, limit: companiesLimit} } = this.state.companies;
                        const { 
                            pages: numCompanyPages, 
                            current: currentCompanyPage 
                        } = adminView.calculatePagination(companiesIndex, companiesLimit, totalCompanies);
                        adminView.renderPagination(numCompanyPages, currentCompanyPage, document.querySelector('.table-wrapper'), 'companies');

                    //// End

                    //// Company Summary /////

                        // Add summary
                        const companySummary = adminView.createCompanySummary(this.companies[0]);
                        document.querySelector('.summary-wrapper').insertAdjacentHTML('afterbegin', companySummary);

                        // // Add pagination for nested contacts, addresses, and jobs elements
                        // this.addCompanyNestedPagination();

                        // Set the pagination state (This does to the company jobs array what limit and offset do in the api call)
                        this.setCompanyJobsState();

                        // Render the summary company jobs table
                        if(this.state.companies.paginatedJobs.length > 0) {
                            // remove any placeholders
                            const placeholder = document.querySelector('.company-jobs-placeholder');
                            if(placeholder) placeholder.parentElement.removeChild(placeholder);

                            this.renderCompanyJobsTable();
                        } else {
                            // render a placeholder saying 'no jobs'
                            document.querySelector('.table-wrapper--nested-jobs')
                                .insertAdjacentHTML('afterbegin', adminView.generateCompanyJobsPlaceholder());
                        } 
                        // Add pagination for nested contacts, addresses, and jobs elements
                        this.addCompanyNestedPagination();

                        this.addCompanySummaryListeners();
                        break;


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
                nestedTl.to('.loader', {autoAlpha: 0, duration: .2, onComplete: () => loader.clearLoaders()});

                // Animate summaries in for the first time (different to switching). Tables animated in the render methods
                if(sectionName === 'jobs' || sectionName === 'companies') {
                  adminView.animateSummaryIn();
                } else if(sectionName === 'applications') {
                    adminView.animateApplicationSummaryIn(true);
                }

                // Animate the pagination in
                nestedTl.fromTo('.pagination', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .6 }, '>');
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



    addCompanyNestedPagination() {
        //// Nested Company Jobs table

        // Paginate companyJobs array
        const { totalJobs: totalCompanyJobs, jobIndex: companyJobsIndex, jobLimit: companyJobsLimit } = this.state.companies.companyJobPagination;

        const { 
            pages: numCompanyJobPages, 
            current: currentCompanyJobPage 
        } = adminView.calculatePagination(companyJobsIndex, companyJobsLimit, totalCompanyJobs);

        adminView.renderPagination(numCompanyJobPages, currentCompanyJobPage, document.querySelector('.table-wrapper--nested-jobs'), 'nested-jobs');

        //// Nested Contacts pagination
        this.state.companies.contactPagination.totalContacts = this.state.companies.currentCompany.contacts.length;
        const { totalContacts, contactIndex } = this.state.companies.contactPagination;

        // No need to calculate contact pagination - displayed 1 at a time, so number of pages = contacts.length
        adminView.renderPagination(totalContacts, contactIndex, document.querySelector('.pagination-wrapper--contacts'), 'contacts');

        //// Nested Addresses pagination
        this.state.companies.addressPagination.totalAddresses = this.state.companies.currentCompany.addresses.length;
        const { totalAddresses, addressIndex } = this.state.companies.addressPagination;
    
        // No need to calculate address pagination - displayed 1 at a time, so number of pages = address.length
        adminView.renderPagination(totalAddresses, addressIndex, document.querySelector('.pagination-wrapper--addresses'), 'addresses');
    }

    addUserNestedPagination() {
        // Paginate userJobs array
        const { totalJobs, jobIndex, jobLimit } = this.state.users.userJobsPagination;
        const { pages, current } = adminView.calculatePagination(jobIndex, jobLimit, totalJobs);
        // Render the userJobs pagination
        adminView.renderPagination(pages, current, document.querySelector('.table-wrapper--nested-user-jobs'), 'nested-user-jobs');

        //// Nested Addresses pagination
        // Displayed 1 at a time
        this.state.users.addressPagination.totalAddresses = this.state.users.currentUser.addresses.length;
        const { totalAddresses, addressIndex } = this.state.users.addressPagination;

        // No need to calculate contact pagination - displayed 1 at a time, so number of pages = contacts.length
        adminView.renderPagination(totalAddresses, addressIndex, document.querySelector('.pagination-wrapper--addresses'), 'addresses');
    }

    getNumOfRows(sectionName) {
        switch(sectionName) {
            case 'applications': 
                this.state.applications.searchOptions.limit = adminView.calculateRows(sectionName, true,false);
                break;
            case 'jobs': 
                this.state.jobs.searchOptions.limit = adminView.calculateRows(sectionName, true, true);
                break;
            case 'companies': 
                this.state.companies.searchOptions.limit = adminView.calculateRows(sectionName, true, true);
                break;
            case 'users':
                this.state.users.searchOptions.limit = adminView.calculateRows(sectionName, true, true);
                break;
            case 'nested-jobs':
                this.state.companies.companyJobPagination.jobLimit = adminView.calculateRows(sectionName, true, true);
                break;
            case 'nested-user-jobs':
                this.state.users.userJobsPagination.jobLimit = adminView.calculateRows(sectionName, true, true);
        }
    }

    async getData(sectionName, indexId) {
        console.log('getting');
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
                console.log(this.companies);
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
        const { totalApplications, searchOptions: {index, limit} } = this.state.applications;

        const table = document.querySelector('.table--applications');
        const tableContent = document.querySelector('.table__content--applications');

       // If no table visible, render both the header and content
        if(!table) { 
            // Heading content added here to animate at the same time as the data comes in
            const headerContent = `<div class="table__heading">Applications</div>`;
            document.querySelector('.table__header').insertAdjacentHTML('afterbegin', headerContent);
            const newTable = tableView.createTableTest('applications', headers, rows, false);
            tableContent.insertAdjacentHTML('afterbegin',newTable);

            // Else remove the tbody and render just the content
        } else {
            utils.removeElement(document.querySelector('tbody'));
            document.querySelector('thead').insertAdjacentHTML('afterend', tableView.updateTableContent('applications', rows));
        }
        adminView.animateTableContentIn('applications')

        const applicationRows = document.querySelectorAll('.row--applications');
       
        const activeRow = Array.from(applicationRows).find(row => row.querySelector(`[data-id="${this.state.applications.currentApplication.applicationId}"]`)) || applicationRows[0];

        utils.changeActiveRow(activeRow, applicationRows);

        applicationRows.forEach(row => {
            row.addEventListener('click', (e) => {

                const tl = gsap.timeline({ paused: true });

                tl.add(adminView.animateApplicationSummaryOut());
                tl.add(() => {
                    // Putting the row selection and switching logic inside the timeline
                    // should prevent issues with fast successive clicks

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
                    adminView.animateApplicationSummaryIn();
                });
                tl.play(0);

                // Change summary
                // const summary = document.querySelector('.summary');
                // const newSummary = adminView.createApplicationSummary(application[0]);
                // adminView.swapSummary(summary, adminView.createApplicationSummary(application[0]), this.applicationSummaryListener.bind(this)); 
            
                // const { headerContent, positionContent, applicantContent, controlContent } = adminView.createApplicationSummaryContent(application[0])

                // adminView.switchApplicationSummary(application[0]);

                // const tl = gsap.timeline();

                // tl.add(adminView.animateSummaryWrapperOut());
                // tl.add(() => {
                //     // Switch the summary
                //     adminView.switchSummary(summary, newSummary);
                                
                //     // Add the listener to the new summary
                //     this.addApplicationSummaryListeners();
                // });
                // tl.add(adminView.animateSummaryWrapperIn());
            
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
        const newApplicationAlertAnimation = gsap.timeline({paused: true});
        const deleteApplicationAlertAnimation = gsap.timeline({paused: true});

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
            // Get Job names for the job select
            const { data: { names } } =  await this.Admin.getJobNames();
            this.state.jobs.jobNames = names;

            // Get User names for the applicant select
            const { data: { applicants: applicantNames } } =  await this.Admin.getUserNames();
            this.state.users.applicantNames = applicantNames;

            modalView.renderNewApplicationModal({jobs: this.state.jobs.jobNames, users: this.state.users.applicantNames, applications: this.applications, appNumber: this.getNextId('applications')});
        
            const applicationSummaryModal = document.querySelector('.summary__modal--new-application');
            const submitNewBtn = document.querySelector('.new-application__submit');
            const closeBtn = document.querySelector('.new-application__close');

            const alertWrapper = document.querySelector('.alert-wrapper');

            // Add the animation for the application alerts (paused)
            newApplicationAlertAnimation
                .from(alertWrapper, {
                    autoAlpha: 0
                })
                .to(alertWrapper, {
                    autoAlpha: 0
                }, '+=3')

            closeBtn.addEventListener('click', () => {
                console.log('clicked');
                gsap.to(applicationSummaryModal, {
                    autoAlpha: 0,
                    duration: .2,
                    onComplete: () => {
                        applicationSummaryModal.parentElement.removeChild(applicationSummaryModal);
                    }
                })
            });
        
            submitNewBtn.addEventListener('click',  async (e) => {
                e.preventDefault();

                // Clear the alert wrapper
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                // Get the job id from the select
                const jobId = document.querySelector('.new-application__input--job').value;
                const personId = document.querySelector('.new-application__input--applicant').value;
                let msg;

                if(!jobId || !personId) {
                    msg = !jobId? 'No Job Selected':'No Applicant Selected';

                    const alert = modalView.getAlert(msg, false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);
                    newApplicationAlertAnimation.play(0);
                    return;
                }

                try {
                    const res = await this.Admin.createApplication(jobId, personId);
                    if(res.status === 200) {                                 
                        // Display successful alert      
                        const alert = modalView.getAlert('Application Created', true);
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        newApplicationAlertAnimation.play(0);

                        // Get data (Updates the total applications)
                        await this.getData('applications');
                        // Update the current application
                        this.state.applications.currentApplication = this.applications[0];
                        
                        // Render table
                        this.renderApplicationTable();

                        // Switch summary (No animation needed as behind the modal)
                        summaryView.switchApplicationSummary(this.applications[0]);

                        // Update pagination
                        const { totalApplications, searchOptions: {index, limit} } = this.state.applications;
                        const { pages, current } = paginationView.calculatePagination(index, limit, totalApplications);
                        paginationView.renderPagination(pages, current, 'applications');
                    }
                } catch (err) {
                    console.log(err);
                    if(err.response?.data?.message === 'Application already made') {
                        const alert = modalView.getAlert(`Application Exists, ID: ${err.response.data.data.applicationId}`, false);
                    
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        newApplicationAlertAnimation.play(0);
                    }
                }
            });

        }
        if(deleteBtn) {
            const applicationId = document.querySelector('.summary__id').innerText;
            const summaryWrapper = document.querySelector('.summary__details');
            const confirmationHtml = adminView.getDeleteApplicationHtml(applicationId);

            summaryWrapper.insertAdjacentHTML('afterbegin', confirmationHtml);
            const confirmation = document.querySelector('.confirmation');
            // Confirmation animation 
            gsap.from(confirmation, {
                autoAlpha: 0,
                duration: .2
            });

            // Alert animation
            const alertWrapper = document.querySelector('.alert-wrapper');

            // Add the animation for the application alerts
            deleteApplicationAlertAnimation
                .from(alertWrapper, {
                    autoAlpha: 0
                })
                .to(alertWrapper, {
                    autoAlpha: 0
                }, '+=1.5')
                .to(confirmation, {
                    autoAlpha: 0,
                    onComplete: () => {
                        confirmation.parentElement.removeChild(confirmation);
                    }
                })
        

            const confirm = document.querySelector('.confirmation__btn--confirm');
            const cancel = document.querySelector('.confirmation__btn--cancel');

            console.log(this.state.applications.totalApplications, ' applications');

            confirm.addEventListener('click', async() => {
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                try {
                    const res = await this.Admin.deleteApplication(applicationId);

                    if(res.status === 200) {
                        const tl = gsap.timeline();
                        const alert = modalView.getAlert(`Application ${applicationId} deleted`, true);
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);

                        if(this.applications.length === 1) {
                            // Set the pagination state (second param simulates pressing the previous button)
                            this.setApplicationPagination(null, true, null);
                            // // Set the pagination view
                            adminView.updatePaginationView(this.state.applications.currentPage -1);

                            // Get the data
                            await this.getData('applications');


                            this.changeTablePageAnimation(tl, 'applications');

                            const { totalApplications, searchOptions: {index, limit} } = this.state.applications;
                            const { pages, current } = paginationView.calculatePagination(index, limit, totalApplications);
                            
                            paginationView.renderPagination(pages, current, 'applications');
                        } else {
                            // Update the data
                            await this.getData('applications');

                            // Rerender the table
                            this.renderApplicationTable();       
                            
                            // Switch the summary (No animation needed)
                            summaryView.switchApplicationSummary(this.applications[0]);

                            // // Update pagination
                            // const { totalApplications, searchOptions: {index: appIndex, limit: appLimit} } = this.state.applications;
                            // adminView.renderPagination(appIndex, appLimit, totalApplications, document.querySelector('.table__content'), 'applications');
                        
                            const { totalApplications, searchOptions: {index, limit} } = this.state.applications;
                            const { pages, current } = paginationView.calculatePagination(index, limit, totalApplications);
                            paginationView.renderPagination(pages, current, 'applications');

                            // After the page has potentially changed because of onComplete function
                            deleteApplicationAlertAnimation.play(0);
                        }

                    } else {
                        throw new Error();
                    }

                
                } catch (err) {
                    const alert = modalView.getAlert(`Please contact the administrator`, false);
                
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);
                    deleteApplicationAlertAnimation.play(0);
                    console.log(err)
                }
            });

            cancel.addEventListener('click', () => {
                console.log('click');
                gsap.to(confirmation, {
                    autoAlpha: 0,
                    duration: .2,
                    onComplete: () => {
                        confirmation.parentElement.removeChild(confirmation);
                    }
                })
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
        const {headers, rows} = adminView.formatJobs(this.jobs);
        const { totalJobs, searchOptions: { index, limit } } = this.state.jobs;
        
        const tableWrapper = document.querySelector('.table-wrapper');

        const table = document.querySelector('.table--jobs');
        // If no table visible, render both the header and content
        if(!table) {
            tableWrapper.insertAdjacentHTML('afterbegin', tableView.createTableTest('jobs', headers, rows, false));  
            adminView.animateTableContentIn('jobs')
        } else {
            // Else remove the tbody and render just the content
            utils.removeElement(document.querySelector('tbody'));
            document.querySelector('thead').insertAdjacentHTML('afterend', tableView.updateTableContent('jobs', rows));
            adminView.animateTableBodyIn('jobs')

        }

        const jobRows = document.querySelectorAll('.row--jobs');

        const activeRow = Array.from(jobRows).find(row => {
            return row.querySelector(`[data-id="${this.state.jobs.currentJob.id}"]`)
        }) || jobRows[0];

        utils.changeActiveRow(activeRow, jobRows);

        // Add table row listeners
        jobRows.forEach(row => {
            row.addEventListener('click', e => {
                const targetRow = e.target.closest('.row');
                const rowId = row.querySelector('.td-data--company').dataset.id;
                const job = this.jobs.filter((job, index) => {
                    if(parseInt(rowId) === job.id) this.state.jobsTable.index = index;
                    return parseInt(rowId) === job.id;
                })[0];

                utils.changeActiveRow(targetRow, jobRows);
                this.state.jobs.currentJob = job;

                // Change the summary
                const summary = document.querySelector('.summary');
                const newSummary = adminView.createJobSummary(job);

                const tl = gsap.timeline();

                tl.add(adminView.animateSummaryWrapperOut());
                tl.add(() => {
                    // Switch the summary
                    adminView.switchSummary(summary, newSummary);
                                
                    // Add the listener to the new summary
                    this.addJobsSummaryListeners();
                });
                tl.add(adminView.animateSummaryWrapperIn());
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
        const jobSummary = document.querySelector('.job-summary');
        jobSummary.addEventListener(
            'click', 
            this.jobSummaryListener.bind(this)
        );

    }

    async jobSummaryListener(e) {
        // Animations
        const newJobAlertAnimation = gsap.timeline({paused: true});
        const editJobAlertAnimation = gsap.timeline({paused: true});
        const deleteJobAlertAnimation = gsap.timeline({paused: true});

        // Buttons
        const newBtn = e.target.closest('.job-summary__btn--new');
        const deleteBtn = e.target.closest('.job-summary__btn--delete');
        const editBtn = e.target.closest('.job-summary__btn--edit');
        const hubspotBtn = e.target.closest('.job-summary__btn--hubspot');

        // Links
        const companyLink = e.target.closest('.summary__link--company');

        if(newBtn) {
            let alert;

            // Get company list
            const { data: { companyNames } } = await this.Admin.getCompanyNames();
            this.state.companies.companyNames = companyNames;

            adminView.renderJobModal({ 
                companies: this.state.companies.companyNames, 
                jobTypes: this.jobTypes, 
                jobPositions: this.jobPositions,
                jobPqes: this.jobPqes,
                jobNumber: this.getNextId('jobs')
            }, 'new');

            const alertWrapper = document.querySelector('.alert-wrapper');
            const jobForm = document.querySelector('.form--new-job');
            const closeBtn = document.querySelector('.form__close--new-job');
            const submitBtn = document.querySelector('.form__submit--new-job');


            // Custom selects and fields need to be separated for validation
            const fields = adminView.getJobFields('new');
            const { titleField, locationField, wageField, descriptionField } = fields;
            const selects = adminView.getJobCustomSelects('new');
            const { companyField, typeField, positionField, pqeField, featuredField } = selects;

            // Add the animation for the job alerts (paused)
            newJobAlertAnimation
            .from(alertWrapper, {
                autoAlpha: 0
            })
            .to(alertWrapper, {
                autoAlpha: 0
            }, '+=3')

            closeBtn.addEventListener('click', () => {
                adminView.removeJobModal();
            });
           
            jobForm.addEventListener('submit', async e => {
                e.preventDefault();
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
                            alert = modalView.getAlert('Job Not Created', false);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            newJobAlertAnimation.play(0);
                        } else {
                            alert = modalView.getAlert('Job Created', true);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            newJobAlertAnimation.play(0);

                            await this.getData('jobs');

                            this.state.jobs.currentJob = res.data.job;

                            this.renderJobsTable();
                            // Update pagination
                            const { totalJobs, searchOptions: {index: jobIndex, limit: jobLimit} } = this.state.jobs;
                            adminView.renderPagination(jobIndex, jobLimit, totalJobs, document.querySelector('.table-wrapper'), 'jobs');
                    
                            // Update the summary
                            const summary = document.querySelector('.summary');
                            adminView.swapSummary(summary, adminView.createJobSummary(this.state.jobs.currentJob), this.jobSummaryListener.bind(this)); 
                        }
                    } catch(err) {
                        console.log(err);

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
            let alert;
            const jobId = document.querySelector('.job-summary__id').innerText;
            const summaryWrapper = document.querySelector('.summary-wrapper');
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

            // Add the animation for the job alerts
            deleteJobAlertAnimation
                .from(alertWrapper, {
                    autoAlpha: 0
                })
                .to(alertWrapper, {
                    autoAlpha: 0
                }, '+=1')
                .add(() => {
                    if(!document.querySelector('.alert--error')) {
                        return gsap.to(confirmation, {
                            autoAlpha: 0,
                            duration: .2,
                            onComplete: () => {
                                confirmation.parentElement.removeChild(confirmation);
                            }
                        })
                    }
                })

        
            const confirm = document.querySelector('.confirmation__btn--confirm');
            const cancel = document.querySelector('.confirmation__btn--cancel');


            confirm.addEventListener('click', async() => {
                // Clear the alert wrapper contents
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                try {
                    const { status } = await this.Admin.deleteJob(jobId);

                    if(status === 200) {
                        alert = modalView.getAlert(`Job ${jobId} deleted`, true);
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);

                        // Update the jobs array
                        await this.getData('jobs');
                        
                        // Rerender table
                        this.renderJobsTable();

                        // Update the current job
                        this.state.jobs.currentJob = this.jobs[0];

                        // Change the summary
                        const summary = document.querySelector('.summary');
                        const newSummary = adminView.createJobSummary(this.state.jobs.currentJob);
                        // No animation needed as it's behind the modal
                        adminView.switchSummary(summary, newSummary);
                        this.addJobsSummaryListeners();

                        // Play the alert animation
                        deleteJobAlertAnimation.play(0);

                        // Deal with pagination if only one item left on page
                        if(this.jobs.length === 1) {


                    //         // 2nd arg is the 'prevBtn' argument
                    //         this.setJobPaginationState(null, true, null);
                    //         // Set the view
                    //         adminView.updatePaginationView(this.state.jobs.currentPage -1);

                    //         // Get the new data to display
                    //         await this.getData('jobs');

                    //         this.changeTablePageAnimation(tl, 'jobs');

                    //         // Update the pagination items
                    //         const { totalJobs, searchOptions: {index: jobIndex, limit: jobLimit} } = this.state.jobs;
                    //         adminView.renderPagination(jobIndex, jobLimit, totalJobs, document.querySelector('.table-wrapper'), 'jobs');
                        
                        } else {

                        }

                    } else {
                        alert = modalView.getAlert(`Error: Job ${jobId} not deleted`, false);
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                    }



                    // if(status === 200) {
                    //     const tl = gsap.timeline();
                    //     alert = modalView.getAlert(`Job ${jobId} deleted`, true);
                    //     alertWrapper.insertAdjacentHTML('afterbegin', alert);

                    //     // Deal with pagination if only 1 item left on the page
                    //     if(this.jobs.length === 1) {
                    //         // 2nd arg is the 'prevBtn' argument
                    //         this.setJobPaginationState(null, true, null);
                    //         // Set the view
                    //         adminView.updatePaginationView(this.state.jobs.currentPage -1);

                    //         // Get the new data to display
                    //         await this.getData('jobs');

                    //         this.changeTablePageAnimation(tl, 'jobs');

                    //         // Update the pagination items
                    //         const { totalJobs, searchOptions: {index: jobIndex, limit: jobLimit} } = this.state.jobs;
                    //         adminView.renderPagination(jobIndex, jobLimit, totalJobs, document.querySelector('.table-wrapper'), 'jobs');
                        
                    //     } else {
                    //         // Update the table
                    //         await this.getData('jobs');
                    //         this.renderJobsTable();

                    //         // Update pagination
                    //         const { totalJobs, searchOptions: {index: jobIndex, limit: jobLimit} } = this.state.jobs;
                    //         adminView.renderPagination(jobIndex, jobLimit, totalJobs, document.querySelector('.table-wrapper'), 'jobs');
                        
                    //         // After the page has potentially changed because of onComplete function
                    //         deleteJobAlertAnimation.play(0);
                    //     }
                    //     this.state.jobs.currentJob = jobs[0];
                    //     const summary = document.querySelector('.summary');
                    //     const newSummary = adminView.createCompanySummary(this.state.jobs.currentJob);

                    //     // No animation needed as it's behind the modal
                    //     adminView.switchSummary(summary, newSummary);

                    // }

                } catch(err) {
                    // Clear the alert wrapper contents
                    while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);
                    alert = modalView.getAlert(`Error, please contact the administrator`, false);
                
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);
                    deleteJobAlertAnimation.play(0);
                    console.log(err)
                }
            });
            cancel.addEventListener('click', () => {
                gsap.to(confirmation, {
                    autoAlpha: 0,
                    duration: .2,
                    onComplete: () => {
                        confirmation.parentElement.removeChild(confirmation);
                    }
                })
            });
        }
        if(editBtn) {
            const jobId = document.querySelector('.job-summary__id').innerText;
            let alert;

            // Get companies list
            const { data: { companyNames } } = await this.Admin.getCompanyNames();
            this.state.companies.companyNames = companyNames;

            adminView.renderJobModal({ 
                companies: this.state.companies.companyNames, 
                job: this.state.jobs.currentJob,
                jobTypes: this.jobTypes, 
                jobPositions: this.jobPositions,
                jobPqes: this.jobPqes,
                jobNumber: this.getNextId('jobs')
            }, 'edit');

            const alertWrapper = document.querySelector('.alert-wrapper');
            const jobForm = document.querySelector('.form--edit-job');
            const closeBtn = document.querySelector('.form__close--edit-job');
            const summaryModal = document.querySelector('.job-summary__modal');


            // Custom selects and fields need to be separated for validation
            const fields = adminView.getJobFields('edit');
            const { titleField, locationField, wageField, descriptionField } = fields;
            const selects = adminView.getJobCustomSelects('edit');
            const { companyField, typeField, positionField, pqeField, featuredField } = selects;

            // Add the animation for the job alerts (paused)
            editJobAlertAnimation
            .from(alertWrapper, {
                autoAlpha: 0
            })
            .to(alertWrapper, {
                autoAlpha: 0,
            }, '+=1.5')

            closeBtn.addEventListener('click', () => {
                adminView.removeJobModal();
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

                    editJobAlertAnimation.play(0);
                    return;
                }
                if(!errors) {
                    try {
                        const res = await this.Admin.editJob(jobId, values);
                        if(res.status !== 200) {
                            alert = modalView.getAlert('Job Not Edited', false);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            editJobAlertAnimation.play(0);

                        } else {
                            alert = modalView.getAlert('Job Edited', true);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);

                            this.state.jobs.currentJob = res.data.job;

                            await this.getData('jobs');
                            this.renderJobsTable();

                            // Update pagination
                            const { totalJobs, searchOptions: {index: jobIndex, limit: jobLimit} } = this.state.jobs;
                            adminView.renderPagination(jobIndex, jobLimit, totalJobs, document.querySelector('.table-wrapper'), 'jobs');

                            editJobAlertAnimation.add(() => {
                                gsap.to(summaryModal, {
                                    autoAlpha: 0,
                                    onComplete: () => {
                                        summaryModal.parentElement.removeChild(summaryModal);

                                        // Update the summary
                                        const summary = document.querySelector('.summary');
                                        adminView.swapSummary(summary, adminView.createJobSummary(this.state.jobs.currentJob), this.jobSummaryListener.bind(this)); 
                                    }
                                });
                            });
                            editJobAlertAnimation.play(0);

                        }
                    } catch(err) {
                        console.log(err);
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
            const companyId = document.querySelector('.job-summary__field--company').dataset.id;

            this.displayAdminContent('companies', companyId);
            adminView.changeActiveMenuItem(document.querySelector('.sidebar__item--companies'));

        }
    }

    s() {
        const jobSummary = document.querySelector('.job-summary');
        jobSummary.addEventListener('click', e => {
            // Ignore synthetic clicks from the offscreen input element
            // if(e.target === document.querySelector('.user-summary__input')) return;

            const editBtn = e.target.closest('.job-summary__btn--edit');
            const deleteBtn = e.target.closest('.job-summary__btn--delete');
            const saveBtn = e.target.closest('.job-summary__btn--save');
            const saveNewBtn = e.target.closest('.job-summary__btn--save-new');
            const hubspotBtn = e.target.closest('.job-summary__btn--hubspot');
            const newBtn = e.target.closest('.job-summary__btn--new');


            if(editBtn) {
                const jobId = jobSummary.dataset.id;
                this.state.jobs.currentJob = this.jobs.find(job => job.id === parseInt(jobId));
                adminView.changeSummaryIconState('editing', 'job');
                //@TODO what's the featured state for?
                adminView.makeJobSummaryEditable(true, this.state.jobs.currentJob);
                adminView.addJobDropdowns(this.state.jobs.currentJob);
                
                // Add focus listeners
                this.boundFocusOutEditJobHandler = adminView.focusOutEditJobHandler.bind(this, this.state.jobs.currentJob);
                jobSummary.addEventListener('focusin', adminView.focusInEditJobHandler);
                jobSummary.addEventListener('focusout', this.boundFocusOutEditJobHandler);
            }
            if(saveBtn) {
                console.log('save job')
                // Remove element listeners
                jobSummary.removeEventListener('focusin', adminView.focusInEditJobHandler);
                jobSummary.removeEventListener('focusout', this.boundFocusOutEditJobHandler);

                const formData = adminView.getJobEdits(this.state.jobs.currentJob);
                // for(let[key, value] of formData.entries()) console.log(key, value);

                if(formData) {
                    console.log('save data');
                    this.Admin
                        .editJob(this.state.jobs.currentJob.id, formData)
                        .then(response => {
                            
                            if(response !== 200) {
                                //@TODO: message to say not edited
                            }
                            return this.Admin.getJobs(this.state.jobs.searchOptions);
                        })
                        .then(response => {
                            if(response.status !== 200) { 
                                // @TODO: message to say problem rendering 
                            }
                            this.jobs = response.data.jobs;
                            this.state.jobs.totalJobs = response.data.total;

                            const jobId = jobSummary.dataset.id;
                            this.state.jobs.currentJob = this.jobs.find(job => { return job.id === parseInt(jobId)});
                            this.renderJobsTable();

                            adminView.changeSummaryIconState('edited', 'job');
                            adminView.makeJobSummaryEditable(false, this.state.companies.currentCompany.featured);
                            adminView.removeJobDropdowns(this.state.jobs.currentJob);

                            adminView.populateJobSummary(this.state.jobs.currentJob);
                           
                        })
                        .catch(err => console.log(err));
                } else {
                    console.log('dont save');
                }

                // Technically unnecessary as the edit button never had the disabled class added
                // but used for consistency
                // const iconsToIgnore = ['job-summary__btn--edit'];

                // adminView.changeEditIcon('edit', 'job', iconsToIgnore);

                // adminView.changeSummaryIconState('edited', 'job');
                // adminView.makeJobSummaryEditable(false, this.state.companies.currentCompany.featured);
                // adminView.removeJobDropdowns(this.state.jobs.currentJob);

                // adminView.addFeaturedCheckbox(false, this.state.jobs.currentJob.featured);
            }
            if(newBtn) {
                // Save current job
                const jobId = jobSummary.dataset.id;
                this.state.jobs.currentJob = this.jobs.find(job => job.id === parseInt(jobId));
                const companyId = this.state.jobs.currentJob.companyId;

                // Add event listeners for inputs
                jobSummary.addEventListener('focusin', adminView.focusInNewJobHandler);
                jobSummary.addEventListener('focusout', adminView.focusOutNewJobHandler);

                document.body.addEventListener('keydown', this.handleCtrl1);

                // Change the new icon
                adminView.changeSummaryIconState('creating', 'job');

                adminView.makeJobSummaryEditable(true, this.state.jobs.currentJob);

                // Switch the company element to a dropdown
                adminView.addCompanyDropdown(this.companies, companyId);

                // Switch the Job Type elements to dropdowns
                adminView.addJobDropdowns();

                adminView.clearJobForm();
            }
            if(saveNewBtn){
                console.log('saveBtn');

                // Remove element listeners
                jobSummary.removeEventListener('focusin', adminView.focusInNewJobHandler);
                jobSummary.removeEventListener('focusout', adminView.focusOutNewJobHandler);

                // Get values from fields
                const formData = adminView.getNewJob();

                let formJob;
                
                if(formData) {
                    console.log('submit new job');
                    // Submit new job

                    // Flow: 
                    // Create job > post to server > get and store updated job list > render jobs table 
                    // If the newly created job is in the paginated list of jobs returned, make it the currentJob/active row
                    this.Admin.createJob(formData)
                        .then(res => {
                            if(res.status !== 201) {}// @TODO: warn user error occurred.

                            formJob = res.data.job;

                            return this.Admin.getJobs(this.state.jobs.searchOptions);
                        })
                        .then(res => {
                            // Store the response
                            this.jobs = res.data.jobs;
                            this.state.jobs.totalJobs = res.data.total;

                            this.renderJobsTable();

                            // Get elements used to get the row id of the newly created job
                            const table = document.querySelector('.table--jobs');
                            let companyElement; // data-id stored on this td element

                            // Look for the job in the frontend array
                            const job = this.jobs.find(job => {
                                return job.id === formJob.id;
                            });


                            // If the job created appears in the paginated results returned from the server, make it the current job
                            if(job) {
                                this.state.jobs.currentJob = job;

                                companyElement = table.querySelectorAll(`[data-id="${this.state.jobs.currentJob.id}"]`)[0];

                            } else {

                                this.state.jobs.currentJob = this.jobs[0];
                            }
                            adminView.removeCompanyDropdown(this.state.jobs.currentJob.companyName);
                            adminView.removeJobDropdowns(this.state.jobs.currentJob);
                            adminView.populateJobSummary(this.state.jobs.currentJob);  

                            // If the new job is visible in the table make it the active row, else make it the first row
                            const row = companyElement? companyElement.parentNode.parentNode : document.querySelector('.row--jobs');
                            const rows = document.querySelectorAll('.row--jobs');
                            if(row) utils.changeActiveRow(row, rows);
                            
                        })
                        .catch(err => console.log(err));

                } else {
                    console.log('dont save new job');
                    adminView.removeCompanyDropdown(this.state.jobs.currentJob.companyName);
                    adminView.removeJobDropdowns(this.state.jobs.currentJob);
                    adminView.populateJobSummary(this.state.jobs.currentJob);
                }

                adminView.changeSummaryIconState('created', 'job');
                adminView.makeJobSummaryEditable(false);

                // adminView.addFeaturedCheckbox(false, this.state.jobs.currentJob.featured);

                // Changing the icons / making elements uneditable handled in a listener on the body
            }
            if(deleteBtn) {
                const jobId = jobSummary.dataset.id;
                this.Admin.deleteJob(jobId).then(response => {
                    if(response.status === 200) {
                        // If the jobs array only has 1 item left, move the page back
                        //@TODO: handle 0 jobs here
                        if(this.jobs.length === 1) this.movePageBackwards(this.state.jobs);

                        return this.Admin.getJobs(this.state.jobs.searchOptions);
                    }
                }).then(response => {
                    this.jobs = response.data.jobs;
                    this.state.jobs.totalJobs = response.data.total;

                    // Change the currentJob and table index
                    this.state.jobs.currentJob = this.jobs[0];
                    // this.state.jobsTable.index = 0;

                    // Render the table
                    this.renderJobsTable();

                    // Update the Job summary
                    adminView.populateJobSummary(this.state.jobs.currentJob);

                    // Change the first row to active
                    // const rows = document.querySelectorAll('.row--jobs');
                    // utils.changeActiveRow(rows[0], rows);

                }).catch(err => console.log(err));
            }
        });
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

                // adminView.swapSummary(summary, adminView.createCompanySummary(company[0]), this.companySummaryListener.bind(this), tl);
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
        const { jobIndex, jobLimit } = this.state.users.userJobsPagination;

        // Paginate the company jobs
        this.state.users.paginatedJobs = this.state.users.currentUser.jobs.slice(jobIndex, jobIndex + jobLimit);

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

    setCompanyJobsState() {
        // Set the state for the summary's nested table
        this.getNumOfRows('nested-jobs');
        this.state.companies.companyJobPagination.totalJobs = this.state.companies.currentCompany.jobs.length;
        const { jobIndex, jobLimit } = this.state.companies.companyJobPagination;

        // Paginate the company jobs
        this.state.companies.paginatedJobs = this.state.companies.currentCompany.jobs.slice(jobIndex, jobIndex + jobLimit);
    }

    renderCompanyJobsTable() {
        // Format the paginated jobs into html elements
        const {headers, rows} = adminView.formatCompanyJobs(this.state.companies.paginatedJobs);

        const tableWrapper = document.querySelector('.table-wrapper--nested-jobs');
        const table = document.querySelector('.table--nested-jobs');

        // If no table visible, render both the header and content
        if(!table) { 
            console.log('nestedTableWrapper', tableWrapper);
            tableWrapper.insertAdjacentHTML('afterbegin', tableView.createTableTest('nested-jobs', headers, rows, false));
            // Else remove the tbody and render just the content
        } else {
            utils.removeElement(document.querySelector('tbody'));
            document.querySelector('thead').insertAdjacentHTML('afterend', tableView.updateTableContent('nested-jobs', rows));
        }

        adminView.animateTableContentIn('nested-jobs')
    };

    renderCompaniesTable() {
        // Format applications/headers into html elements
        const {headers, rows} = adminView.formatCompanies(this.companies);

        const tableWrapper = document.querySelector('.table-wrapper');
        const table = document.querySelector('.table--companies');

        // If no table visible, render both the header and content
        if(!table) { 
            tableWrapper.insertAdjacentHTML('afterbegin', tableView.createTableTest('companies', headers, rows, false));
            adminView.animateTableContentIn('companies')
            // Else remove the tbody and render just the content
        } else {
            utils.removeElement(document.querySelector('tbody'));
            document.querySelector('thead').insertAdjacentHTML('afterend', tableView.updateTableContent('companies', rows));
            adminView.animateTableBodyIn('companies');
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
                const targetRow = e.target.closest('.row');
                const rowId = row.querySelector('.td-data--company-name').dataset.id;
                const company = this.companies.filter((company, index) => {
                    return parseInt(rowId) === company.id;
                });
                utils.changeActiveRow(targetRow, companyRows);
                this.state.companies.currentCompany = company[0];


                // Change the summary
                const summary = document.querySelector('.summary');
                const newSummary = adminView.createCompanySummary(company[0])
                console.log(summary, newSummary);

                const tl = gsap.timeline();

                // adminView.swapSummary(summary, adminView.createCompanySummary(company[0]), this.companySummaryListener.bind(this), tl);
                tl.add(adminView.animateSummaryWrapperOut());
                tl.add(() => {
                    // Switch the summary
                    adminView.switchSummary(summary, newSummary);

                    // Set the pagination state (This does to the company jobs array what limit and offset do in the api call)
                    this.setCompanyJobsState();

                    // Render the summary company jobs table
                    if(this.state.companies.paginatedJobs.length > 0) {
                        // remove any placeholders
                        const placeholder = document.querySelector('.company-jobs-placeholder')

                        if(placeholder) placeholder.parentElement.removeChild(placeholder);

                        this.renderCompanyJobsTable();
                    } else {
                        // render a placeholder saying 'no jobs'
                        document.querySelector('.table-wrapper--nested-jobs')
                            .insertAdjacentHTML('afterbegin', adminView.generateCompanyJobsPlaceholder());
                    } 

                    // Add pagination for nested contacts, addresses, and jobs elements
                    this.addCompanyNestedPagination();

                    // Add the listener to the new summary
                    document.querySelector('.summary').addEventListener('click', (e) => this.companySummaryListener(e))

                    // Remove any modals
                    adminView.removeSummaryModals();
            
                  })
                  tl.add(adminView.animateSummaryWrapperIn());

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
        const companySummary = document.querySelector('.company-summary');
        companySummary.addEventListener(
            'click',
            (e) => this.companySummaryListener(e)
        );
    }

    async companySummaryListener(e) {
        // Animations
        const newCompanyAlertAnimation = gsap.timeline({paused: true});
        const editCompanyAlertAnimation = gsap.timeline({paused: true});
        const deleteCompanyAlertAnimation = gsap.timeline({paused: true});

        const newContactAlertAnimation = gsap.timeline({paused: true});
        const editContactAlertAnimation = gsap.timeline({paused: true});
        const deleteContactAlertAnimation = gsap.timeline({paused: true});
        
        const newAddressAlertAnimation = gsap.timeline({paused: true});
        const editAddressAlertAnimation = gsap.timeline({paused: true});
        const deleteAddressAlertAnimation = gsap.timeline({paused: true});


        // Buttons
        const newBtn = e.target.closest('.company-summary__btn--new');
        const newContactBtn = e.target.closest('.company-summary__btn--new-contact');
        const newAddressBtn = e.target.closest('.company-summary__btn--new-address');
        const hubspotBtn = e.target.closest('.company-summary__btn--hubspot');
        const editBtn = e.target.closest('.company-summary__btn--edit');
        const editContactBtn = e.target.closest('.company-summary__btn--edit-contact');
        const editAddressBtn = e.target.closest('.company-summary__btn--edit-address');
        const deleteBtn = e.target.closest('.company-summary__btn--delete');
        const deleteContactBtn = e.target.closest('.company-summary__btn--delete-contact');
        const deleteAddressBtn = e.target.closest('.company-summary__btn--delete-address');
        const jobBtn = e.target.closest('.row');

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

        if(jobBtn) {
            console.log(this);
            const jobId = jobBtn.firstElementChild.dataset.id;
            this.displayAdminContent('jobs', jobId);
            adminView.changeActiveMenuItem(document.querySelector('.sidebar__item--jobs')); 
        }

        if(newBtn) {
            let alert;
            const { 
                id,
                companyName,
                addresses,
                contacts
            } = this.state.companies.currentCompany;
            adminView.renderCompanyModal({
                companyNumber: this.getNextId('companies'),
                id,
                companyName,
                contact: contacts[this.state.companies.contactPagination.contactIndex],
                address: addresses[this.state.companies.addressPagination.addressIndex]
            }, 'new');

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

            // Add the animation for the company alerts (paused)
            newCompanyAlertAnimation
            .from(alertWrapper, {
                autoAlpha: 0
            })
            .to(alertWrapper, {
                autoAlpha: 0
            }, '+=3')

            closeBtn.addEventListener('click', () => {
                adminView.removeCompanyModal();
            });

            companyForm.addEventListener('submit', async e => {
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

                            alert = modalView.getAlert('Company Not Created', false);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            newCompanyAlertAnimation.play(0);
                        }else {  
                            alert = modalView.getAlert('Company Created', true);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            newCompanyAlertAnimation.play(0);

                            await this.getData('companies');
                            this.state.companies.currentCompany = res.data.company;
                            this.resetCompanyState();

                            const summary = document.querySelector('.summary');
                            const newSummary = adminView.createCompanySummary(this.state.companies.currentCompany);

                            // No animation needed as it's behind the modal
                            adminView.switchSummary(summary, newSummary);

                            // Render the summary company jobs table
                            if(this.state.companies.paginatedJobs.length > 0) {
                                // remove any placeholders
                                const placeholder = document.querySelector('.company-jobs-placeholder')

                                if(placeholder) placeholder.parentElement.removeChild(placeholder);

                                this.renderCompanyJobsTable();
                            } else {
                                // render a placeholder saying 'no jobs'
                                document.querySelector('.table-wrapper--nested-jobs')
                                    .insertAdjacentHTML('afterbegin', adminView.generateCompanyJobsPlaceholder());
                            } 

                            // Add pagination for nested contacts, addresses, and jobs elements
                            this.addCompanyNestedPagination();

                            // Add the listener to the new summary
                            document.querySelector('.summary').addEventListener('click', (e) => this.companySummaryListener(e))


                            this.renderCompaniesTable();
                            // Update pagination
                            const { totalCompanies, searchOptions: {index: companyIndex, limit: companyLimit} } = this.state.companies;
                            adminView.renderPagination(companyIndex, companyLimit, document.querySelector('.table-wrapper'), 'companies');
                    
                            console.log(this.state.companies.currentCompany);
                        }
                    } catch(err) {
                        console.log(err)

                        if(err?.response?.data?.validationErrors.length > 0){
                            alert = modalView.getAlert(err.response.data.validationErrors[0].msg, false);
                        } else {
                            alert = modalView.getAlert('Company Not Created', false);
                        }
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        newCompanyAlertAnimation.play(0);
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
               console.log(name, value);
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
        if(newContactBtn) {
            let alert;

            const { 
                id,
                companyName,
                addresses,
                contacts
            } = this.state.companies.currentCompany;

            adminView.renderCompanyModal({
                companyNumber: id,
                companyName,
                contact: contacts[this.state.companies.contactPagination.contactIndex],
                address: addresses[this.state.companies.addressPagination.addressIndex]
            }, 'new-contact');

            const alertWrapper = document.querySelector('.alert-wrapper');
            const companyForm = document.querySelector('.form--new-contact');
            const closeBtn = document.querySelector('.form__close--new-contact');
            const submitBtn = document.querySelector('.form__submit--new-contact');
            const modal = document.querySelector('.company-summary__modal');

            const fields = adminView.getCompanyFields('new-contact');
            const { contactFirstNameField, contactSurnameField, contactPositionField, phoneField, emailField } = fields;

            // Add the animation for the company alerts (paused)
            newContactAlertAnimation
            .from(alertWrapper, {
                autoAlpha: 0
            })
            .to(alertWrapper, {
                autoAlpha: 0,
                duration: .2,
            }, '+=1.5')
            .add(() => {
                if(!document.querySelector('.alert--error')) {
                    return gsap.to(modal, {
                        autoAlpha: 0,
                        duration: .2,
                        onComplete: () => {

                            modal.parentElement.removeChild(modal);
                        }
                    })
                }
            })

            closeBtn.addEventListener('click', ()=>adminView.removeCompanyModal());

            companyForm.addEventListener('submit', async e => {
                e.preventDefault();
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
                            newContactAlertAnimation.play(0);
                        } else {
                            alert = modalView.getAlert('Contact Created', true);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            newContactAlertAnimation.play(0);

                            this.state.companies.currentCompany.contacts.push(res.data.contact);
                            this.state.companies.contactPagination.totalContacts++;

                            const { totalContacts, contactIndex } = this.state.companies.contactPagination;
                            adminView.renderPagination(totalContacts, contactIndex, document.querySelector('.pagination-wrapper--contacts'), 'contacts');

                        }
                    } catch(err) {
                        console.log(err);

                        if(err?.response?.data?.validationErrors.length > 0){
                            alert = modalView.getAlert(err.response.data.validationErrors[0].msg, false);
                        } else {
                            alert = modalView.getAlert('Contact Not Created', false);
                        }
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        newContactAlertAnimation.play(0);
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
            let alert;

            const { 
                id,
                companyName,
                addresses,
                contacts
            } = this.state.companies.currentCompany;

            adminView.renderCompanyModal({
                companyNumber: id,
                companyName,
                contact: contacts[this.state.companies.contactPagination.contactIndex],
                address: addresses[this.state.companies.addressPagination.addressIndex]
            }, 'new-address');

            const alertWrapper = document.querySelector('.alert-wrapper');
            const companyForm = document.querySelector('.form--new-address');
            const closeBtn = document.querySelector('.form__close--new-address');
            const submitBtn = document.querySelector('.form__submit--new-address');
            const modal = document.querySelector('.company-summary__modal');

            const fields = adminView.getCompanyFields('new-address');
            const { firstLineField, secondLineField, cityField, countyField, postcodeField } = fields;

            // Add the animation for the company alerts (paused)
            newAddressAlertAnimation
            .from(alertWrapper, {
                autoAlpha: 0
            })
            .to(alertWrapper, {
                autoAlpha: 0,
                duration: .2,
            }, '+=1.5')
            .add(() => {
                if(!document.querySelector('.alert--error')) {
                    return gsap.to(modal, {
                        autoAlpha: 0,
                        duration: .2,
                        onComplete: () => {

                            modal.parentElement.removeChild(modal);
                        }
                    })
                }
            })

            closeBtn.addEventListener('click', ()=>
                gsap.to('.company-summary__modal', {
                    autoAlpha: 0,
                    duration: .2,
                    onComplete: () => {
                        adminView.removeCompanyModal()
                    }
                })
            );

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
                            newAddressAlertAnimation.play(0);
                        } else {
                            alert = modalView.getAlert('Address Created', true);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            newAddressAlertAnimation.play(0);

                            this.state.companies.currentCompany.addresses.push(res.data.address);
                            this.state.companies.addressPagination.totalAddresses++;

                            const { totalAddresses, addressIndex } = this.state.companies.addressPagination;
                            adminView.renderPagination(totalAddresses, addressIndex, document.querySelector('.pagination-wrapper--addresses'), 'addresses');

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
                        newAddressAlertAnimation.play(0);

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
        if(editBtn) {
            const { 
                id,
                companyName,
                addresses,
                contacts
            } = this.state.companies.currentCompany;

            adminView.renderCompanyModal({
                companyNumber: id,
                companyName,
                contact: contacts[this.state.companies.contactPagination.contactIndex],
                address: addresses[this.state.companies.addressPagination.addressIndex]
            }, 'edit');

            let alert;
            const alertWrapper = document.querySelector('.alert-wrapper');
            const companyForm = document.querySelector('.form--edit-company');
            const closeBtn = document.querySelector('.form__close--edit-company');
            const modal = document.querySelector('.company-summary__modal');

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

            // Add the animation for the company alerts (paused)
            editCompanyAlertAnimation
                .from(alertWrapper, {
                    autoAlpha: 0
                })
                .to(alertWrapper, {
                    autoAlpha: 0
                }, '+=1')
                .add(() => {
                    if(!document.querySelector('.alert--error')) {
                        return gsap.to(modal, {
                            autoAlpha: 0,
                            duration: .2,
                            onComplete: () => {
                                modal.parentElement.removeChild(modal);
                            }
                        })
                    }
                })

            closeBtn.addEventListener('click', adminView.removeCompanyModal);

            companyForm.addEventListener('submit', async () => {
                e.preventDefault();
                // Clear the alert wrapper contents
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                const data = adminView.getCompanyValues(fields, true); 
                const { changed, ...values } = data;

                const errors = validator.validateCompany(values);
                
                if(!changed.length > 0) {
                    alert = modalView.getAlert(`No Fields Changed`, false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);

                    editCompanyAlertAnimation.play(0);
                    return;
                }

                const contactId = this.state.companies.currentCompany.contacts[this.state.companies.currentContactIndex].contactId;

                const addressId = this.state.companies.currentCompany.addresses[this.state.companies.currentAddressIndex].id;

                if(!errors) {
                    try {
                        const res = await this.Admin.editCompany({ id, contactId, addressId, ...values });      

                        if(res.status !== 201) {
                            alert = modalView.getAlert('Company Not Edited', false);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            editCompanyAlertAnimation.play(0);
                        } else {
                            await this.getData('companies');
                            this.state.companies.currentCompany = res.data.company;

                            const summary = document.querySelector('.summary');
                            const newSummary = adminView.createCompanySummary(this.state.companies.currentCompany);

                            // No animation needed as it's behind the modal
                            adminView.switchSummary(summary, newSummary);
                            
                            // No need to set the companyJobs state because it's not changed

                            // Render the summary company jobs table
                            if(this.state.companies.paginatedJobs.length > 0) {
                                // remove any placeholders
                                const placeholder = document.querySelector('.company-jobs-placeholder')

                                if(placeholder) placeholder.parentElement.removeChild(placeholder);

                                this.renderCompanyJobsTable();
                            } else {
                                // render a placeholder saying 'no jobs'
                                document.querySelector('.table-wrapper--nested-jobs')
                                    .insertAdjacentHTML('afterbegin', adminView.generateCompanyJobsPlaceholder());
                            } 

                            // Add pagination for nested contacts, addresses, and jobs elements
                            this.addCompanyNestedPagination();

                            // Add the listener to the new summary
                            document.querySelector('.summary').addEventListener('click', (e) => this.companySummaryListener(e))

                            // Remove any modals
                            adminView.removeSummaryModals();

                            alert = modalView.getAlert('Company Edited', true);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            editCompanyAlertAnimation.play(0);

                            console.log(changed);
                            // If companyName has changed, update the table
                            if(changed.indexOf('companyName') !== -1) this.renderCompaniesTable();

                        }

                    } catch(err) {
                        console.log(err)

                        if(err?.response?.data?.validationErrors.length > 0){
                            alert = modalView.getAlert(err.response.data.validationErrors[0].msg, false);
                        } else {
                            alert = modalView.getAlert('Company Not Edited', false);
                        }
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        editCompanyAlertAnimation.play(0);
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
        if(editContactBtn) {
            let alert;
            const { 
                id,
                companyName,
                addresses,
                contacts
            } = this.state.companies.currentCompany;

            adminView.renderCompanyModal({
                companyNumber: id,
                companyName,
                contact: contacts[this.state.companies.contactPagination.contactIndex],
                address: addresses[this.state.companies.addressPagination.addressIndex]
            }, 'edit-contact');

            const alertWrapper = document.querySelector('.alert-wrapper');
            const companyForm = document.querySelector('.form--edit-contact');
            const closeBtn = document.querySelector('.form__close--edit-contact');
            const modal = document.querySelector('.company-summary__modal');

            const fields = adminView.getCompanyFields('edit-contact');
            const { 
                contactFirstNameField,
                contactSurnameField,
                contactPositionField,
                phoneField,
                emailField,
            } = fields;

            // Add the animation for the company alerts (paused)
            editContactAlertAnimation
            .from(alertWrapper, {
                autoAlpha: 0
            })
            .to(alertWrapper, {
                autoAlpha: 0,
                duration: .2,
            }, '+=2')
            .add(() => {
                if(!document.querySelector('.alert--error')) {
                    return gsap.to(modal, {
                        autoAlpha: 0,
                        duration: .2,
                        onComplete: () => {
                            modal.parentElement.removeChild(modal);
                        }
                    })
                }
            })

            closeBtn.addEventListener('click', ()=>
                gsap.to('.company-summary__modal', {
                    autoAlpha: 0,
                    duration: .2,
                    onComplete: () => {
                        adminView.removeCompanyModal()
                    }
                })
            );

            companyForm.addEventListener('submit', async e => {
                e.preventDefault();
                // Clear the alert wrapper
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                const data = adminView.getCompanyValues(fields, true); 
                // Remove the changed field, and others not applicable to the new contact form
                const { changed, companyName, firstLine, secondLine, city, county, postcode, ...values } = data;
                if(!changed.length > 0) {
                    alert = modalView.getAlert(`No Fields Changed`, false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);

                    editContactAlertAnimation.play(0);

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

                const contactId = this.state.companies.currentCompany.contacts[this.state.companies.currentContactIndex].contactId;

                const errors = validator.validateContact(values);

                if(!errors) {
                    try {
                        const res = await this.Admin.editContact({id, contactId, ...values});

                        console.log(res.status);
                        if(res.status !== 201) {
                            alert = modalView.getAlert('Contact Not Edited', false);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            editContactAlertAnimation.play(0);
                        } else {
                            await this.getData('companies');
                            // editContact returns all the contacts, not 1
                            this.state.companies.currentCompany.contacts = res.data.contacts;
                            
                            const summary = document.querySelector('.summary');
                            const newSummary = adminView.createCompanySummary(this.state.companies.currentCompany);
                            // No animation needed as it's behind the modal
                            adminView.switchSummary(summary, newSummary);

                            // No need to set the companyJobs state because it's not changed

                            // Render the summary company jobs table
                            if(this.state.companies.paginatedJobs.length > 0) {
                                // remove any placeholders
                                const placeholder = document.querySelector('.company-jobs-placeholder')

                                if(placeholder) placeholder.parentElement.removeChild(placeholder);

                                this.renderCompanyJobsTable();
                            } else {
                                // render a placeholder saying 'no jobs'
                                document.querySelector('.table-wrapper--nested-jobs')
                                    .insertAdjacentHTML('afterbegin', adminView.generateCompanyJobsPlaceholder());
                            } 

                            // Add pagination for nested contacts, addresses, and jobs elements
                            this.addCompanyNestedPagination();

                            // Add the listener to the new summary
                            document.querySelector('.summary').addEventListener('click', (e) => this.companySummaryListener(e))

                            alert = modalView.getAlert('Contact Edited', true);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            editContactAlertAnimation.play(0);

                        }
                    } catch(err) {
                        console.log(err);
                        if(err?.response?.data?.validationErrors.length > 0){
                            alert = modalView.getAlert(err.response.data.validationErrors[0].msg, false);
                        } else {
                            alert = modalView.getAlert('Contact Not Created', false);
                        }
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                        newContactAlertAnimation.play(0);
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
            let alert;
            const { 
                id,
                companyName,
                addresses,
                contacts
            } = this.state.companies.currentCompany;

            adminView.renderCompanyModal({
                companyNumber: id,
                companyName,
                contact: contacts[this.state.companies.contactPagination.contactIndex],
                address: addresses[this.state.companies.addressPagination.addressIndex]
            }, 'edit-address');

            const alertWrapper = document.querySelector('.alert-wrapper');
            const companyForm = document.querySelector('.form--edit-address');
            const closeBtn = document.querySelector('.form__close--edit-address');
            const modal = document.querySelector('.company-summary__modal');

            const fields = adminView.getCompanyFields('edit-address');
            const { 
                firstLineField, secondLineField, cityField, countyField, postcodeField 
            } = fields;
            
            // Add the animation for the company alerts (paused)
            editAddressAlertAnimation
            .from(alertWrapper, {
                autoAlpha: 0
            })
            .to(alertWrapper, {
                autoAlpha: 0,
                duration: .2,
            }, '+=2')
            .add(() => {
                if(!document.querySelector('.alert--error')) {
                    return gsap.to(modal, {
                        autoAlpha: 0,
                        duration: .2,
                        onComplete: () => {
                            modal.parentElement.removeChild(modal);
                        }
                    })
                }
            })

            closeBtn.addEventListener('click', ()=>
                gsap.to('.company-summary__modal', {
                    autoAlpha: 0,
                    duration: .2,
                    onComplete: () => {
                        adminView.removeCompanyModal()
                    }
                })
            );

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

                    editContactAlertAnimation.play(0);

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
                const addressId = this.state.companies.currentCompany.addresses[this.state.companies.currentAddressIndex].id;

                const errors = validator.validateAddress(values);

                if(!errors) {
                    try {
                        const res = await this.Admin.editAddress({id, addressId, ...values});
                        console.log(res.status);
                        if(res.status !== 201) {
                            alert = modalView.getAlert('Address Not Edited', false);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            editAddressAlertAnimation.play(0);
                        } else {
                            await this.getData('companies');

                            // editAddress returns all the contacts, not 1
                            this.state.companies.currentCompany.addresses = res.data.addresses;

                            const summary = document.querySelector('.summary');
                            const newSummary = adminView.createCompanySummary(this.state.companies.currentCompany);
                            // No animation needed as it's behind the modal
                            adminView.switchSummary(summary, newSummary);
                            // No need to set the companyJobs state because it's not changed

                            
                            // Render the summary company jobs table
                            if(this.state.companies.paginatedJobs.length > 0) {
                                // remove any placeholders
                                const placeholder = document.querySelector('.company-jobs-placeholder')

                                if(placeholder) placeholder.parentElement.removeChild(placeholder);

                                this.renderCompanyJobsTable();
                            } else {
                                // render a placeholder saying 'no jobs'
                                document.querySelector('.table-wrapper--nested-jobs')
                                    .insertAdjacentHTML('afterbegin', adminView.generateCompanyJobsPlaceholder());
                            } 

                            // Add pagination for nested contacts, addresses, and jobs elements
                            this.addCompanyNestedPagination();

                            // Add the listener to the new summary
                            document.querySelector('.summary').addEventListener('click', (e) => this.companySummaryListener(e))

                            alert = modalView.getAlert('Address Edited', true);
                            alertWrapper.insertAdjacentHTML('afterbegin', alert);
                            editAddressAlertAnimation.play(0);
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
                        editAddressAlertAnimation.play(0);
                    }
                }
            });
        }
        if(deleteBtn) {
            let alert;
            const companyId = document.querySelector('.company-summary').dataset.id;
            const summaryWrapper = document.querySelector('.summary-wrapper');

            // Render confirmation modal
            const confirmationHtml = adminView.getDeleteCompanyHtml(companyId);
            summaryWrapper.insertAdjacentHTML('afterbegin', confirmationHtml);

            // Select and animate confirmation modal
            const confirmation = document.querySelector('.confirmation');
            gsap.from(confirmation, {
                autoAlpha: 0,
                duration: .2
            });

            // Alert animation
            const alertWrapper = document.querySelector('.alert-wrapper');
            // Add the animation for the company alerts
            deleteCompanyAlertAnimation
            .from(alertWrapper, {
                autoAlpha: 0
            })
            .to(alertWrapper, {
                autoAlpha: 0
            }, '+=1')
            .add(() => {
                if(!document.querySelector('.alert--error')) {
                    return gsap.to(confirmation, {
                        autoAlpha: 0,
                        duration: .2,
                        onComplete: () => {
                            confirmation.parentElement.removeChild(confirmation);
                        }
                    })
                }
            })
            
            const confirm = document.querySelector('.confirmation__btn--confirm');
            const cancel = document.querySelector('.confirmation__btn--cancel');

            confirm.addEventListener('click', async() => {
                // Clear the alert wrapper contents
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);


                if(this.companies.length === 1) {
                    alert = modalView.getAlert(`Cannot delete last remaining address`, false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);
                    // Add to the animation to remove the modal (usually failed modals remain)
                    deleteAddressAlertAnimation.to(confirmation, {
                        autoAlpha: 0,
                        duration: .2,
                        onComplete: () => {
                            confirmation.parentElement.removeChild(confirmation);
                        }
                    })
                    deleteAddressAlertAnimation.play(0);
                    
                    return;
                }

                try {
                    const res = await this.Admin.deleteCompany(companyId);
                    if(res.status === 200) {
                        console.log('success');
                        alert = modalView.getAlert(`Company ${companyId} deleted`, true);
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);

                        // Update the companies array
                        await this.getData('companies');

                        // Rerender table
                        this.renderCompaniesTable();

                        // Update current company
                        this.state.companies.currentCompany = this.companies[0];

                        // Change the summary
                        const summary = document.querySelector('.summary');
                        const newSummary = adminView.createCompanySummary(this.state.companies.currentCompany);
                        // No animation needed as it's behind the modal
                        adminView.switchSummary(summary, newSummary);


                        // Set the pagination state (This does to the company jobs array what limit and offset do in the api call)
                        this.setCompanyJobsState();

                        // Render the summary company jobs table
                        if(this.state.companies.paginatedJobs.length > 0) {
                            // remove any placeholders
                            const placeholder = document.querySelector('.company-jobs-placeholder');
                            if(placeholder) placeholder.parentElement.removeChild(placeholder);

                            this.renderCompanyJobsTable();
                        } else {
                            // render a placeholder saying 'no jobs'
                            document.querySelector('.table-wrapper--nested-jobs')
                                .insertAdjacentHTML('afterbegin', adminView.generateCompanyJobsPlaceholder());
                        } 
                        // Add pagination for nested contacts, addresses, and jobs elements
                        this.addCompanyNestedPagination();

                        this.addCompanySummaryListeners();

                        // Play the alert animation
                        deleteCompanyAlertAnimation.play(0);
                    } else { 
                        // Clear the alert wrapper contents
                        while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);
                        alert = modalView.getAlert(`Company not deleted`, false);
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);
                    }
                } catch(err) {
                    // Clear the alert wrapper contents
                    while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);
                    alert = modalView.getAlert(`Company not deleted`, false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);
                }
            });

            cancel.addEventListener('click', () => {
                gsap.to(confirmation, {
                    autoAlpha: 0,
                    duration: .2,
                    onComplete: () => {
                        confirmation.parentElement.removeChild(confirmation);
                    }
                })
            });
        }
        if(deleteContactBtn) {
            console.log('deleteContact');
            
            let alert;
            const contactId = document.querySelector('.summary__heading--contacts').dataset.id;
            const summaryWrapper = document.querySelector('.summary-wrapper');

            // Render confirmation modal
            const confirmationHtml = adminView.getDeleteContactHtml(contactId);
            summaryWrapper.insertAdjacentHTML('afterbegin', confirmationHtml);

            // Select and animate confirmation modal
            const confirmation = document.querySelector('.confirmation');
            gsap.from(confirmation, {
                autoAlpha: 0,
                duration: .2
            });

            // Alert animation
            const alertWrapper = document.querySelector('.alert-wrapper');
            // Add the animation for the company alerts
            deleteContactAlertAnimation
            .from(alertWrapper, {
                autoAlpha: 0
            })
            .to(alertWrapper, {
                autoAlpha: 0
            }, '+=1')
            .add(() => {
                if(!document.querySelector('.alert--error')) {
                    return gsap.to(confirmation, {
                        autoAlpha: 0,
                        duration: .2,
                        onComplete: () => {
                            confirmation.parentElement.removeChild(confirmation);
                        }
                    })
                }
            })

            const confirm = document.querySelector('.confirmation__btn--confirm');
            const cancel = document.querySelector('.confirmation__btn--cancel');

            confirm.addEventListener('click', async () => {
                // Clear the alert wrapper contents
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                if(this.state.companies.currentCompany.contacts.length === 1) {
                    alert = modalView.getAlert(`Cannot delete last remaining contact`, false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);
                    // Add to the animation to remove the modal (usually failed modals remain)
                    deleteContactAlertAnimation.to(confirmation, {
                        autoAlpha: 0,
                        duration: .2,
                        onComplete: () => {
                            confirmation.parentElement.removeChild(confirmation);
                        }
                    })
                    deleteContactAlertAnimation.play(0);
                    
                    return;
                }

                try {
                    const res = await this.Admin.deleteContact(contactId);

                    if(res.status === 200) {
                        // Set the alert
                        alert = modalView.getAlert(`Contact ${contactId} deleted`, true);
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);

                        // No need to update the company array or the company table
                        // Just remove the contact from the current company
                        const index = this.state.companies.currentCompany.contacts.findIndex(contact => contact.contactId === parseInt(contactId));
                        this.state.companies.currentCompany.contacts.splice(index, 1);

                        // Change summary
                        const summary = document.querySelector('.summary');
                        const newSummary = adminView.createCompanySummary(this.state.companies.currentCompany);
                        // No animation needed as it's behind the modal
                        adminView.switchSummary(summary, newSummary);

                        // Set the pagination state (This does to the company jobs array what limit and offset do in the api call)
                        this.setCompanyJobsState();

                        // Render the summary company jobs table
                        if(this.state.companies.paginatedJobs.length > 0) {
                            // remove any placeholders
                            const placeholder = document.querySelector('.company-jobs-placeholder');
                            if(placeholder) placeholder.parentElement.removeChild(placeholder);

                            this.renderCompanyJobsTable();
                        } else {
                            // render a placeholder saying 'no jobs'
                            document.querySelector('.table-wrapper--nested-jobs')
                                .insertAdjacentHTML('afterbegin', adminView.generateCompanyJobsPlaceholder());
                        } 
                        // Add pagination for nested contacts, addresses, and jobs elements
                        this.addCompanyNestedPagination();

                        this.addCompanySummaryListeners();

                        deleteContactAlertAnimation.play(0);
                    } 
                } catch(err) {
                    console.log(err);
                }
            }); 

            cancel.addEventListener('click', () => {
                gsap.to(confirmation, {
                    autoAlpha: 0,
                    duration: .2,
                    onComplete: () => {
                        // Pausing the animation prevents the onComplete running on a confirmation that isn't there
                        deleteContactAlertAnimation.pause();
                        confirmation.parentElement.removeChild(confirmation);
                    }
                })
            });  
        }
        if(deleteAddressBtn) {
            let alert;
            const addressId = document.querySelector('.summary__heading--addresses').dataset.id;
            const summaryWrapper = document.querySelector('.summary-wrapper');

            // Render confirmation modal
            const confirmationHtml = adminView.getDeleteAddressHtml(addressId);
            summaryWrapper.insertAdjacentHTML('afterbegin', confirmationHtml);

            // Select and animate confirmation modal
            const confirmation = document.querySelector('.confirmation');
            gsap.from(confirmation, {
                autoAlpha: 0,
                duration: .2
            });

            // Alert animation
            const alertWrapper = document.querySelector('.alert-wrapper');
            // Add the animation for the company alerts
            deleteAddressAlertAnimation
            .from(alertWrapper, {
                autoAlpha: 0
            })
            .to(alertWrapper, {
                autoAlpha: 0
            }, '+=1')
            .add(() => {
                if(!document.querySelector('.alert--error')) {
                    return gsap.to(confirmation, {
                        autoAlpha: 0,
                        duration: .2,
                        onComplete: () => {
                            confirmation.parentElement.removeChild(confirmation);
                        }
                    })
                }
            })

            const confirm = document.querySelector('.confirmation__btn--confirm');
            const cancel = document.querySelector('.confirmation__btn--cancel');

            confirm.addEventListener('click', async () => {
                // Clear the alert wrapper contents
                while(alertWrapper.firstChild) alertWrapper.removeChild(alertWrapper.firstChild);

                if(this.state.companies.currentCompany.addresses.length === 1) {
                    alert = modalView.getAlert(`Cannot delete last remaining address`, false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);
                    // Add to the animation to remove the modal (usually failed modals remain)
                    deleteAddressAlertAnimation.to(confirmation, {
                        autoAlpha: 0,
                        duration: .2,
                        onComplete: () => {
                            confirmation.parentElement.removeChild(confirmation);
                        }
                    })
                    deleteAddressAlertAnimation.play(0);
                    
                    return;
                }

                try {
                    const res = await this.Admin.deleteAddress(addressId);

                    if(res.status === 200) {
                        console.log('deleted');
                        // Set the alert
                        alert = modalView.getAlert(`Address ${addressId} deleted`, true);
                        alertWrapper.insertAdjacentHTML('afterbegin', alert);

                        // No need to update the company array or the company table
                        // Just remove the address from the current company
                        const index = this.state.companies.currentCompany.addresses.findIndex(address => address.id === parseInt(addressId));
                        this.state.companies.currentCompany.addresses.splice(index, 1);

                        // Change summary
                        const summary = document.querySelector('.summary');
                        const newSummary = adminView.createCompanySummary(this.state.companies.currentCompany);
                        // No animation needed as it's behind the modal
                        adminView.switchSummary(summary, newSummary);

                        // Set the pagination state (This does to the company jobs array what limit and offset do in the api call)
                        this.setCompanyJobsState();

                        // Render the summary company jobs table
                        if(this.state.companies.paginatedJobs.length > 0) {
                            // remove any placeholders
                            const placeholder = document.querySelector('.company-jobs-placeholder');
                            if(placeholder) placeholder.parentElement.removeChild(placeholder);

                            this.renderCompanyJobsTable();
                        } else {
                            // render a placeholder saying 'no jobs'
                            document.querySelector('.table-wrapper--nested-jobs')
                                .insertAdjacentHTML('afterbegin', adminView.generateCompanyJobsPlaceholder());
                        } 
                        // Add pagination for nested contacts, addresses, and jobs elements
                        this.addCompanyNestedPagination();

                        this.addCompanySummaryListeners();

                        deleteAddressAlertAnimation.play(0);
                    } else {
                        const error = new Error();
                        error.statusCode = res.status;
                        throw error;

                    }
                } catch(err) {
                    console.log(err);
                    alert = modalView.getAlert('Address Not Deleted', false);
                    alertWrapper.insertAdjacentHTML('afterbegin', alert);
                    newAddressAlertAnimation.play(0);
                }
            }); 
            cancel.addEventListener('click', () => {
                gsap.to(confirmation, {
                    autoAlpha: 0,
                    duration: .2,
                    onComplete: () => {
                        // Pausing the animation prevents the onComplete running on a confirmation that isn't there
                        deleteAddressAlertAnimation.pause();
                        confirmation.parentElement.removeChild(confirmation);
                    }
                })
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

    resetCompanyState() {
        this.state.companies.companyJobPagination.jobIndex = 0;
        this.state.companies.companyJobPagination.jobLimit = 0;
        this.state.companies.companyJobPagination.totalJobs = 0;
        this.state.companies.contactPagination.contactIndex = 0;
        this.state.companies.contactPagination.contactLimit = 0;
        this.state.companies.contactPagination.totalContacts = 0;
        this.state.companies.addressPagination.addressIndex = 0;
        this.state.companies.addressPagination.addressLimit = 0;
        this.state.companies.addressPagination.totalAddresses = 0;
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
        const tl = gsap.timeline();
        // pagination btns
        const userBtn = e.target.closest('.pagination__item--users');
        const jobBtn = e.target.closest('.pagination__item--jobs');
        const companyBtn = e.target.closest('.pagination__item--companies');
        const applicationBtn = e.target.closest('.pagination__item--applications');
        const userPrevious = e.target.closest('.pagination__previous--users');
        const userNext = e.target.closest('.pagination__next--users');
        const jobPrevious = e.target.closest('.pagination__previous--jobs');
        const jobNext = e.target.closest('.pagination__next--jobs');
        const companyPrevious = e.target.closest('.pagination__previous--companies');
        const companyNext = e.target.closest('.pagination__next--companies');
        const applicationPrevious = e.target.closest('.pagination__previous--applications');
        const applicationNext = e.target.closest('.pagination__next--applications');
        const paginationItem = e.target.closest('.pagination__item');


        const application = applicationPrevious || applicationNext || applicationBtn;
        const job = jobPrevious || jobNext || jobBtn;
        const company = companyPrevious || companyNext || companyBtn;
        const user = userPrevious || userNext || userBtn;

        // If no pagination btns are clicked, return
        if(!application && !job && !company && !user) return;

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
        
        // Render loaders
        adminView.renderAdminLoaders();

        // set up animation timeline (before data updated)
        tl
          .add(adminView.animateTableContentOut())
        //   .add(adminView.animateSummaryOut(), '<')
          .add(adminView.animateAdminLoadersIn(), '<')


        // Choose which table's pagination is being updated, and with which functions
        if(userBtn || userPrevious || userNext) {
            this.handleUserPagination(userBtn, userPrevious, userNext);
        } else if(jobBtn || jobPrevious || jobNext){
            this.handleJobPagination(jobBtn, jobPrevious, jobNext, tl);
        } else if(companyBtn || companyPrevious || companyNext) {
            this.handleCompanyPagination(companyBtn, companyPrevious, companyNext);
        } else if(applicationBtn || applicationPrevious || applicationNext) {
            this.handleApplicationPagination(applicationBtn, applicationPrevious, applicationNext, tl);

        } else {
            return;
        }

 

        //// Set the pagination state
        // setPagination();

        // // Update the pagination view
        // adminView.updatePagination(this.state.applications.currentPage);

        // // Update the admin data
        // await requestData();
        // this.state.isActiveRequest = false;

        // tl
        //     // Animate the loaders out
        //   .add(adminView.animateAdminLoadersOut())
        //   .add(() => {
        //     // Populate summary while not visible
        //     populateSummary();

        //     // Animate summary in
        //     gsap.fromTo('.summary', {autoAlpha: 0}, {autoAlpha: 1});

        //     // Update the table
        //     // this.renderApplicationTable();
        //     this.updateApplicationTable();

        //     // Animate table in
        //     renderTable();

        //     this.state.isActivePaginationAnimation = false;

        //     console.log(this.state.isActivePaginationAnimation, this.state.isActiveRequest);
        //   });

       
    };

    handleUserPagination(userBtn, userPrevious, userNext) {
        const userState = this.state.users;
        // If the page changes the active user should be the first in the table
        userState.currentUser = this.users[0];
        const pages = Math.ceil(userState.totalUsers / userState.searchOptions.limit);

        if(userPrevious && !(userState.currentPage < 1)) {
            this.movePageBackwards(userState);
        }
        if(userNext && !(userState.currentPage >= pages-1) ) {
            this.movePageForwards(userState);
        }
        if(userBtn) {
            this.movePage(userState, userBtn);
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

    setJobPaginationState(jobBtn, jobPrevious, jobNext) {
        const jobState = this.state.jobs;
        // // Changing page = new current job
        // jobState.currentJob = this.jobs[0];

        const pages = Math.ceil(jobState.totalJobs / jobState.searchOptions.limit);

        if(jobPrevious && !(jobState.currentPage <= 1)) {
            console.log('backwards');

            this.movePageBackwards(jobState);
        }
        if(jobNext && !(jobState.currentPage >= pages)) {
            console.log('forwards');

            this.movePageForwards(jobState);
        }
        if(jobBtn) {
            console.log('move');

            this.movePage(jobState, jobBtn);
        }

    }

    async handleJobPagination(jobBtn, jobPrevious, jobNext, timeline) {
        // Set the state
        this.setJobPaginationState(jobBtn, jobPrevious, jobNext);
        // Update the view
        adminView.updatePaginationView(this.state.jobs.currentPage -1);

        // get the new data
        await this.getData('jobs');
        this.state.isActiveRequest = false;

        this.changeTablePageAnimation(timeline, 'jobs');
    }

    // handleJobPagination(jobBtn, jobPrevious, jobNext) {
    //     const tl = gsap.timeline();

    //     // If there's an active request, cancel it
    //     if(this.state.isActiveRequest) { 
    //         cancelTokenSource();
    //         this.state.isActiveRequest = false;
    //         console.log('cancelled')
    //     }

    //     const jobState = this.state.jobs;
    //     // Changing page = new current job
    //     jobState.currentJob = this.jobs[0];

    //     const pages = Math.ceil(jobState.totalJobs / jobState.searchOptions.limit);

    //     if(jobPrevious && !(jobState.currentPage < 1)) {
    //         this.movePageBackwards(jobState);
    //     }
    //     if(jobNext && !(jobState.currentPage >= pages-1)) {
    //         this.movePageForwards(jobState);
    //     }
    //     if(jobBtn) {
    //         this.movePage(jobState, jobBtn);
    //     }

    //     this.Admin.getJobs(this.state.jobs.searchOptions)
    //         .then(res => {
    //             this.jobs = res.data.jobs;
    //             this.state.jobs.totalJobs = res.data.total;

    //             // Set the table index to 0
    //             this.state.jobsTable.index = 0;
    //             this.renderJobsTable();
    //             adminView.populateJobSummary(this.jobs[0]);
    //         }).catch(err => console.log(err));
    // };

    handleCompanyPagination(companyBtn, companyPrevious, companyNext) {
        const companyState = this.state.companies;
        // New page, new current company
        companyState.currentCompany = this.companies[0];
        const pages = Math.ceil(companyState.totalCompanies / companyState.searchOptions.limit);
 
        if(companyPrevious && !(companyState.currentPage < 1)) {
            this.movePageBackwards(companyState);
        }
        if(companyNext && !(companyState.currentPage >= pages-1) ) {
            this.movePageForwards(companyState);
        }
        if(companyBtn) {
            this.movePage(companyState, companyBtn);
        }
        this.Admin.getCompanies(this.state.companies.searchOptions)
            .then((res) => {
                if(res.data.companies) {
                    // Store and render data
                    this.companies = res.data.companies;
                    this.state.companies.totalCompanies = res.data.total;

                    this.renderCompaniesTable();
                    // Initialise company summary
                    adminView.populateCompanySummary(this.companies[0]);
                    adminView.populateAddressSummary(this.companies[0].id, this.companies[0].addresses[0]);
                    adminView.populateContactSummary(this.companies[0].id, this.companies[0].people[0]);
                }
            })
            .catch(err => console.log(err));
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

    setApplicationPagination(applicationBtn, applicationPrevious, applicationNext) {
        const applicationState = this.state.applications;
      
        // // New page, new application
        // applicationState.currentApplication = this.applications[0];

        const pages = Math.ceil(applicationState.totalApplications / applicationState.searchOptions.limit);

        if(applicationPrevious && !(applicationState.currentPage <= 1)) {
            console.log('backwards');
            this.movePageBackwards(applicationState);
        } else if(applicationNext && !(applicationState.currentPage >= pages)) {
            console.log('forwards');
            this.movePageForwards(applicationState);
        } else if(applicationBtn) {
            console.log('move');
            this.movePage(applicationState, applicationBtn);
        }

    }

    async handleApplicationPagination(applicationBtn, applicationPrevious, applicationNext, timeline) {

        // Set the pagination state
        this.setApplicationPagination(applicationBtn, applicationPrevious, applicationNext);
        // Set the pagination view
        adminView.updatePaginationView(this.state.applications.currentPage -1);

        await this.getData('applications');
        this.state.isActiveRequest = false;

        this.changeTablePageAnimation(timeline, 'applications');

    }

    changeTablePageAnimation(timeline, table) {
        let listener;
        let createSummary;

        switch(table) {
            case 'applications': 
                listener = this.applicationSummaryListener.bind(this);
                createSummary = adminView.createApplicationSummary.bind(this, this.applications[0]); 
                break;
            case 'jobs':
                listener = this.jobSummaryListener.bind(this);
                createSummary = adminView.createJobSummary.bind(this, this.jobs[0]);
                break;
        }
        timeline
          .add(adminView.animateAdminLoadersOut())
          .add(() => {
            // Populate summary while not visible
            adminView.swapSummary(
                document.querySelector('.summary'), 
                createSummary(), 
                listener
            ); 
                         
            // Update the table
            switch(table) {
                case 'applications': 
                    this.renderApplicationTable();
                    break;
                case 'jobs':
                    this.renderJobsTable();
                    break;
            }

            // Animate table in
            adminView.animateTableBodyIn();

            this.state.isActivePaginationAnimation = false;
        })

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
        state.searchOptions.index -= state.searchOptions.limit;

    }
    movePageForwards(state) {
        state.currentPage++;
        state.searchOptions.index += state.searchOptions.limit;
    }
    movePage(state, btn) {
        state.searchOptions.index = btn.dataset.id * state.searchOptions.limit;
        state.currentPage = state.searchOptions.index / state.searchOptions.limit +1;
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