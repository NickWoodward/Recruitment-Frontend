import * as headerView from './views/headerView';

// Assets
import '../sass/jobs.scss';


class JobsController {
    constructor() {
        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener('DOMContentLoaded', () => headerView.renderHeader('jobs'));
    }
}

new JobsController();