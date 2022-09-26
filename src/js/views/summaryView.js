import * as utils from '../utils/utils';
import { gsap } from 'gsap';

//// APPLICATION SUMMARY VIEW ////

export const createApplicationSummaryContent = ({
    id: applicationId,
    applicationDate,
    applicant: {
        id: applicantId,
        person: {
            id: personId,
            firstName: personFirstName,
            lastName: personLastName,
            email: personEmail,
            phone: personPhone,
        },
        cvUrl: cvUrl
    },
    job: {
        id: jobId,
        title: jobTitle,
        company: {
            id: companyId, 
            name: companyName,
            contacts: [{
                person: { 
                    firstName: contactFirstName,  
                    lastName: contactLastName,
                    phone: contactPhone,
                    email: contactEmail
                },
                position: contactPosition,
            }]
        }
    }
}) => {
    let cvType;
    if(cvUrl) {
        cvType = cvUrl.indexOf('.doc') !== -1 ? 'doc':'pdf';
    } 

    const headerContent = `
        <div class="summary__header-content">
            <div class="summary__item summary__item--header summary__item--header-title">
                <div class="summary__id">${applicationId}</div>
            </div>
            <form class="summary__item summary__item--header summary__item--header-search">
                <input class="summary__search-input no-focusborder">
                <div class="summary__search" tabindex="-1"><svg><use xlink:href="svg/spritesheet.svg#search"></svg></div>
            </form>
        </div>
    `;

    const positionContent = `
        <div class="summary__section-content summary__section-content--application-job">
            <div class="summary__column summary__column--applications-page">
                <div class="summary__item summary__item--applications-page">
                    <div class="summary__label summary__label">Title:</div>
                    <div class="summary__field summary__field--title" data-id="${jobId}">
                        <a class="summary__link summary__link--job">${jobTitle}</a>
                    </div>
                </div>
                <div class="summary__item summary__item--applications-page">
                    <div class="summary__label">Company:</div>
                    <div class="summary__field summary__field--company" data-id="${companyId}">
                        <a class="summary__link summary__link--company">${companyName}</a>
                    </div>
                </div>
                <div class="summary__item--applications-page summary__item">
                    <div class="summary__label">Contact:</div>
                    <div class="summary__field summary__field--contact">${contactFirstName} ${contactLastName}</div>
                </div>
            </div>

            <div class="summary__column summary__column--applications-page">
                <div class="summary__item summary__item--applications-page">
                    <div class="summary__label">Contact Position:</div>
                    <div class="summary__field summary__field--contact-position">${contactPosition}</div>
                </div>
                <div class="summary__item summary__item--applications-page">
                    <div class="summary__label">Contact Phone:</div>
                    <div class="summary__field summary__field--contact-phone">${contactPhone}</div>
                </div>
                <div class="summary__item summary__item--applications-page">
                    <div class="summary__label">Contact Email:</div>
                    <div class="summary__field summary__field--contact-email">
                        <a class="summary__field-text--contact-email">${contactEmail}</a>
                        <svg class="summary__copy-svg copy-svg--application"><use xlink:href="svg/spritesheet.svg#applications"></svg>    
                    </div>
                </div>
            </div>
        </div>
    `;

    const applicantContent  = `
        <div class="summary__section-content summary__section-content--application-applicant">
            <div class="summary__column summary__column--applications-page">
                <div class="summary__item summary__item--applications-page">
                    <div class="summary__label">Applicant Name:</div>
                    <a class="summary__link summary__link--applicant">
                        <div class="summary__field summary__field--applicant" data-id="${applicantId}">${personFirstName} ${personLastName}</div>
                    </a>
                </div>
                <div class="summary__item summary__item--applications-page">
                    <div class="summary__label">Phone:</div>
                    <div class="summary__field summary__field--phone">${personPhone}</div>
                </div>
            </div>

            <div class="summary__column summary__column--applications-page">
                <div class="summary__item summary__item--applications-page">
                    <div class="summary__label">Email:</div>
                    <div class="summary__field summary__field--email">${personEmail}</div>
                </div>

                <div class="summary__item summary__item--applications-page summary__item--cv">
                    <div class="summary__label summary__label--cv">Applicant CV:</div>
                    <div class="summary__field summary__field--cv">${cvType? 'Yes':'No'}</div>
                </div>
            </div>

        </div>
    `;            

    const controlContent = `
        <div class="summary__controls-content summary__controls-content--applications">
            <div class="summary__btn summary__btn--applications summary__new-application-btn--applications">
                <svg class="summary__new-application-icon summary__icon">
                    <use xlink:href="svg/spritesheet.svg#add">
                </svg>
            </div>

            <div class="summary__btn summary__btn--applications summary__cv-btn--applications" data-id='${personId}'>
                ${cvType?`<svg class="summary__cv-svg--applications"><use xlink:href="svg/spritesheet.svg#${cvType}"></svg>`:'None'}
            </div>

            <div class="summary__btn summary__btn--applications summary__delete-application-btn--applications">
                <svg class="summary__delete-application-icon summary__icon">
                    <use xlink:href="svg/spritesheet.svg#delete-np1">
                </svg>
            </div>
        </div>
    `;
    
    return {headerContent, applicantContent, positionContent, controlContent};
};

