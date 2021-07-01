/* ASSETS */
import '../sass/common.scss';
import '../sass/admin.scss';
import '../assets/icons/edit-solid.svg';
import '../assets/icons/delete-solid.svg';
import '../assets/icons/hubspot.svg';
import '../assets/icons/tick.svg';
import '../assets/icons/upload-np.svg';
import '../assets/icons/pdf.svg';
import '../assets/icons/pdf.svg';
import '../assets/icons/doc.svg';
import '../assets/icons/save-np.svg';
import '../assets/icons/delete-np1.svg';
import '../assets/icons/edit-np1.svg';
import '../assets/icons/add.svg';

import * as headerView from './views/headerView';
import * as adminView from './views/adminView';
import * as tableView from './views/tableView';
import * as userForm from './views/userForm';
import * as jobForm from './views/jobForm';
import * as jobView from './views/jobView';
import * as utils from './utils/utils';

import JobList from './models/JobList';
import UserModel from './models/User';
import Applications from './models/Applications';
import Companies from './models/Companies';
import Admin from './models/Admin';

import { elements, elementStrings } from './views/base';

class AdminController {
    constructor() {
        // JobList and UserModel return axios methods CRUD ops
        this.JobList = new JobList();
        this.UserModel = new UserModel();
        this.Applications = new Applications();
        this.Companies = new Companies();
        this.Admin = new Admin();
        this.state= {
            jobs: {
                totalJobs: 0,
                currentJob: {},
                currentPage: 0,
                searchOptions: {
                    index: 0,
                    limit: 6,
                    titles: [],
                    locations: [],
                    orderField: "createdAt",
                    orderDirection: "ASC"
                }
            },
            users: {
                totalUsers: 0,
                currentUser: {},
                currentPage: 0,
                searchOptions: {
                    index: 0,
                    limit: 6,
                    orderField: "createdAt",
                    orderDirection: "ASC"
                }
            },
            jobsTable: {
                index: 0
            }
            
        }
        
        // initSocket();

        this.addEventListeners();
    }

    addEventListeners() {
        // ONLOAD
        window.addEventListener('DOMContentLoaded', async e => {
            utils.pageFadeIn();
            // Render Header
            headerView.renderHeader("admin");

            adminView.initialiseJobPage();

            // Calculate # of rows to render
            this.state.jobs.searchOptions.limit = adminView.calculateRows('jobs');


            this.Admin.getJobs(this.state.jobs.searchOptions)
                .then(res => {

                    this.jobs = res.data.jobs;
                    this.state.jobs.totalJobs = res.data.total;

                    
                    this.renderJobsTable();
                    if(this.jobs.length > 0) {
                        adminView.populateJobSummary(this.jobs[0]);
                        this.addJobSummaryListeners();
                        // adminView.addTableListeners('jobs');
                    } else {
                        // @TODO: Render placeholder
                        
                    }
                })
                .catch(err => console.log(err));

            this.Admin.getCompanies().then(res => {
                this.companies = res.data.companies;
            }).catch(err => console.log(err));
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
                adminView.makeEditable(document.querySelectorAll('.job-summary__item'), false);
                adminView.changeEditIcon('edit', 'job');
                
                adminView.toggleDropdown(
                    false, 
                    `<div class="job-summary__item job-summary__company" contenteditable=false>
                        ${this.state.jobs.currentJob.companyName}
                    </div>`,
                    document.querySelector('.job-summary__select')
                )
                adminView.addFeaturedCheckbox(false, this.state.jobs.currentJob.featured);
            }
            if(this.createJobLostFocus(e)) {
                console.log('create jobs lost focus');
                
                // Remove the dropdown + replace with company div
                adminView.toggleDropdown(
                    false, 
                    `<div class="job-summary__item job-summary__company" contenteditable=false>
                        ${this.state.jobs.currentJob.companyName}
                    </div>`,
                    document.querySelector('.job-summary__select')
                );

                adminView.populateJobSummary(this.state.jobs.currentJob);

                adminView.makeEditable(document.querySelectorAll('.job-summary__item'), false);

                adminView.changeNewIcon('new', 'job');
            }

        })

