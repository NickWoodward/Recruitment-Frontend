import gsap from 'gsap';
import Select from './customSelect';
import { getPaginationSelectAnimations } from '../animations/adminAnimation';


export const getTotalPages = (limit = 1, totalItems = 1) => {
    limit === 0? 1 : limit;
    totalItems = totalItems === 0? 1 : totalItems;
    return Math.ceil(totalItems / limit);
}
export const getCurrentPage = (index = 0, limit = 1) => {
    limit === 0? 1 : limit;
    return index/limit + 1;
}

export const onLastPage = (index, limit, total) => {
    const page = getCurrentPage(index, limit);
    const totalPages = getTotalPages(limit, total);
    return page === totalPages;
}

export const initPagination = (totalPages, currentPage, tableName) => {
    // Remove pagination if present
    removePagination(tableName);

    // Create a new pagination select
    const paginationSelect = createPaginationSelect(totalPages, tableName);

    // Create a new pagination element
    const paginationElement = createPaginationElement(totalPages, currentPage, paginationSelect, tableName);

    // Append to the relevant pagination wrapper 
    const paginationWrapper = document.querySelector(`.pagination-wrapper--${tableName}`);
    paginationWrapper.append(paginationElement);

    // Replace pagination selects with custom selects
    replaceSelects(totalPages, tableName);

    // If currentPage is !== 1, change the select
    if(currentPage !== 1){
        changePaginationSelect(currentPage, tableName)
    }
}

const removePagination = (tableName) => {
    const paginationContent = document.querySelector(`.pagination__content--${tableName}`);
    if(paginationContent) paginationContent.parentElement.removeChild(paginationContent);  
}

// export const calculatePagination = (index, limit, totalItems) => {
//     console.log({index}, {limit}, {totalItems});
//     // Work out how many pages (if there are no items default to 1)
//     const pages = totalItems === 0? 1 : Math.ceil(totalItems / limit);
//     // index/limit = page number
//     const page = index/limit +1;
//     console.log('new page:', {page}, 'pages: ', {pages});

//     return { pages, page};
// }

// export const initPagination = (pages, current, tableName) => {
// console.log('INIT PAGINATION', {pages}, {current});
//     const paginationWrapper = document.querySelector(`.pagination-wrapper--${tableName}`);
//     // Remove pagination if present
//     const paginationContent = document.querySelector(`.pagination__content--${tableName}`);
//     if(paginationContent) paginationContent.parentElement.removeChild(paginationContent);  
//     // Generate the individual pagination numbers
//     const paginationSelect = createPaginationSelect(pages, current, tableName);


//     const newPaginationContent = document.createElement('div');
//     const previousBtn = document.createElement('div');
//     const nextBtn = document.createElement('div');
//     const next = document.createTextNode('Next');
//     const previous = document.createTextNode('Previous');

//     newPaginationContent.setAttribute('class', `pagination__content pagination__content--${tableName}`);
//     previousBtn.setAttribute('class', `pagination__previous pagination__previous--${tableName} ${current === 1? 'pagination__previous--inactive':''}`);
//     nextBtn.setAttribute('class', `pagination__next pagination__next--${tableName} ${current === pages || pages === 1? 'pagination__next--inactive':''}`);

//     previousBtn.appendChild(previous);
//     nextBtn.appendChild(next);

//     newPaginationContent.append(previousBtn, paginationSelect, nextBtn);

//     paginationWrapper.append(newPaginationContent);

//     // Replace the selects with custom selects
//     const select = paginationWrapper.querySelector('select');
//     const selectClassNames = [tableName];
//     if(pages === 1) selectClassNames.push(`${tableName}-disabled`);
//     const animations = getPaginationSelectAnimations();
//     const CustomSelect = new Select({select, modifiers: selectClassNames, selectIcon:false, animations});

//     switch(tableName) {
//         case 'companies': {
//             CustomSelect.addCustomSelectListeners(tableName);
//             break;
//         }
//         case 'company-jobs': {
//             CustomSelect.addCustomSelectListeners(tableName);
//             break;
//         }
//         case 'company-addresses' : {
//             CustomSelect.addCustomSelectListeners(tableName);
//             break;
//         }
//         case 'company-contacts': {
//             CustomSelect.addCustomSelectListeners(tableName);
//             break;
//         }
//         case 'jobs': {
//             CustomSelect.addCustomSelectListeners(tableName);
//             break;
//         }
//     }

// }

