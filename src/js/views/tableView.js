import { gsap } from 'gsap';

const REM_TO_PX = 10;

/**
 * 
 * @param {*} title - String table title
 * @param {*} theads - Array of keys for the table
 * @param {*} rows - Array of objects to be displayed as rows
 * @param {*} displayIndex - boolean signifying if the index is displayed
 * @param {*} rowControls - Array of key:value pairs to be added as extra columns on a row
 */

export const createTable = (title, theads = [], rows, displayIndex = false, rowControls = []) => {
    let theadArr = [...theads, ...rowControls.map(ctrl => ctrl[0])];
       
    const markup = `
        <table class="table table--${title}">

            <thead class="thead thead--${title}">
                <tr>${theadArr.map((thead) => {
                    if(thead === 'id' && !displayIndex) return;
                    return `<th>${thead.toUpperCase()}</th>`;
                }).join('')} </tr>
            </thead>
            <tbody>
                ${
                    // For each row return the columns from the object and the columns from the row controls
                    rows.map((row) => {
                        // Array of column key:value pairs 
                        const cols = [...Object.entries(row), ...rowControls];
                        
                        return (
                                `<tr class="table-row table-row--${row.id}" data-id=${row.id}> 
                                    ${cols
                                        .map(([title, value], index) => {
                                            // skip the id col
                                            if(title === 'id' && !displayIndex) return; 
                                            return `<td class="td td--${title}">${value}</td>`
                                        }).join('')
                                    }
                                </tr>`
                            );
                    }).join('')
                }
            </tbody>
        </table>
    `;

    return markup;
};

// have to add the rowControls theads before passing
export const createTableTest = (title, theads, rows, displayIndex = false) => {
    const markup = `
        <table class="table table--${title}">
            <thead class="thead thead--${title}">
                <tr>
                    ${theads.map((thead) => {
                        if(thead === 'id' && !displayIndex) return;
                        return `<th class="th--${thead.toLowerCase()}">${thead}</th>`;
                    }).join('')} 
                </tr>
            </thead>
            ${rows.length > 0? 
                `<tbody class="tbody--${title}">
                    ${
                        rows.map(row => {
                            return `<tr class="row row--${title}">${row.map(col => {
                                return `${col}`
                            }).join('')}</tr>`
                        }).join('')

                    }
                </tbody>`: ''
            }
        </table>
    `;
    return markup;
};

export const updateTableContent = (title, rows) => {
    const markup = `
        <tbody class="tbody--${title}">
            ${
                rows.map(row => {
                    return `<tr class="row row--${title}">${row.map(col => {
                        return `${col}`
                    }).join('')}</tr>`
                }).join('')

            }
        </tbody>
    `;
    return markup;
}

export const createTableHeader = (page, title) => {
    const markup = `
        <div class="table__header table__header--${page}">${title}</div>
    `;
    return markup;
};


export const calculateRows = (tableName) => {
    // Sets whether the calculation should take the height of the header/pagination into account
    let header;
    let pagination;

    switch(tableName) {
        case 'applications':    
            header = true; pagination = false;
            break;
        case 'jobs':            
            header = true; pagination = false;
            break;
        case 'companies':       
            header = true; pagination = false;
            break;
        case 'users': 
            header = true; pagination = false;
            break;
        case 'company-jobs':
            header = true; pagination = false;
            break;
        case 'nested-user-jobs':
            header = true; pagination = true;
            break;
    }

    const tableContentHeight = document.querySelector(`.table__content--${tableName}`).offsetHeight;
    const headerHeight = header? parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--table-header-height')) * REM_TO_PX : 0;
    const paginationHeight = pagination? parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pagination-height')) * REM_TO_PX : 0;
    const rowHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--row-height')) * REM_TO_PX;

    const numOfRows = Math.floor((tableContentHeight - parseFloat(headerHeight) - parseFloat(paginationHeight)) / parseFloat(rowHeight));
    // console.log({tableContentHeight}, {headerHeight}, {paginationHeight}, {rowHeight}, {numOfRows});

    return numOfRows;
}

