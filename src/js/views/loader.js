import { elementStrings } from './base';

export const renderLoader = (parent, type, position = 'afterbegin', inFlow = true) => {
    const loader = `
        <div class="${elementStrings.loader} ${elementStrings.loader}--${type}">
            <svg>
                <use href="svg/spritesheet.svg#loader"></use>
            </svg>
        </div>
    `;

    parent.insertAdjacentHTML(position, loader);

    // If a loader should be outside of the document flow, set position class to absolute
    const loaderElement = document.querySelector(`.${elementStrings.loader}`);
    if(!inFlow) loaderElement.classList.add("loader--absolute");

 
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader) loader.parentElement.removeChild(loader);
}