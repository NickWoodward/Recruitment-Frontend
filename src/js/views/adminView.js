import { elements, elementStrings } from './base';
import * as utils from '../utils/utils';
import * as userForm from './userForm';
import * as jobForm from './jobForm';
import { renderJobDetails } from './jobView';
import * as tableView from './tableView';


export const renderContent = (content, container) => {
    content.forEach(item => {
        container.insertAdjacentHTML('beforeend', item);

    });
};

export const forceDownload = (res, filename, ext) => {
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}`);
    document.body.appendChild(link);
    link.click();
};

// { company, jobsId, applicantId, position, personId, firstName, lastName, cvUrl }
// return div elements with the following datasets and add additional row controls:
// controls: delete/create
// firstName/lastName : personId
// position : jobsId
// 
export const formatApplications = (applications) => {
    // Headers should match the returned divs in createApplicationElement
    const headers = ['', 'NAME','SURNAME','POSITION','COMPANY','CV']
    const rows = applications.map(application => {
        
        return createApplicationElement(formatProperties(application, ['cvUrl']));
    });
    return { headers, rows };
}; 
const createApplicationElement = ({applicationId, company, companyId, firstName, lastName, personId, applicantId, position, jobId, cvUrl = ''}) => {
    let cvType;
    if(cvUrl) cvType = cvUrl.indexOf('doc') !== -1? 'doc':'pdf';

    const row = [
        `<div class="td-data--applicationId" data-application=${applicationId}>${applicationId}</div>`,
        `<div class="td-data--firstName" data-id=${personId}>${firstName}</div>`,
        `<div class="td-data--lastName" data-id=${personId}>${lastName}</div>`,
        `<div class="td-data--position" data-id=${jobId}>${position}</div>`,
        `<div class="td-data--company data-id=${companyId}">${company}</div>`,
        `<div class="cv-btn--table" data-cvUrl=${applicantId}><svg class="cv-icon">
            ${cvUrl? 
                (cvType === 'doc'? 
                    '<use xlink:href="svg/spritesheet.svg#doc">':
                    '<use xlink:href="svg/spritesheet.svg#pdf">'
                ): '<use xlink:href="svg/spritesheet.svg#upload">'}
        </svg></div>`,
        `<div class="td-data--delete"></div>`
    ];
    return row;
};
const formatProperties = (object, skip) => {
    for(const key in object) {
        const value = object[key];
        if(!skip.includes(key)) object[key] = utils.capitalise(value);
    }
    return object;
};


//////////  USER PAGE  //////////

export const formatUsers = (users) => {
    // Headers should match the returned divs in createUserElement
    const headers = ['ID', 'NAME', 'SURNAME', 'JOINED'];
    const rows = users.map(user => {
        return createUserElement(formatProperties(user, ['applicantId', 'createdAt', 'jobs']));
    });
    return { headers, rows };
};
const createUserElement = ({ applicantId, firstName, lastName, userDate }) => {
    const row = [
        `<div class="td-data--applicantId">${applicantId}</div>`,
        `<div class="td-data--first-name" data-id=${applicantId}>${firstName}</div>`,
        `<div class="td-data--last-name" data-id=${applicantId}>${lastName}</div>`,
        `<div class="td-data--date" data-id=${applicantId}>${userDate}</div>`
    ];
    return row;
}
const createUserSummary = () => {
    const markup = `
        <div class="user-summary summary">
            <div class="user-summary__details">
                <div class="user-summary__item user-summary__first-name" data-placeholder="First Name" contenteditable=false></div>
                <div class="user-summary__item user-summary__last-name" data-placeholder="Last Name" contenteditable=false></div>
                <div class="user-summary__item user-summary__phone" data-placeholder="Phone" contenteditable=false></div>
                <div class="user-summary__item user-summary__email" data-placeholder="Email" contenteditable=false></div>
            </div>
            <div class="user-summary__controls">
                <div class="user-summary__btn user-summary__btn--new">
                    <svg class="user-summary__new-icon user-summary__icon">
                        <use xlink:href="svg/spritesheet.svg#add">
                    </svg>
                </div>
                <div class="user-summary__btn user-summary__btn--hubspot">
                    <svg class="user-summary__hubspot-icon">
                        <use xlink:href="svg/spritesheet.svg#hubspot">
                    </svg>
                </div>
                <div class="user-summary__btn user-summary__btn--edit">
                    <svg class="user-summary__edit-icon">
                        <use xlink:href="svg/spritesheet.svg#edit-np1">
                    </svg>
                </div>
                <div class="user-summary__btn user-summary__btn--delete">
                    <svg class="user-summary__delete-icon">
                        <use xlink:href="svg/spritesheet.svg#delete-np1">
                    </svg>
                </div>
            </div>
        </div>
    `;
    return markup;
};
export const populateUserSummary = (user) => {
    const userSummary = document.querySelector('.user-summary');
    userSummary.setAttribute('data-id', user.applicantId);
    document.querySelector('.user-summary__first-name').innerText = user.firstName;
    document.querySelector('.user-summary__last-name').innerText = user.lastName;
    document.querySelector('.user-summary__phone').innerText = user.phone;
    document.querySelector('.user-summary__email').innerText = user.email;
    
    addCvElement(user);
}


export const makeJobSummaryEditable = (editable) => {
    const jobTitle = document.querySelector('.job-summary__title');
    const location = document.querySelector('.job-summary__location');
    const wage = document.querySelector('.job-summary__wage');
    // const type = document.querySelector('.job-summary__type');
    // const position = document.querySelector('.job-summary__position');
    // const PQE = document.querySelector('.job-summary__PQE');
    const description = document.querySelector('.job-summary__description');

    const featuredWrapper = document.querySelector('.job-summary__featured-wrapper');
    const featuredIcon = document.querySelector('.job-summary__featured-icon');

    const fields = [jobTitle, location, wage, description];

    fields.forEach(field => {
        makeFieldEditable(field, editable);
    });

    if(editable) {
        const checkbox = `<input type="checkbox" class="job-summary__featured-checkbox" />`;
        featuredWrapper.insertAdjacentHTML('afterbegin', checkbox);
        utils.removeElement(featuredIcon);
    } else {
        utils.removeElement(document.querySelector('.job-summary__featured-checkbox'));
    }
};

export const addCompanyDropdown = (companies, companyId) => {
    const companyItem = document.querySelector('.job-summary__company');

    const classNames = ['job-summary__field','job-summary__select', 'job-summary__select--editable', 'job-summary__company'];
    const dropdown = createSelectElement(companies, 'Company Name', classNames, companyId);
    utils.swapElement(companyItem, dropdown);
}
export const removeCompanyDropdown = (companyName) => {
    const companyElement = `
        <div class="job-summary__field job-summary__company" contenteditable=false>
            ${companyName}
        </div>`;
    
    utils.swapElement(document.querySelector('.job-summary__select'), companyElement);
};

export const addJobDropdowns = (job) => {
    const jobTypes = [ {id:1, name:'Permanent'}, {id: 2, name:'Interim'} ];
    const positions = [ {id:1, name:'In House'}, {id:1, name:'Private Practice'} ];
    let PQE = [];

    for(let x = 0; x < 10; x++) {
        const obj = {};
        obj.id = x + 1;
        obj.name = `${x+1}+`;
        PQE.push(obj);
    }

    const typesClassNames = ['job-summary__field','job-summary__select', 'job-summary__select--editable', 'job-summary__type'];
    const positionsClassNames = ['job-summary__field','job-summary__select', 'job-summary__select--editable', 'job-summary__position'];
    const PQEClassNames = ['job-summary__field','job-summary__select', 'job-summary__select--editable', 'job-summary__PQE'];

    const typesDropdown = createSelectElement(jobTypes, 'Job Type', typesClassNames);
    const positionsDropdown = createSelectElement(positions, 'Position', positionsClassNames);
    const PQEDropdown = createSelectElement(PQE, 'PQE', PQEClassNames);

    const typeElement = document.querySelector('.job-summary__type');
    const positionElement = document.querySelector('.job-summary__position');
    const PQEElement = document.querySelector('.job-summary__PQE');

    utils.swapElement(typeElement, typesDropdown);
    utils.swapElement(positionElement, positionsDropdown);
    utils.swapElement(PQEElement, PQEDropdown);

    // If there's a job it's being edited, not created, so use current values as placeholders
    if(job) {
        const [typesIndex] = jobTypes.filter(type => job.jobType === type.name).map(item => item.id);
        const [positionsIndex] = positions.filter(position => job.position === position.name).map(item => item.id);
        const [PQEIndex] = PQE.filter(pqe => job.pqe === pqe.id).map(item => item.id);
        console.log(PQEIndex);

        typesDropdown.selectedIndex = typesIndex;
        positionsDropdown.selectedIndex = positionsIndex;
        PQEDropdown.selectedIndex = PQEIndex;
    }
};

export const removeJobDropdowns = ({type, position, pqe}) => {
    console.log(pqe);
    const typeElement = document.querySelector('.job-summary__type');
    const positionElement = document.querySelector('.job-summary__position');
    const PQEElement = document.querySelector('.job-summary__PQE');

    const newType= `<div class="job-summary__type job-summary__field">${type}</div>`;
    const newPosition = `<div class="job-summary__position job-summary__field">${position}</div>`;
    const newPQE = `<div class="job-summary__PQE job-summary__field">${pqe}</div>`;

    utils.swapElement(typeElement, newType);
    utils.swapElement(positionElement, newPosition);
    utils.swapElement(PQEElement, newPQE);
}

export const clearJobForm = () => {
    const fields = [
        document.querySelector('.job-summary__title'),
        document.querySelector('.job-summary__location'),
        document.querySelector('.job-summary__wage'),
 
        document.querySelector('.job-summary__featured-checkbox'),
        document.querySelector('.job-summary__description'),
    ];
    const defaultText = [
        'Job Title',
        'Location',
        'Wage',
        'NA',
        'Description'
    ];
    utils.clearForm(fields, defaultText);
}

const makeFieldEditable = (field, editable) => {
    const className = field.classList[0];

    if(!editable) {
        field.classList.remove(`${className}--editable`);
        field.setAttribute('contenteditable', false);
    } else {
        field.classList.add(`${className}--editable`);
        field.setAttribute('contenteditable', true);
    }
};

// @TODO: move from user section
export const makeEditable = (elements, makeEditable, exclude) => {

    elements.forEach((element, index) => {
        // Return if the element classList includes an item in the exclude array
        if(exclude && exclude.some(item => Array.from(element.classList).includes(item)))  return;
        
        const className = element.classList[0];

        if(!makeEditable) {
            element.classList.remove(`${className}--editable`);
            element.setAttribute('contenteditable', false);
        } else {
            element.classList.add(`${className}--editable`);
            element.setAttribute('contenteditable', true);
        }
    });
}

export const addCvElement = user => {
    const cvWrapper = document.querySelector('.user-summary__cv-wrapper');
    const cvName = user.cvName;
    const cvType = user.cvType;
    if(cvWrapper) utils.removeElement(cvWrapper);
    const cvElement = `
        <div class="user-summary__cv-wrapper">
            <div class="user-summary__cv-download">
                <div class="user-summary__btn user-summary__btn--${cvType === null ? 'upload':'cv'}" data-id=${user.applicantId}>
                    <svg class="user-summary__icon user-summary__${cvType === null ? 'upload':'cv'}-icon">
                        <use xlink:href="svg/spritesheet.svg#${cvType === '.pdf'? 'pdf':(cvType === '.doc' || cvType === '.docx'? 'doc':'upload-np')}">
                    </svg>
                </div>
                <div class="user-summary__cv-path" data-id=${user.applicantId}>${cvName}</div>
            </div>
        </div>
    `;

    document.querySelector('.user-summary__email').insertAdjacentHTML('afterend', cvElement);
}

export const addUploadElement = (cvName) => {
    const cvWrapper = document.querySelector('.user-summary__cv-wrapper');

    // Remove contents of cv wrapper
    if(cvWrapper) utils.removeElement(cvWrapper);

    const markup = `
        <div class="user-summary__cv-wrapper">
            <!-- Input inside label for custom styling -->
            <div class="user-summary__file-picker">
                <label class="user-summary__label user-summary__btn user-summary__btn--upload" for="user-summary__input">
                    <svg class="user-summary__icon user-summary__upload-icon">
                        <use xlink:href="svg/spritesheet.svg#upload-np">
                    </svg>
                    <input class="user-summary__input" id="user-summary__input" name="cv" type=file />
                </label>
                <label class="user-summary__upload-path" for="user-summary__input">${cvName !== 'No CV uploaded'? 'Update existing CV?' :'Add a CV'} <label/>
            </div>

        </div>`

    document.querySelector('.user-summary__email').insertAdjacentHTML('afterend', markup);
}

export const changeSummaryIconState = (state, summaryType) => {
    let sectionsToChange;

    switch(summaryType) {
        case 'company'  : sectionsToChange = [ 'company', 'address', 'contact' ]; break;
        case 'job'      : sectionsToChange = [ 'job' ]; break;
    }

    if(state === 'edited') {
        const saveBtn = document.querySelector(`.${summaryType}-summary__btn--save`);
        const btnsToSkip = [`${summaryType}-summary__btn--edit`];

        addEditedStateIcons(saveBtn, summaryType);
        toggleActiveBtns(true, summaryType, sectionsToChange, btnsToSkip);

    } else if(state === 'editing') {
        const editBtn = document.querySelector(`.${summaryType}-summary__btn--edit`);
        const btnsToSkip = [`${summaryType}-summary__btn--save`];

        addEditingStateIcons(editBtn, summaryType);
        toggleActiveBtns(false, summaryType, sectionsToChange, btnsToSkip);

    } else if(state === 'created') {
        const saveNewBtn = document.querySelector(`.${summaryType}-summary__btn--save-new`);
        const btnsToSkip = [`${summaryType}-summary__btn--new`];

        addCreatedStateIcons(saveNewBtn, summaryType);
        toggleActiveBtns(true, summaryType, sectionsToChange, btnsToSkip);

    } else if(state === 'creating') {
        const newBtn = document.querySelector(`.${summaryType}-summary__btn--new`);
        const btnsToSkip = [`${summaryType}-summary__btn--save-new`];

        addCreatingStateIcons(newBtn, summaryType);
        toggleActiveBtns(false, summaryType, sectionsToChange, btnsToSkip);
    }
}

const addCreatedStateIcons = (oldBtn, summaryType) => {
    const newBtn = `
        <div class="${summaryType}-summary__btn ${summaryType}-summary__btn--new">
            <svg class="${summaryType}-summary__new-icon">
                <use xlink:href="svg/spritesheet.svg#add">
            </svg>
        </div>
    `;

    utils.swapElement(oldBtn, newBtn);
};

const addCreatingStateIcons = (oldBtn, summaryType) => {
    const saveNewBtn = `
        <div class="${summaryType}-summary__btn ${summaryType}-summary__btn--save-new">
            <svg class="${summaryType}-summary__save-icon">
                <use xlink:href="svg/spritesheet.svg#save-np">
            </svg>
        </div>
    `;

    utils.swapElement(oldBtn, saveNewBtn);
};

const addEditedStateIcons = (oldBtn, summaryType) => {
    const editBtn = `
        <div class="${summaryType}-summary__btn ${summaryType}-summary__btn--edit">
            <svg class="${summaryType}-summary__edit-icon">
                <use xlink:href="svg/spritesheet.svg#edit-np1">
            </svg>
        </div>
    `;

    utils.swapElement(oldBtn, editBtn);
};

const addEditingStateIcons = (oldBtn, summaryType) => {
    const saveBtn = `
        <div class="${summaryType}-summary__btn ${summaryType}-summary__btn--save">
            <svg class="${summaryType}-summary__save-icon">
                <use xlink:href="svg/spritesheet.svg#save-np">
            </svg>
        </div>
    `;

    utils.swapElement(oldBtn, saveBtn);
};

export const changeEditIcon = (btnToDisplay, summaryType, skip) => {
    const editBtn = document.querySelector(`.${summaryType}-summary__btn--edit`);
    const saveBtn = document.querySelector(`.${summaryType}-summary__btn--save`);
    const delBtn = document.querySelector(`.${summaryType}-summary__btn--delete`);
    let markup;
    if(btnToDisplay === 'save') {
        utils.removeElement(editBtn);
        markup = `
            <div class="${summaryType}-summary__btn ${summaryType}-summary__btn--save">
                <svg class="${summaryType}-summary__save-icon">
                    <use xlink:href="svg/spritesheet.svg#save-np">
                </svg>
            </div>
        `;
    } else if(btnToDisplay === 'edit') {
        utils.removeElement(saveBtn);
        markup = `
            <div class="${summaryType}-summary__btn ${summaryType}-summary__btn--edit">
                <svg class="${summaryType}-summary__edit-icon">
                    <use xlink:href="svg/spritesheet.svg#edit-np1">
                </svg>
            </div>
        `;
    }

    delBtn.insertAdjacentHTML('beforebegin', markup);
    if(btnToDisplay === 'save') toggleActiveBtns(false, summaryType, skip);
    else toggleActiveBtns(true, summaryType, skip);
}

const toggleActiveBtns = (active, summaryType, sections, skip ) => {
    let btns = [];

    sections.forEach(section => {
        btns = [...document.querySelectorAll(`.${section}-summary__btn`), ...btns];
    });

    btns.forEach(btn => {
        // If none of the names in the skip list match any of those in the btn classList, or no list exists
        if(!skip || !skip.some(element => Array.from(btn.classList).includes(element))) {
            const btnIcon = btn.firstElementChild;
            if(!active) { 
                btn.classList.add(`summary__btn--disabled`); 
                btnIcon.classList.add(`summary__icon--disabled`);
            }
            else {
                btn.classList.remove(`summary__btn--disabled`);
                btnIcon.classList.remove(`summary__icon--disabled`);

            }
        }
    });
};

export const getUserEdits = (currentUser) => {
    const formData = new FormData();

    // Compare the current user to the edits made
    const { firstName, lastName, phone, email, cv } = getUserFormValues();

    let submit = false;
    firstName !== currentUser.firstName && (submit = true) ? formData.append('firstName', firstName) : formData.append('firstName', currentUser.firstName);
    lastName !== currentUser.lastName && (submit = true) ? formData.append('lastName', lastName) : formData.append('lastName', currentUser.lastName);
    phone !== currentUser.phone && (submit = true) ? formData.append('phone', phone) : formData.append('phone', currentUser.phone);
    email !== currentUser.email && (submit = true) ? formData.append('email', email) : formData.append('email', currentUser.email);
    
    if(cv) {
        formData.append('cv', cv);
        submit = true;
    }
    
    return submit? formData : null;
}

export const getNewUser = () => {
    const { firstName, lastName, phone, email, cv } = getUserFormValues();


    // Check the placeholders have been removed
    // @TODO FE validation here
    if(
        firstName === 'Name' ||
        lastName === 'Surname' ||
        phone === 'Phone' ||
        email === 'Email'
    ) return null;

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('phone', phone);
 
    if(cv) formData.append('cv', cv);
    return formData;
}

const getUserFormValues = () => {
    const firstName = document.querySelector('.user-summary__first-name').innerText;
    const lastName = document.querySelector('.user-summary__last-name').innerText;
    const phone = document.querySelector('.user-summary__phone').innerText;
    const email = document.querySelector('.user-summary__email').innerText;
    const cv = document.querySelector('.user-summary__input').files[0];

    return { firstName, lastName, phone, email, cv };
};



// table name, function to get row height
export const calculateRows = (tableName) => {
    const { headerHeight, rowHeight, paginationHeight } = getRowHeight(tableName);
    const tableHeight = document.querySelector(`.${tableName}-table__wrapper`).offsetHeight;
    const numOfRows = Math.floor((tableHeight - headerHeight - paginationHeight)/rowHeight);

    return numOfRows-1;
}
const getRowHeight = (tableName) => {
    // Create dummy table to get row height
    const table = `
            <table class="table--test">
                <thead class="thead thead--${tableName}"><tr><th>Test</th></tr></thead>
                <tbody><tr class="row row--${tableName}"><td>test</td></tr></tbody>
            </table>
            <div class="pagination pagination--${tableName}">
                <div class="pagination__previous">Previous</div>
                    <div class="pagination__item pagination__item--active">
                        1
                    </div>
                <div class="pagination__next">Next</div>
            </div>
    `;

    // Add table to DOM
    elements.adminContent.insertAdjacentHTML('afterbegin', table);
    const rowHeight = document.querySelector(`.row--${tableName}`).offsetHeight;
    const headerHeight = document.querySelector(`.thead--${tableName}`).offsetHeight;
    const paginationHeight = document.querySelector(`.pagination--${tableName}`).offsetHeight;

    // Remove table
    utils.removeElement(document.querySelector('.table--test'));
    utils.removeElement(document.querySelector(`.pagination--${tableName}`));
    return { headerHeight, rowHeight, paginationHeight };
}


// toggle = true, insert placeholder
export const togglePlaceholders = (elements, toggle, values) => {
    elements.forEach((element, index) => {
        element.innerText = toggle? element.dataset.placeholder : values[index];
    });
};


// export const initialiseUserPage = () => {
//     // Remove existing content
//     utils.clearElement(elements.adminContent);

//     // Replace existing classname
//     elements.adminContent.className = "admin__content admin__content--users";

//     // Insert placeholders
//     elements.adminContent.insertAdjacentHTML('afterbegin', createUserSummary());
//     elements.adminContent.insertAdjacentHTML('beforeend', `<div class="users-table__wrapper"></div>`);

// };


//////////  JOBS PAGE  ///////////

// export const initialiseJobPage =  () => {
//     utils.clearElement(elements.adminContent);

//     // Replace admin content class name
//     elements.adminContent.className = "admin__content admin__content--jobs";

//     // Insert placeholders
//     elements.adminContent.insertAdjacentHTML('afterbegin', createJobSummary());
//     elements.adminContent.insertAdjacentHTML('beforeend', `<div class="jobs-table__wrapper"></div>`);
// };

const createJobSummary = () => {
    // const markup = `
    //     <div class="job-summary summary">
    //         <div class="job-summary__details">
    //             <div class="job-summary__item job-summary__company" data-placeholder="company" contenteditable=false></div>
    //             <div class="job-summary__item job-summary__title" data-placeholder="title" contenteditable=false></div>
    //             <div class="job-summary__item job-summary__location" data-placeholder="location" contenteditable=false></div>
    //             <div class="job-summary__item job-summary__wage" data-placeholder="wage" contenteditable=false></div>
    //             <label class="job-summary__item job-summary__featured" for="job-summary__featured-checkbox"></label>
    //             <div class="job-summary__item job-summary__description job-summary__text-area" data-placeholder="description" contenteditable=false></div>
    //         </div>
    //         <div class="job-summary__controls">
    //             <div class="job-summary__btn job-summary__btn--new">
    //                 <svg class="job-summary__new-icon job-summary__icon">
    //                     <use xlink:href="svg/spritesheet.svg#add">
    //                 </svg>
    //             </div>
    //             <div class="job-summary__btn job-summary__btn--hubspot">
    //                 <svg class="job-summary__hubspot-icon job-summary__icon">
    //                     <use xlink:href="svg/spritesheet.svg#hubspot">
    //                 </svg>
    //             </div>
    //             <div class="job-summary__btn job-summary__btn--edit">
    //                 <svg class="job-summary__edit-icon job-summary__icon">
    //                     <use xlink:href="svg/spritesheet.svg#edit-np1">
    //                 </svg>
    //             </div>
    //             <div class="job-summary__btn job-summary__btn--delete">
    //                 <svg class="job-summary__delete-icon job-summary__icon">
    //                     <use xlink:href="svg/spritesheet.svg#delete-np1">
    //                 </svg>
    //             </div>
    //         </div>
    //     </div>
    // `;
    // return markup;

    const markup = `
    <div class="job-summary summary">
        <div class="job-summary__details">
            <div class="job-summary__header">
                <div class="job-summary__title job-summary__field">Head of HR</div> 
                <div class="job-summary__company job-summary__field">Dell</div>
            </div>
            <div class="job-summary__content">
                <div class="job-summary__location-wrapper">
                    <svg class="job-summary__location-icon"><use xlink:href="svg/spritesheet.svg#location"></svg>
                    <div class="job-summary__location job-summary__field">Birmingham</div>
                </div>
                <div class="job-summary__wage-wrapper">
                    <svg class="job-summary__wage-icon"><use xlink:href="svg/spritesheet.svg#sterling"></use></svg>
                    <div class="job-summary__wage job-summary__field">£50000</div>

                </div> 
                <div class="job-summary__extra-wrapper">
                    <svg class="job-summary__extra-icon"><use xlink:href="svg/spritesheet.svg#clock"></svg>
                    <div class="job-summary__type job-summary__field">Permanent</div>
                    <div class="job-summary__position job-summary__field">In House</div>
                    <div class="job-summary__PQE job-summary__field">PQE: 3+</div>
                </div> 

                <div class="job-summary__featured-wrapper">
                    <div class="job-summary__featured job-summary__field">Featured?</div>
                </div>

                <div class="job-summary__description job-summary__field">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</div>
            </div>    
            
        </div>
        <div class="job-summary__controls">
                <div class="job-summary__btn job-summary__btn--new">
                    <svg class="job-summary__new-icon job-summary__icon">
                        <use xlink:href="svg/spritesheet.svg#add">
                    </svg>
                </div>
                <div class="job-summary__btn job-summary__btn--hubspot">
                    <svg class="job-summary__hubspot-icon job-summary__icon">
                        <use xlink:href="svg/spritesheet.svg#hubspot">
                    </svg>
                </div>
                <div class="job-summary__btn job-summary__btn--edit">
                    <svg class="job-summary__edit-icon job-summary__icon">
                        <use xlink:href="svg/spritesheet.svg#edit-np1">
                    </svg>
                </div>
                <div class="job-summary__btn job-summary__btn--delete">
                    <svg class="job-summary__delete-icon job-summary__icon">
                        <use xlink:href="svg/spritesheet.svg#delete-np1">
                    </svg>
                </div>
            </div>
     </div>                 
 `;
 return markup;
};



