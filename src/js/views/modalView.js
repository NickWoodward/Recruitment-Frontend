import {gsap} from 'gsap';

import { getSelectAnimations } from '../animations/adminAnimation';
import Select from './customSelect';

export const getAlert = (msg, success) => {
    return `
        <div class="alert alert--${success?'success':'error'}">
            <div class="alert__icon alert__icon--${success?'success':'error'}">
                <svg class="alert__svg alert__svg--${success?'success':'error'}"><use xlink:href="svg/spritesheet.svg#${success?'tick':'alert-circled'}"></svg>
            </div>
            <div class="alert__content alert__content--${success? 'success':'error'}">
                <div class="alert__status">${ success? 'Success':'Error' }</div>
                <div class="alert__message">${msg}</div>
            </div>
        </div>
    `;
}

//// APPLICATION MODALS ////

export const renderNewApplicationModal = (data) => {
    
    const summaryHeader = document.querySelector('.summary__header');
    const summary = document.querySelector('.summary__content');

    const headerModal = createHeaderModal(data, 'applications');
    const modal = createNewApplicationModal(data);

    summaryHeader.insertAdjacentHTML('afterbegin', headerModal);
    summary.insertAdjacentHTML('afterbegin', modal);

    populateApplicationModal(data);
};

const createNewApplicationModal = ({jobs, users, appNumber}) => {

    const today = new Date();
    const day = `${today.getDate()}`.padStart(2, '0');;
    const month = `${today.getMonth()+1}`.padStart(2, '0');
    const year = `${today.getFullYear()}`.substring(2);
    const date = `${day}/${month}/${year}`;
    const modal = `
        <div class="summary__modal summary__modal--new-application">

            <div class="new-application__close">
                <svg class="new-application__close-svg"><use xlink:href="svg/spritesheet.svg#cross"></svg>
            </div>
            <div class="new-application__form-wrapper">

                <form class="new-application">
                    <div class="new-application__field">
                        <div class="new-application__label">Job:</div>
                        <select name="job" id="job" class="new-application__input new-application__input--job">
                            <!-- options added in js -->
                        </select>
                    </div>
                    
                    <div class="new-application__field">
                        <div class="new-application__label">Applicant:</div>
                        <select name="applicant" id="applicant" class="new-application__input new-application__input--applicant">
                            <!-- options added in js -->
                        </select>
                    </div>

                    <button class="new-application__submit">Submit</button>

                </form>
            </div>
            <div class="alert-wrapper">
                
            </div>
        </div>
    `;

    return modal;
};

const populateApplicationModal = ({ jobs, users }) => {
    const jobsInput = document.querySelector('.new-application__input--job');

    const userInput = document.querySelector('.new-application__input--applicant');

    // Order the jobs by the company name
    jobs.sort((a, b) => a.companyName > b.companyName? 1:-1);

    const jobPlaceholder = new Option('Jobs');
    jobPlaceholder.setAttribute('disabled', 'disabled');
    jobPlaceholder.setAttribute('selected', 'selected');
    jobsInput.append(jobPlaceholder)

    const userPlaceholder = new Option('Applicants');
    userPlaceholder.setAttribute('disabled', 'disabled');
    userPlaceholder.setAttribute('selected', 'selected');
    userInput.append(userPlaceholder)

    jobs.forEach(job => {
        let group = jobsInput.querySelector(`optgroup[label="${job.companyName}"]`);
        if(!group) {
            group = document.createElement("optgroup");
            group.label = job.companyName;
        }
        const option = new Option(`${job.title}`, job.id);
        option.setAttribute('data-group', group.label.toLowerCase());
        group.append(option);

        jobsInput.appendChild(group);
    });

    users.forEach(applicant => {
        const option = new Option(`${applicant.applicantId}: ${applicant.firstName} ${applicant.lastName}`, applicant.applicantId);
        option.className = 'job-option';
        userInput.add(option, undefined);
    });

    [jobsInput, userInput].forEach(select => {return new Select({select, animations: getSelectAnimations()})});
}


//// END APPLICATION MODALS ////

//// JOB MODALS ////

