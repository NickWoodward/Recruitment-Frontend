import { gsap } from 'gsap';

export const clearElement = (element) => {
    while(element.firstChild) element.removeChild(element.firstChild);
}

export const removeElement = (element) => {
    element.parentElement.removeChild(element);
}

export const changeActiveRow = (row, rows) => {
    console.log(row);
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