import { gsap } from 'gsap';

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

export const insertTableArrows = (tableName, state) => {
    let containers;
    let header;

    switch(tableName) {
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
        container[1].insertAdjacentHTML('beforeend', `<div class="th__arrow th__arrow--companies th__arrow--companies-${container[0]}"><svg><use xlink:href="svg/spritesheet.svg#arrow-right"></svg></div>`)
    });

    // Add Table Arrow animations
    addTableArrowAnimations(tableName);

    // Set the active arrow
    setSelectedArrow(header, state);
}

export const addTableArrowAnimations = (tableName) => {
    // Put an animation on each arrow so they can individually be reversed when another is clicked
    switch(tableName) {
        case 'companies': {
            // Select all the table arrows
            const arrows = document.querySelectorAll('.th__arrow--companies');
            arrows.forEach(arrow => {
                const tlDown = gsap.timeline({ paused: true });
                const tlUp = gsap.timeline({ paused: true });
                const tl180 = gsap.timeline({ paused: true });

                tlDown.add(gsap.to(arrow, { rotation: '90', duration: .2, onStart: ()=> console.log('down') }));
                tlUp.add(gsap.to(arrow, { rotation: '-90', duration: .2, onStart: ()=> console.log('up') }));
                tl180.add(gsap.fromTo(arrow, { rotation: '-90' }, { rotation: '90', duration: .4, immediateRender: false, onReverseComplete: ()=> console.log('up')  }));

                arrow.animationDown = tlDown;
                arrow.animationUp = tlUp;
                arrow.animation180 = tl180;
            });
            break;
        }
    }
}

export const changeArrow = (e, state, tableName) => {
    // Remove any search term (will remove tags and highlighted row)
    state.searchOptions.searchTerm = '';

    let header;

    switch(tableName) {
        case 'companies': {
            // Select the table headers
            const idTh = e.target.closest('.th--id');
            const nameTh = e.target.closest('.th--name');
            const addedTh = e.target.closest('.th--added');     

            header = idTh || nameTh || addedTh;
            // const orderField = idTh? 'id': nameTh? 'name' : addedTh? 'added' : '';
            // setTableFieldOrder(state, orderField, tableName);
            
            // Set the orderField
            if(idTh) state.searchOptions.orderField = 'id';
            if(nameTh) state.searchOptions.orderField = 'name';
            if(addedTh) state.searchOptions.orderField = 'createdAt';
        }
    }

    setSelectedArrow(header, state);
}

export const setSelectedArrow = (header, state) => {
    if(!header) {return};
    console.log('ORDER', state.searchOptions.orderDirection);
    const selectedArrow = header.querySelector('.th__arrow');

    // If an active arrow exists, and *is the current row*, animate 180, set the orderDirection (Then return)
    if(!!state.activeTableArrow && state.activeTableArrow === selectedArrow) {
        // ASC means arrow already down
        if(state.searchOptions.orderDirection === 'ASC') {
            console.log('Reverse 180, from down to up', 'progress', state.activeTableArrow.animation180.progress());
            state.activeTableArrow.animation180.reverse(0);
            state.searchOptions.orderDirection = 'DESC';
        } else {
            console.log('Play 180, from up to down');
            state.activeTableArrow.animation180.play(0);
            state.searchOptions.orderDirection = 'ASC';
        }

        return;
    }

    // If an active arrow exists, and it isn't the current active arrow, reverse its animation
    if(!!state.activeTableArrow && state.activeTableArrow !== selectedArrow) {
        // If the current order is 'ASC' (A-Z or 1-9)
        // It means the arrow is pointing down, so reverse that
        if(state.searchOptions.orderDirection === 'ASC') {
            console.log('Arrow exists. Reverse down animation.', 'Search direction', state.searchOptions.orderDirection)
            state.activeTableArrow.animationDown.reverse()
        } else {
            console.log('Arrow exists. Reverse up animation', 'Search direction', state.searchOptions.orderDirection)
            state.activeTableArrow.animationUp.reverse()
        }
    }
    // Even if an active arrow doesn't yet exist, set the selected arrow to the active arrow and animate down
    if(state.activeTableArrow !== selectedArrow) {
        console.log('New arrow animation')
        state.activeTableArrow = selectedArrow;

        state.activeTableArrow.animationDown.play(0);
    }
    // If it *is* the same arrow, change the orderDirection
}

// export const setTableFieldOrder = (state, orderField, tableName) => {
//     switch(tableName) {
//         case 'companies': {
//             // Set the orderField
//             if(orderField === 'id') state.searchOptions.orderField = 'id';
//             if(orderField === 'name') state.searchOptions.orderField = 'name';
//             if(orderField === 'added') state.searchOptions.orderField = 'createdAt';
//         }
//     }
// }