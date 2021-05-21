export const elements = {

    /* Page Layout */
    body: document.querySelector('body'),

    /* Header */

    /* Index.html */
    parallaxWrapper: document.querySelector('.parallax-wrapper'),
    featuredJobsList: document.querySelector('.featured-jobs__jobs-list'),
    signupBtns: document.querySelectorAll('.signup-btn'),
    browseBtn: document.querySelector('.browse-btn'),
    contactBtn: document.querySelector('.contact-btn'),
    footerContent: document.querySelector('.footer__content'),
    searchInputs: document.querySelectorAll('.search__input'),


    /* Jobs.html */
    jobsMain: document.querySelector('.jobs__main'),
    jobsGrid: document.querySelector('.jobs__grid'),
    jobsMenu: document.querySelector('.jobs-menu'),
    jobsContent: document.querySelector('.jobs__content'),

    jobsSort: document.querySelector('.sort'),
    jobsTitleSearch: document.querySelector('.search-input--title'),
    jobsMenuContents: document.querySelectorAll('.jobs-menu__content'),
    jobsMenuJobTitles: document.querySelector('.jobs-menu__content--titles'),
    jobsMenuSalaries: document.querySelector('.jobs-menu__content--salaries'),
    jobsMenuLocations: document.querySelector('.jobs-menu__content--locations'),
    jobsMenuTypes: document.querySelector('.jobs-menu__content--types'),

    /* Admin.html */
    adminMain: document.querySelector('.admin__main'),
    adminContent: document.querySelector('.admin__content'),

    adminSidebar: document.querySelector('.sidebar__menu'),
    adminMenuItem: document.querySelector('.sidebar__item'),

    adminMenuJobsItem: document.querySelector('.sidebar__item--jobs'),
    adminMenuJobsLink: document.querySelector('.sidebar__link--jobs'),
    adminMenuJobsIcon: document.querySelector('.sidebar__icon--jobs'),

    adminMenuUsersItem: document.querySelector('.sidebar__item--users'),
    adminMenuUsersLink: document.querySelector('.sidebar__link--users'),
    adminMenuUsersIcon: document.querySelector('.sidebar__icon--users'),

    adminMenuApplicationsItem: document.querySelector('.sidebar__item--applications'),
    adminMenuApplicationsLink: document.querySelector('.sidebar__link--applications'),
    adminMenuApplicationsIcon: document.querySelector('.sidebar__icon--applications'),

    adminMenuCompaniesItem: document.querySelector('.sidebar__item--companies'),

    adminMenuSettingsItem: document.querySelector('.sidebar__item--settings'),


    // adminMenuJobItem: document.querySelector('.sidebar__item--jobs'),
    // adminMenuJobLink: document.querySelector('.sidebar__link--jobs'),
    // adminMenuJobIcon: document.querySelector('.sidebar__icon--jobs'),

    adminTableWrapper: document.querySelector('.admin__table-wrapper'),
    deleteUser: document.querySelector('.delete-user-btn'),
    createJob: document.querySelector('.create-job-btn'),

};

export const elementStrings = {
    loader: 'loader',
    header: '.header',

    // Header
    loginLink: '.nav__a--login',

    // Home
    viewJobBtn: '.job-card__view-btn',
    applyBtn: '.job-card__apply-btn',


    // Jobs.html
    // (NB: checkboxAll strings used in classList search so no '.')
    jobCard: '.job-card',

    jobsMenuCheckbox: '.jobs-menu__checkbox',

    titlesCheckbox: '.jobs-menu__titles-checkbox',
    titlesCheckboxAll: 'jobs-menu__titles-checkbox--all',

    titlesMenu: '.jobs-menu__item--titles',
    titlesContent: '.jobs-menu__content--titles',

    salariesCheckbox: '.jobs-menu__salaries-checkbox',
    salariesCheckboxAll: 'jobs-menu__salaries-checkbox--all',

    salariesMenu: '.jobs-menu__item--salaries',
    salariesContent: '.jobs-menu__content--salaries',

    locationsMenu: '.jobs-menu__item--locations',
    locationsContent: '.jobs-menu__content--locations',

    locationsCheckbox: '.jobs-menu__locations-checkbox',
    locationsCheckboxAll: 'jobs-menu__locations-checkbox--all',

    vacanciesMenu: '.jobs-menu__item--vacancies',
    vacanciesContent: '.jobs-menu__content--vacancies',


    /* ADMIN */
    adminMenuItem: '.sidebar__item',

    adminJobsTable: '.table--jobs',
    adminUsersTable: '.table--users',
    adminApplicationsTable: '.table--applications',

    pagination: '.pagination',


    
    /* TABLES */
    editJobsBtn: '.edit-btn--table',
    deleteJobsBtn: '.delete-btn--table',
    hubspotBtn: '.hubspot-btn--table',

    editUsersBtn: '.edit-btn--table',
    deleteUsersBtn: '.delete-btn--table',
};