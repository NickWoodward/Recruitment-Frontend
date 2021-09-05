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
            companies: {
                totalCompanies: 0,
                currentCompany: {},
                currentAddressIndex: 0,
                currentContactIndex: 0,
                searchOptions: {
                    index: 0,
                    limit: 6,
                    orderField: "createdAt",
                    orderDirection: "ASC"
                }
            },
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
                    orderDirection: "DESC"
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
                    orderDirection: "DESC"
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

            adminView.initialiseAdminPage('jobs');

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

                const jobSummary = document.querySelector('.job-summary');
                // Remove element listeners
                jobSummary.removeEventListener('focusin', adminView.focusInEditJobHandler);
                jobSummary.removeEventListener('focusout', adminView.focusOutEditJobHandler);

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

                const jobSummary = document.querySelector('.job-summary');
                // Remove element listeners
                jobSummary.removeEventListener('focusin', adminView.focusInNewJobHandler);
                jobSummary.removeEventListener('focusout', adminView.focusOutNewJobHandler);
                
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
                adminView.changeNewIcon('new', 'company');
                adminView.changeNewIcon('new', 'address');
                adminView.changeNewIcon('new', 'contact');
            }
            if(this.editCompanyLostFocus(e)) {
                console.log('edit company lost focus');

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

                adminView.changeEditIcon('edit', 'company');
                adminView.changeEditIcon('edit', 'address');
                adminView.changeEditIcon('edit', 'contact');
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
                adminView.initialiseAdminPage('jobs');

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
                adminView.initialiseAdminPage('users');

                // Calculate # of rows to render / api limit
                this.state.users.searchOptions.limit = adminView.calculateRows('users');

                // Get User data
                this.Admin.getUsers(this.state.users.searchOptions)
                    .then((res) => {

                        // Store and render data
                        this.users = res.data.applicants;
                        this.state.users.totalUsers = res.data.total;

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
                adminView.initialiseAdminPage('companies');

                // Calculate # of rows to render / api limit
                this.state.companies.searchOptions.limit = adminView.calculateRows('companies');

                this.Admin
                    .getCompanies(this.state.companies.searchOptions)
                    .then(res => {
                        this.companies = res.data.companies;
                        this.state.companies.totalCompanies = res.data.total;
                        if(this.companies.length > 0) {
                            this.renderCompaniesTable();
                            adminView.populateCompanySummary(this.companies[0]);
                            adminView.populateAddressSummary(this.companies[0].id, this.companies[0].addresses[0]);
                            adminView.populateContactSummary(this.companies[0].id, this.companies[0].people[0]);
                            this.addCompanySummaryListeners();
                        }
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
        // const activeRow = Array.from(jobRows).find(row => {
        //     console.log(row.querySelector(`[data-id="${this.state.jobs.currentJob.applicantId}"]`));
        //     return row.querySelector(`[data-id="${this.state.jobs.currentJob.applicantId}"]`)
        // }) || jobRows[0];
        utils.changeActiveRow(jobRows[0], jobRows);

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
                    
                    // Add focus listeners
                    this.boundFocusOutEditJobHandler = adminView.focusOutEditJobHandler.bind(this, this.state.jobs.currentJob);
                    jobSummary.addEventListener('focusin', adminView.focusInEditJobHandler);
                    jobSummary.addEventListener('focusout', this.boundFocusOutEditJobHandler);

                    // Add a company name dropdown in place of the div
                    const classNames = ['job-summary__item', 'job-summary__select', 'job-summary__item--editable', 'job-summary__company'];                    
                    const dropdown = adminView.createSelectElement(this.companies, 'Company Name', classNames, companyId);
                    
                    classNames.forEach(name => dropdown.classList.add(name));

                    adminView.toggleDropdown(true, companyItem, dropdown);

                    adminView.addFeaturedCheckbox(true, this.state.jobs.currentJob.featured);
                }
            }
            if(saveBtn) {

                // Remove element listeners
                jobSummary.removeEventListener('focusin', adminView.focusInEditJobHandler);
                jobSummary.removeEventListener('focusout', this.boundFocusOutEditJobHandler);

                const formData = adminView.getJobEdits(this.state.jobs.currentJob);

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
             
                // Add event listeners
                jobSummary.addEventListener('focusin', adminView.focusInNewJobHandler);
                jobSummary.addEventListener('focusout', adminView.focusOutNewJobHandler);

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

    renderUsersTable() {
        const { totalUsers, searchOptions: {index, limit} } = this.state.users;
        // Offset is subtracted from the user id to get the current item
        // const page = index / limit;
        // const offset = page * limit;
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

        console.log(this.state.users.currentUser.applicantId);
        const userRows = document.querySelectorAll('.row--users');
        const activeRow = Array.from(userRows).find(row => row.querySelector(`[data-id="${this.state.users.currentUser.applicantId}"]`)) || userRows[0];
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

    renderCompaniesTable() {
        // Extract state
        const { totalCompanies, searchOptions: { index, limit } } = this.state.companies;

        // Format data into html elements
        const { headers, rows } = adminView.formatCompanies(this.companies);

        // Select html elements
        const tableWrapper = document.querySelector('.companies-table__wrapper');
        const table = document.querySelector('.table--companies');
        const pagination = document.querySelector('.pagination--companies');

        // If the elements exist, remove them
        if(table) utils.removeElement(table);
        if(pagination) utils.removeElement(pagination);

        tableWrapper.insertAdjacentHTML('afterbegin', tableView.createTableTest('companies', headers, rows, false));
        
        // Add pagination
        adminView.renderPagination(index, limit, totalCompanies, tableWrapper, 'companies');

        console.log(this.state.companies.currentCompany.id);


        // Change active 
        const companyRows = document.querySelectorAll('.row--companies');
        const activeRow = Array.from(companyRows).find(row => row.querySelector(`[data-id="${this.state.companies.currentCompany.id}"]`)) || companyRows[0];
        

        utils.changeActiveRow(activeRow, companyRows);

        companyRows.forEach(row => {
            row.addEventListener('click', (e) => {
                const targetRow = e.target.closest('.row');
                const rowId = targetRow.querySelector('.td-data--company-name').dataset.id;
                const company = this.companies.filter(company => {
                    return parseInt(rowId) === company.id;
                })[0];

                utils.changeActiveRow(targetRow, companyRows);
                this.state.companies.currentCompany = company;
                adminView.populateCompanySummary(company);
                adminView.populateAddressSummary(company.id, company.addresses[0]);
                adminView.populateContactSummary(company.id, company.people[0])
            });
        });
    }
    addCompanySummaryListeners() {
        const summaryWrapper = document.querySelector('.summary-wrapper');

        summaryWrapper.addEventListener('click', e => {
            const newBtn = e.target.closest('.company-summary__btn--new');
            const editBtn = e.target.closest('.company-summary__btn--edit');
            const deleteBtn = e.target.closest('.company-summary__btn--delete');
            const saveBtn = e.target.closest('.company-summary__btn--save');
            const hubspotBtn = e.target.closest('.company-summary__btn--hubspot');
            const saveNewBtn = e.target.closest('.company-summary__btn--save-new');
    
            const companyElements = summaryWrapper.querySelectorAll('.company-summary__item');
            const contactElements = summaryWrapper.querySelectorAll('.contact-summary__item');
    
            if(newBtn) {
                console.log('newBtn');
                // Save current company values
                const companyId = document.querySelector('.company-summary').dataset.id;
                this.state.companies.currentCompany = this.companies.find(company => company.id === parseInt(companyId));

                const iconsToIgnore = [
                    'company-summary__btn--save-new'
                ];
                // Alter the summary form
                adminView.changeNewIcon('save', 'company', iconsToIgnore);
                adminView.changeNewIcon('save', 'address', iconsToIgnore);
                adminView.changeNewIcon('save', 'contact', iconsToIgnore);

                adminView.makeEditable(companyElements, true, []);
                adminView.makeAddressEditable(true, 'placeholder', this.state.companies.currentCompany.addresses[0]);
                adminView.makeEditable(contactElements, true, []);

                adminView.togglePlaceholders(companyElements, true, []);
                adminView.togglePlaceholders(document.querySelectorAll('.address-summary__item'), true, []);
                adminView.togglePlaceholders(contactElements, true, []);

                summaryWrapper.addEventListener('focusin', adminView.focusInNewCompanyHandler);
                summaryWrapper.addEventListener('focusout', adminView.focusOutNewCompanyHandler);
            };
            if(editBtn) {
                console.log('edit');
                // Save current company values
                const companyId = document.querySelector('.company-summary').dataset.id;
                this.state.companies.currentCompany = this.companies.find(company => company.id === parseInt(companyId));

                const iconsToIgnore = [
                    'company-summary__btn--save'
                ];
                // Alter the summary form
                adminView.changeEditIcon('save', 'company', iconsToIgnore);
                adminView.changeEditIcon('save', 'address', iconsToIgnore);
                adminView.changeEditIcon('save', 'contact', iconsToIgnore);


                adminView.makeEditable(companyElements, true, []);
                adminView.makeAddressEditable(true, 'value', this.state.companies.currentCompany.addresses[0]);
                adminView.makeEditable(contactElements, true, []);

                // adminView.togglePlaceholders(companyElements, true, []);
                // adminView.togglePlaceholders(document.querySelectorAll('.address-summary__item'), true, []);
                // adminView.togglePlaceholders(contactElements, true, []);

                this.boundFocusOutEditCompanyHandler = adminView.focusOutEditCompanyHandler.bind(this, this.state.companies.currentCompany);
                summaryWrapper.addEventListener('focusin', adminView.focusInEditCompanyHandler);
                summaryWrapper.addEventListener('focusout', this.boundFocusOutEditCompanyHandler);
            }
            if(deleteBtn) {
                console.log('delete');
                // Get company id
                const companyId = document.querySelector('.company-summary').dataset.id;

                this.Admin.deleteCompany(companyId).then(res => {
                    console.log(res);
                    // @TODO: handle success/failure
                    
                    // If it's the last company in the table, move back one page
                    if(this.companies.length <= 1) {
                        this.movePageBackwards(this.state.companies);
                    }

                    return this.Admin.getCompanies(this.state.companies.searchOptions);
                }).then(res => {
                    // @TODO: handle success/failure
                    console.log(res);
                    this.companies = res.data.companies;
                    this.state.companies.totalCompanies = res.data.total;

                    this.state.companies.currentCompany = this.companies[0];

                    this.renderCompaniesTable();

                    // Repopulate the summaries
                    adminView.populateCompanySummary(this.state.companies.currentCompany);
                    adminView.populateAddressSummary(this.state.companies.currentCompany.id, this.state.companies.currentCompany.addresses[0]);
                    adminView.populateContactSummary(this.state.companies.currentCompany.id, this.state.companies.currentCompany.people[0]);
                }).catch(err => console.log(err));

            }
            if(saveBtn) {
                console.log('save');
                // Remove the item listeners
                summaryWrapper.removeEventListener('focusin', adminView.focusInNewCompanyHandler);
                summaryWrapper.removeEventListener('focusout', adminView.focusOutNewCompanyHandler);

                // Get all user input
                const companyForm = adminView.getNewCompany();
                const addressForm = adminView.getNewAddress();
                const contactForm = adminView.getNewContact();
                
                const formData = new FormData();

                for(let [key, value] of companyForm.entries()) formData.append(`${key}`, value);
                for(let [key, value] of addressForm.entries()) formData.append(`${key}`, value);
                for(let [key, value] of contactForm.entries()) formData.append(`${key}`, value);

                for(let [key, value] of addressForm.entries()) console.log(`${key}`, value);
                
                if(companyForm && addressForm && contactForm) {
                    let formCompany;

                    // Make API call here to create company
                    this.Admin.editCompany(1, 4, 1, formData)
                        .then(response => {
                            if(response.status !== 201) {
                                // @TODO: error handling
                                console.log('error');
                            }
                            formCompany = response.data.company;

                            return this.Admin.getCompanies(this.state.companies.searchOptions);
                        })
                        .then(response => {
                            this.state.companies.totalCompanies = response.data.total;
                            this.companies = response.data.companies;

                            // Search for the recently created company in the returned company list
                            const currentCompany = this.companies.find(company => {
                                return formCompany.id === company.id;
                            });

                            this.state.companies.currentCompany = currentCompany? currentCompany : this.companies[0];

                            // Change the address summary back to a text area
                            // Change the contact and company summary inputs to non editable
                            adminView.makeEditable(companyElements, false, []);
                            adminView.makeAddressEditable(false, '', this.state.companies.currentCompany.addresses[0]);
                            adminView.makeEditable(contactElements, false, []);

                            // Repopulate the summaries
                            adminView.populateCompanySummary(this.state.companies.currentCompany);
                            adminView.populateAddressSummary(this.state.companies.currentCompany.id, this.state.companies.currentCompany.addresses[0]);
                            adminView.populateContactSummary(this.state.companies.currentCompany.id, this.state.companies.currentCompany.people[0]);

                            adminView.changeEditIcon('save', 'company');
                            adminView.changeEditIcon('save', 'address');
                            adminView.changeEditIcon('save', 'contact');

                            this.renderCompaniesTable();
                        }).catch(err => {
                            console.log(err);
                        })
                }
            }
            if(hubspotBtn) console.log('hub');
            if(saveNewBtn) {
                console.log('savenewBtn');
                summaryWrapper.removeEventListener('focusin', adminView.focusInNewCompanyHandler);
                summaryWrapper.removeEventListener('focusout', adminView.focusOutNewCompanyHandler);

                // Get all user input
                const companyForm = adminView.getNewCompany();
                const addressForm = adminView.getNewAddress();
                const contactForm = adminView.getNewContact();

                const formData = new FormData();

                for(let [key, value] of companyForm.entries()) formData.append(`${key}`, value);
                for(let [key, value] of addressForm.entries()) formData.append(`${key}`, value);
                for(let [key, value] of contactForm.entries()) formData.append(`${key}`, value);

                for(let [key, value] of addressForm.entries()) console.log(`${key}`, value);

                if(companyForm && addressForm && contactForm) {
                    let formCompany;

                    // Make API call here to create company
                    this.Admin
                        .createCompany(formData)
                        .then(response => {
                            if(response.status !== 201) {
                                // @TODO: error handling
                                console.log('error');
                            }
                            formCompany = response.data.company;

                            return this.Admin.getCompanies(this.state.companies.searchOptions);
                        })
                        .then(response => {
                            this.state.companies.totalCompanies = response.data.total;
                            this.companies = response.data.companies;

                            // Search for the recently created company in the returned company list
                            const currentCompany = this.companies.find(company => {
                                return formCompany.id === company.id;
                            });

                            this.state.companies.currentCompany = currentCompany? currentCompany : this.companies[0];

                            // Change the address summary back to a text area
                            // Change the contact and company summary inputs to non editable
                            adminView.makeEditable(companyElements, false, []);
                            adminView.makeAddressEditable(false, '', this.state.companies.currentCompany.addresses[0]);
                            adminView.makeEditable(contactElements, false, []);

                            // Repopulate the summaries
                            adminView.populateCompanySummary(this.state.companies.currentCompany);
                            adminView.populateAddressSummary(this.state.companies.currentCompany.id, this.state.companies.currentCompany.addresses[0]);
                            adminView.populateContactSummary(this.state.companies.currentCompany.id, this.state.companies.currentCompany.people[0]);

                            // Change the summary icons
                            const iconsToIgnore = [
                                'companies-summary__btn--save-new'
                            ];
                            adminView.changeNewIcon('new', 'company', iconsToIgnore);
                            adminView.changeNewIcon('new', 'address', iconsToIgnore);
                            adminView.changeNewIcon('new', 'contact', iconsToIgnore);

                            this.renderCompaniesTable();

                        })
                        .catch(err => console.log(err));
                    // Get companies and render companies table

                    // Populate the summary forms with the created company if visible in the table, [0] if not
                } else {
                    // @TODO: handle validation problems here (make the form methods return an array with problem fields)
                }
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

    handlePaginationEvent(e) {
        const userBtn = e.target.closest('.pagination__item--users');
        const jobBtn = e.target.closest('.pagination__item--jobs');
        const companyBtn = e.target.closest('.pagination__item--companies');

        const userPrevious = e.target.closest('.pagination__previous--users');
        const userNext = e.target.closest('.pagination__next--users');

        const jobPrevious = e.target.closest('.pagination__previous--jobs');
        const jobNext = e.target.closest('.pagination__next--jobs');

        const companyPrevious = e.target.closest('.pagination__previous--companies');
        const companyNext = e.target.closest('.pagination__next--companies');

        if(userBtn || userPrevious || userNext) {
            this.handleUserPagination(userBtn, userPrevious, userNext);
        } else if(jobBtn || jobPrevious || jobNext){
            this.handleJobPagination(jobBtn, jobPrevious, jobNext);
        } else if(companyBtn || companyPrevious || companyNext) {
            this.handleCompanyPagination(companyBtn, companyPrevious, companyNext);
        }
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
    handleJobPagination(jobBtn, jobPrevious, jobNext) {
        const jobState = this.state.jobs;
        // Changing page = new current job
        jobState.currentJob = this.jobs[0];

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
        state.currentPage = state.searchOptions.index / state.searchOptions.limit;

    }
}

new AdminController();