export const populateJobSummary = (job) => {
    const jobSummary = document.querySelector('.job-summary');
    jobSummary.setAttribute('data-id', job.id);

    const companyItem = document.querySelector('.job-summary__company');

    companyItem.innerText = job.companyName;
    companyItem.setAttribute('data-id', job.companyId);
    document.querySelector('.job-summary__title').innerText = job.title;
    document.querySelector('.job-summary__location').innerText = job.location;
    document.querySelector('.job-summary__wage').innerText = job.wage;
    document.querySelector('.job-summary__type').innerText = job.jobType;
    document.querySelector('.job-summary__position').innerText = job.position;
    document.querySelector('.job-summary__PQE').innerText = job.pqe;


    const iconExists = document.querySelector('.job-summary__featured-icon');
    const featuredWrapper = document.querySelector('.job-summary__featured-wrapper');

    if(job.featured) {
        const icon = `<svg class="job-summary__featured-icon job-summary__featured-icon--true"><use xlink:href="svg/spritesheet.svg#pin-ok"></use></svg>`;
        if(iconExists) utils.removeElement(iconExists);
        featuredWrapper.insertAdjacentHTML('afterbegin', icon);
    } else {
        const icon = `<svg class="job-summary__featured-icon job-summary__featured-icon--false"><use xlink:href="svg/spritesheet.svg#pin-angle"></use></svg>`;
        if(iconExists) utils.removeElement(iconExists);
        featuredWrapper.insertAdjacentHTML('afterbegin', icon);

    }

    document.querySelector('.job-summary__description').innerText = job.description;

};
export const clearJobSummary = () => {
    const items = document.querySelectorAll('.job-summary__field');
    items.forEach(item => {
        if(item.className.includes('job-summary__title')) item.innerText = 'Job Title';
        if(item.className.includes('job-summary__location')) item.innerText = 'Location';
        if(item.className.includes('job-summary__wage')) item.innerText = 'Wage';
        if(item.className.includes('job-summary__description')) item.innerText = 'Description';
        if(item.className.includes('job-summary__featured')) addFeaturedCheckbox(false, false);
    });
};

