/**
 * 
 * @param {*} title - 
 * @param {*} theads 
 * @param {*} rows 
 * @param {*} container 
 */

export const createTable = (title, theads, rows, container) => {
    const markup = `
        <table class="table table--${title}">
        <caption class="table">${title}</caption>

            <thead class="thead--${title}">
                <tr>${theads.map((thead) => `<th>${thead}</th>`).join('')} </tr>
            </thead>
            <tbody>
                ${rows.map((row) => {
                    return `<tr> ${Object.values(row).map((col) => `<td>${col}</td>`).join('')} </tr>`;
                }).join('')}
            </tbody>
        </table>
    `;

    return markup;
};
