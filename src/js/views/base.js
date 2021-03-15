export const elements = {

    /* Page Layout */
    body: document.querySelector('body'),

    /* Header */

    /* Index.html */
    parallaxWrapper: document.querySelector('.parallax-wrapper'),



    /* Jobs.html */
    jobsMain: document.querySelector('.jobs__main'),
    jobsGrid: document.querySelector('.jobs__grid'),
    jobsMenu: document.querySelector('.jobs-menu'),

    jobsSort: document.querySelector('.sort'),
    jobsTitleSearch: document.querySelector('.search-input--title'),
    jobsMenuContents: document.querySelectorAll('.jobs-menu__content'),
    jobsMenuJobTitles: document.querySelector('.jobs-menu__content--titles'),
    jobsMenuSalaries: document.querySelector('.jobs-menu__content--salaries'),
    jobsMenuLocations: document.querySelector('.jobs-menu__content--locations'),
    jobsMenuTypes: document.querySelector('.jobs-menu__content--types'),
};

export const elementStrings = {
    loader: 'loader',
    header: '.header',

    // Header
    loginLink: '.nav__a--login',


    // Jobs.html
    // (NB: checkboxAll strings used in classList search so no '.')
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

};