import * as headerView from './views/headerView'; 

// import '../sass/common.scss';
import '../sass/contact.scss';

class ContactController {
    constructor() {
        console.log('contact');
        headerView.renderHeader('contact');
    }
}

new ContactController();