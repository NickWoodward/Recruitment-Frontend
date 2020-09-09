import * as headerView from './views/headerView';
/* ASSETS */
import '../sass/index.scss';

class IndexController {
    constructor() {
        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener('DOMContentLoaded', () => headerView.renderHeader('index'));       
    }
}

new IndexController();