export const renderJobModal = (data, type) => {
    const summaryHeader = document.querySelector('.summary__header');
    const summary = document.querySelector('.summary__content');

    switch(type) {
        case 'new': 
            summaryHeader.insertAdjacentHTML('afterbegin', createHeaderModal(data, 'jobs'));
            summary.insertAdjacentHTML('afterbegin', createNewJobModal());
            populateNewJobModal(data);
            break;
        case 'edit':
            summaryHeader.insertAdjacentHTML('afterbegin', createHeaderModal(data, 'jobs', true));
            summary.insertAdjacentHTML('afterbegin', createEditJobModal(data));
            populateEditJobModal(data);
            break;
    }
};

const createHeaderModal = (data, type, editMode) => {
    const today = new Date();
    const day = `${today.getDate()}`.padStart(2, '0');;
    const month = `${today.getMonth()+1}`.padStart(2, '0');
    const year = `${today.getFullYear()}`.substring(2);
    let date = `${day}/${month}/${year}`;
    // console.log({data});

    let id;
    switch(type) {
        case 'applications':
            id = data.appNumber;
            break;
        case 'jobs':
            id = editMode? data.job.id : data.jobNumber;
            date = editMode? data.job.jobDate : date; 
            break;
        case 'companies':
            id = data.companyNumber;
            date = editMode? data.companyDate : date;
            break;
    }

    const header = `
        <div class="summary__modal-header summary__modal-header--${type}">
            <div>${id}</div>
            <div>${date}</div>
        </div>
    `;
    return header;
}

const createNewJobModal = () => {

    const modal = `
        <div class="summary__modal summary__modal--new-job">
           
            <form class="form--new-job">
                <div class="form__close--new-job">
                    <svg class="form__close-svg--new-job"><use xlink:href="svg/spritesheet.svg#cross"></svg>
                </div>
                <div class="form__content--new-job">
                    <div class="form__field--new-job form__title--new-job">
                        <label for="title" class="form__label--new-job">Title</label>
                        <input type="text" placeholder="Job Title" id="title" class="form__input--new-job form__title-input--new-job">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                    <div class="form__field--new-job form__company--new-job">
                        <label for="company" class="form__label--new-job">Company</label>
                        <select name="company" id="company" class="form__input--new-job form__company-input--new-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>
                    
                    <div class="form__field--new-job form__location--new-job">
                        <label for="location" class="form__label--new-job">Location</label>
                        <input type="text" placeholder="Location" id="location" class="form__input--new-job form__location-input--new-job">
                    
                        <i class="form__icon form__icon--success">
                            <svg><svg><use xlink:href="svg/spritesheet.svg#success"></svg></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--new-job form__wage--new-job">
                        <label for="wage" class="form__label--new-job">Wage</label>
                        <input type="number" placeholder="Wage" id="wage" class="form__input--new-job form__wage-input--new-job" min="10000" max="10000000" step="any">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--new-job form__type--new-job">
                        <label for="type" class="form__label--new-job">Type</label>
                        <select name="type" id="type" class="form__input--new-job form__type-input--new-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>

                    <div class="form__field--new-job form__position--new-job">
                        <label for="position" class="form__label--new-job">Position</label>
                        <select name="position" id="position" class="form__input--new-job form__position-input--new-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>

                    <div class="form__field--new-job form__pqe--new-job">
                        <label for="pqe" class="form__label--new-job">PQE</label>
                        <select name="pqe" id="pqe" class="form__input--new-job form__pqe-input--new-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>

                    <div class="form__field--new-job form__featured--new-job">
                        <label for="featured" class="form__label--new-job">Featured</label>
                        <select name="featured" id="featured" class="form__input--new-job form__featured-input--new-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>

                    <div class="form__field--new-job form__description--new-job">
                        <label for="description" class="form__label--new-job">Description</label>
                        <textarea name="description" id="description" class="form__input--new-job form__description-input--new-job"></textarea>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>

                    <button class="form__submit--new-job">Submit</button>

                </div>

            </form>
            <div class="alert-wrapper alert-wrapper--new-job alert-wrapper--hidden">
                
            </div>
        </div>
    `;

    return modal;
};

