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

export const changeActiveMenuItem = (e) => {
    // Items contain the highlight, the links contain the fill and color for the text/icon
    const items = [ elements.adminMenuJobsItem, elements.adminMenuUsersItem ];

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

    // Row links
    const table = document.querySelector('.table');
    if(table) table.addEventListener('click', (e) => {
        // If a row was clicked but not the edit or delete buttons
        const row = e.target.closest('.table-row') && (!e.target.closest('.td--edit') && !e.target.closest('.td--delete'));
        if(row) {
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
    // @TODO: This logic doesn't work
    const cancel = e.target.closest('.cancel-btn--warn') || !e.target.closest('.modal__content');

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
 

export const renderPagination = (current, limit, totalItems, container) => {
    // Work out how many pages
    const pages = Math.ceil(totalItems / limit);

    const itemMarkup = generatePaginationMarkup(pages, current);
    
    const markup = `
        <div class="pagination">
            <div class="pagination__previous ${current === 1? 'pagination__previous--inactive':''}">Previous</div>
            ${itemMarkup}
            <div class="pagination__next ${current === pages? 'pagination__next--inactive':''}">Next</div>
        </div>
    `;
    container.insertAdjacentHTML('afterbegin', markup);
};

const generatePaginationMarkup = (pages, current) => {
    let markup = '';
    for(let x = 0; x < pages; x++) {
        const temp = `
            <div class="pagination__item pagination__item--${x+1} ${x+1 === current? 'pagination__item--active':''}" data-id=${x+1}>
                ${x+1}
            </div>`;
        markup += temp;
    }
    return markup;
};