        // MODALS
        document.body.addEventListener('click', this.checkModals.bind(this));

        // MENU LISTENERS
        elements.adminSidebar.addEventListener('click', (e) => {
            const applications = e.target.closest('.sidebar__item--applications');
            const jobs = e.target.closest('.sidebar__item--jobs');
            const companies = e.target.closest('.sidebar__item--companies');
            const users = e.target.closest('.sidebar__item--users');
            const settings = e.target.closest('.sidebar__item--settings');

            adminView.changeActiveMenuItem(e);

            if(jobs && !document.querySelector('.admin__content--jobs')) {
                // Clear admin page / rename content class / render placeholders
                adminView.initialiseJobPage();

                // Jobs data initially loaded on DOMLoaded (+company data for editing)
                this.renderJobsTable();

                if(this.jobs.length > 0) {
                    adminView.populateJobSummary(this.jobs[0]); 
                    this.addJobSummaryListeners();
                } else { 
                    // @TODO Placeholder for no jobs
                }
            }
            if(users && !document.querySelector('.admin__content--users')) {
                // Clear admin page / rename content class / render placeholders
                adminView.initialiseUserPage();

                // Calculate # of rows to render / api limit
                this.state.users.searchOptions.limit = adminView.calculateRows('users');

                // Get User data
                this.Admin.getUsers(this.state.users.searchOptions)
                    .then((res) => {
                        // Store and render data
                        this.users = res.data.applicants;
                        this.state.users.totalUsers = res.data.total;
                        console.log(this.users);

                        this.renderUsersTable();
                        if(this.users.length > 0) {
                            adminView.populateUserSummary(this.users[0]);
                            this.addUserSummaryListeners();
                        } else {
                            // @TODO: Render placeholder
                        }
                });
                
            }
            if(applications) {
                this.Applications
                    .getApplications()
                    .then(res => {
                            this.applications = res.data.applications;
                        if(this.applications.length > 0) {
                            this.renderApplicationsContent();
                            // Add application button listeners
                            document.querySelectorAll('.cv-btn--table').forEach(btn => {
                                btn.addEventListener('click', (e) => {
                                    const cvUrl = e.target.closest('.cv-btn--table').dataset.cvurl;
                                    if(cvUrl !== 'null')
                                        this.Admin.getCv(cvUrl).then((res) => {
                                            const contentDisposition = res.headers['content-disposition'];
                                            let fileName = contentDisposition.split(';')[1].split('=')[1].toString();
                                            adminView.forceDownload(res, fileName);
                                        }).catch(err => console.log(err));
                                });
                            });
                        }

                    })
                    .catch(err => console.log(err));
            }
            if(companies) {
                this.Companies
                    .getCompanies()
                    .then(res => {
                        this.companies = res.data.companies;
                        if(this.companies.length > 0) adminView.renderCompanies(this.companies)
                    })
            }
        });


