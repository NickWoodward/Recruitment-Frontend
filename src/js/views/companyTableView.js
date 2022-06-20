import * as tableView from './tableView';
import * as utils from '../utils/utils';


export const createCompanyTable = (companies) => {
    const {rows, headers} = formatCompanies(companies);
    const companyTable = tableView.createTableTest('companies', headers, rows, false);

    const markup = `
        <div class="table-wrapper table-wrapper--companies">
            <div class="table__header table__header--companies">Companies</div>
            <div class="table__content table__content--companies">
                ${companyTable}
            </div>
        </div>
    `;
    return markup;
}


/////// TEST ///////
// Move these, probably to the main table module


function formatProperties(object, skip) {
    for(const key in object) {
        const value = object[key];
        if(!skip.includes(key)) object[key] = utils.capitalise(value);
    }
    return object;
};

function formatCompanies(companies) {
    // Headers should match the returned divs in createCompanyElement
    const headers = ['ID', 'Name', 'Added'];
    const rows = companies.map(company => {
        return createCompanyElement(formatProperties(company, ['companyId', 'companyDate']));
    });
    return { headers, rows };
};

function createCompanyElement({ id, companyName, companyDate })  {
    const row = [
        `<td class="td-data--company-id">${id}</td>`,
        `<td class="td-data--company-name" data-id=${id}>${companyName}</td>`,
        `<td class="td-data--date" data-id=${id}>${companyDate}</td>`
    ];
    return row;
}