export const switchApplicationSummary = (application, searchTerm) => {
    removeOldApplicationSummary();
    insertNewApplicationSummary(application, searchTerm);
}

const removeOldApplicationSummary = () => {
    // Select old content
    const oldHeaderContent = document.querySelector('.summary__header-content');
    const oldApplicantContent = document.querySelector('.summary__section-content--application-applicant');
    const oldPositionContent = document.querySelector('.summary__section-content--application-job');
    const oldControlsContent = document.querySelector('.summary__controls-content--applications');
    const items = [oldHeaderContent, oldApplicantContent, oldPositionContent, oldControlsContent];
    
    // Remove old content
    items.forEach(item => item.parentElement.removeChild(item));
}

export const insertNewApplicationSummary = (application, searchTerm) => {
    // Create new content
    const { headerContent, applicantContent, positionContent, controlContent } = createApplicationSummaryContent(application);
    
    // Add new content
    document.querySelector('.summary__header').insertAdjacentHTML('afterbegin', headerContent);
    document.querySelector('.summary__section--application-person').insertAdjacentHTML('beforeend', applicantContent);
    document.querySelector('.summary__section--application-job').insertAdjacentHTML('beforeend', positionContent);
    document.querySelector('.summary__controls').insertAdjacentHTML('beforeend', controlContent);

    // Insert New tag if needed
    if(searchTerm) addSearchTag(searchTerm);

    initSearchBar();
}

//// END APPLICATION SUMMARY VIEW ////

//// JOB SUMMARY VIEW ////

