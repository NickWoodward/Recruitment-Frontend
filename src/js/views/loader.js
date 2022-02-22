import { elementStrings } from './base';

export const renderLoader = (parent, type, position = 'afterbegin', inFlow = true) => {
    console.log(parent);
    const loader = `
        <div class="${elementStrings.loader} ${elementStrings.loader}--${type}">
            <div class="rotate">
                <svg>
                    <use href="svg/spritesheet.svg#loader"></use>
                </svg>
            </div>
        </div>
    `;
    parent.insertAdjacentHTML(position, loader);
    console.log(!inFlow);

    // If a loader should be outside of the document flow, set position class to absolute
    const loaderElement = document.querySelector(`.${elementStrings.loader}--${type}`);
    console.log(loaderElement)
    if(!inFlow) loaderElement.classList.add("loader--absolute");

 
};

export const clearLoader = () => {
    const loader = document.querySelectorAll(`.${elementStrings.loader}`);

    loader.forEach(loader => loader.parentElement.removeChild(loader));
    // if(loader) loader.parentElement.removeChild(loader);
}