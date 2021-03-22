import { elements, elementStrings } from './base';
import * as utils from '../utils/utils';

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

export const addTableListeners = (e, deleteUser, editUser) => {
    // const jobsTable = e.target.closest('.table--jobs');
    const usersTable = e.target.closest('.table--users');

    const deleteUserButtons = document.querySelectorAll(elementStrings.deleteUsersBtn);

    deleteUserButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Create delete modal
            const warningModal = utils.warn(
                'Are you sure you want to delete this user?',
                ['delete', 'cancel']
            );
            // Insert the delete modal
            document.body.insertAdjacentHTML('afterbegin', warningModal);
    
            // Select and add listeners 
            const modal = document.querySelector('.modal--warn');
            
            modal.addEventListener('click', (e) => {
                const confirmDelete = e.target.closest('.delete-btn--warn');
                const cancel = e.target.closest('.cancel-btn--warn') || !e.target.closest('.modal__content');
    
                if(confirmDelete) deleteUser();
                if(cancel) utils.removeElement(modal);
            });
        });
    })
    
    // document.querySelector(elementStrings.editUsersBtn).addEventListener('click', cb2);
}