export const createJobSummaryContent = ({companyId, companyName, title, featured, id, jobDate, jobType, description, location, position, pqe, wage}) => {
    
    const headerContent = `
        <div class="summary__header-content" data-id=${id}>
            <div class="summary__item summary__item--header summary__item--header-title">
                <div class="summary__title">${title}</div>
            </div>
            <form class="summary__item summary__item--header summary__item--header-search">
                <input class="summary__search-input no-focusborder">
                <div class="summary__search" tabindex="-1"><svg><use xlink:href="svg/spritesheet.svg#search"></svg></div>
            </form>
        </div>
    `;
    // Section wrappers and headers are created/inserted in the initAdmin function

    const detailsContent = `
        <div class="summary__section-content summary__section-content--details">

            <div class="summary__column summary__column--jobs-page">

                <div class="summary__item summary__item--jobs-page">
                    <div class="summary__label summary__label">Title:</div>
                    <div class="summary__field summary__field--title" data-id="${id}" title="${title}">
                        ${title}
                    </div>
                </div>

                <div class="summary__item summary__item--jobs-page">
                    <div class="summary__label summary__label">Wage:</div>
                    <div class="summary__field summary__field--wage">
                        ${utils.formatSalary(wage)}
                    </div>
                </div>

                <div class="summary__item summary__item--jobs-page">
                    <div class="summary__label summary__label">PQE:</div>
                    <div class="summary__field summary__field--pqe">
                        ${pqe}
                    </div>
                </div>

            </div>

            <div class="summary__column summary__column--jobs-page">
                <div class="summary__item summary__item--jobs-page">
                    <div class="summary__label summary__label">Company:</div>
                    <div class="summary__field summary__field--company" data-id="${companyId}" title="${companyName}">
                        <a class="summary__link summary__link--company">${companyName}</a>
                    </div>
                </div>

                <div class="summary__item summary__item--jobs-page">
                    <div class="summary__label summary__label">Type:</div>
                    <div class="summary__field summary__field--type">
                        ${jobType}
                    </div>
                </div>

                <div class="summary__item summary__item--jobs-page">
                    <div class="summary__label summary__label">Featured:</div>
                    <div class="summary__field summary__field--featured">
                        ${featured? 'Yes':'No'}
                    </div>
                </div>

            </div>

            <div class="summary__column summary__column--jobs-page">
                <div class="summary__item summary__item--jobs-page">
                    <div class="summary__label summary__label">Location:</div>
                    <div class="summary__field summary__field--location" title="${location}">
                        ${location}
                    </div>
                </div>

                <div class="summary__item summary__item--jobs-page">
                    <div class="summary__label summary__label">Position:</div>
                    <div class="summary__field summary__field--position">
                        ${position}
                    </div>
                </div>

            </div>
        </div>
    `;

    const descriptionContent = `
        <div class="summary__section-content summary__section-content--description scrollable">

            <div class="summary__column summary__column--description summary__column--jobs-page">
                <div class="summary__item summary__item--description summary__item--jobs-page">
                    <div class="summary__field summary__field--description">
                        ${description}
                    </div>
                </div>
            </div>
        </div>
    `;

    const controlContent = `
        <div class="summary__controls-content summary__controls-content--jobs">
            <div class="summary__btn summary__btn--jobs summary__new-job-btn--jobs">
                <svg class="summary__new-job-icon summary__icon">
                    <use xlink:href="svg/spritesheet.svg#add">
                </svg>
            </div>

            <div class="summary__btn summary__btn--jobs summary__edit-job-btn--jobs">
                <svg class="summary__edit-job-icon summary__icon">
                    <use xlink:href="svg/spritesheet.svg#edit-np1">
                </svg>
            </div>

            <div class="summary__btn summary__btn--jobs summary__hubspot-btn--jobs">
                <svg class="summary__hubspot-icon summary__icon">
                    <use xlink:href="svg/spritesheet.svg#hubspot">
                </svg>
            </div>

            <div class="summary__btn summary__btn--jobs summary__delete-job-btn--jobs">
                <svg class="summary__delete-job-icon summary__icon">
                    <use xlink:href="svg/spritesheet.svg#delete-np1">
                </svg>
            </div>
        </div>
    `;

    return {headerContent, detailsContent, descriptionContent, controlContent};
}

export const switchJobSummary = (job, searchTerm) => {
    removeOldJobSummary();
    insertNewJobSummary(job, searchTerm);
}

const removeOldJobSummary = () => {
    // Select old content
    const oldHeaderContent = document.querySelector('.summary__header-content');
    const oldDetailsContent = document.querySelector('.summary__section-content--details');
    const oldDescriptionContent = document.querySelector('.summary__section-content--description');
    const oldControlsContent = document.querySelector('.summary__controls-content--jobs');
    const items = [oldHeaderContent, oldDetailsContent, oldDescriptionContent, oldControlsContent];

    // Remove old content
    items.forEach(item => item.parentElement.removeChild(item));
}