// Changing pagingation distinct from initialising
// Latter used for rerendering the elements when new pages have been added, the former for
// simply changing values/visibility
export const changePagination = (index, limit, totalItems, tableName) => {
    const pages = getTotalPages(limit, totalItems);
    const page = getCurrentPage(index, limit);

    changePaginationBtns(pages, page, tableName);
    changePaginationSelect(page, tableName);
}

const changePaginationBtns = (pages, current, tableName) => {
    const previousBtn = document.querySelector(`.pagination__previous--${tableName}`);
    const nextBtn = document.querySelector(`.pagination__next--${tableName}`);

    previousBtn.setAttribute('class', `pagination__previous pagination__previous--${tableName} ${current === 1? 'pagination__previous--inactive':''}`);
    nextBtn.setAttribute('class', `pagination__next pagination__next--${tableName} ${current === pages || pages === 1? 'pagination__next--inactive':''}`);
}

const changePaginationSelect = (page, tableName) => {
    const customSelect = document.querySelector(`.custom-select-container--${tableName}`);
    // Format the table name to match the event name the select expects (js camelcase vs hypenated class names)
    switch(tableName) {
        case 'applications':
        case 'companies':
        case 'jobs':
        case 'users':
            break;
        case 'company-contacts': tableName = 'companyContacts'; break;
        case 'company-jobs': tableName = 'companyJobs'; break;
        case 'company-addresses': tableName = 'companyAddresses'; break;
    }
    const moveEvent = new CustomEvent(`${tableName}Change`, { detail: { page } });
    customSelect.dispatchEvent(moveEvent, { bubbles: true });
}

const createPaginationElement = (pages, current, paginationSelect, tableName) => {
    const newPaginationElement = document.createElement('div');
    const previousBtn = document.createElement('div');
    const nextBtn = document.createElement('div');
    const next = document.createTextNode('Next');
    const previous = document.createTextNode('Previous');

    newPaginationElement.setAttribute('class', `pagination__content pagination__content--${tableName}`);
    previousBtn.setAttribute('class', `pagination__previous pagination__previous--${tableName} ${current === 1? 'pagination__previous--inactive':''}`);
    nextBtn.setAttribute('class', `pagination__next pagination__next--${tableName} ${current === pages || pages === 1? 'pagination__next--inactive':''}`);

    previousBtn.appendChild(previous);
    nextBtn.appendChild(next);

    newPaginationElement.append(previousBtn, paginationSelect, nextBtn);

    return newPaginationElement;
}

const createPaginationSelect = (pages, table) => {
    const input = document.createElement('select');
    input.setAttribute('class', `pagination__item pagination__item--${table}`);
    for(let x = 0; x < pages; x++) {
        const option = new Option(x+1, x+1);
        option.className = `pagination__option pagination__option--${table}`;
        
        input.append(option);
    }
    return input;
};

const replaceSelects = (pages, tableName) => {
    const paginationWrapper = document.querySelector(`.pagination-wrapper--${tableName}`);
    const select = paginationWrapper.querySelector('select');
    const selectClassNames = [tableName];
    if(pages === 1) selectClassNames.push(`${tableName}-disabled`);

    const animations = getPaginationSelectAnimations();
    const CustomSelect = new Select({select, modifiers: selectClassNames, selectIcon:false, animations});

    CustomSelect.addCustomSelectListeners(tableName);

    // switch(tableName) {
    //     case 'companies': {
    //         CustomSelect.addCustomSelectListeners(tableName);
    //         break;
    //     }
    //     case 'company-jobs': {
    //         CustomSelect.addCustomSelectListeners(tableName);
    //         break;
    //     }
    //     case 'company-addresses' : {
    //         CustomSelect.addCustomSelectListeners(tableName);
    //         break;
    //     }
    //     case 'company-contacts': {
    //         CustomSelect.addCustomSelectListeners(tableName);
    //         break;
    //     }
    //     case 'jobs': {
    //         CustomSelect.addCustomSelectListeners(tableName);
    //         break;
    //     }
    //     case 'applications': {
    //         CustomSelect.addCustomSelectListeners(tableName);
    //         break;
    //     }
    // }
}


export const animatePaginationContentIn = (table) => {
    return (
        gsap.timeline()
            .fromTo(`.pagination__content--${table}`, {autoAlpha: 0},{autoAlpha: 1, duration: .3}, '<')
            .fromTo(`.pagination__item--${table}`, {autoAlpha: 0},{autoAlpha: 1, stagger: .3}, '<')
            .fromTo(`.pagination__previous--${table}`, {autoAlpha: 0, x:-20},{autoAlpha:1, x:0}, '<')
            .fromTo(`.pagination__next--${table}`, {autoAlpha: 0, x:20},{autoAlpha:1, x:0}, '<')
    )
}