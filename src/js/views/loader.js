import { elementStrings } from './base';

export const renderLoader = (parent, type) => {
    const loader = `
        <div class="${elementStrings.loader} ${elementStrings.loader}--${type}">
            <svg>
                <use href="svg/spritesheet.svg#loader"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader) loader.parentElement.removeChild(loader);
}