const createEditJobModal = ({companies, job, jobNumber}) => {

    const modal = `
        <div class="summary__modal summary__modal--edit-job">
           
            <form class="form--edit-job">
                <div class="form__close--edit-job">
                    <svg class="form__close-svg--edit-job"><use xlink:href="svg/spritesheet.svg#cross"></svg>
                </div>
                <div class="form__content--edit-job">
                    <div class="form__field--edit-job form__title--edit-job">
                        <label for="title" class="form__label--edit-job">Title</label>
                        <input type="text" placeholder="${job.title}" id="title" class="form__input--edit-job form__title-input--edit-job">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                    <div class="form__field--edit-job form__company--edit-job">
                        <label for="company" class="form__label--edit-job">Company</label>
                        <select name="company" id="company" data-placeholder="${job.companyId}" class="form__input--edit-job form__company-input--edit-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>
                    
                    <div class="form__field--edit-job form__location--edit-job">
                        <label for="location" class="form__label--edit-job">Location</label>
                        <input type="text"  placeholder="${job.location}" id="location" class="form__input--edit-job form__location-input--edit-job">
                    
                        <i class="form__icon form__icon--success">
                            <svg><svg><use xlink:href="svg/spritesheet.svg#success"></svg></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--edit-job form__wage--edit-job">
                        <label for="wage" class="form__label--edit-job">Wage</label>
                        <input type="number" placeholder="${job.wage}" id="wage" class="form__input--edit-job form__wage-input--edit-job" min="10000" max="10000000" step="any">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--edit-job form__type--edit-job">
                        <label for="type" class="form__label--edit-job">Type</label>
                        <select name="type" data-placeholder="${job.jobType}" id="type" class="form__input--edit-job form__type-input--edit-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--edit-job form__position--edit-job">
                        <label for="position" class="form__label--edit-job">Position</label>
                        <select name="position" data-placeholder="${job.position}" id="position" class="form__input--edit-job form__position-input--edit-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>

                    <div class="form__field--edit-job form__pqe--edit-job">
                        <label for="pqe" class="form__label--edit-job">PQE</label>
                        <select name="pqe" data-placeholder="${job.pqe}" id="pqe" class="form__input--edit-job form__pqe-input--edit-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>

                    <div class="form__field--edit-job form__featured--edit-job">
                        <label for="featured" class="form__label--edit-job">Featured</label>
                        <select name="featured" data-placeholder="${job.featured}" id="featured" class="form__input--edit-job form__featured-input--edit-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>

                    <div class="form__field--edit-job form__description--edit-job">
                        <label for="description" class="form__label--edit-job">Description</label>
                        <textarea placeholder="${job.description}" name="description" id="description" class="form__input--edit-job form__description-input--edit-job">${job.description}
                        </textarea>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>

                    <button class="form__submit--edit-job">Submit</button>

                </div>

            </form>
            <div class="alert-wrapper alert-wrapper--edit-job alert-wrapper--hidden">
                
            </div>
        </div>
    `;

    return modal;
};

export const removeAdminModal = (type, modals) => {
    const elements = modals? modals:[];
    switch(type) {
        case 'applications':
        case 'jobs':
        case 'companies':
        case 'company-contacts':
            elements.push(document.querySelector('.summary__modal'));
            elements.push(document.querySelector('.summary__modal-header'));
            break;
    }

    const tl = gsap.timeline({defaults: { duration: .2 }});
    elements.forEach(element => tl.to(element, { autoAlpha: 0, onComplete: () => element.parentElement.removeChild(element) }, '<'))
}

