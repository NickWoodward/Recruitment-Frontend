/* ASSETS */
import '../sass/common.scss';
import '../sass/admin.scss';
import '../assets/icons/edit-solid.svg';
import '../assets/icons/delete-solid.svg';
import '../assets/icons/hubspot.svg';
import '../assets/icons/tick.svg';
import '../assets/icons/upload.svg';
import '../assets/icons/pdf.svg';
import '../assets/icons/pdf.svg';
import '../assets/icons/doc.svg';

import * as headerView from './views/headerView';
import * as adminView from './views/adminView';
import * as tableView from './views/tableView';
import * as userForm from './views/userForm';
import * as jobForm from './views/jobForm';
import * as jobView from './views/jobView';
import * as utils from './utils/utils';

import { initSocket } from './socket';
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
                totalUsers: 0
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
            headerView.renderHeader("admin")
        
            // Get Job data and render table
            this.JobList.getJobs(this.state.jobs.searchOptions)
                .then(res => {
                    if(res.data.jobs) {
                        this.jobs = res.data.jobs.map(({featured, id, title, wage, location, description, createdAt}) => ({featured, id, title, wage, location, description, createdAt}));
                        this.state.jobs.totalJobs = res.data.totalJobs;
                        this.renderJobsTable();   
                        // adminView.addTableListeners('jobs');

                    }
                })
                .catch(err => console.log(err));
        });

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

            if(jobs) {
                // Jobs data initially loaded on DOMLoaded
                this.renderJobsTable();
                // adminView.addTableListeners('jobs');
            }
            if(users) {
                // Get User data
                this.UserModel.getUsers()
                    .then(res => {
                        // Store and render data
                        this.users = res.data.applicants;
                        console.log(this.users)
                        if(this.users.length > 0) {
                            // this.headers = Object.keys(this.users[0]);


                            this.renderUsersTable();
                            // adminView.addTableListeners('users');
                        } else {
                            this.UserModel.getUserHeaders().then(result => {
                                // this.headers = result.data.headers;
                                this.renderUsersTable();

                            });

                        }
                    })
                    .catch(err => console.log(err));
                
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
            const btn = e.target.closest('.pagination__item');
            const previous = e.target.closest('.pagination__previous');
            const next = e.target.closest('.pagination__next');

            if(btn) {
                this.state.jobs.searchOptions.index = btn.dataset.id * this.state.jobs.searchOptions.limit;
                this.JobList.getJobs(this.state.jobs.searchOptions)
                    .then(res => {
                        if(res.data.jobs) {
                            this.jobs = res.data.jobs.map(({featured, id, title, wage, location, description, createdAt}) => ({featured, id, title, wage, location, description, createdAt}));
                            this.state.jobs.totalJobs = res.data.totalJobs;
                            // Remove the table
                            utils.clearElement(elements.adminContent);
                            
                            this.renderJobsTable();   
                            // adminView.addTableListeners('jobs');

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
        return this.UserModel.getUsers()
            .then(res => {
                return res;
            })
            .catch(err => console.log(err));
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
        // Table controls
        const tableControls = `
            <div class="btn-wrapper btn-wrapper--admin">
                <button class="create-job-btn btn">Create Job</button>
            </div>`;
        // Row buttons
        const editBtn = [
            'edit', 
            `<div class="edit-btn edit-btn--table">
                <svg class="edit-icon">
                    <use xlink:href="svg/spritesheet.svg#edit-solid">
                </svg>
            </div>`
        ];
        const deleteBtn = [
            'delete', 
            `<div class="delete-btn delete-btn--table">
                <svg class="delete-icon">
                    <use xlink:href="svg/spritesheet.svg#delete-solid">
                </svg>
            </div>`
        ];

        // Already on the jobs page, return
        if(document.querySelector('.admin__content--jobs')) return;

        // Remove existing content
        utils.clearElement(elements.adminContent);

        // Replace existing classname
        elements.adminContent.className = "admin__content admin__content--jobs";

        // Create table contents
        const {headers, rows} = adminView.formatJobs(this.jobs);

        adminView.renderContent([ 
                tableView.createTableTest('jobs', headers, rows, false),
            ],  elements.adminContent
        );

        // If the table doesn't exist
        // if(!document.querySelector(elementStrings.adminJobsTable)) {
        //     // Clear the table wrapper
        //     utils.clearElement(elements.adminContent);
        //     // Add HTML for the Featured column
        //     const formattedJobs = this.jobs.map(job => {
        //         if(job.featured) return { ...job, featured: '<svg class="featured-icon featured-icon--tick"><use xlink:href="svg/spritesheet.svg#tick"></svg>' }
        //         else return { ...job, featured: '<svg class="featured-icon featured-icon--cross"><use xlink:href="svg/spritesheet.svg#cross"></svg>' }
        //     });
        //     // Render the table
        //     adminView.renderContent(
        //         [
        //             tableView.createTable(
        //                 'jobs',
        //                 Object.keys(this.jobs[0]),  
        //                 formattedJobs,
        //                 false,
        //                 [editBtn, deleteBtn]
        //             ),
        //             tableControls
        //         ],
        //         elements.adminContent
        //     );
        //     adminView.renderPagination(this.searchOptions.index, this.searchOptions.limit, this.state.jobs.totalJobs, document.querySelector('.btn-wrapper--admin'));
        // }
    }

    renderUsersTable() {
        // Table controls
        const tableControls = `
            <div class="btn-wrapper btn-wrapper--admin">
                <button class="create-user-btn btn">Create User</button>
            </div>`;
        // Row buttons
        const editBtn = [
            'edit', 
            `<div class="edit-btn edit-btn--table">
                <svg class="edit-icon">
                    <use xlink:href="svg/spritesheet.svg#edit-solid">
                </svg>
            </div>`
        ]
        const deleteBtn = [
            'delete', 
            `<div class="delete-btn delete-btn--table">
                <svg class="delete-icon">
                    <use xlink:href="svg/spritesheet.svg#delete-solid">
                </svg>
            </div>`
        ]
        const hubspotBtn = [
            'upload',
            `<div class="hubspot-add-btn hubspot-btn--table">
                <svg class="hubspot-icon">
                    <use xlink:href="svg/spritesheet.svg#hubspot">
                </svg>
            </div>`
        ]


        // Already on the users page, return
        if(document.querySelector('.admin__content--users')) return;

        // Remove existing content
        utils.clearElement(elements.adminContent);

        // Replace existing classname
        elements.adminContent.className = "admin__content admin__content--users";
        
        // Create applicant table
        const {headers, rows} = adminView.formatUsers(this.users);
        console.log(this.users)
        adminView.renderContent(
            [
                adminView.createUserSummary(), 
                tableView.createTableTest('users', headers, rows, false)
            ], 
            elements.adminContent
        );

        // Initialise user summary
        adminView.populateUserSummary(this.users[0]);

        // Add listeners to rows in the user tables 
        const userRows = document.querySelectorAll('.row--users');
        userRows.forEach(row => {
            row.addEventListener('click', (e) => {
                const targetRow = e.target.closest('.row');
                const rowId = targetRow.querySelector('.td-data--first-name').dataset.id;
                const user = this.users[rowId -1];

                utils.changeActiveRow(targetRow, userRows);
                adminView.populateUserSummary(user);
                
            });
        });

        // Listen for user-summary btn events
        document.querySelector('.user-summary').addEventListener('click', (e) => {
            const editBtn = e.target.closest('.user-summary__btn--edit');
            const deleteBtn = e.target.closest('.user-summary__btn--delete');
            const hubspotBtn = e.target.closest('.user-summary__btn--hubspot');
            const cvBtn = e.target.closest('.user-summary__btn--cv');
            const uploadBtn = e.target.closest('.user-summary__btn--upload');

            if(editBtn) console.log('edit');
            if(deleteBtn) console.log('delete');
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

        // if(!document.querySelector(elementStrings.adminUsersTable)) {
        //      // Clear the table wrapper
        //      utils.clearElement(elements.adminContent);
        //     // Render the table
        //     // adminView.renderContent(
        //     //     [
        //     //         tableView.createTable(
        //     //             'users',
        //     //             this.headers,  
        //     //             this.users,
        //     //             false,
        //     //             [editBtn, deleteBtn, hubspotBtn]
        //     //         ),
        //     //         tableControls
        //     //     ],
        //     //     elements.adminContent
        //     // );

        //     const {headers, rows} = adminView.formatUsers(this.users);
        //     adminView.renderContent(
        //         [userView.createUserSummary({name: 'Nick'}), tableView.createTableTest('users', headers, rows, false)], 
        //         elements.adminContent
        //     );
        // }
    }
}

new AdminController();