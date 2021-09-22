import { elements } from './base';
import { elementStrings } from './base';

// If the page uses a parallax container the width of the header should account for the wrapper scrollbar
export const setParallaxHeaderWidth = () => {
    const width = document.querySelector('section').clientWidth;
    const header = document.querySelector(elementStrings.header);
    header.style.width = `${width}px`;
}
{/* <img class="logo" src="src/assets/cropped-logo.png" alt="JRS Logo" /> */}

export const renderHeader = (page) => {
    const markup = `
    <header class="header header--${page}">

        <div class="header__content header__content--${page}">
        <a href="./index.html" class="header__logo">
            <svg><use class="logo--svg" xlink:href="svg/spritesheet.svg#logo"></svg>
        </a>

        <a href="#main-menu" class="menu-toggle" aria-label="Open main menu">
            <svg class="burger" aria-hidden="true"><use xlink:href="svg/spritesheet.svg#burger-icon"></use></svg>
        </a>

        <nav class="header__main-menu main-menu" id="main-menu" aria-label="Main-menu">
            <a href="#main-menu-toggle" class="menu-close">
                <span class="sr-only">Close main menu</span>
                <svg class="close" aria-hidden="true"><use xlink:href="svg/spritesheet.svg#close-icon"></use></svg>
            </a>

            <div class="nav-wrapper">
 

                <ul class="nav">
                    <li class="nav__link">
                        <a href="./admin.html" class="nav__a nav__a--about ${page === "about"? "nav__a--active":""}">About</a>
                    </li>
                    <li class="nav__link">
                        <a href="./jobs.html" class="nav__a nav__a--jobs ${page === "jobs"? "nav__a--active":""}">Find a Job</a>
                    </li>
                    <li class="nav__link">
                        <a href="#" class="nav__a nav__a--contact">Contact Us</a>
                    </li>
                    <li class="nav__link">
                        <a href="#" class="nav__a nav__a--login">Login</a>
                    </li>
                </ul>
            </div>
        </nav>

        <!-- The transparent background behind the mobile menu -->
        <a href="#" class="backdrop" hidden></a>
        </div>
    </header>`;
    
    elements.body.insertAdjacentHTML('afterbegin', markup);
};

export const addHeaderListeners = ({ renderLogin }) => {
    const loginLink = document.querySelector('.nav__a--login');
    loginLink.addEventListener('click', () => renderLogin());
}

{/* <ul class="nav--social">
<li class="nav__link--social">
    <svg class="nav__facebook-icon" aria-hidden="true"><use xlink:href="svg/spritesheet.svg#facebook-icon"></use></svg>
</li>
<li class="nav__link--social">
    <svg class="nav__twitter-icon" aria-hidden="true"><use xlink:href="svg/spritesheet.svg#twitter-icon"></use></svg>
</li>                   
<li class="nav__link--social">
    <svg class="nav__linkedin-icon" aria-hidden="true"><use xlink:href="svg/spritesheet.svg#linkedin-icon"></use></svg>
</li>
<li class="nav__link--social nav__link--last">
    <svg class="nav__instagram-icon" aria-hidden="true"><use xlink:href="svg/spritesheet.svg#instagram-icon"></use></svg>
</li>
</ul> */}