// export const toggleDropdown = (flag, item, dropdown) => {
//     if(flag) {
//         item.insertAdjacentElement('beforebegin', dropdown);
//         utils.removeElement(item);
//     } else {
//         dropdown.insertAdjacentHTML('beforebegin', item);
//         utils.removeElement(dropdown);
//     }
// }

export const createSelectElement = (options, defaultText, classNames, companyId) => {
    const dropdown = document.createElement('select'); 

    classNames.forEach(name => dropdown.classList.add(name));
    
    if(defaultText) {
        const placeholder = new Option(defaultText, defaultText)
        dropdown.add(placeholder);
        placeholder.setAttribute('disabled', true);
    }

    options.forEach(item => {
        const option = new Option(item.name, item.name);
        option.setAttribute('data-id', item.id);

        if(!defaultText && parseInt(option.dataset.id) === companyId) {
            option.selected = true;
        }

        dropdown.add(option);
    });

    return dropdown;
};

export const addFeaturedCheckbox = (visible, featured) => {
    const checkbox = document.querySelector('.job-summary__featured-checkbox');
    if(!visible && checkbox) {
        utils.removeElement(checkbox);
        return;
    }

    const featuredDiv = document.querySelector('.job-summary__featured');
    const markup = `<input type="checkbox" class="job-summary__featured-checkbox" value ="featured" ${featured? 'checked':'' } />`;
    
    featuredDiv.insertAdjacentHTML('beforeend', markup);   
};