const populateNewJobModal = ({companies, jobTypes, jobPositions, jobPqes}) => {
    // Populate select elements
    const companySelect = document.querySelector('.form__company-input--new-job');
    const typeSelect = document.querySelector('.form__type-input--new-job');
    const positionSelect = document.querySelector('.form__position-input--new-job');
    const pqeSelect = document.querySelector('.form__pqe-input--new-job');
    const featuredSelect = document.querySelector('.form__featured-input--new-job');
    // Order the companies by name
    companies.sort((a, b) => a.companyName > b.companyName? 1:-1);

    const selects = [
        [companySelect, 'Company'], 
        [typeSelect, 'Type'], 
        [positionSelect, 'Position'],
        [pqeSelect, 'Experience'],
        [featuredSelect, 'Featured?']
    ];

    // Add placeholders
    selects.forEach(select => {
        const selectElement = select[0];
        const placeholder= new Option(select[1]);

        placeholder.setAttribute('disabled', 'disabled');
        placeholder.setAttribute('selected', 'selected');
        placeholder.className = 'placeholder';

        selectElement.appendChild(placeholder);
    });

    companies.forEach(company => {
        const option = new Option(company.name, company.id);
        option.className = 'company-option';
        companySelect.add(option);
    });

    Object.entries(jobTypes).forEach(type => {
        const option = new Option(type[1], type[1]);
        option.className = 'type-option';
        typeSelect.add(option);
    });

    Object.entries(jobPositions).forEach(position => {
        const option = new Option(position[1], position[1]);
        option.className = 'position-option';
        positionSelect.add(option);
    });

    jobPqes.forEach(pqe => {
        const option = new Option(`${pqe}+`, pqe);
        option.className = 'pqe-option';
        pqeSelect.add(option); 
    });

    [0, 1].forEach(featured => {
        const option = new Option(`${featured? 'Yes': 'No'}`, featured);
        option.className = 'featured-option';
        featuredSelect.add(option); 
    });
    // Create Custom Selects
    selects.forEach(select => new Select({select: select[0], animations: getSelectAnimations()}));
};

const populateEditJobModal = ({companies, job, jobTypes, jobPositions, jobPqes}) => {
    // Populate select elements
    const companySelect = document.querySelector('.form__company-input--edit-job');
    const typeSelect = document.querySelector('.form__type-input--edit-job');
    const positionSelect = document.querySelector('.form__position-input--edit-job');
    const pqeSelect = document.querySelector('.form__pqe-input--edit-job');
    const featuredSelect = document.querySelector('.form__featured-input--edit-job');
    
    const selects = [companySelect, typeSelect, positionSelect, pqeSelect, featuredSelect];

    // Order the companies by name
    companies.sort((a, b) => a.companyName > b.companyName? 1:-1);

    // Create the select options and set the relevant job option in the select
    companies.forEach(company => {
        const option = new Option(company.name, company.id);
        option.className = 'company-option';
        if(company.name === job.companyName) option.setAttribute('selected', 'selected');
        companySelect.add(option);
    });

    Object.entries(jobTypes).forEach(type => {
        const option = new Option(type[1], type[1]);
        option.className = 'type-option';
        // if(type[1] === job.type) option.setAttribute('selected', 'selected');
        typeSelect.add(option);
    });

    Object.entries(jobPositions).forEach(position => {
        const option = new Option(position[1], position[1]);
        option.className = 'position-option';
        if(position[1] === job.position) option.setAttribute('selected', 'selected');
        positionSelect.add(option);
    });

    jobPqes.forEach(pqe => {
        const option = new Option(`${pqe}+`, pqe);
        option.className = 'pqe-option';
        if(pqe === job.pqe) option.setAttribute('selected', 'selected');
        pqeSelect.add(option); 
    });

    [0, 1].forEach(featured => {
        const option = new Option(`${featured? 'Yes': 'No'}`, featured);
        option.className = 'featured-option';
        if(featured === job.featured) option.setAttribute('selected', 'selected');
        featuredSelect.add(option); 
    });

    selects.forEach(select => new Select({select, animations: getSelectAnimations()}));
};

//// END JOB MODALS ////

//// COMPANY MODALS ////