export const insertNewJobSummary = (job, searchTerm) => {
    // Create new content
    const { headerContent, detailsContent, descriptionContent, controlContent } = createJobSummaryContent(job);
    
    // Add new content
    document.querySelector('.summary__header').insertAdjacentHTML('afterbegin', headerContent);
    document.querySelector('.summary__section--details').insertAdjacentHTML('beforeend', detailsContent);
    document.querySelector('.summary__section--description').insertAdjacentHTML('beforeend', descriptionContent);
    document.querySelector('.summary__controls').insertAdjacentHTML('beforeend', controlContent);

    // Insert New tag if needed
    if(searchTerm) addSearchTag(searchTerm);

    initSearchBar();
}

//// END JOB SUMMARY VIEW ////

//// COMPANY SUMMARY VIEW ////

export const insertNewCompanySummary = (company, searchTerm) => {
    // Create new content
    const { headerContent, contactsContent, addressesContent, contactsControls, addressesControls } = createCompanySummaryContent(company);
    
    // Add new content
    document.querySelector('.summary__header').insertAdjacentHTML('afterbegin', headerContent);
    document.querySelector('.summary__section--contacts').insertAdjacentHTML('beforeend', contactsContent);
    document.querySelector('.summary__section--addresses').insertAdjacentHTML('beforeend', addressesContent);
    document.querySelector('.summary__contact-controls--companies-page').insertAdjacentHTML('beforeend', contactsControls);
    document.querySelector('.summary__address-controls--companies-page').insertAdjacentHTML('beforeend', addressesControls);

    // Insert New tag if needed
    if(searchTerm) addSearchTag(searchTerm);

    initSearchBar();
}

export const switchCompanySummary = (company, searchTerm) => {
    removeOldCompanySummary();
    insertNewCompanySummary(company, searchTerm);
}
const removeOldCompanySummary = () => {
    // Select old content
    const oldHeaderContent = document.querySelector('.summary__header-content');
    const oldContactsContent = document.querySelector('.summary__section-content--contacts');
    const oldAddressesContent = document.querySelector('.summary__section-content--addresses');

    const oldContactControls = document.querySelector('.summary__controls-content--contacts');
    const oldAddressControls = document.querySelector('.summary__controls-content--addresses');

    // The company-jobs element is handled as a table

    const items = [
        oldHeaderContent, 
        oldContactsContent, 
        oldAddressesContent, 
        oldContactControls, 
        oldAddressControls,
    ];

    // Remove old content
    items.forEach(item => item.parentElement.removeChild(item));
}

export const addSearchTag = (searchTerm) => {
    const searchContainer = document.querySelector('.summary__item--header-search');

    const markup = `
      <div class="summary__tag">
        <div class="summary__tag-content">${searchTerm}</div>
        <div class="summary__tag-close"><svg><use xlink:href="svg/spritesheet.svg#cross"></svg></div>  
      </div>`;
    searchContainer.insertAdjacentHTML('afterbegin', markup);
}