// @TODO: move from job section
//@TODO: Same as the changeEditIcon?
// export const changeNewIcon = (btnToDisplay, summaryType, skip) => {
//     const newBtn = document.querySelector(`.${summaryType}-summary__btn--new`);
//     const saveBtn = document.querySelector(`.${summaryType}-summary__btn--save-new`);
//     const summaryControls = document.querySelector(`.${summaryType}-summary__controls`);

//     let markup;
//     if(btnToDisplay === 'save') {
//         utils.removeElement(newBtn);
//         markup = `
//             <div class="${summaryType}-summary__btn ${summaryType}-summary__btn--save-new">
//                 <svg class="${summaryType}-summary__save-icon">
//                     <use xlink:href="svg/spritesheet.svg#save-np">
//                 </svg>
//             </div>
//         `;
//     } else if(btnToDisplay === 'new') {
//         utils.removeElement(saveBtn);
//         markup = `
//             <div class="${summaryType}-summary__btn ${summaryType}-summary__btn--new">
//                 <svg class="${summaryType}-summary__edit-icon">
//                     <use xlink:href="svg/spritesheet.svg#add">
//                 </svg>
//             </div>
//         `;
//     }
//     summaryControls.insertAdjacentHTML('afterbegin', markup);

//     // Disable other btns if save is active
//     if(btnToDisplay === 'save') toggleActiveBtns(false, summaryType, skip);
//     else toggleActiveBtns(true, summaryType, skip);
// };