export const renderCompanyModal = (data, type) => {
    const summaryHeader = document.querySelector('.summary__header');
    const summary = document.querySelector('.summary__content');
    switch(type) {
        case 'new': 
            summaryHeader.insertAdjacentHTML('afterbegin', createHeaderModal(data, 'companies'));
            summary.insertAdjacentHTML('afterbegin', createCompanyModal(data, 'new-company', false));
            break; 
        case 'edit': 
            summaryHeader.insertAdjacentHTML('afterbegin', createHeaderModal(data, 'companies', true));
            summary.insertAdjacentHTML('afterbegin', createCompanyModal(data, 'edit-company', true));
            break;
        case 'new-contact':
            summaryHeader.insertAdjacentHTML('afterbegin', createHeaderModal(data, 'new-contact'));
            // The new contact modal is just an edited new company modal
            const element = createCompanyModal(data, 'new-contact', false);
            summary.insertAdjacentHTML('afterbegin', element);
            break;
        case 'edit-contact':
            summaryHeader.insertAdjacentHTML('afterbegin', createHeaderModal(data, 'edit-contact', true));
            summary.insertAdjacentHTML('afterbegin', createCompanyModal(data, 'edit-contact', true));
            break; 
        case 'new-address':
            summaryHeader.insertAdjacentHTML('afterbegin', createHeaderModal(data, 'new-address'));
            summary.insertAdjacentHTML('afterbegin', createCompanyModal(data, 'new-address', false));
            break; 
        case 'edit-address':
            summaryHeader.insertAdjacentHTML('afterbegin', createHeaderModal(data, 'edit-address', true));
            summary.insertAdjacentHTML('afterbegin', createCompanyModal(data, 'edit-address', true));
            break;
        
    }

}

{/* <div class="company-summary__modal-header">
    <div class="company-summary__modal-item company-summary__modal-item--id">${companyNumber}</div>
    <div>${action} a${edit? 'n Existing':' New'} ${type==='new-company' || type==='edit-company'? 'Company' : type === 'new-contact' || type === 'edit-contact'? 'Contact':'Address'}</div>
    <div class="company-summary__modal-item company-summary__modal-item--date">${date}</div>
</div> */}

