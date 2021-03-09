import * as headerView from './views/headerView';
import JRS from './api/jrs';


/* ASSETS */
import '../sass/index.scss';

import '../assets/hero.webp';
import '../assets/legal.png';
import '../assets/search-jobs.png';

import '../assets/icons/permanent.svg';
import '../assets/icons/clock.svg';
import '../assets/icons/location.svg';
import '../assets/icons/ios-location.svg';
import '../assets/icons/ios-telephone.svg';
import '../assets/icons/ios-email.svg';

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
        document.querySelector('.browse-btn--hero').addEventListener('click', ()=> {
            console.log('pressed');
            const res = JRS.get('/auth/register');
        });
    }
}

new IndexController();

