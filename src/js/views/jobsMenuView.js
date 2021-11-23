import { elements } from './base';
import { elementStrings } from "./base";

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

var tl;

export const animateMenu = () => {
    tl = gsap.timeline({defaults: {opacity: 0, ease: 'back'}});

    // tl.from(`.jobs-menu__title`, { opacity: 0, y: -80, stagger: { amount: .8 }, ease: 'ease-out', duration: .8});
    tl.from(`.jobs-menu__item`, { opacity: 0, y: 20, stagger: { amount: .6 }, ease: 'ease-out', duration: 1});

}

/**
 * Dynamically create menu options for each menu section from unique db entries
 * 
 * @param {Object} content An object containing arrays of the unique entries in the db for use as menu items (eg: {uniqueTitles, uniqueSalaries, ...}) 
 * @param {Object} params An object containing string params that may have been passed to the jobs page. Used to set the state of menu items
 */

export const populateMenu = (content, params) => {

    // Add menu items to the relevant menus
    const jobTitles = content.uniqueTitles;
    const jobLocations = content.uniqueLocations;
    const titleParam = params['titleParam'];
    const locationParam = params['locationParam'];

    // Render Job Titles
    jobTitles.forEach(({id, title}) => {
        const checked = title === titleParam;
        renderItem(id, title, elements.jobsMenuJobTitles, "titles", checked);
    });

    // Render Job Locations
    jobLocations.forEach(({id, location}) => {
        const checked = location === locationParam;
        renderItem(id, location, elements.jobsMenuLocations, "locations", checked);
    });
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
 * @param {boolean} checked Should the element be pre-checked
 */
export const renderItem = (id, menuItem, htmlElement, menuType, checked) => {
    // If there's a param then the 'all' checkbox isn't applicable
    if(checked && menuType === 'titles') document.querySelector(`.${elementStrings.titlesCheckboxAll}`).checked = false;
    if(checked && menuType === 'locations') document.querySelector(`.${elementStrings.locationsCheckboxAll}`).checked = false;

    const markup = `
         <div class="jobs-menu__input-wrapper">
             <input class="jobs-menu__${menuType}-checkbox jobs-menu__checkbox" type="checkbox" name="${menuType}" value="${menuItem}" ${checked? 'checked': ''} data-id=${id}>
             <p class="jobs-menu__description">${menuItem}</p>
         </div>
    `;

    htmlElement.insertAdjacentHTML('beforeend', markup);
    
};

// @TODO: delete?
// export const toggleMenu = (e) => {
//     const item = e.target.closest('.jobs-menu__title');
//     // If the element clicked isn't a menu title, return
//     if(!item) return;
//     // Else get the adjacent sibling (the associated content div) & its styles
//     const itemContent = item.nextElementSibling;
//     const itemStyles = window.getComputedStyle(itemContent);
//     const itemIcon = item.querySelector('.jobs-menu__title-icon');

//     // If the max-height is 0, set it to be 100%, and vice versa
//     // Set the itemContent class to 'jobs-menu__content--open'
//     if(itemStyles.maxHeight === '0px') {
//         itemContent.style.maxHeight = '100%';
//         itemContent.style.opacity = 1;
//         itemContent.classList.add('jobs-menu__content--open');
//         // Set item class active
//         item.classList.add('jobs-menu__title--active');
//         itemIcon.classList.add('jobs-menu__title-icon--active');
//     } else {
//         itemContent.style.maxHeight = '0px';
//         itemContent.style.opacity = 0;
//         itemContent.classList.remove('jobs-menu__content--open');
//         item.classList.remove('jobs-menu__title--active');
//         itemIcon.classList.remove('jobs-menu__title-icon--active');

//     }
// };

export const addMenuAnimation = (itemContent) => {
    // *** MENU CONTENT ANIMATION ***
    const contentHeight = itemContent.getBoundingClientRect().height;

    // In mobile / smaller views, the item wrapper's height is animated, rather than the content div being moved down
    const contentWrapper = itemContent.parentElement;

    // Animation for each item
    let animation; 

    // ScrollTrigger can be used for animation media queries outside of any scrolling
    ScrollTrigger.matchMedia({
        "(max-width: 650px)": () => {
            ScrollTrigger.saveStyles(contentWrapper);

            animation = gsap.timeline({ 
                paused: true, 
                onComplete: () => window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                }) 
            });
            animation.fromTo(contentWrapper, {pointerEvents: 'none', height: 0, duration: .4, ease: 'ease-in'}, {pointerEvents: 'none', height: contentHeight});
        
            // Assign the animation to the element
            itemContent.animation = animation;
        }, 
        "(min-width: 651px)": () => {
            ScrollTrigger.saveStyles(itemContent);

            animation = gsap.timeline({ paused: true });
            animation.fromTo(
                itemContent, 
                {pointerEvents: 'none', opacity: 0, y: -contentHeight, duration: .4, ease: 'ease-in'},
                {pointerEvents: 'auto', opacity: 1, y: 0}
            );

            // Assign the animation to the element
            itemContent.animation = animation;
        }, 
      });
      



    // *** ARROW ANIMATION ***
    const itemArrow = itemContent.parentElement.parentElement.querySelector('.jobs-menu__title-icon');
    const arrowAnimation = gsap.timeline({paused: true});
    arrowAnimation.to(itemArrow, { rotation: '90', duration: .2 });

    itemArrow.animation = arrowAnimation;
}