export const getJobEdits = (currentJob) => {
    let { title, location, wage, type, position, PQE, featured, description } = getJobFormValues();
    const company = document.querySelector('.job-summary__company');
    const companyId = company.dataset.id;
    const companyName = company.innerText;

    const formData = new FormData();
    let submit = false;

    // The ID doesn't need comparison, just appending to the form
    formData.append('companyId', parseInt(companyId));

    // Compare the form values to the current values. Set submit to true if one varies
    // Company (as a select element) also has to be compared to '' 
    companyName && companyName !== currentJob.companyName && (submit = true) ? formData.append('companyName', companyName):formData.append('companyName', currentJob.companyName);
    title !== currentJob.title && (submit = true) ? formData.append('title', title):formData.append('title', currentJob.title);
    location !== currentJob.location && (submit = true) ? formData.append('location', location):formData.append('location', currentJob.location);
    parseInt(wage) !== currentJob.wage && (submit = true) ? formData.append('wage', wage):formData.append('wage', currentJob.wage);
    type !== currentJob.jobType && (submit = true) ? formData.append('jobType', type): formData.append('jobType', currentJob.jobType);
    position !== currentJob.position && (submit = true) ? formData.append('position', position): formData.append('position', currentJob.position);

    // Make sure the PQE is always a string in the format 'num+'
    console.log(PQE, currentJob.pqe)
    PQE !== `${currentJob.pqe}+` && (submit = true) ? formData.append('pqe', PQE): formData.append('pqe', currentJob.pqe);

    description !== currentJob.description && (submit = true) ? formData.append('description', description):formData.append('description', currentJob.description);
    
    featured !== currentJob.featured && (submit = true) ? formData.append('featured', featured):formData.append('featured', currentJob.featured); 

    return submit ? formData : null;
}; 

export const getNewJob = () => {
    const { title, location, wage, type, position, PQE, featured, description } = getJobFormValues();

    const selectElement = document.querySelector('.job-summary__company');
    const companyName = selectElement.value;
    const companyId = selectElement.options[selectElement.selectedIndex].getAttribute('data-id');

    // Check the placeholders have been removed
    // @TODO FE validation here
    if(
        companyName === 'Company Name' ||
        title === 'Job Title' ||
        location === 'Location' ||
        wage === 'Wage' ||
        type === 'Job Type' ||
        position === 'position' ||
        PQE === 'PQE' ||
        description === 'Description'
    ) return null;

    const formData = new FormData();
    formData.append('companyId', companyId);
    formData.append('companyName', companyName);
    formData.append('title', title);
    formData.append('location', location);
    formData.append('wage', parseInt(wage));
    formData.append('jobType', type);
    formData.append('position', position);
    formData.append('pqe', PQE);
    formData.append('featured', featured);
    formData.append('description', description);

    return formData;
}

const getJobFormValues = () => {
    // Company name is retrieved by the calling function 
    const title = document.querySelector('.job-summary__title').innerText;
    const location = document.querySelector('.job-summary__location').innerText;
    const wage = document.querySelector('.job-summary__wage').innerText;
    const type = document.querySelector('.job-summary__type').value;
    const position = document.querySelector('.job-summary__position').value;
    let PQE = document.querySelector('.job-summary__PQE').value;
    PQE = PQE.substring(0, PQE.length - 1);
    const featured = document.querySelector('.job-summary__featured-checkbox').checked? 1:0;
    const description = document.querySelector('.job-summary__description').innerText;
    return { title, location, wage, type, position, PQE, featured, description };
}

