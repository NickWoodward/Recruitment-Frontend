import gsap from 'gsap';

export const calculatePagination = (index, limit, totalItems) => {
    // console.log({index}, {limit}, {totalItems});
    // Work out how many pages
    const pages = Math.ceil(totalItems / limit);
    // Current is the first (zero indexed) item on the page. index/limit = zero index page number
    index = index/limit;

    return { pages, index };
}

export const renderPagination = (pages, current, tableName) => {
    // console.log(pages, current, tableName)
    const paginationWrapper = document.querySelector(`.pagination-wrapper--${tableName}`);
    // Remove pagination if present
    const paginationContent = document.querySelector(`.pagination__content--${tableName}`);
    if(paginationContent) paginationContent.parentElement.removeChild(paginationContent);  
    // Generate the individual pagination numbers
    const itemMarkup = generatePaginationMarkup(pages, current, tableName);

    const markup = `
        <div class="pagination__content pagination__content--${tableName}">
            <div class="pagination__previous pagination__previous--${tableName} ${current === 0? 'pagination__previous--inactive':''}">Previous</div>
            <div class="pagination__item-wrapper">${itemMarkup}</div>
            <div class="pagination__next pagination__next--${tableName} ${current === pages-1 || pages === 0? 'pagination__next--inactive':''}">Next</div>
        </div>
    `;
    paginationWrapper.insertAdjacentHTML('beforeend', markup);
}

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

export const updatePaginationView = (index) => {
    // Get the pagination items
    const items = document.querySelectorAll('.pagination__item');

    items.forEach(item => {
        if(item.classList.contains('pagination__item--active')) {
            item.classList.remove('pagination__item--active');
        }
    })

    items[index].classList.add('pagination__item--active');

    if(index === 0) {
        document.querySelector('.pagination__previous').classList.add('pagination__previous--inactive');
    }  else {
        document.querySelector('.pagination__previous').classList.remove('pagination__previous--inactive');
    }
    if(index === items.length -1) {
        document.querySelector('.pagination__next').classList.add('pagination__next--inactive');
    } else {
        document.querySelector('.pagination__next').classList.remove('pagination__next--inactive');
    }
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