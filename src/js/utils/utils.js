import { gsap } from 'gsap';

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


export const chunk = (array, chunkLength) => {
    let chunks = [];
    let i = 0;

    while(i < array.length) {
        chunks.push(array.slice(i, i += chunkLength));
    };
    return chunks;
};