export const formatJobs = (jobs) => {
    // Headers should match the returned divs in createJobsElement
    const headers = ['#', 'COMPANY','TITLE','LOCATION', 'ADDED'];
    const rows = jobs.map(job => {
        return createJobElement(job);
    });
    return { headers, rows };
};
const createJobElement = (job) => {
    const row = [
        `<div class="td-data--jobId" data-id=${job.id}>${job.id}</div>`,
        `<div class="td-data--company" data-id=${job.id}>${job.companyName}</div>`,
        `<div class="td-data--title">${job.title}</div>`,
        `<div class="td-data--location">${job.location}</div>`,
        `<div class="td-data--location">${job.jobDate}</div>`

    ];
    return row;
}; 

export const changeActiveMenuItem = (e) => {
    // Items contain the highlight, the links contain the fill and color for the text/icon
    const items = [ elements.adminMenuJobsItem, elements.adminMenuUsersItem, elements.adminMenuApplicationsItem, elements.adminMenuCompaniesItem, elements.adminMenuSettingsItem ];

    const newActiveItem = e.target.closest(elementStrings.adminMenuItem);
    if(newActiveItem) {
        const newActiveLink = newActiveItem.childNodes[1];
    
        if(!newActiveItem.classList.contains('sidebar__item--active')) newActiveItem.classList.add('sidebar__item--active');
        if(!newActiveLink.classList.contains('sidebar__link--active')) newActiveLink.classList.add('sidebar__link--active');
    
        items.forEach(item => {
            if(item !== newActiveItem) {
                item.classList.remove('sidebar__item--active');
                item.childNodes[1].classList.remove('sidebar__link--active');
            }
        });
    }
}

// @TODO: delete?
// export const addTableListeners = (type) => {
//     const deleteButtons = type==='jobs'? 
//                             document.querySelectorAll(elementStrings.deleteJobsBtn):
//                             document.querySelectorAll(elementStrings.deleteUsersBtn);

//     const editButtons = type==='jobs'?
//                             document.querySelectorAll(elementStrings.editJobsBtn):
//                             document.querySelectorAll(elementStrings.editUsersBtn);

//     const hubspotButtons = type === 'users'? 
//                             document.querySelectorAll(elementStrings.hubspotBtn):
//                             [];

//     // Row buttons
//     deleteButtons.forEach(button => {
//         button.addEventListener('click', (e) => {
//             const item = type==='jobs'? getJob(e): getUser(e);
//             if(item) {
//                 // Change the display info for the modal based on the table
//                 const modalParams = type === 'jobs'? [item.id, item.title]: [item.id, `${item.fName} ${item.lName}`];
//                 displayModal('delete', type, modalParams);
//             }
//         });
//     });
//     editButtons.forEach(button => {
//         button.addEventListener('click', (e) => {
//             const item = type==='jobs'? getJob(e): getUser(e);
//             if(item)
//                 if(type === 'jobs') {
//                     jobForm.renderJobForm(e, 'edit', item)
//                 } else {
//                     userForm.renderUserForm(e, 'edit', item);
//                 }
//         });
//     });
//     if(type === 'users') {
//         hubspotButtons.forEach(button => {
//             button.addEventListener('click', (e) => {
//                 const {id, fName, lName} = getUser(e);
//                 displayModal('add', type, [id, `${fName} ${lName}`]);
//             });
//         });
//     }

//     // Row links
//     const table = document.querySelector('.table');
//     if(table) table.addEventListener('click', (e) => {
//         // If a row was clicked but not the edit or delete buttons
//         const row = e.target.closest('.table-row') && (!e.target.closest('.td--edit') && !e.target.closest('.td--delete'));
//         if(row && type === 'jobs') {
//             const job = getJob(e);
//             if(type === 'jobs') renderJobDetails(job, elements.adminContent);
//         }
//     });

//     // Table controls
//     if(type === 'jobs') {
//         document.querySelector('.create-job-btn')
//         .addEventListener('click', (e) => {
//             jobForm.renderJobForm(e, 'create')
//         })
//     } else if (type === 'users') {
//         document.querySelector('.create-user-btn')
//             .addEventListener('click', (e) => {
//                 userForm.renderUserForm(e, 'create')
//             })
//     }
// }

// This is for the warning modal
export const getAction = (e) => {
    const confirmJob = e.target.closest(`.delete-btn--jobs`);
    const confirmUser = e.target.closest(`.delete-btn--users`);
    const addUser = e.target.closest(`.add-btn--users`);
    // @TODO: This logic doesn't work
    const cancel = e.target.closest('.cancel-btn--warn') || !e.target.closest('.modal__content');

    if(addUser) return 'addUser';
    if(confirmJob) return 'deleteJob';
    if(confirmUser) return 'deleteUser';
    if(cancel) return 'cancel';
}

const getUser = (e) => {
    // Associate the row/button with a user
    const row = e.target.closest('.table-row');
    let user = {};
    if(row) {
        user.id = row.dataset.id;
        user.fName = row.querySelector('.td--firstName').innerText;
        user.lName = row.querySelector('.td--lastName').innerText;
        user.phone = row.querySelector('.td--phone').innerText;
        user.email = row.querySelector('.td--email').innerText;
    }
    return user;
}

const getJob = (e) => {
    const row = e.target.closest('.table-row');
    let job = {};
    if(row) {
        job.id = row.dataset.id;
        job.title = row.querySelector('.td--title').innerText;
        job.wage = row.querySelector('.td--wage').innerText;
        job.location = row.querySelector('.td--location').innerText;
        job.description = row.querySelector('.td--description').innerText;
    }
    return job;
}



//////////  COMPANIES PAGE  ///////////

export const formatCompanies = (companies) => {
    // Headers should match the returned divs in createCompanyElement
    const headers = ['ID', 'NAME', 'CREATED'];
    const rows = companies.map(company => {
        return createCompanyElement(formatProperties(company, ['companyId', 'companyDate']));
    });
    return { headers, rows };
};
const createCompanyElement = ({ id, name, companyDate }) => {
    const row = [
        `<div class="td-data--company-id">${id}</div>`,
        `<div class="td-data--company-name" data-id=${id}>${name}</div>`,
        `<div class="td-data--date" data-id=${id}>${companyDate}</div>`
    ];
    return row;
}


