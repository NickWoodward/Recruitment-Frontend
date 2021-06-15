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
const createUserElement = ({ applicantId, firstName, lastName, createdAt }) => {
    const row = [
        `<div class="td-data--applicantId">${applicantId}</div>`,
        `<div class="td-data--first-name" data-id=${applicantId}>${firstName}</div>`,
        `<div class="td-data--last-name" data-id=${applicantId}>${lastName}</div>`,
        `<div class="td-data--date" data-id=${applicantId}>${createdAt}</div>`
    ];
    return row;
}
const createUserSummary = () => {
    const markup = `
        <div class="user-summary">
            <div class="user-summary__details">
                <div class="user-summary__item user-summary__first-name" contenteditable=false></div>
                <div class="user-summary__item user-summary__last-name" contenteditable=false></div>
                <div class="user-summary__item user-summary__phone" contenteditable=false></div>
                <div class="user-summary__item user-summary__email" contenteditable=false></div>
            </div>
            <div class="user-summary__controls">
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
    // if(makeEditable) {
    //     const cvWrapper = document.querySelector('.user-summary__cv-wrapper');
    //     utils.removeElement(cvWrapper);
    //     console.log(cvWrapper);

    //     // const uploader = `
    //     //     <div class="user-summary__btn user-summary__btn--upload">
    //     //         <svg class="user-summary__icon user-summary__upload-icon">
    //     //             <use xlink:href="svg/spritesheet.svg#upload-np">
    //     //         </svg>
    //     //     </div>
    //     //     <div class="user-summary__cv-path">No CV selected</div>
    //     // `;
    //     // cvWrapper.insertAdjacentHTML('afterbegin', uploader);
    //     // console.log(document.querySelector('.user-summary__btn'));
    // }
}

export const addCvElement = user => {
    const cvWrapper = document.querySelector('.user-summary__cv-wrapper');
    const cvName = user.cvName;
    const cvType = user.cvType;
    if(cvWrapper) utils.removeElement(cvWrapper);
    const cvElement = `
        <div class="user-summary__cv-wrapper">
            <div class="user-summary__btn user-summary__btn--${cvType === null ? 'upload':'cv'}" data-id=${user.applicantId}>
                <svg class="user-summary__icon user-summary__${cvType === null ? 'upload':'cv'}-icon">
                    <use xlink:href="svg/spritesheet.svg#${cvType === '.pdf'? 'pdf':(cvType === '.doc' || cvType === '.docx'? 'doc':'upload-np')}">
                </svg>
            </div>
            <div class="user-summary__cv-path">${cvName}</div>
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
                <label class="user-summary__label user-summary__btn" for="user-summary__input">
                    <svg class="user-summary__icon user-summary__upload-icon">
                        <use xlink:href="svg/spritesheet.svg#upload-np">
                    </svg>
                    <input class="user-summary__input" id="user-summary__input" name="cv" type=file />
                </label>
                <div class="user-summary__cv-path">${cvName !== 'No CV uploaded'? 'Update existing CV?':'Add a CV'}</div>
            </div>

        </div>`

    document.querySelector('.user-summary__email').insertAdjacentHTML('afterend', markup);
}

export const changeEditIcon = (btnToDisplay, summaryType) => {
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

    // Disable other btns if save is active
    if(btnToDisplay === 'save') toggleActiveBtns(false, summaryType, [document.querySelector(`.${summaryType}-summary__btn--save`)]);
    else toggleActiveBtns(true, summaryType, [document.querySelector(`.${summaryType}-summary__btn--save`)]);
}

const toggleActiveBtns = (active, summaryType, skip) => {
    const btns = document.querySelectorAll(`.${summaryType}-summary__btn`);
    btns.forEach(btn => {
        if(!skip.includes(btn)) {
            const btnIcon = btn.firstElementChild;
            if(!active) { 
                btn.classList.add(`${summaryType}-summary__btn--disabled`); 
                btnIcon.classList.add(`${summaryType}-summary__icon--disabled`);
            }
            else {
                btn.classList.remove(`${summaryType}-summary__btn--disabled`);
                btnIcon.classList.remove(`${summaryType}-summary__icon--disabled`);

            }
        }
    });
};

