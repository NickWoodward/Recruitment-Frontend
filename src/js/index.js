import * as headerView from './views/headerView';
import JRS from './api/jrs';

import { elementStrings } from './views/base';
import * as loginView from './views/loginView';

import User from './models/User';

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
        this.User = new User();
        this.addEventListeners();
    }

    addEventListeners() {

        // ONLOAD
        window.addEventListener('DOMContentLoaded', (e) => {
            // Create Listener callbacks for header links
            const cbs = {
                renderLogin: loginView.renderLogin
            }
            headerView.renderHeader('index');
            headerView.addHeaderListeners(cbs);

            // Separated from the renderHeader method for page resizing
            headerView.setParallaxHeaderWidth();
        });  

        // RESIZE
        window.addEventListener('resize', (e) => {
            // #TODO: Debounce
            headerView.setParallaxHeaderWidth();
        });

        // CHECK MODAL CLICKED
        document.body.addEventListener('click', async (e) => {
            const modal = e.target.closest('.modal');
            if(modal) {

                // Login Modal Clicked
                if(e.target.closest('.login')) {
                    switch(loginView.getAction(e)) {
                        case 'submit':  console.log('login'); 
                                        try {
                                            // @TODO: REFRESH TOKENS
                                            const res = await this.User.login(loginView.getLoginDetails());
                                            // window.location.replace('http://localhost:8082');
                                            console.log(res.data.token);
                                        } catch(error) { 
                                            if (error.response) {
                                                // Server responded with a status code that falls out of the range of 2xx
                                                if(!error.response.data.success) 
                                                    console.log(error.response.data.message);

                                                    // @TODO: REFRESH TOKENS
                                                    // If the token is invalid send the refresh token
                                                
                                              } else if (error.request) {
                                                // The request was made but no response was received
                                                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                                                // http.ClientRequest in node.js
                                                console.log(error.request);
                                              } else {
                                                // Something happened in setting up the request that triggered an Error
                                                console.log('Error', error.message);
                                              }
                                        }
                                        break;
                        case 'cancel':  modal.parentElement.removeChild(modal);
                    }

                // Register Modal Clicked
                } else if(e.target.closest('.register')) {

                }
                
            }
        });
    }
}

new IndexController();