const createCompanySummary = (company) => {
    const markup  = `
        <div class="summary-wrapper">
            <div class="company-summary summary">
                <div class="company-summary__details">
                    <div class="company-summary__item company-summary__company" data-placeholder="Company" contenteditable=false></div>
                </div>
                <div class="company-summary__controls">
                    <div class="company-summary__btn company-summary__btn--new">
                        <svg class="company-summary__new-icon company-summary__icon">
                            <use xlink:href="svg/spritesheet.svg#add">
                        </svg>
                    </div>
                    <div class="company-summary__btn company-summary__btn--hubspot">
                        <svg class="company-summary__hubspot-icon company-summary__icon">
                            <use xlink:href="svg/spritesheet.svg#hubspot">
                        </svg>
                    </div>
                    <div class="company-summary__btn company-summary__btn--edit">
                        <svg class="company-summary__edit-icon company-summary__icon">
                            <use xlink:href="svg/spritesheet.svg#edit-np1">
                        </svg>
                    </div>
                    <div class="company-summary__btn company-summary__btn--delete">
                        <svg class="company-summary__delete-icon company-summary__icon">
                            <use xlink:href="svg/spritesheet.svg#delete-np1">
                        </svg>
                    </div>
                </div>
            </div>

            ${createAddressSummary()}

            ${createContactSummary()}
        </div>
    `;

    return markup;
};

export const populateCompanySummary = ({ id, name }) => {
    const companySummary = document.querySelector('.company-summary');
    companySummary.setAttribute('data-id', id);
    
    document.querySelector('.company-summary__company').innerText = name;

};

export const getSummaryCompanyId =  () => {
    return document.querySelector('.company-summary').dataset.id;
};
export const getSummaryAddressId = () => {
    return document.querySelector('.address-summary').dataset.id;
};
export const getSummaryContactId = () => {
    return document.querySelector('.contact-summary').dataset.id;
};

export const getNewCompany = () => {
    const companyName = document.querySelector('.company-summary__company').innerText;
    
    // @TODO: Add validation
    if(companyName === 'Company') return null;
    const formData = new FormData();
    formData.append('companyName', companyName);
    return formData;
};
export const getNewAddress = () => {
    const { firstLine, secondLine, city, county, postcode } = getAddressFormValues();

    // @TODO: Add validation
    if(
        firstLine === 'First Line' ||
        secondLine === 'Second Line' ||
        city === 'City' ||
        county === 'County' ||
        postcode === 'Postcode'
    ) return null;

    const formData = new FormData();
    formData.append('firstLine', firstLine);
    formData.append('secondLine', secondLine);
    formData.append('city', city);
    formData.append('county', county);
    formData.append('postcode', postcode);

    return formData;
};
const getAddressFormValues = () => {
    const firstLine = document.querySelector('.address-summary__first-line').innerText;
    const secondLine = document.querySelector('.address-summary__second-line').innerText;
    const city = document.querySelector('.address-summary__city').innerText;
    const county = document.querySelector('.address-summary__county').innerText;
    const postcode = document.querySelector('.address-summary__postcode').innerText;

    return { firstLine, secondLine, city, county, postcode };
};
export const getNewContact = () => {
    const { firstName, lastName, position, email, phone } = getContactFormValues();

    // @TODO: Add validation
    if(
        firstName === 'First Name' ||
        lastName === 'Last Name' ||
        position === 'Position' ||
        email === 'Email' ||
        phone === 'Phone'
    ) return null;

    const formData = new FormData();

    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('position', position);
    formData.append('email', email);
    formData.append('phone', phone);

    return formData;
};
const getContactFormValues = () => {
    const firstName = document.querySelector('.contact-summary__firstname').innerText;
    const lastName = document.querySelector('.contact-summary__lastname').innerText;
    const position = document.querySelector('.contact-summary__position').innerText;
    const phone = document.querySelector('.contact-summary__phone').innerText;
    const email = document.querySelector('.contact-summary__email').innerText;

    return { firstName, lastName, position, phone, email };
};

export const createAddressSummary = () => {
    const markup  = `
        <div class="address-summary summary">
            <div class="address-summary__details">
                <div class="address-summary__item address-summary__address" data-placeholder="Address" contenteditable=false></div>
            </div>
            <div class="address-summary__controls">
                <div class="address-summary__btn address-summary__btn--new">
                    <svg class="address-summary__new-icon address-summary__icon">
                        <use xlink:href="svg/spritesheet.svg#add">
                    </svg>
                </div>
                <div class="address-summary__btn address-summary__btn--edit">
                    <svg class="address-summary__edit-icon address-summary__icon">
                        <use xlink:href="svg/spritesheet.svg#edit-np1">
                    </svg>
                </div>
                <div class="address-summary__btn address-summary__btn--delete">
                    <svg class="address-summary__delete-icon address-summary__icon">
                        <use xlink:href="svg/spritesheet.svg#delete-np1">
                    </svg>
                </div>
            </div>
        </div>
    `;

    return markup;
};
export const populateAddressSummary = (id, address) => {
    const addressSummary = document.querySelector('.address-summary');
    addressSummary.setAttribute('data-id', address.addressId);
    addressSummary.setAttribute('data-company-id', id);
    
    populateAddress(address);
};

export const makeAddressEditable = (editable, type, address) => {
    const addressDetails = document.querySelector('.address-summary__details');
    utils.clearElement(addressDetails);
    if(editable) {
        const markup = `
            <div class="address-summary__item address-summary__first-line address-summary__item--editable" data-placeholder="First Line" contenteditable=false>${type === 'placeholder'? '':address.firstLine}</div>
            <div class="address-summary__item address-summary__second-line address-summary__item--editable" data-placeholder="Second Line" contenteditable=false>${type === 'placeholder'? '':address.secondLine}</div>
            <div class="address-summary__item address-summary__city address-summary__item--editable" data-placeholder="City" contenteditable=false>${type === 'placeholder'? '':address.city}</div>
            <div class="address-summary__item address-summary__county address-summary__item--editable" data-placeholder="County" contenteditable=false>${type === 'placeholder'? '':address.county}</div>
            <div class="address-summary__item address-summary__postcode address-summary__item--editable" data-placeholder="Postcode" contenteditable=false>${type === 'placeholder'? '':address.postcode}</div>
        `;
        addressDetails.insertAdjacentHTML('afterbegin', markup);
        makeEditable(document.querySelectorAll('.address-summary__item'), true, []);
    } else {
        addressDetails.insertAdjacentHTML('afterbegin', '<div class="address-summary__item address-summary__address" data-placeholder="Address" contenteditable=false></div>');
        populateAddress(address);
    }
};

export const populateAddress = ({firstLine, secondLine, city, county, postcode} = {}) => {
    const address = 
        firstLine? `${firstLine} ${secondLine? `\n${secondLine}`:'\ '} ${city? `\n${city}`:'\ '} ${county? `\n${county}`:'\ '} ${postcode? `\n${postcode}`: ''}`
        : 'Please add an address';
    document.querySelector('.address-summary__address').innerText = address;
};