export const createCompanySummaryContent = ({id, companyName, companyDate, contacts, addresses, jobs}) => {
    const headerContent = `
        <div class="summary__header-content" data-id=${id}>
            <div class="summary__item summary__item--header summary__item--header-title">
                <div class="summary__title">${companyName}</div>
            </div>

            <form class="summary__item summary__item--header summary__item--header-search">
                <input class="summary__search-input no-focusborder">
                <div class="summary__search" tabindex="-1"><svg><use xlink:href="svg/spritesheet.svg#search"></svg></div>
            </form>


        </div>
    `;

    // Section wrappers and headers are created/inserted in the initAdmin function
    const contactsContent = createCompanyContact(contacts[0]);

    const addressesContent = createCompanyAddress(addresses[0]);

    const contactsControls = `
        <div class="summary__controls-content summary__controls-content--contacts">
            <div class="summary__btn summary__btn--contacts summary__new-contact-btn--companies">
                <svg class="summary__new-contact-icon summary__icon">
                    <use xlink:href="svg/spritesheet.svg#add">
                </svg>
            </div>
            <div class="summary__btn summary__btn--contacts summary__edit-contact-btn--companies">
                <svg class="summary__icon summary__edit-contact-icon--companies">
                    <use xlink:href="svg/spritesheet.svg#edit-np1">
                </svg>
            </div>
            <div class="summary__btn summary__btn--contacts summary__delete-contact-btn--companies">
                <svg class="summary__icon summary__delete-contact-icon--companies">
                    <use xlink:href="svg/spritesheet.svg#delete-np1">
                </svg>
            </div>
        </div>
    `;

    const addressesControls = `
        <div class="summary__controls-content summary__controls-content--addresses">
            <div class="summary__btn summary__btn--addresses summary__new-address-btn--companies">
                <svg class="summary__icon summary__new-address-icon--companies">
                    <use xlink:href="svg/spritesheet.svg#add">
                </svg>
            </div>
            <div class="summary__btn summary__btn--addresses summary__edit-address-btn--companies">
                <svg class="summary__icon summary__edit-address-icon--companies">
                    <use xlink:href="svg/spritesheet.svg#edit-np1">
                </svg>
            </div>
            <div class="summary__btn summary__btn--addresses summary__delete-address-btn--companies">
                <svg class="summary__icon summary__delete-address-icon--companies">
                    <use xlink:href="svg/spritesheet.svg#delete-np1">
                </svg>
            </div>
        </div>
    `;


    return { headerContent, contactsContent, addressesContent, contactsControls, addressesControls };
};

export const switchContact = (contact) => {
    const oldContact = document.querySelector('.summary__section-content--contacts');
    oldContact.parentElement.removeChild(oldContact);
    document.querySelector('.summary__section--contacts').insertAdjacentHTML('beforeend', createCompanyContact(contact));
};
export const switchAddress = (address) => {
    const oldAddress = document.querySelector('.summary__section-content--addresses');
    oldAddress.parentElement.removeChild(oldAddress);
    document.querySelector('.summary__section--addresses').insertAdjacentHTML('beforeend', createCompanyAddress(address));
};

const createCompanyContact = ({contactId, firstName, lastName, position, email, phone}) => {
    return `
        <div class="summary__section-content summary__section-content--contacts" data-id="${contactId}" >
            <div class="summary__column summary__column--companies-page">

                <div class="summary__item summary__item--companies-page">
                    <div class="summary__label summary__label">Name:</div>
                    <div class="summary__field summary__field--name" data-id="${contactId}" title="${firstName} ${lastName}">
                        <a class="summary__link summary__link--name">${firstName} ${lastName}</a>
                    </div>
                </div>

                <div class="summary__item summary__item--companies-page">
                    <div class="summary__label summary__label">Position:</div>
                    <div class="summary__field summary__field--position">
                        ${position}
                    </div>
                </div>
            </div>

            <div class="summary__column summary__column--companies-page">

                <div class="summary__item summary__item--companies-page">
                    <div class="summary__label summary__label">Email:</div>
                    <div class="summary__field summary__field--email" title="${email}">
                        <a class="summary__link summary__link--email">${email}</a>
                    </div>
                </div>

                <div class="summary__item summary__item--companies-page">
                    <div class="summary__label summary__label">Phone:</div>
                    <div class="summary__field summary__field--phone">${phone}</div>
                </div>

            </div> 
        </div>
    `; 
}

