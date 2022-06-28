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
            <div class="summary__item summary__item--header">
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