export const setMenuActive = (itemContent, setTrue) => {
    const itemWrapper = itemContent.parentElement.parentElement;
    // const item = itemWrapper.querySelector('.jobs-menu__item');
    const itemTitle = itemWrapper.querySelector('.jobs-menu__title');
    
    if(setTrue) {
        itemWrapper.classList.add('jobs-menu__item-wrapper--active');
        itemTitle.classList.add('jobs-menu__title--active');
    } else {
        itemWrapper.classList.remove('jobs-menu__item-wrapper--active');
        itemTitle.classList.remove('jobs-menu__title--active');
    }
}

let tagListAnimation;
export const initialiseTagsListAnimation = () => {
    const tl = gsap.timeline({ paused: true, defaults: { duration: .8 } });
    tl.to('.tags-wrapper', { minHeight: '30px', height: 'auto' });
    tagListAnimation = tl;
}
export const openTagsList = () => {
    tagListAnimation.play();
}
export const closeTagsList = (cb) => {
    tagListAnimation.eventCallback("onReverseComplete", cb);
    tagListAnimation.reverse();
}

// export const initMenuItemAnimations = (e) => {
//     const items = gsap.utils.toArray('.jobs-menu__item');

//     items.forEach(item => {
//         const itemContent = item.querySelector('.jobs-menu__content');

//         // Animation for each item
//         let animation = gsap.timeline({
//             paused:true, 
//             onComplete: () => console.log('complete')
//         });
//         animation.to(itemContent, {opacity: '1', duration: .2, ease: 'ease-in' });
//         // Assign the animation to the element
//         itemContent.animation = animation;
//     });
// } 

// export const toggleMenuAnimated = (e) => {
//     tl = gsap.timeline({defaults: { ease: 'ease-out'}});

//     const item = e.target.closest('.jobs-menu__title');
//     // If the element clicked isn't a menu title, return
//     if(!item) return;
//     // Else get the adjacent sibling (the associated content div) & its styles
//     const itemContent = item.nextElementSibling;
//     const itemStyles = window.getComputedStyle(itemContent);
//     const itemIcon = item.querySelector('.jobs-menu__title-icon');

//     if(itemStyles.visibility === 'hidden') {
//         console.log(itemStyles.height);
//         tl.to(itemContent, {visibility: "visible", opacity: '1',   duration: .4, ease: 'ease-in'})
//         item.classList.add('jobs-menu__title--active');
//         itemIcon.classList.add('jobs-menu__title-icon--active');
//     } else {
//         tl.to(itemContent, {visibility: "hidden", opacity: '0',  duration: .4, ease: 'ease-out'});
//         console.log(itemStyles.height);
//         item.classList.remove('jobs-menu__title--active');
//         itemIcon.classList.remove('jobs-menu__title-icon--active');
//     }
// }

/**
 *  Update the checkbox values in the submenu
 *  - If 'all' is checked, uncheck the rest
 *  - If the final remaining item is unchecked, check 'all'
 *  - If any item is checked, uncheck 'all' 
 *   
 *  @param {string} submenu The submenu that contains the checkbox
 *  @param {string} checkboxTitle The checkbox title ('all' etc)
 */ 
export const handleCheckboxLogic = (submenu, checkboxTitle) => {
    console.log(submenu, checkboxTitle);
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
        console.log('last');
        checkboxAll.checked = true;
    } else {
    // Uncheck the 'all' option if any other checkbox is selected
        checkboxAll.checked = false;
        console.log('Uncheck All option');
    }
}

function isLastCheckbox(checkboxes) {
    let count = 0;
    checkboxes.forEach(checkbox => count = checkbox.checked? count+1:count);
    return count === 0;
}

