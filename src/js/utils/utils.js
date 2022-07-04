import { gsap } from 'gsap';

import Select from '../views/customSelect';

export const displayLoaderMessage = (container, type, msg) => {

    const markup = `
        <div class="loader__message-wrapper loader__message-wrapper--${type}">
            <div class="loader__message-close loader__message-close--${type}">
                <svg class="loader__close-svg loader__close-svg--${type}">
                    <use xlink:href="svg/spritesheet.svg#close-icon" />
                </svg>
            </div>
            <div class="loader__message loader__message--${type}">${msg}</div>
        </div>
    `;
     
    container.insertAdjacentHTML('beforeend', markup);
}

export const clearElement = (element) => {
    while(element.firstChild) element.removeChild(element.firstChild);
}

export const clearForm = (elements, defaults) => {
    elements.forEach((element, index) => {
        if (element.matches('input[type="checkbox"]')) {
            element.checked = false;
        } else {
            element.innerText = defaults? defaults[index]:'';
        }
    });
}

export const removeElement = (element) => {
    element.parentElement.removeChild(element);
}

export const templateStringToElement = (templateString) => {
    const placeholder = document.createElement('div');

    placeholder.innerHTML = templateString;
    return placeholder.firstElementChild;

}


export const swapElement = (icon1, icon2) => {
    
    if(typeof icon2 === 'object') icon1.insertAdjacentElement('beforebegin', icon2);
    else icon1.insertAdjacentHTML('beforebegin', icon2); 
    removeElement(icon1);
};

export const changeActiveRow = (row, rows) => {
    rows.forEach(row => {
        if(row.classList.contains('row--active')) row.classList.remove('row--active'); 
    });
    row.classList.add('row--active');
};

export const warn = (message, controls, type, data) => {
    const markup = `
        <div class="modal modal--warn warn">
            <div class="warn__content">
                <div class="warn__message">${message}</div>
                <div class="warn__controls">
                    ${controls.map(item => {
                        return `<button class="btn ${item}-btn--warn ${item}-btn--${type}" data-id="${data}">${item}</button>`
                    }).join('')}
                </div>
            </div>
        </div>
    `;
    return markup;
}

export const pageFadeIn = () => {
    return gsap.from('body', { autoAlpha: 0, ease: 'linear', duration: .5 });
}

export const limitText = (text, limit = 30) => {
    const newText = [];
    if(text.length < limit) return text;

    text.split(' ').reduce((acc, current) => {
        if(acc + current.length <= limit) {
            newText.push(current);
        }
        return acc + current.length +1;
    }, 0);

    return `${newText.join(' ')}...`;
};

export const capitalise = (text, all) => {
    if(typeof text !== 'string') return text;
    if(!all) return text.charAt(0).toUpperCase() + text.slice(1);
    const words = text.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
    return words;
};

export const formatSalary = (number) => {
    let text ='';
    const reversed = number.toString().split("").reverse();
    reversed.forEach((number, index) => {
        if(index % 3 === 0 && index !== 0 ) { text += ',' }
        text += number;
    })

    return `£${text.split("").reverse().join("")}`;
};
export const removeSalaryFormatting = (str) => {
    let [min, max] = str.split(" - ");

    min = min.replace ( /[^0-9.]/g, '' );
    max = max.replace ( /[^0-9.]/g, '' );

    return [parseInt(min), parseInt(max)];
}

export const chunk = (array, chunkLength) => {
    let chunks = [];
    let i = 0;

    while(i < array.length) {
        chunks.push(array.slice(i, i += chunkLength));
    };
    return chunks;
};

const epochs = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1]
];

const getDuration = (timeAgoInSeconds) => {
    for (let [name, seconds] of epochs) {
        const interval = Math.floor(timeAgoInSeconds / seconds);
        if (interval >= 1) {
            return {
                interval: interval,
                epoch: name
            };
        }
    }
};

export const timeAgo = (date) => {
    const timeAgoInSeconds = Math.floor((new Date() - new Date(date)) / 1000);
    const {interval, epoch} = getDuration(timeAgoInSeconds);
    const suffix = interval === 1 ? '' : 's';
    return `${interval} ${epoch}${suffix} ago`;
};

export const getInnerDimensions = (element) => {
    const cs = getComputedStyle(element);

    const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

    const borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
    const borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

    // Element width and height minus padding and border
    const elementWidth = element.offsetWidth - paddingX - borderX;
    const elementHeight = element.offsetHeight - paddingY - borderY;

    return { elementWidth, elementHeight };
}

export const createSelect = (select) => new Select(select);
