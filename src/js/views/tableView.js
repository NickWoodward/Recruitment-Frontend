
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
            <tbody>
                ${
                    rows.map(row => {
                        return `<tr class="row row--${title}">${row.map(col => {
                            return `${col}`
                        }).join('')}</tr>`
                    }).join('')

                }
            </tbody>
        </table>
    `;
    return markup;
};

export const updateTableContent = (title, rows) => {
    const markup = `
        <tbody>
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