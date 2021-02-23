import * as headerView from './views/headerView';
/* ASSETS */
import '../sass/index.scss';
import '../assets/hero.webp';

class IndexController {
    constructor() {
        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener('DOMContentLoaded', (e) => {
            headerView.renderHeader('index');
            // Separated from the renderHeader method for page resizing
            headerView.setParallaxHeaderWidth();
        });  
        
        window.addEventListener('resize', (e) => {
            // #TODO: Debounce
            headerView.setParallaxHeaderWidth();
        });
    }
}

new IndexController();