const createCompanyAddress = ({id, firstLine, secondLine, city, county, postcode}) => {
    return `
        <div class="summary__section-content summary__section-content--addresses" data-id="${id}">
            <div class="summary__column summary__column--companies-page">

                <div class="summary__item summary__item--companies-page">
                    <div class="summary__label summary__label">First Line:</div>
                    <div class="summary__field summary__field--first-line">${firstLine}</div>
                </div>

                ${secondLine? `
                    <div class="summary__item summary__item--companies-page">
                        <div class="summary__label summary__label">SecondLine:</div>
                        <div class="summary__field summary__field--second-line">
                            ${secondLine}
                        </div>
                    </div>
                `:''}    

                <div class="summary__item summary__item--companies-page">
                    <div class="summary__label summary__label">City:</div>
                    <div class="summary__field summary__field--city">${city}</div>
                </div>

            </div>

            <div class="summary__column summary__column--companies-page">

                <div class="summary__item summary__item--companies-page">
                    <div class="summary__label summary__label">County:</div>
                    <div class="summary__field summary__field--county">${county}</div>
                </div>

                <div class="summary__item summary__item--companies-page">
                    <div class="summary__label summary__label">Postcode:</div>
                    <div class="summary__field summary__field--postcode">${postcode}</div>
                </div>

            </div> 
        </div>
    `;
}

//// END COMPANY SUMMARY VIEW ////

//// USER SUMMARY VIEW ////
export const switchUserSummary = (user, searchTerm) => {
    removeOldUserSummary();
    insertNewUserSummary(user, searchTerm);
}

const removeOldUserSummary = () => {
    // Select old content
    const oldHeaderContent = document.querySelector('.summary__header-content');
    const oldDetailsContent = document.querySelector('.summary__section-content--details');
    const oldDescriptionContent = document.querySelector('.summary__section-content--description');
    const oldControlsContent = document.querySelector('.summary__controls-content--users');
    const items = [oldHeaderContent, oldDetailsContent, oldDescriptionContent, oldControlsContent];

    // Remove old content
    items.forEach(item => item.parentElement.removeChild(item));
}

export const insertNewUserSummary = (user, searchTerm) => {
    // Create new content
    const { headerContent, contactContent, contactControls, addressContent, addressControls } = createUserSummaryContent(user);
    
    // Add new content
    document.querySelector('.summary__header').insertAdjacentHTML('afterbegin', headerContent);
    document.querySelector('.summary__section--user-details').insertAdjacentHTML('beforeend', contactContent);
    document.querySelector('.summary__contact-controls--users-page').insertAdjacentHTML('beforeend', contactControls);

    document.querySelector('.summary__section--user-addresses').insertAdjacentHTML('beforeend', addressContent);
    document.querySelector('.summary__address-controls--users-page').insertAdjacentHTML('beforeend', addressControls);

    // document.querySelector('.summary__controls').insertAdjacentHTML('beforeend', controlContent);

    // Insert New tag if needed
    if(searchTerm) addSearchTag(searchTerm);

    initSearchBar();
}

const createUserSummaryContent = (user) => {
    const headerContent = `
        <div class="summary__header-content" data-id=${user.id}>
            <div class="summary__item summary__item--header summary__item--header-title">
                <div class="summary__title">${user.firstName}\u00A0\u00A0${user.lastName}</div>
            </div>

            <form class="summary__item summary__item--header summary__item--header-search">
                <input class="summary__search-input no-focusborder">
                <div class="summary__search" tabindex="-1"><svg><use xlink:href="svg/spritesheet.svg#search"></svg></div>
            </form>
        </div>
    `;
    const contactContent = createUserContact(user);
    const contactControls = createUserControls('contact', 'users');
    const addressContent = createUserAddress(user.addresses[0]);
    const addressControls = createUserControls('address', 'users');

    return { headerContent, contactContent, contactControls, addressContent, addressControls };

}