export const createContactSummary = () => {
    const markup  = `
        <div class="contact-summary summary">
            <div class="contact-summary__details">
                <div class="contact-summary__item contact-summary__firstname" data-placeholder="First Name" contenteditable=false></div>
                <div class="contact-summary__item contact-summary__lastname" data-placeholder="Last Name" contenteditable=false></div>
                <div class="contact-summary__item contact-summary__position" data-placeholder="Position" contenteditable=false></div>
                <div class="contact-summary__item contact-summary__email" data-placeholder="Email" contenteditable=false></div>
                <div class="contact-summary__item contact-summary__phone" data-placeholder="Phone" contenteditable=false></div>
            </div>
            <div class="contact-summary__controls">
                <div class="contact-summary__btn contact-summary__btn--new">
                    <svg class="contact-summary__new-icon contact-summary__icon">
                        <use xlink:href="svg/spritesheet.svg#add">
                    </svg>
                </div>
                <div class="contact-summary__btn contact-summary__btn--edit">
                    <svg class="contact-summary__edit-icon contact-summary__icon">
                        <use xlink:href="svg/spritesheet.svg#edit-np1">
                    </svg>
                </div>
                <div class="contact-summary__btn contact-summary__btn--delete">
                    <svg class="contact-summary__delete-icon contact-summary__icon">
                        <use xlink:href="svg/spritesheet.svg#delete-np1">
                    </svg>
                </div>
            </div>
        </div>
    `;

    return markup;
};

export const populateContactSummary = (id, contact) => {
    const contactSummary = document.querySelector('.contact-summary');
    contactSummary.setAttribute('data-id', contact.personId);
    contactSummary.setAttribute('data-company-id', id);
    document.querySelector('.contact-summary__firstname').innerText = contact.firstName;
    document.querySelector('.contact-summary__lastname').innerText = contact.lastName;
    document.querySelector('.contact-summary__position').innerText = contact.position;
    document.querySelector('.contact-summary__position').innerText = contact.position;
    document.querySelector('.contact-summary__email').innerText = contact.email;
    document.querySelector('.contact-summary__phone').innerText = contact.phone;
};


export const renderCompanies = (companies) => {
    const markup = `
        ${companies.map(company => {
            return renderCompany(company);
        })}
    `;
    utils.clearElement(elements.adminContent);

    document.querySelector('.admin__content').insertAdjacentHTML('afterbegin', markup);
};
const renderCompany = (company) => {
    return `
        <div class="company-wrapper" data-set="${company.id}">
                <div class="company-item company-item--${company.name}">${company.name}</div>
                <div class="company-item company-item--${company.address}">${company.address}</div>
        </div>
        `
};
 

export const renderPagination = (current, limit, totalItems, container, table) => {
    // Work out how many pages
    const pages = Math.ceil(totalItems / limit);
    // Current is the first (zero indexed) item on the page. current/limit = zero index page number
    current = current/limit;
    const itemMarkup = generatePaginationMarkup(pages, current, table);
    
    const markup = `
        <div class="pagination pagination--${table}">
            <div class="pagination__previous pagination__previous--${table} ${current === 0? 'pagination__previous--inactive':''}">Previous</div>
            <div class="pagination__item-wrapper">${itemMarkup}</div>
            <div class="pagination__next pagination__next--${table} ${current === pages-1? 'pagination__next--inactive':''}">Next</div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', markup);
};

const generatePaginationMarkup = (pages, current, table) => {
    let markup = '';
    for(let x = 0; x < pages; x++) {
        const temp = `
            <div class="pagination__item pagination__item--${table} pagination__item--${x+1} ${x === current? 'pagination__item--active':''}" data-id=${x}>
                ${x+1}
            </div>`;
        markup += temp;
    }
    return markup;
};

export const initialiseAdminPage = (page) => {
    // Remove existing content
    utils.clearElement(elements.adminContent);

    // Replace existing classname
    elements.adminContent.className = `admin__content admin__content--${page}`;

    let createSummary;

    switch(page) {
        case 'users':           createSummary = createUserSummary; break;
        case 'jobs':            createSummary = createJobSummary; break;
        case 'companies':       createSummary = createCompanySummary; break;
        // case 'applications':    createSummary = createApplicationSummary; break;
    }

    // Insert placeholders
    if(createSummary) elements.adminContent.insertAdjacentHTML('afterbegin', createSummary());
    elements.adminContent.insertAdjacentHTML('beforeend', `<div class="${page}-table__wrapper"></div>`);
};




// @TODO: move to modal module
const displayModal = (action, type, item) => {
    // Create modal and insert into DOM
    const warningModal = utils.warn(
        `Are you sure you want to ${action} ${item[1]} (id: ${item[0]})?`,
        [`${action}`, 'cancel'],
        type,
        item[0]
    );
    document.body.insertAdjacentHTML('afterbegin', warningModal);
};


////////// Event Handlers //////////

export const inputChangeHandler = (e) => {
    const cvPath = document.querySelector('.user-summary__upload-path');
    cvPath.innerText = `${e.target.files[0].name}`;
};

export const focusInNewUserHandler = (e) => {
    e.target.innerText = '';
};
export const focusOutNewUserHandler = (e) => {
    e.target.innerText = e.target.innerText || e.target.dataset.placeholder;
};

export const focusInEditUserHandler = (e) => {
    window.getSelection().selectAllChildren(e.target);
};

export const focusOutEditUserHandler = (user, e) => {
    let value;

    //@TODO: This should be validation
    // If blank, replace with original value
    if(!e.target.innerText) {
        switch(e.target.dataset.placeholder) {
            case 'First Name':  value = user['firstName']; break;
            case 'Last Name':   value = user['lastName']; break;
            case 'Phone':       value = user['phone']; break;
            case 'Email':       value = user['email']; break;
        }
    }
    e.target.innerText = value? value : e.target.innerText;
};

export const focusInNewJobHandler = (e) => {
    if(e.target.nodeName !== 'DIV') return;

    window.getSelection().selectAllChildren(e.target);
};
export const focusOutNewJobHandler = (e) => {
    if(e.target.nodeName !== 'DIV') return;
    e.target.innerText = e.target.innerText || e.target.dataset.placeholder;
};
export const focusInEditJobHandler = (e) => {
    window.getSelection().selectAllChildren(e.target);
};
export const focusOutEditJobHandler = (job, e) => {
    if(e.target.nodeName !== 'DIV') return;
    let value;
    // @TODO: put validation here
    if(!e.target.innerText) {
        switch(e.target.dataset.placeholder) {
            //case 'company':    
            case 'title':       value = job['title']; break;
            case 'location':    value = job['location']; break;
            case 'wage':        value = job['wage']; break;
            case 'description': value = job['description']; break;
        }
    }
    e.target.innerText = value? value : e.target.innerText;
};
export const focusInNewCompanyHandler = (e) => {
    window.getSelection().selectAllChildren(e.target);

};
export const focusOutNewCompanyHandler = (e) => {
    e.target.innerText = e.target.innerText || e.target.dataset.placeholder;
};

export const focusInEditCompanyHandler = (e) => {
    window.getSelection().selectAllChildren(e.target);

};
export const focusOutEditCompanyHandler = (company, e) => {
    let value;

    if(!e.target.innerText) {
        value = company['name'];
    }

    e.target.innerText = value? value : e.target.innerText;
};