        // PAGINATION CONTROLS
        document.body.addEventListener('click', this.handlePaginationEvent.bind(this));
            
    }

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

    renderApplicationsContent() {
        // Already on the applications page, return
        if(document.querySelector('.admin__content--applications')) return;

        // Remove existing content
        utils.clearElement(elements.adminContent);

        // Replace existing classname
        elements.adminContent.className = "admin__content admin__content--applications";

        // Create table contents
        const {headers, rows} = adminView.formatApplications(this.applications);

        adminView.renderContent([ 
                tableView.createTableTest('applications', headers, rows, false),
            ],  elements.adminContent
        );

        // if(!document.querySelector(elementStrings.adminApplicationsTable)) {
        //     // Clear the table wrapper
        //     utils.clearElement(elements.adminContent);
            
        //     // Render the table
        //     // adminView.renderContent(
        //     //     [
        //     //         tableView.createTable(
        //     //             'applications',
        //     //             Object.keys(this.applications[0]),  
        //     //             adminView.formatApplications(this.applications),
        //     //             false,
        //     //             []
        //     //         ),
        //     //         ''
        //     //     ],
        //     //     elements.adminContent
        //     // );
        //     // adminView.renderPagination(this.searchOptions.index, this.searchOptions.limit, this.state.jobs.totalJobs, document.querySelector('.btn-wrapper--admin'));

            
        //     const {headers, rows} = adminView.formatApplications(this.applications);
        //     console.log(this.applications);
  
        //     adminView.renderContent([ 
        //             tableView.createTableTest('applications', headers, rows, false),
        //         ],  elements.adminContent
        //     );
            
        //     // add
        // }
    }

    renderJobsTable() {
        const { totalJobs, searchOptions: { index, limit } } = this.state.jobs;
        
        // Format jobs/header into html elements
        const {headers, rows} = adminView.formatJobs(this.jobs);
        
        const tableWrapper = document.querySelector('.jobs-table__wrapper');

        // Remove table and pagination if they exist already
        const table = document.querySelector('.table--jobs');
        const pagination = document.querySelector('.pagination--jobs');
        if(table) utils.removeElement(table);
        if(pagination) utils.removeElement(pagination);

        tableWrapper.insertAdjacentHTML('afterbegin', tableView.createTableTest('jobs', headers, rows, false));

        adminView.renderPagination(index, limit, totalJobs, tableWrapper, 'jobs');

        const jobRows = document.querySelectorAll('.row--jobs');

        utils.changeActiveRow(jobRows[this.state.jobsTable.index], jobRows);

        // Add table row listeners
        jobRows.forEach(row => {
            row.addEventListener('click', e => {
                const rowId = row.querySelector('.td-data--company').dataset.id;
                const job = this.jobs.filter((job, index) => {
                    if(parseInt(rowId) === job.id) this.state.jobsTable.index = index;
                    return parseInt(rowId) === job.id;
                })[0];

                adminView.populateJobSummary(job);
                utils.changeActiveRow(row, jobRows);
            });
        });
    }

    addJobSummaryListeners() {
        const jobSummary = document.querySelector('.job-summary');

        jobSummary.addEventListener('click', e => {
            // Ignore synthetic clicks from the offscreen input element
            // if(e.target === document.querySelector('.user-summary__input')) return;

            const editBtn = e.target.closest('.job-summary__btn--edit');
            const deleteBtn = e.target.closest('.job-summary__btn--delete');
            const saveBtn = e.target.closest('.job-summary__btn--save');
            const saveNewBtn = e.target.closest('.job-summary__btn--save-new');
            const hubspotBtn = e.target.closest('.job-summary__btn--hubspot');
            const jobElements = jobSummary.querySelectorAll('.job-summary__item');
            const newBtn = e.target.closest('.job-summary__btn--new');
            const companyItem = jobSummary.querySelector('.job-summary__company');


            if(editBtn) {
                const jobId = jobSummary.dataset.id;
                this.state.jobs.currentJob = this.jobs.find(job => job.id === parseInt(jobId));
                const companyId = this.state.jobs.currentJob.companyId;


                if(jobElements[0].getAttribute('contenteditable') === 'false') {

                    // Icons not to alter when the edit state is changed
                    const iconsToIgnore = ['job-summary__btn--save'];

                    adminView.changeEditIcon('save', 'job', iconsToIgnore);
                    adminView.makeEditable(jobElements, true, ['job-summary__featured', 'job-summary__company']);
                    

                    // Add a company name dropdown in place of the div
                    const classNames = ['job-summary__item', 'job-summary__select', 'job-summary__item--editable', 'job-summary__company'];                    
                    const dropdown = adminView.createSelectElement(this.companies, 'Company Name', classNames, companyId);
                    
                    classNames.forEach(name => dropdown.classList.add(name));

                    adminView.toggleDropdown(true, companyItem, dropdown);

                    adminView.addFeaturedCheckbox(true, this.state.jobs.currentJob.featured);
                }
            }
            if(saveBtn) {
                const formData = adminView.getJobEdits(this.state.jobs.currentJob);
                // for(let [key, value] of formData.entries()) { console.log(key, value);}

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
                            this.state.jobs.currentJob = this.jobs.find(job => job.id === parseInt(jobId));
                            this.renderJobsTable();
                            console.log(this.state.jobs.currentJob);
                            adminView.populateJobSummary(this.state.jobs.currentJob);
                            
                        })
                        .catch(err => console.log(err));
                } else {
                    console.log('dont save');
                }

                // Technically unnecessary as the edit button never had the disabled class added
                // but used for consistency
                const iconsToIgnore = ['job-summary__btn--edit'];

                adminView.changeEditIcon('edit', 'job', iconsToIgnore);
                adminView.makeEditable(jobElements, false, ['job-summary__featured']);
                adminView.toggleDropdown(
                    false, 
                    `<div class="job-summary__item job-summary__company" contenteditable=false>
                        ${this.state.jobs.currentJob.companyName}
                    </div>`,
                    document.querySelector('.job-summary__select')
                );
                adminView.addFeaturedCheckbox(false, this.state.jobs.currentJob.featured);
            }
            if(newBtn) {
                // Save current user
                const jobId = jobSummary.dataset.id;
                this.state.jobs.currentJob = this.jobs.find(job => job.id === parseInt(jobId));
                const companyId = this.state.jobs.currentJob.companyId;

                // Make the items editable
                adminView.makeEditable(jobElements, true, ['job-summary__featured', 'job-summary__company']);
             

                // Switch the company element to a dropdown
                const classNames = ['job-summary__item', 'job-summary__select', 'job-summary__item--editable', 'job-summary__company'];
                const dropdown = adminView.createSelectElement(this.companies, 'Company Name', classNames, companyId);
                adminView.toggleDropdown(true, companyItem, dropdown);

                const iconsToIgnore = ['job-summary__btn--save-new'];

                // Change the new icon
                adminView.changeNewIcon('save', 'job', iconsToIgnore);

                // Clear the current summary
                adminView.clearJobSummary();
            }
            if(saveNewBtn){
                console.log('saveBtn');
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
                                adminView.populateJobSummary(job);

                                companyElement = table.querySelectorAll(`[data-id="${this.state.jobs.currentJob.id}"]`)[0];

                            } else {
                                this.state.jobs.currentJob = this.jobs[0];
                                adminView.populateJobSummary(this.state.jobs.currentJob);   
                            }

                            // If the new job is visible in the table make it the active row, else make it the first row
                            const row = companyElement? companyElement.parentNode.parentNode : document.querySelector('.row--jobs');
                            const rows = document.querySelectorAll('.row--jobs');
                            if(row) utils.changeActiveRow(row, rows);
                            
                        })
                        .catch(err => console.log(err));

                } else {
                    console.log('dont save new job');
                }

                // Technically not needed as the 'new' btn was never disabled, but used for consistency
                const iconsToIgnore = ['job-summary__btn--new'];

                adminView.changeNewIcon('new', 'job', iconsToIgnore);
                adminView.makeEditable(jobElements, false, ['job-summary__featured']);
                adminView.toggleDropdown(
                    false, 
                    `<div class="job-summary__item job-summary__company" contenteditable=false>
                        ${this.state.jobs.currentJob.companyName}
                    </div>`,
                    document.querySelector('.job-summary__select')
                );
                adminView.addFeaturedCheckbox(false, this.state.jobs.currentJob.featured);

                // Changing the icons / making elements uneditable handled in a listener on the body
            }
            if(deleteBtn) {
                const jobId = jobSummary.dataset.id;
                this.Admin.deleteJob(jobId).then(response => {
                    if(response.status === 200)
                        return this.Admin.getJobs();
                }).then(response => {
                    this.jobs = response.data.jobs;
                    this.state.jobs.totalJobs = response.data.total;

                    // Change the currentJob and table index
                    this.state.jobs.currentJob = this.jobs[0];
                    this.state.jobsTable.index = 0;

                    // Update the Job summary
                    adminView.populateJobSummary(this.state.jobs.currentJob);

                    // Render the table
                    this.renderJobsTable();

                    // Change the first row to active
                    const rows = document.querySelectorAll('.row--jobs');
                    utils.changeActiveRow(rows[0], rows);

                }).catch(err => console.log(err));
            }
        });
    }

    renderUsersTable() {
        const { totalUsers, searchOptions: {index, limit} } = this.state.users;
        // Offset is subtracted from the user id to get the current item
        const page = index / limit;
        const offset = page * limit;
        // Format users/headers into html elements
        const {headers, rows} = adminView.formatUsers(this.users);
        const tableWrapper = document.querySelector('.users-table__wrapper');

        // removeUserTable & pagination if it exists
        const table = document.querySelector('.table--users');
        const pagination = document.querySelector('.pagination--users');
        if(table) utils.removeElement(table);
        if(pagination) utils.removeElement(pagination);

        // elements.adminContent.insertAdjacentHTML('afterbegin', tableView.createTableTest('users', headers, rows, false))
        tableWrapper.insertAdjacentHTML('afterbegin', tableView.createTableTest('users', headers, rows, false));
        // Add pagination
        adminView.renderPagination(index, limit, totalUsers, tableWrapper, 'users');

        // Add listeners to rows in the user tables 
        const userRows = document.querySelectorAll('.row--users');
        const activeRow = Array.from(userRows).find(row => row.querySelector(`[data-id="${this.state.users.currentUser.applicantId}"]`)) || userRows[0];
        console.log(activeRow);
        utils.changeActiveRow(activeRow, userRows);

        userRows.forEach(row => {
            row.addEventListener('click', (e) => {
                const targetRow = e.target.closest('.row');
                const rowId = targetRow.querySelector('.td-data--first-name').dataset.id;
                const user = this.users.filter(user => {
                    return parseInt(rowId) === user.applicantId;
                });

                utils.changeActiveRow(targetRow, userRows);
                this.state.users.currentUser = user[0];
                console.log(this.state.users.currentUser);
                adminView.populateUserSummary(user[0]);
            });
        });
    }
    addUserSummaryListeners() {
        const userSummary = document.querySelector('.user-summary');

        userSummary.addEventListener('click', (e) => {



            const newBtn = e.target.closest('.user-summary__btn--new');
            const editBtn = e.target.closest('.user-summary__btn--edit');
            const deleteBtn = e.target.closest('.user-summary__btn--delete');
            const saveBtn = e.target.closest('.user-summary__btn--save');
            const hubspotBtn = e.target.closest('.user-summary__btn--hubspot');
            const cvBtn = e.target.closest('.user-summary__btn--cv') || e.target.closest('.user-summary__cv-path');
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
                this.Admin.createApplicant(formData).then(res => {
                    if(res.status !== 201) { 
                        console.log(res.status);
                        throw new Error('Applicant not created') 
                    }// @TODO: show error message
                    // @TODO: show success message
                    console.log(res.data.user);
                    formUser = res.data.user;

                    return this.Admin.getUsers(this.state.users.searchOptions);
                    
                }).then(res => {
                    // @TODO: show error msg
                    if(res.status !== 200) {
                        console.log(res.status);
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
                        // @TODO: Both getUsers and remove from local array?
                        // Remove the current user from the local array
                        // this.users = this.users.filter(user => {
                        //     return user !== this.state.users.currentUser;
                        // }) 

                        // If the local array only has 1 element left in it, move the pagination (which updates searchOptions)
                        console.log('Array length' + this.users.length);
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
            if(cvBtn && !uploadBtn) {
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
        const editableContent = document.querySelector('.job-summary__item--editable');
        const editBtnTarget = e.target.closest('.job-summary__btn--edit');
        const itemTarget = e.target.closest('.job-summary__item');
        const saveTarget = e.target.closest('.job-summary__btn--save-new');
        // Returns false if present, ie if the newBtn is on screen 
        // The newBtn is present when both adding a new job && editing a current job
        const editBtn = document.querySelector('.job-summary__btn--edit');

        if(jobSummary && editableContent && !editBtnTarget && !itemTarget && !saveTarget && editBtn) {
            return true;
        } 
        return false;
    }
    editJobLostFocus(e) {
        const jobSummary = document.querySelector('.job-summary');
        const editableContent = document.querySelector('.job-summary__item--editable');
        const editBtnTarget = e.target.closest('.job-summary__btn--edit');
        const itemTarget = e.target.closest('.job-summary__item');
        const saveTarget = e.target.closest('.job-summary__btn--save');

        // Returns false if present, ie if editBtn on screen
        // Present whenever not editing
        const newBtn = document.querySelector('.job-summary__btn--new');

        if(jobSummary && editableContent && !editBtnTarget && !itemTarget && !saveTarget && newBtn) {
            return true;
        }
        return false;
    }

    handlePaginationEvent(e) {
        const userBtn = e.target.closest('.pagination__item--users');
        const userPrevious = e.target.closest('.pagination__previous--users');
        const userNext = e.target.closest('.pagination__next--users');

        const jobBtn = e.target.closest('.pagination__item--jobs');
        const jobPrevious = e.target.closest('.pagination__previous--jobs');
        const jobNext = e.target.closest('.pagination__next--jobs');

        if(userBtn || userPrevious || userNext) {
            this.handleUserPagination(userBtn, userPrevious, userNext);
        } else if(jobBtn || jobPrevious || jobNext){
            this.handleJobPagination(jobBtn, jobPrevious, jobNext);
        }
    };
    handleUserPagination(userBtn, userPrevious, userNext) {
        const userState = this.state.users;
        const pages = Math.ceil(userState.totalUsers / userState.searchOptions.limit);
        console.log(`User pagination: CurrentPage: ${userState.currentPage}`);

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
    handleJobPagination(jobBtn, jobPrevious, jobNext) {
        const jobState = this.state.jobs;
        const pages = Math.ceil(jobState.totalJobs / jobState.searchOptions.limit);

        if(jobPrevious && !(jobState.currentPage < 1)) {
            this.movePageBackwards(jobState);
        }
        if(jobNext && !(jobState.currentPage >= pages-1)) {
            this.movePageForwards(jobState);
        }
        if(jobBtn) {
            this.movePage(jobState, jobBtn);
        }

        this.Admin.getJobs(this.state.jobs.searchOptions)
            .then(res => {
                this.jobs = res.data.jobs;
                this.state.jobs.totalJobs = res.data.total;

                // Set the table index to 0
                this.state.jobsTable.index = 0;
                this.renderJobsTable();

                adminView.populateJobSummary(this.jobs[0]);
            }).catch(err => console.log(err));
    };
    movePageBackwards(state) {
        state.currentPage--;
        state.searchOptions.index -= state.searchOptions.limit;
        console.log(`User pagination: CurrentPageNow: ${state.currentPage}`);

    }
    movePageForwards(state) {
        state.currentPage++;
        state.searchOptions.index += state.searchOptions.limit;
        console.log(`User pagination: CurrentPageNow: ${state.currentPage}`);
    }
    movePage(state, btn) {
        state.searchOptions.index = btn.dataset.id * state.searchOptions.limit;
        state.currentPage = state.searchOptions.index / state.searchOptions.limit;

        console.log(`User pagination: CurrentPageNow: ${state.currentPage}`);
    }
}

new AdminController();