const createUserContact = ({id, firstName, lastName, email, phone, cvUrl}) => {
    let cvType;
    if(cvUrl) {
        cvType = cvUrl.indexOf('.doc') !== -1 ? 'doc':'pdf';
    } 
    return `
        <div class="summary__section-content summary__section-content--contacts" data-id="${id}" >

            <div class="summary__item summary__item--user-details summary__item--users-page">
                <div class="summary__label summary__label">Name:</div>
                <div class="summary__field summary__field--name" data-id="${id}" title="${firstName} ${lastName}">
                    <a class="summary__link summary__link--name">${firstName} ${lastName}</a>
                </div>
            </div>

            <div class="summary__item summary__item--user-details summary__item--users-page">
                <div class="summary__label summary__label">Email:</div>
                <div class="summary__field summary__field--email" title="${email}">
                    <a class="summary__link summary__link--email">${email}</a>
                </div>
            </div>

            <div class="summary__item summary__item--user-details summary__item--users-page">
                <div class="summary__label summary__label">Phone:</div>
                <div class="summary__field summary__field--phone">${phone}</div>
            </div>

            <div class="summary__item summary__item--user-details summary__item--cv summary__item--users-page">
                <div class="summary__label summary__label">CV:</div>
                <div class="summary__field summary__field--CV">
                    ${cvUrl? 'Yes': 'No'}
                </div>
            </div>
        </div>
    `; 
}

export const createUserControls = (type, page) => {
    const newBtn = `            
        <div class="summary__btn summary__btn--${type} summary__new-${type}-btn--${page}">
            <svg class="summary__new-${type}-icon summary__icon">
                <use xlink:href="svg/spritesheet.svg#add">
            </svg>
        </div>
    `;
    const editBtn = `
        <div class="summary__btn summary__btn--${type} summary__edit-${type}-btn--${page}">
            <svg class="summary__icon summary__edit-${type}-icon--${page}">
                <use xlink:href="svg/spritesheet.svg#edit-np1">
            </svg>
        </div>
    `;
    const deleteBtn = `
        <div class="summary__btn summary__btn--${type} summary__delete-${type}-btn--${page}">
            <svg class="summary__icon summary__delete-${type}-icon--${page}">
                <use xlink:href="svg/spritesheet.svg#delete-np1">
            </svg>
        </div>
    `;

    return `
        <div class="summary__controls-content summary__controls-content--${type}">
            ${newBtn}
            ${editBtn}
            ${deleteBtn}
        </div>
    `;
}


const createUserAddress = ({id = 'na', firstLine = 'None', secondLine, city = 'None', county = 'None', postcode = 'None'}) => {
    return `
        <div class="summary__section-content summary__section-content--addresses" data-id="${id}">

            <div class="summary__item summary__item--user-addresses summary__item--users-page">
                <div class="summary__label summary__label">First Line:</div>
                <div class="summary__field summary__field--first-line">${firstLine}</div>
            </div>

            
            <div class="summary__item summary__item--user-addresses summary__item--users-page">
                <div class="summary__label summary__label">SecondLine:</div>
                <div class="summary__field summary__field--second-line">
                    ${secondLine? secondLine : 'n/a'}
                </div>
            </div>
                

            <div class="summary__item summary__item--user-addresses summary__item--users-page">
                <div class="summary__label summary__label">City:</div>
                <div class="summary__field summary__field--city">${city}</div>
            </div>


            <div class="summary__item summary__item--user-addresses summary__item--users-page">
                <div class="summary__label summary__label">County:</div>
                <div class="summary__field summary__field--county">${county}</div>
            </div>

            <div class="summary__item summary__item--user-addresses summary__item--users-page">
                <div class="summary__label summary__label">Postcode:</div>
                <div class="summary__field summary__field--postcode">${postcode}</div>
            </div>

        </div>
    `;
}



//// END USER SUMMARY VIEW ////


const initSearchBar = () => {
    // Add animation to the search bar
    const searchBtn = document.querySelector('.summary__search');
    const searchInput = searchBtn.previousElementSibling;

    const tl = gsap.timeline({ paused: true });
    gsap.set(searchInput, { scaleX: 0 })
    tl.to(searchInput, {
        scaleX: 1, 
        transformOrigin: "right center", 
        duration: .3, 
        onComplete: ()=> searchInput.focus()
    });

    searchInput.animation = tl;
}