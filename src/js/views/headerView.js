import { elements } from './base';
import { elementStrings } from './base';

// If the page uses a parallax container the width of the header should account for the wrapper scrollbar
export const setParallaxHeaderWidth = () => {
    const width = document.querySelector('section').clientWidth;
    const header = document.querySelector(elementStrings.header);
    header.style.width = `${width}px`;
}

export const renderHeader = (page) => {
    const markup = `
    <header class="header header--${page}">
        <a href="./index.html" class="header__logo">
            <img class="logo" src="src/assets/logo.jpg" alt="JRS Logo" />
        </a>

        <a href="#main-menu" class="menu-toggle" aria-label="Open main menu">
            <svg class="burger" aria-hidden="true"><use xlink:href="svg/spritesheet.svg#burger-icon"></use></svg>
        </a>

        <nav class="header__main-menu main-menu" id="main-menu" aria-label="Main-menu">
            <a href="#main-menu-toggle" class="menu-close">
                <span class="sr-only">Close main menu</span>
                <svg class="close" aria-hidden="true"><use xlink:href="svg/spritesheet.svg#close-icon"></use></svg>
            </a>

            <ul class="nav">
                <li class="nav__link">
                    <a href="./about.html" class="nav__a nav__a--about ${page === "about"? "nav__a--active":""}">About</a>
                </li>
                <li class="nav__link">
                    <a href="./jobs.html" class="nav__a nav__a--jobs ${page === "jobs"? "nav__a--active":""}">Find a Job</a>
                </li>
                <li class="nav__link">
                    <a href="#" class="nav__a nav__a--contact">Contact Us</a>
                </li>
                <li class="nav__link">
                    <a href="#" class="nav__a nav__a--contact">Login</a>
                </li>
            </ul>
        </nav>

        <!-- The transparent background behind the mobile menu -->
        <a href="#" class="backdrop" hidden></a>
    </header>`;
    
    elements.body.insertAdjacentHTML('afterbegin', markup);
};
