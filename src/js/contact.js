import UserModel from './models/User';

// import '../sass/common.scss';
import '../sass/index.scss';
import '../sass/contact.scss';
import axios from 'axios';

import * as summaryView from './views/summaryView';
import * as statsView from './views/statsView';
import * as companyTableView from './views/companyTableView';
import * as utils from './utils/utils';

class ContactController {
    constructor() {
        this.UserModel = new UserModel();
        utils.pageFadeIn();

        const company = {
            id: 5, 
            companyName: 'Test', 
            companyDate: '22/04/22', 
            contacts: [{contactId: 2, firstName: 'Nick', lastName: 'Woodward', position: 'CEO', phone: '07565234767', email: 'nick@gm12333.com'}], 
            addresses: [{id: 9, firstLine: '305 Haverly Drive', second: 'Earley', city:'Reading', county: 'Berkshire', postcode: 'RG6 7WE'}], 
        }

        const dummyCompanies = [
            {
                id: 5, 
                companyName: 'Test', 
                companyDate: '22/04/22', 
            },
            {
                id:6,
                companyName: 'Dell',
                companyDate: '12/03/21'
            },
            {
                id: 2,
                companyName: 'HP',
                companyDate: '02/03/19'
            },
            {
                id: 78,
                companyName: 'JRS',
                companyDate: '10/05/19'
            }
        ];
        

        const summary = summaryView.createCompanySummary(company);
        const stats = statsView.createCompanyStatsSummary();
        const table = companyTableView.createCompanyTable(dummyCompanies);

        const content = document.querySelector('.content');
        content.insertAdjacentHTML('afterbegin', stats);
        content.insertAdjacentHTML('afterbegin', summary);
        content.insertAdjacentHTML('afterbegin', table);


        summaryView.renderPagination(5, 3, document.querySelector('.summary__section--contacts'), 'contacts')
        summaryView.renderPagination(7, 2, document.querySelector('.summary__section--addresses'), 'addresses')
        summaryView.renderPagination(5, 2, document.querySelector('.summary__section--jobs'), 'jobs');


    }



    // getUsers() {
    //     return axios.get('http://localhost:8080/users/all', {headers: { 'Content-Type':  'application/json' }});
    // }
    // createUser() {
    //     const dummyUser = { firstName:'jon', lastName:'thomas', email:'jon@hotmail.com', phone:'07362517628', password:'1234567891011', confirmPassword:'1234567891011', url:'test'}
    //     return axios.post('http://localhost:8080/users/register', { ...dummyUser });
    // }
    // deleteUser() {
    //     return axios.delete('http://localhost:8080/users/delete-email/jon@hotmail.com');
    // }
}

new ContactController();