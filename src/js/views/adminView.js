import { elements, elementStrings } from './base';

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