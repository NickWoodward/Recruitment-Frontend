import { elements, elementStrings } from './base';
import * as utils from '../utils/utils';
import * as userForm from './userForm';

export const renderContent = (content, container) => {
    container.insertAdjacentHTML('afterbegin', content);
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

export const addUserTableListeners = (e) => {
    const deleteUserButtons = document.querySelectorAll(elementStrings.deleteUsersBtn);
    const editUserButtons = document.querySelectorAll(elementStrings.editUsersBtn);

    deleteUserButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const user = getUser(e);
            if(user)
                displayModal('delete', user);
        });
    });

    editUserButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const user = getUser(e);
            if(user)
                userForm.renderUserForm(e, 'edit', user);
        });
    });
}

export const getAction = (e) => {
    const confirm = e.target.closest(`.delete-btn--warn`);
    const cancel = e.target.closest('.cancel-btn--warn') || !e.target.closest('.modal__content');

    if(confirm) return 'delete';
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

// @TODO: move to modal module
const displayModal = (type, user) => {
    // Create modal and insert into DOM
    const warningModal = utils.warn(
        `Are you sure you want to ${type} ${user.fName} ${user.lName} (id: ${user.id})?`,
        [`${type}`, 'cancel'],
        user.id
    );
    document.body.insertAdjacentHTML('afterbegin', warningModal);
};
 