export const getUserEdits = (currentUser) => {
    const formData = new FormData();

    // Compare the current user to the edits made
    const firstName = document.querySelector('.user-summary__first-name').innerText;
    const lastName = document.querySelector('.user-summary__last-name').innerText;
    const phone = document.querySelector('.user-summary__phone').innerText;
    const email = document.querySelector('.user-summary__email').innerText;
    const cv = document.querySelector('.user-summary__input').files[0];

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

// table name, function to get row height
export const calculateRows = (tableName) => {
    const { headerHeight, rowHeight, paginationHeight } = getRowHeight(tableName);
    const tableHeight = document.querySelector(`.${tableName}-table__wrapper`).offsetHeight;
    const numOfRows = Math.floor((tableHeight - headerHeight - paginationHeight)/rowHeight);
    console.log(document.querySelector(`.${tableName}-table__wrapper`));
    console.log(tableHeight, rowHeight, paginationHeight);
    return numOfRows;
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

export const initialiseUserPage = () => {
    // Remove existing content
    utils.clearElement(elements.adminContent);

    // Replace existing classname
    elements.adminContent.className = "admin__content admin__content--users";

    // Insert placeholders
    elements.adminContent.insertAdjacentHTML('afterbegin', createUserSummary());
    elements.adminContent.insertAdjacentHTML('beforeend', `<div class="users-table__wrapper"></div>`);
};



//////////  JOBS PAGE  ///////////

export const initialiseJobPage =  () => {
    utils.clearElement(elements.adminContent);

    // Replace admin content class name
    elements.adminContent.className = "admin__content admin__content--jobs";

    // Insert placeholders
    elements.adminContent.insertAdjacentHTML('afterbegin', createJobSummary());
    elements.adminContent.insertAdjacentHTML('beforeend', `<div class="jobs-table__wrapper"></div>`);
};

const createJobSummary = () => {
    const markup = `
        <div class="job-summary">
            <div class="job-summary__details">
                <div class="job-summary__item job-summary__company" contenteditable=false></div>
                <div class="job-summary__item job-summary__title" contenteditable=false></div>
                <div class="job-summary__item job-summary__location" contenteditable=false></div>
                <div class="job-summary__item job-summary__wage" contenteditable=false></div>
                <label class="job-summary__item job-summary__featured" for="job-summary__featured-checkbox"></label>
                <div class="job-summary__item job-summary__description job-summary__text-area" contenteditable=false></div>
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
    document.querySelector('.job-summary__featured').innerText = `${job.description? 'Featured': 'Not Featured'}`;

    document.querySelector('.job-summary__description').innerText = job.description;

};
export const clearJobSummary = (companies) => {
    const items = document.querySelectorAll('.job-summary__item');
    items.forEach(item => {
        if(item.className.includes('job-summary__title')) item.innerText = 'Job Title';
        if(item.className.includes('job-summary__location')) item.innerText = 'Location';
        if(item.className.includes('job-summary__wage')) item.innerText = 'Wage';
        if(item.className.includes('job-summary__description')) item.innerText = 'Description';
        if(item.className.includes('job-summary__featured')) addFeaturedCheckbox(false, false);
    });
};

export const toggleDropdown = (flag, item, dropdown) => {
    if(flag) {
        item.insertAdjacentElement('beforebegin', dropdown);
        utils.removeElement(item);
    } else {
        dropdown.insertAdjacentHTML('beforebegin', item);
        utils.removeElement(dropdown);
    }
}

export const createSelectElement = (options, defaultText, classNames, companyId) => {
    
    const dropdown = document.createElement('select'); 

    classNames.forEach(name => dropdown.classList.add(name));

    options.forEach(item => {
        const option = new Option(item.name, item.name);
        option.setAttribute('data-id', item.id);

        if(parseInt(option.dataset.id) === companyId) {
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

export const changeNewIcon = (btnToDisplay, summaryType) => {
    const newBtn = document.querySelector(`.${summaryType}-summary__btn--new`);
    const saveBtn = document.querySelector(`.${summaryType}-summary__btn--save-new`);
    const summaryControls = document.querySelector(`.${summaryType}-summary__controls`);

    let markup;
    if(btnToDisplay === 'save') {
        utils.removeElement(newBtn);
        markup = `
            <div class="${summaryType}-summary__btn ${summaryType}-summary__btn--save-new">
                <svg class="${summaryType}-summary__save-icon">
                    <use xlink:href="svg/spritesheet.svg#save-np">
                </svg>
            </div>
        `;
    } else if(btnToDisplay === 'new') {
        utils.removeElement(saveBtn);
        markup = `
            <div class="${summaryType}-summary__btn ${summaryType}-summary__btn--new">
                <svg class="${summaryType}-summary__edit-icon">
                    <use xlink:href="svg/spritesheet.svg#add">
                </svg>
            </div>
        `;
    }
    summaryControls.insertAdjacentHTML('afterbegin', markup);

    // Disable other btns if save is active
    if(btnToDisplay === 'save') toggleActiveBtns(false, summaryType, [document.querySelector(`.${summaryType}-summary__btn--save-new`)]);
    else toggleActiveBtns(true, summaryType, [document.querySelector(`.${summaryType}-summary__btn--save-new`)]);
};

export const getJobEdits = (currentJob) => {
    const { companyId, companyName, title, location, wage, featured, description } = getJobFormValues();
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
    description !== currentJob.description && (submit = true) ? formData.append('description', description):formData.append('description', currentJob.description);
    
    featured !== currentJob.featured && (submit = true) ? formData.append('featured', featured):formData.append('featured', currentJob.featured); 

    return submit ? formData : null;
}; 

export const getNewJob = () => {
    const { companyId, companyName, title, location, wage, featured, description } = getJobFormValues();

    // Check the placeholders have been removed
    // @TODO FE validation here
    if(
        companyName === 'Company Name' ||
        title === 'Job Title' ||
        location === 'Location' ||
        wage === 'Wage' ||
        description === 'Description'
    ) return null;

    const formData = new FormData();
    formData.append('companyId', companyId);
    formData.append('companyName', companyName);
    formData.append('title', title);
    formData.append('location', location);
    formData.append('wage', wage);
    formData.append('featured', featured);
    formData.append('description', description);

    return formData;
}

const getJobFormValues = () => {
    const selectElement = document.querySelector('.job-summary__company');
    const companyName = selectElement.value;
    const companyId = selectElement.options[selectElement.selectedIndex].getAttribute('data-id');
    const title = document.querySelector('.job-summary__title').innerText;
    const location = document.querySelector('.job-summary__location').innerText;
    const wage = document.querySelector('.job-summary__wage').innerText;
    const featured = document.querySelector('.job-summary__featured-checkbox').checked;
    const description = document.querySelector('.job-summary__description').innerText;

    return { companyId, companyName, title, location, wage, featured, description };
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
        `<div class="td-data--jobId">${job.id}</div>`,
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

export const addTableListeners = (type) => {
    const deleteButtons = type==='jobs'? 
                            document.querySelectorAll(elementStrings.deleteJobsBtn):
                            document.querySelectorAll(elementStrings.deleteUsersBtn);

    const editButtons = type==='jobs'?
                            document.querySelectorAll(elementStrings.editJobsBtn):
                            document.querySelectorAll(elementStrings.editUsersBtn);

    const hubspotButtons = type === 'users'? 
                            document.querySelectorAll(elementStrings.hubspotBtn):
                            [];

    // Row buttons
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const item = type==='jobs'? getJob(e): getUser(e);
            if(item) {
                // Change the display info for the modal based on the table
                const modalParams = type === 'jobs'? [item.id, item.title]: [item.id, `${item.fName} ${item.lName}`];
                displayModal('delete', type, modalParams);
            }
        });
    });
    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const item = type==='jobs'? getJob(e): getUser(e);
            if(item)
                if(type === 'jobs') {
                    jobForm.renderJobForm(e, 'edit', item)
                } else {
                    userForm.renderUserForm(e, 'edit', item);
                }
        });
    });
    if(type === 'users') {
        hubspotButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const {id, fName, lName} = getUser(e);
                displayModal('add', type, [id, `${fName} ${lName}`]);
            });
        });
    }

    // Row links
    const table = document.querySelector('.table');
    if(table) table.addEventListener('click', (e) => {
        // If a row was clicked but not the edit or delete buttons
        const row = e.target.closest('.table-row') && (!e.target.closest('.td--edit') && !e.target.closest('.td--delete'));
        if(row && type === 'jobs') {
            const job = getJob(e);
            if(type === 'jobs') renderJobDetails(job, elements.adminContent);
        }
    });

    // Table controls
    if(type === 'jobs') {
        document.querySelector('.create-job-btn')
        .addEventListener('click', (e) => {
            jobForm.renderJobForm(e, 'create')
        })
    } else if (type === 'users') {
        document.querySelector('.create-user-btn')
            .addEventListener('click', (e) => {
                userForm.renderUserForm(e, 'create')
            })
    }
}

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
            ${itemMarkup}
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