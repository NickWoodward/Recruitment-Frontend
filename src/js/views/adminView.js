import { elements, elementStrings } from './base';
import * as utils from '../utils/utils';
import * as userForm from './userForm';
import * as jobForm from './jobForm';
import { renderJobDetails } from './jobView';


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
export const createUserSummary = () => {
    const markup = `
        <div class="user-summary">
            <div class="user-summary__details">
                <div class="user-summary__name user-summary__item"></div>
                <div class="user-summary__phone user-summary__item"></div>
                <div class="user-summary__email user-summary__item"></div>
            </div>
            <div class="user-summary__controls">
                
                <div class="user-summary__btn user-summary__btn--edit">
                    <svg class="user-summary__edit-icon">
                        <use xlink:href="svg/spritesheet.svg#edit-solid">
                    </svg>
                </div>
                <div class="user-summary__btn user-summary__btn--delete">
                    <svg class="user-summary__delete-icon">
                        <use xlink:href="svg/spritesheet.svg#delete-solid">
                    </svg>
                </div>
                <div class="user-summary__btn user-summary__btn--hubspot">
                    <svg class="user-summary__hubspot-icon">
                        <use xlink:href="svg/spritesheet.svg#hubspot">
                    </svg>
                </div>
                
            </div>
        </div>
    `;
    return markup;
};
export const populateUserSummary = (user) => {
    document.querySelector('.user-summary__name').innerText = `${user.firstName} ${user.lastName}`;
    document.querySelector('.user-summary__phone').innerText = user.phone;
    document.querySelector('.user-summary__email').innerText = user.email;
    const cvBtn = document.querySelector('.user-summary__btn--cv') || document.querySelector('.user-summary__btn--upload');
    const cvType = user.cvType;
    if(cvBtn) utils.removeElement(cvBtn);
    const cvElement = `
        <div class="user-summary__btn--${cvType === null ? 'upload':'cv'}" data-id=${user.applicantId}>
            <svg class="user-summary__cv-icon">
                <use xlink:href="svg/spritesheet.svg#${cvType === '.pdf'? 'pdf':(cvType === '.doc' || cvType === '.docx'? 'doc':'upload')}">
            </svg>
        </div>
    `;

    document.querySelector('.user-summary__controls').insertAdjacentHTML('afterbegin', cvElement);
}

export const formatJobs = (jobs) => {
    // Headers should match the returned divs in createJobsElement
    const headers = ['COMPANY','TITLE','LOCATION'];
    const rows = jobs.map(job => {
        return createJobElement(job);
    });
    return { headers, rows };
};
const createJobElement = (job) => {
    const row = [
        `<div class="td-data--company">Company</div>`,
        `<div class="td-data--title">${job.title}</div>`,
        `<div class="td-data--location">${job.location}</div>`
    ];
    return row;
}; 

export const changeActiveMenuItem = (e) => {
    // Items contain the highlight, the links contain the fill and color for the text/icon
    const items = [ elements.adminMenuJobsItem, elements.adminMenuUsersItem, elements.adminMenuApplicationsItem, elements.adminMenuCompaniesItem, elements.adminMenuSettingsItem ];

    const newActiveItem = e.target.closest(elementStrings.adminMenuItem);
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
 

export const renderPagination = (current, limit, totalItems, container) => {
    // Work out how many pages
    const pages = Math.ceil(totalItems / limit);
    // Current is the first (zero indexed) item on the page. current/limit = zero index page number
    current = current/limit;
    const itemMarkup = generatePaginationMarkup(pages, current);
    
    const markup = `
        <div class="pagination">
            <div class="pagination__previous ${current === 0? 'pagination__previous--inactive':''}">Previous</div>
            ${itemMarkup}
            <div class="pagination__next ${current === pages-1? 'pagination__next--inactive':''}">Next</div>
        </div>
    `;
    container.insertAdjacentHTML('afterbegin', markup);
};

const generatePaginationMarkup = (pages, current) => {
    let markup = '';
    for(let x = 0; x < pages; x++) {
        const temp = `
            <div class="pagination__item pagination__item--${x+1} ${x === current? 'pagination__item--active':''}" data-id=${x}>
                ${x+1}
            </div>`;
        markup += temp;
    }
    return markup;
};