import * as headerView from './views/headerView'; 
import UserModel from './models/User';
import * as homeView from './views/homeView';

// import '../sass/common.scss';
import '../sass/index.scss';
import axios from 'axios';

class ContactController {
    constructor() {
        this.UserModel = new UserModel();

        headerView.renderHeader('contact');
        homeView.loadingAnimation();
        homeView.initParallax();
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