/**
 * Create the markup for the new/edit company modal
 * @param {Object | Object[]} data: The company data to be rendered
 * @param {string} type: The type of modal to be created, determining the fields to be disabled. Opts: 'new-company'/'new-contact'/'new-address'.
 * @param {boolean} editMode: Changes the placeholder information in each input
 * @returns {string} A markup string is returned
*/
    const createCompanyModal = ({companyNumber, companyName, contact, address, contact: {firstName, lastName, position, phone, email}, address: {firstLine, secondLine, city, county, postcode}}, type, editMode) => {

    // Potential states:
    // Form     |   editMode   |  type                      |   Disabled sections

    // company      false         type === 'new-company'        No sections disabled
    // contact      false         type === 'new-contact'        Company && Address disabled
    // address      false         type === 'new-address'        Company && Contact disabled

    // company      true          type === 'edit-company'       No sections disabled
    // contact      true          type === 'edit-contact'       Company && Address disabled
    // address      true          type === 'edit-address'       Company && Contact disabled


    const contactDisabled = type === 'new-address' || type === 'edit-address';
    const addressDisabled = type === 'new-contact' || type === 'edit-contact';
    const companyDisabled = type === 'new-address' || type === 'edit-address' || type==='new-contact' || type === 'edit-contact';

    const edit = type === 'edit-address' || type === 'edit-contact' || type === 'edit-address' || type === 'edit-company';

console.log(type, 'contactDisabled:', contactDisabled, 'addressDisabled:', addressDisabled, 'companyDisabled:', companyDisabled);

    const today = new Date();
    const date = `${today.getDate()}/${today.getMonth()+1}/${+today.getFullYear()}`;

    const action = edit? 'Edit':'Create';
    const markup  = `
    <div class="summary__modal summary__modal--${type}">
    
        <form class="form--${type}">
            <div class="form__close--${type}">
                <svg class="form__close-svg--${type}"><use xlink:href="svg/spritesheet.svg#cross"></svg>
            </div>

            <div class="form__content--${type}">
                <div class="form__column form__column--${type} form__column--${type}-company">
                        <div class="form__heading ${companyDisabled ? 'form__heading--disabled':''} form__heading--company">Company</div>

                        <div class="form__field--${type} form__company-name--${type} ${type === 'new-company' || type === 'edit-company' ?  '':'disabled'}">
                        <label for="company-name" class="form__label--${type}">Company Name</label>
                        <input type="text" placeholder=${edit || companyDisabled ? companyName : 'Company Name'} id="company-name" class="form__input--${type} form__company-name-input--${type}" ${companyDisabled ? 'disabled': ''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                </div>

                <div class="form__column form__column--${type} form__column--${type}-address">
                    <div class="form__heading ${addressDisabled ? 'form__heading--disabled' : ''} form__heading--addresses">Address</div>

                    <div class="form__field--${type} form__first-line--${type} ${addressDisabled ? 'disabled':''}">
                        <label for="first-line" class="form__label--${type}">First Line</label>
                        <input type="text" placeholder="${edit || addressDisabled ? firstLine : 'First Line'}" id="first-line" class="form__input--${type} form__first-line-input--${type}" ${addressDisabled? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--${type} form__second-line--${type} ${addressDisabled ? 'disabled':''}">
                        <label for="second-line" class="form__label--${type}">Second Line</label>
                        <input type="text" placeholder="${edit || addressDisabled ? secondLine : 'Second Line'}" id="second-line" class="form__input--${type} form__second-line-input--${type}" ${addressDisabled? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--${type} form__city--${type} ${addressDisabled ? 'disabled':''}">
                        <label for="city" class="form__label--${type}">City</label>
                        <input type="text" placeholder="${edit || addressDisabled ? city : 'City'}" id="city" class="form__input--${type} form__city-input--${type}" ${addressDisabled ? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--${type} form__county--${type} ${addressDisabled ? 'disabled':''}">
                        <label for="county" class="form__label--${type}">County</label>
                        <input type="text" placeholder="${edit || addressDisabled ? county :'County'}" id="county" class="form__input--${type} form__county-input--${type}" ${addressDisabled ? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--${type} form__postcode--${type} ${addressDisabled ? 'disabled':''}">
                        <label for="postcode" class="form__label--${type}">Postcode</label>
                        <input type="text" placeholder="${edit || addressDisabled ? postcode:'Postcode'}" id="postcode" class="form__input--${type} form__postcode-input--${type}" ${addressDisabled ? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                </div>

                <div class="form__column form__column--${type} form__column--${type}-contact">
                    <div class="form__heading ${contactDisabled ? 'form__heading--disabled' : ''} form__heading--contacts">Contact</div>

                    <div class="form__field--${type} form__contact-first-name--${type} ${contactDisabled? 'disabled':''}">
                        <label for="contact-first-name" class="form__label--${type}">First Name</label>
                        <input type="text" placeholder="${edit || contactDisabled ? firstName : 'First Name'}" id="contact-first-name" class="form__input--${type} form__contact-first-name-input--${type}" ${contactDisabled ? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                    <div class="form__field--${type} form__contact-surname--${type} ${contactDisabled ? 'disabled':''}">
                        <label for="contact-surname" class="form__label--${type}">Surname</label>
                        <input type="text" placeholder="${edit || contactDisabled ? lastName : 'Surname'}" id="contact-surname" class="form__input--${type} form__contact-surname-input--${type}" ${contactDisabled ? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                    <div class="form__field--${type} form__position--${type} ${contactDisabled ? 'disabled':''}">
                        <label for="position" class="form__label--${type}">Position</label>
                        <input type="text" placeholder="${edit || contactDisabled ? position : 'Surname'}" class="form__input--${type} form__position-input--${type}" ${contactDisabled ? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                    <div class="form__field--${type} form__phone--${type} ${contactDisabled? 'disabled':''}">
                        <label for="phone" class="form__label--${type}">Phone</label>
                        <input type="text" placeholder="${edit || contactDisabled ? phone : 'Phone'}" id="phone" class="form__input--${type} form__phone-input--${type}" ${contactDisabled? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                    <div class="form__field--${type} form__email--${type} ${contactDisabled? 'disabled':''}">
                        <label for="email" class="form__label--${type}">Email</label>
                        <input type="text" placeholder="${edit || contactDisabled ? email : 'Email'}" id="email" class="form__input--${type} form__email-input--${type}" ${contactDisabled ? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                </div>
                
                <button class="form__submit--${type}">Submit</button>
                <div class="alert-wrapper alert-wrapper--${type} alert-wrapper--hidden"></div>
            </div>
        </form>
    </div>
    `;
    return markup;
}

//// END COMPANY MODALS ////
