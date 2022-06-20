import UserModel from './models/User';

// import '../sass/common.scss';
import '../sass/index.scss';
import '../sass/contact.scss';
import axios from 'axios';

import * as summaryView from './views/summaryView';
import * as utils from './utils/utils';

class ContactController {
    constructor() {
        this.UserModel = new UserModel();
        utils.pageFadeIn();

        const company = {
            id: 5, 
            companyName: 'Test', 
            companyDate: '22/04/22', 
            contacts: [{contactId: 2, firstName: 'Nick', lastName: 'Woodward', position: 'CEO', phone: '07565234767', email: 'nick@gmail.com'}], 
            addresses: [{id: 9, firstLine: '305 Haverly Drive', second: 'Earley', city:'Reading', county: 'Berkshire', postcode: 'RG6 7WE'}], 
        }
        

        const summary = summaryView.createCompanySummary(company);

        const main = document.querySelector('main');
        main.insertAdjacentHTML('afterbegin', summary);
        summaryView.renderPagination(5, 3, document.querySelector('.summary__section--contacts'), 'contacts')
        summaryView.renderPagination(7, 2, document.querySelector('.summary__section--addresses'), 'addresses')


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