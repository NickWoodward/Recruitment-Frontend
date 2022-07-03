import * as utils from '../utils/utils';

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
            <div class="summary__item summary__item--header">
                <div class="summary__id">${applicationId}</div>
            </div>
            <div class="summary__item summary__item--header summary__item--header-date">
                <div class="summary__date">${applicationDate}</div>
            </div>
        </div>
    `;

    const positionContent = `
        <div class="summary__content summary__content--application-job">
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
        <div class="summary__content summary__content--application-applicant">
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

export const switchApplicationSummary = (application) => {
    removeOldApplicationSummary();
    insertNewApplicationSummary(application);
}

const removeOldApplicationSummary = () => {
    // Select old content
    const oldHeaderContent = document.querySelector('.summary__header-content');
    const oldApplicantContent = document.querySelector('.summary__content--application-applicant');
    const oldPositionContent = document.querySelector('.summary__content--application-job');
    const oldControlsContent = document.querySelector('.summary__controls-content--applications');
    const items = [oldHeaderContent, oldApplicantContent, oldPositionContent, oldControlsContent];
    
    // Remove old content
    items.forEach(item => item.parentElement.removeChild(item));
}

export const insertNewApplicationSummary = (application) => {
    // Create new content
    const { headerContent, applicantContent, positionContent, controlContent } = createApplicationSummaryContent(application);
    
    // Add new content
    document.querySelector('.summary__header').insertAdjacentHTML('afterbegin', headerContent);
    document.querySelector('.summary__section--application-person').insertAdjacentHTML('beforeend', applicantContent);
    document.querySelector('.summary__section--application-job').insertAdjacentHTML('beforeend', positionContent);
    document.querySelector('.summary__controls').insertAdjacentHTML('beforeend', controlContent);
}

//// END APPLICATION SUMMARY VIEW ////

//// JOB SUMMARY VIEW ////

export const createJobSummaryContent = ({companyId, companyName, title, featured, id, jobDate, jobType, description, location, position, pqe, wage}) => {
    
    const headerContent = `
        <div class="summary__header-content">
            <div class="summary__item summary__item--header summary__item--header-title">
                <div class="summary__id">${title}</div>
            </div>
            <div class="summary__item summary__item--header summary__item--header-date">
                <div class="summary__date">${jobDate}</div>
            </div>
        </div>
    `;
    // Section wrappers and headers are created/inserted in the initAdmin function

    const detailsContent = `
        <div class="summary__content summary__content--details">

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
        <div class="summary__content summary__content--description scrollable">

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

export const switchJobSummary = (job) => {
    removeOldJobSummary();
    insertNewJobSummary(job);
}

const removeOldJobSummary = () => {
    // Select old content
    const oldHeaderContent = document.querySelector('.summary__header-content');
    const oldDetailsContent = document.querySelector('.summary__content--details');
    const oldDescriptionContent = document.querySelector('.summary__content--description');
    const oldControlsContent = document.querySelector('.summary__controls-content--jobs');
    const items = [oldHeaderContent, oldDetailsContent, oldDescriptionContent, oldControlsContent];
    console.log(items);
    // Remove old content
    items.forEach(item => item.parentElement.removeChild(item));
}

export const insertNewJobSummary = (job) => {
    // Create new content
    const { headerContent, detailsContent, descriptionContent, controlContent } = createJobSummaryContent(job);
    
    // Add new content
    document.querySelector('.summary__header').insertAdjacentHTML('afterbegin', headerContent);
    document.querySelector('.summary__section--details').insertAdjacentHTML('beforeend', detailsContent);
    document.querySelector('.summary__section--description').insertAdjacentHTML('beforeend', descriptionContent);
    document.querySelector('.summary__controls').insertAdjacentHTML('beforeend', controlContent);
}

//// END JOB SUMMARY VIEW ////
