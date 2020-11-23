import { elements } from './base';

/**
 * Dynamically create menu options for each menu section from unique db entries
 * 
 * @param {Object}  content An object containing arrays of the unique entries in the db for use as menu items (eg: {uniqueTitles, uniqueSalaries, ...}) 
 */

export const initialise = (content) => {
    // Add menu items to the relevant menus
    const jobTitles = content.uniqueTitles;
    const jobLocations = content.uniqueLocations;
    // Render Job Titles
    jobTitles.forEach(title => renderItem(title, elements.jobsMenuJobTitles, "jobTitles"));
    // Render Job Locations
    jobLocations.forEach(location => renderItem(location, elements.jobsMenuLocations));
}

/**
 * Add a unique menu item (data), to a specific submenu (element)
 * @param {string} menuItem The menu item to be added.
 * @param {Object} htmlElement The menu section the item should be added to.
 * @param {string} menuType The type of item to be added (title/salary/location etc).
 */
export const renderItem = (menuItem, htmlElement, menuType) => {
    const markup = `
         <div class="jobs-menu__input-wrapper">
             <p>${menuItem}</p><input class="jobs-menu__radio-btn" type="radio" name="${menuType}" value="${menuItem}">
         </div>
    `;
  
    htmlElement.insertAdjacentHTML('beforeend', markup);
};

export const toggleMenu = (e) => {
    const item = e.target.closest('.jobs-menu__title');
    // If the element clicked isn't a menu title, return

    if(!item) return;
    // Else get the adjacent sibling (the associated content div) & its styles
    const itemContent = item.nextElementSibling;
    const itemStyles = window.getComputedStyle(itemContent);

    // If the max-height is 0, set it to be 100%, and vice versa
    console.log(itemStyles.maxHeight);
    if(itemStyles.maxHeight === '0px') {
        itemContent.style.maxHeight = '100%';
        itemContent.style.opacity = 1;
    } else {
        itemContent.style.maxHeight = '0px';
        itemContent.style.opacity = 0;
    }
};

