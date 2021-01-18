import { elements } from './base';
import { elementStrings } from "./base";

/**
 * Dynamically create menu options for each menu section from unique db entries
 * 
 * @param {Object}  content An object containing arrays of the unique entries in the db for use as menu items (eg: {uniqueTitles, uniqueSalaries, ...}) 
 */

export const populateMenu = (content) => {
    // Add menu items to the relevant menus
    const jobTitles = content.uniqueTitles;
    const jobLocations = content.uniqueLocations;
    // Render Job Titles
    jobTitles.forEach(title => renderItem(title, elements.jobsMenuJobTitles, "titles"));
    // Render Job Locations
    jobLocations.forEach(location => renderItem(location, elements.jobsMenuLocations, "locations"));
}

/**
 * 
 * Return the submenu that the selected checkbox belongs to
 * 
 * @param {Object} e The change event from clicking a checkbox  
 * @returns {string} The title of the submenu
 */
export const findSelectedSubmenu = e => {
    const titlesSubmenu = e.target.closest(elementStrings.titlesContent);
    const salariesSubmenu = e.target.closest(elementStrings.salariesContent);
    const locationsSubmenu = e.target.closest(elementStrings.locationsContent);
    const vacanciesSubmenu = e.target.closest(elementStrings.vacanciesContent);

    if(titlesSubmenu) return 'titles';
    if(salariesSubmenu) return 'salaries';
    if(locationsSubmenu) return 'locations';
    if(vacanciesSubmenu) return 'vacancies';

    throw new Error('Submenu not found');
}

/**
 * Add a unique menu item, to a specific submenu
 * @param {string} menuItem The menu item to be added.
 * @param {Object} htmlElement The menu section the item should be added to.
 * @param {string} menuType The type of item to be added (title/salary/location etc).
 */
export const renderItem = (menuItem, htmlElement, menuType) => {
    const random = Math.floor(Math.random() * 10) +1;
    const markup = `
         <div class="jobs-menu__input-wrapper">
             <input class="jobs-menu__${menuType}-checkbox jobs-menu__checkbox" type="checkbox" name="${menuType}" value="${menuItem}">
             <p class="jobs-menu__description">${menuItem}</p>
             <div class="jobs-menu__count">(${random})</div>

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
    // Set the itemContent class to 'jobs-menu__content--open'
    if(itemStyles.maxHeight === '0px') {
        itemContent.style.maxHeight = '100%';
        itemContent.style.opacity = 1;
        itemContent.classList.add('jobs-menu__content--open');
    } else {
        itemContent.style.maxHeight = '0px';
        itemContent.style.opacity = 0;
        itemContent.classList.remove('jobs-menu__content--open');
    }
};

/**
 *  Update the checkbox values in the submenu
 *  - If 'all' is checked, uncheck the rest
 *  - If the final remaining item is unchecked, check 'all'
 *  - If any item is checked, uncheck 'all' 
 *   
 *  @param {string} submenu The submenu that contains the checkbox
 *  @param {string} checkboxTitle The checkbox title ('all' etc)
 */ 
export const updateCheckboxes = (submenu, checkboxTitle) => {
    // Select the submenu's checkboxes (except 'all') 
    const checkboxArray = Array.from(document.querySelectorAll(elementStrings[`${submenu}Checkbox`]))
                                .filter((element) => !element.classList.contains(elementStrings[`${submenu}CheckboxAll`]))
    const checkboxAll = document.querySelector("."+elementStrings[`${submenu}CheckboxAll`]);
    // If 'all' is selected, uncheck the other options in the Submenu
    if (checkboxTitle === "all") {
        // Uncheck each element
        checkboxArray.forEach(checkbox => checkbox.checked = false);
    }  
    // If it's the last remaining checkbox, select 'all', else just uncheck 
    else if(isLastCheckbox(checkboxArray)) {
        checkboxAll.checked = true;
    } else {
    // Uncheck the 'all' option if any other checkbox is selected
        checkboxAll.checked = false;
    }
}

function isLastCheckbox(checkboxes) {
    let count = 0;
    checkboxes.forEach(checkbox => count = checkbox.checked? count+1:count);
    return count === 0;
}

