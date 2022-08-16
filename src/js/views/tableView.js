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

export const insertTableArrows = (tableName) => {
    let containers;
    switch(tableName) {
        case 'companies': {
            containers = [
                ['id', document.querySelector('.thead--companies .th--id')],
                ['name', document.querySelector('.thead--companies .th--name')],
                ['added', document.querySelector('.thead--companies .th--added')]
            ]
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
}

export const addTableArrowAnimations = (tableName, order) => {
    // Put an animation on each arrow so they can individually be reversed when another is clicked
    switch(tableName) {
        case 'companies': {
            // Select all the table arrows
            const arrows = document.querySelectorAll('.th__arrow--companies');
            arrows.forEach(arrow => {
                const tl = gsap.timeline({ paused: true });
                tl.to(arrow, { rotation: '90', duration: .2 });

                arrow.animation = tl;
            });
            break;
        }
    }
}