export const insertTableArrows = (tableName, state) => {
    let containers;
    let header;

    switch(tableName) {
        case 'applications': {
            const idTh = document.querySelector('.thead--applications .th--id');
            const nameTh = document.querySelector('.thead--applications .th--name');
            const surnameTh = document.querySelector('.thead--applications .th--surname');
            const positionTh = document.querySelector('.thead--applications .th--position');
            const companyTh = document.querySelector('.thead--applications .th--company');
            const cvTh = document.querySelector('.thead--applications .th--cv');
            const addedTh = document.querySelector('.thead--applications .th--added');
          
            containers = [
                ['id', idTh],
                ['name', nameTh],
                ['surname', surnameTh],
                ['position', positionTh],
                ['company', companyTh],
                ['cv', cvTh],
                ['added', addedTh]
            ];

            header = 
                state.searchOptions.orderField === 'id'? idTh :
                state.searchOptions.orderField === 'name'? nameTh :
                state.searchOptions.orderField === 'surname'? surnameTh :
                state.searchOptions.orderField === 'position'? positionTh :
                state.searchOptions.orderField === 'company'? companyTh :
                state.searchOptions.orderField === 'cv'? cvTh :
                state.searchOptions.orderField === 'added'? addedTh : null;
            console.log(containers);
            break;
        }
        case 'companies': {
            const idTh = document.querySelector('.thead--companies .th--id');
            const nameTh = document.querySelector('.thead--companies .th--name');
            const addedTh = document.querySelector('.thead--companies .th--added');
            
            containers = [
                ['id', idTh],
                ['name', nameTh],
                ['added', addedTh]
            ];

            header = 
                state.searchOptions.orderField === 'id'? idTh :
                state.searchOptions.orderField === 'name'? nameTh :
                state.searchOptions.orderField === 'added'? addedTh : null;
            
            break;
        }
        case 'jobs': {
            const idTh = document.querySelector('.thead--jobs .th--id');
            const companyTh = document.querySelector('.thead--jobs .th--company');
            const locationTh = document.querySelector('.thead--jobs .th--location');
            const featuredTh = document.querySelector('.thead--jobs .th--featured');
            const addedTh = document.querySelector('.thead--jobs .th--added');

            containers = [
                ['id', idTh],
                ['company', companyTh],
                ['location', locationTh],
                ['featured', featuredTh],
                ['added', addedTh]
            ];

            header = 
                state.searchOptions.orderField === 'id'? idTh :
                state.searchOptions.orderField === 'company'? companyTh :
                state.searchOptions.orderField === 'location'? locationTh :
                state.searchOptions.orderField === 'featured'? featuredTh :
                state.searchOptions.orderField === 'added'? addedTh : null;
            
            break;
        }
        case 'company-jobs': {
            containers = [
                ['id', document.querySelector('.thead--company-jobs .th--id')],
                ['name', document.querySelector('.thead--company-jobs .th--name')],
                ['added', document.querySelector('.thead--company-jobs .th--added')]
            ];
            break;
        }
    }
    containers.forEach(container => {
        container[1].insertAdjacentHTML('beforeend', `<div class="th__arrow th__arrow--${tableName} th__arrow--${tableName}-${container[0]}"><svg><use xlink:href="svg/spritesheet.svg#arrow-right"></svg></div>`)
    });

    const arrows = document.querySelectorAll(`.thead--${tableName} .th__arrow`);
    arrows.forEach(arrow => arrow.direction = 'none');

    changeArrowDirection(header, state);
}

export const updateTableOrder = (header, state, tableName) => {
    changeOrderField(header, state, tableName);
    changeArrowDirection(header, state);
    resetOtherArrows(state, tableName);
}

const changeOrderField = (header, state, tableName) => {
    // Remove any search term (will remove tags and highlighted row)
    state.searchOptions.searchTerm = '';

    switch(tableName) {
        case 'applications': {
            // Select the table headers
            const idTh = header.classList.contains('th--id');
            const nameTh = header.classList.contains('th--name');
            const surnameTh = header.classList.contains('th--surname');

            const addedTh = header.classList.contains('th--added');     

            // Set the orderField
            if(idTh) state.searchOptions.orderField = 'id';
            if(nameTh) state.searchOptions.orderField = 'name';
            if(surnameTh) state.searchOptions.orderField = 'surname';
            if(addedTh) state.searchOptions.orderField = 'createdAt';

            break;
        }
        case 'companies': {
            // Select the table headers
            const idTh = header.classList.contains('th--id');
            const nameTh = header.classList.contains('th--name');
            const addedTh = header.classList.contains('th--added');     

            // Set the orderField
            if(idTh) state.searchOptions.orderField = 'id';
            if(nameTh) state.searchOptions.orderField = 'name';
            if(addedTh) state.searchOptions.orderField = 'createdAt';

            break;
        }
        case 'jobs': {
            // Select the table headers
            const idTh = header.classList.contains('th--id');
            const companyTh = header.classList.contains('th--company');
            const locationTh = header.classList.contains('th--location');
            const featuredTh = header.classList.contains('th--featured');
            const addedTh = header.classList.contains('th--added');     

            // Set the orderField
            if(idTh) state.searchOptions.orderField = 'id';
            if(companyTh) state.searchOptions.orderField = 'company';
            if(locationTh) state.searchOptions.orderField = 'location';
            if(featuredTh) state.searchOptions.orderField = 'featured';
            if(addedTh) state.searchOptions.orderField = 'createdAt';

            break;
        }
    }
}

const changeArrowDirection = (header, state) => {
    const arrow = header.querySelector('.th__arrow');

    state.activeTableArrow = arrow;

    if(arrow.direction === 'none' || arrow.direction === 'up') {
        gsap.to(arrow, { rotation: 90 });
        arrow.direction = 'down';
        state.searchOptions.orderDirection = 'ASC';
    } else {
        gsap.to(arrow, {rotation: -90});
        arrow.direction = 'up';
        state.searchOptions.orderDirection = 'DESC';
    }
}

const resetOtherArrows = (state, tableName) => {
    const arrows = document.querySelectorAll(`.th__arrow--${tableName}`);

    //reset other arrows
    arrows.forEach(function(arrow, index){
        if (arrow != state.activeTableArrow){
            gsap.to(arrow, {rotation:0})
            arrow.direction = "none"
        }
    })
}

