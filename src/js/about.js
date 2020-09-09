/* ASSETS */
import '../sass/about.scss';

import * as headerView from '../js/views/headerView';

class AboutController {
    constructor() {
        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener('DOMContentLoaded', () => headerView.renderHeader('about'));
    }
}

new AboutController();