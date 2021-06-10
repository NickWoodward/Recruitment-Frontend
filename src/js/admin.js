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
                searchOptions: {
                    index: 0,
                    limit: 6,
                    titles: [],
                    locations: [],
                    orderField: "title",
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
                }
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

            this.Admin.getJobs()
                .then(res => {
                    adminView.initialiseJobPage();

                    this.jobs = res.data.jobs;
                    this.state.jobs.totalJobs = res.data.total;

                    // Calculate # of rows to render
                    this.state.jobs.searchOptions.limit = adminView.calculateRows('jobs');

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
                console.log(this.companies);
            }).catch(err => console.log(err));
        
            // Get Job data and render table
        //     this.JobList.getJobs(this.state.jobs.searchOptions)
        //         .then(res => {
        //             if(res.data.jobs) {
        //                 console.log(res.data.jobs);
        //                 adminView.initialiseJobPage();

        //                 this.jobs = res.data.jobs.map(({featured, id, title, wage, location, description, createdAt}) => ({featured, id, title, wage, location, description, createdAt}));
        //                 this.state.jobs.totalJobs = res.data.totalJobs;

        //                 // Calculate # of rows to render
        //                 this.state.jobs.searchOptions.limit = adminView.calculateRows('jobs');
        //                 console.log('ew'+this.state.users.searchOptions.limit);

        //                 this.renderJobsTable(); 
        //                 if(this.jobs.length > 0)
        //                     adminView.populateJobSummary(this.jobs[0]); 
        //                 else 
        //                     // @TODO Placeholder for no jobs
                        
        //                 if(this.jobs.length > 0) {
        //                     adminView.populateJobSummary(this.jobs[0]);
        //                     // adminView.addTableListeners('jobs');
        //                 } else {
        //                     // @TODO: Render placeholder
                            
        //                 }
                        

        //             }
        //         })
        //         .catch(err => console.log(err));
        });

        // Handle editable elements when a user clicks elsewhere
        document.body.addEventListener('mousedown', (e) => {
            if(this.editUserLostFocus(e)) {
                console.log('edit user lost focus');
                adminView.makeEditable(document.querySelectorAll('.user-summary__item'), false);
                adminView.changeEditIcon('edit', 'user');
                adminView.addCvElement(this.state.users.currentUser);
            }
            if(this.editJobLostFocus(e)) {
                console.log('edit jobs lost focus');
                adminView.makeEditable(document.querySelectorAll('.job-summary__item'), false);
                adminView.changeEditIcon('edit', 'job');
                
                adminView.toggleDropdown(
                    false, 
                    document.querySelector('.job-summary__select'), 
                    `<div class="job-summary__item job-summary__company" contenteditable=false>
                        ${this.state.jobs.currentJob.companyName}
                    </div>`
                )
                adminView.addFeaturedCheckbox(false, this.state.jobs.currentJob.featured);
            }
            if(this.createJobLostFocus(e)) {
                console.log('create jobs lost focus');
                
                // Remove the dropdown + replace with company div
                adminView.toggleDropdown(
                    false, 
                    document.querySelector('.job-summary__select'), 
                    `<div class="job-summary__item job-summary__company" contenteditable=false>
                        ${this.state.jobs.currentJob.companyName}
                    </div>`
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
                this.getUsers()
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
                this.Companies
                    .getCompanies()
                    .then(res => {
                        this.companies = res.data.companies;
                        if(this.companies.length > 0) adminView.renderCompanies(this.companies)
                    })
            }
        });


        // PAGINATION CONTROLS
        document.body.addEventListener('click', (e) => {
            const userBtn = e.target.closest('.pagination__item--users');
            const userPrevious = e.target.closest('.pagination__previous--users');
            const userNext = e.target.closest('.pagination__next--users');

            if(userBtn || userPrevious || userNext) {
                const userState = this.state.users;
                const pages = Math.ceil(userState.totalUsers / userState.searchOptions.limit);
                if(userPrevious && !(userState.currentPage < 1)) {
                    userState.currentPage--;
                    userState.searchOptions.index -= userState.searchOptions.limit;
                }
                if(userNext && !(userState.currentPage >= pages-1) ) {
                    userState.currentPage++;
                    userState.searchOptions.index += userState.searchOptions.limit;
                }
                if(userBtn) {
                    userState.searchOptions.index = userBtn.dataset.id * userState.searchOptions.limit;
                    userState.currentPage = userState.searchOptions.index / userState.searchOptions.limit;
                }
                this.getUsers()
                    .then((res) => {
                        if(res.data.applicants) {
                            // Store and render data
                            this.users = res.data.applicants;
                            this.state.users.totalUsers = res.data.total;

                            // @TODO: Is this needed?
                            // Clear user table
                            // utils.clearElement(document.querySelector('.user-table__wrapper'));

                            this.renderUsersTable();

                            // Initialise user summary
                            adminView.populateUserSummary(this.users[0]);
                        }

                        
                    })
                    .catch(err => console.log(err));
            }
        });
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
                    console.log(res.data.jobs);
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
        utils.changeActiveRow(jobRows[0], jobRows);

        // Add table row listeners
        jobRows.forEach(row => {
            row.addEventListener('click', e => {
                const rowId = row.querySelector('.td-data--company').dataset.id;
                const job = this.jobs.filter(job => {
                    return parseInt(rowId) === job.id;
                })[0];

                adminView.populateJobSummary(job);
                utils.changeActiveRow(row, jobRows);
            });
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
        utils.changeActiveRow(userRows[0], userRows);

        userRows.forEach(row => {
            row.addEventListener('click', (e) => {
                const targetRow = e.target.closest('.row');
                const rowId = targetRow.querySelector('.td-data--first-name').dataset.id;
                const user = this.users.filter(user => {
                    return parseInt(rowId) === user.applicantId;
                });

                utils.changeActiveRow(targetRow, userRows);
                adminView.populateUserSummary(user[0]);
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

                if(jobElements[0].getAttribute('contenteditable') === 'false') {
                    adminView.changeEditIcon('save', 'job');
                    adminView.makeEditable(jobElements, true, ['job-summary__featured', 'job-summary__company']);
                    
                    // Add a company name dropdown in place of the div
                    const classNames = ['job-summary__item', 'job-summary__select', 'job-summary__item--editable', 'job-summary__company'];
                    // const dropdown = adminView.createSelectElement(this.companies, 'Company Name', classNames, 'company-dropdown');
                    const { dropdown, list } = adminView.createDataList(this.companies, 'Company Name', classNames, 'company-dropdown');
                    adminView.toggleDropdown(true, dropdown, companyItem);

                    adminView.addFeaturedCheckbox(true, this.state.jobs.currentJob.featured);
                }
            }
            if(saveBtn) {
                const formData = adminView.getJobEdits(this.state.jobs.currentJob);
                for(let [key, value] of formData.entries()) { console.log(key, value);}

                if(formData) {
                    console.log('save data');
                    this.Admin
                        .editJob(this.state.jobs.currentJob.id, formData)
                        .then(response => {
                            // Update current current job
                            for(let [key, value] of formData.entries()) {
                                this.state.jobs.currentJob[key] = value;
                            }
                            this.renderJobsTable();
                        })
                        .catch(err => console.log(err));
                } else {
                    console.log('dont save');
                }
                adminView.changeEditIcon('edit', 'job');
                adminView.makeEditable(jobElements, false, ['job-summary__featured']);
                adminView.toggleDropdown(
                    false, 
                    document.querySelector('.job-summary__select'), 
                    `<div class="job-summary__item job-summary__company" contenteditable=false>
                        ${this.state.jobs.currentJob.companyName}
                    </div>`
                );
                adminView.addFeaturedCheckbox(false, this.state.jobs.currentJob.featured);
            }
            if(newBtn) {
                // Save current user
                const jobId = jobSummary.dataset.id;
                this.state.jobs.currentJob = this.jobs.find(job => job.id === parseInt(jobId));
                

                // Make the items editable
                adminView.makeEditable(jobElements, true, ['job-summary__featured']);

                // Switch the company element to a dropdown
                const classNames = ['job-summary__item', 'job-summary__select', 'job-summary__item--editable', 'job-summary__company'];
                const dropdown = adminView.createSelectElement(this.companies, 'Company Name', classNames);
                adminView.toggleDropdown(true, dropdown, companyItem);

                // Change the new icon
                adminView.changeNewIcon('save', 'job');

                // Clear the current summary
                adminView.clearJobSummary(this.companies.map(company => { return { name: company.name, id: company.id } }));
            }
            if(saveNewBtn){
                console.log('saveBtn');
                // Get values from fields
                const formData = adminView.getNewJob();
                
                if(formData) {
                    console.log('submit new job');
                    // Submit new job
                    for(let [key, value] of formData.entries()){
                        console.log(key,value)
                    }

                    this.Admin.createJob(formData)
                        .then(res => {
                            console.log(res.data);
                        })
                        .catch(err => console.log(err));

                } else {
                    console.log('dont save new job');
                }

                // Changing the icons / making elements uneditable handled in a listener on the body
            }
        });
    }

    addUserSummaryListeners() {
        const userSummary = document.querySelector('.user-summary');

        userSummary.addEventListener('click', (e) => {
            // Ignore synthetic clicks from the offscreen input element
            if(e.target === document.querySelector('.user-summary__input')) return;

            const editBtn = e.target.closest('.user-summary__btn--edit');
            const deleteBtn = e.target.closest('.user-summary__btn--delete');
            const saveBtn = e.target.closest('.user-summary__btn--save');
            const hubspotBtn = e.target.closest('.user-summary__btn--hubspot');
            const cvBtn = e.target.closest('.user-summary__btn--cv');
            const uploadBtn = e.target.closest('.user-summary__label');

            const userElements = userSummary.querySelectorAll('.user-summary__item');

            if(editBtn) {
                const userId = document.querySelector('.user-summary').dataset.id;
                // Save current user values
                this.state.users.currentUser = this.users.find(user => user.applicantId === parseInt(userId));
                // Set the elements to editable
                // Removing contenteditable is done in a listener on the body
                if(userElements[0].getAttribute('contenteditable') === 'false') {
                    // Make the content divs editable
                    adminView.makeEditable(userElements, true);
                    // Change the cv element to a file picker
                    adminView.addUploadElement(this.state.users.currentUser.cvName);

                    // Change the edit icon to a save icon
                    adminView.changeEditIcon('save', 'user');
                }
            } 
            if(saveBtn) {
                // Get edited values
                const formData = adminView.getUserEdits(this.state.users.currentUser);
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
                adminView.changeEditIcon('edit', 'user');
            }
        
            if(deleteBtn) {
                console.log('delete');
                const userId = document.querySelector('.user-summary').dataset.id;
                this.state.users.currentUser = this.users.find(user => user.applicantId === parseInt(userId));
                
                this.Admin
                    .deleteApplicant(userId)
                    .then(response => {
                        console.log(response);
                        // Remove the current user from the local array
                        this.users = this.users.filter(user => {
                            return user !== this.state.users.currentUser;
                        }) 
                        return this.getUsers();                      
                    }).then((res) => {
                        // Store and render data
                        this.users = res.data.applicants;
                        this.state.users.totalUsers = res.data.total;
                        this.renderUsersTable();
                    })
                    .catch(err => console.log(err));
            }
            if(hubspotBtn) console.log('hubspot');
            if(cvBtn) {
                this.Admin.getCv(cvBtn.dataset.id)
                    .then(res => {
                        const contentDisposition = res.headers['content-disposition'];
                        let fileName = contentDisposition.split(';')[1].split('=')[1].toString();
                        adminView.forceDownload(res, fileName);
                     })
                     .catch(err => console.log(err));
             }
            if(uploadBtn) console.log('upload');
        });
    }



    editUserLostFocus(e) {
        const userSummary = document.querySelector('.user-summary');
        const editableContent = document.querySelector('.user-summary__item--editable');
        const editBtnTarget = e.target.closest('.user-summary__btn--edit');
        const itemTarget = e.target.closest('.user-summary__item');
        const saveTarget = e.target.closest('.user-summary__btn--save');
        const uploadCv = e.target.closest('.user-summary__label');

        // If user summary is present, editable, and the edit btn, editable elements, or save btn have not been clicked
        if(userSummary && editableContent && !editBtnTarget && !itemTarget && !saveTarget && !uploadCv) {
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
        // The prescence of 'newBtn' distinguishes this from 'editJobLostFocus' & vice versa
        const newBtn = document.querySelector('.job-summary__btn--new');

        if(jobSummary && editableContent && !editBtnTarget && !itemTarget && !saveTarget & !newBtn) {
            return true;
        }
    }
    editJobLostFocus(e) {
        const jobSummary = document.querySelector('.job-summary');
        const editableContent = document.querySelector('.job-summary__item--editable');
        const editBtnTarget = e.target.closest('.job-summary__btn--edit');
        const itemTarget = e.target.closest('.job-summary__item');
        const saveTarget = e.target.closest('.job-summary__btn--save');
        const editBtn = document.querySelector('.job-summary__btn--edit');

        if(jobSummary && editableContent && !editBtnTarget && !itemTarget && !saveTarget & !editBtn) {
            return true;
        }
        
        return false;
    }
}

new AdminController();