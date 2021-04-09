import { gsap } from 'gsap';

export const clearElement = (element) => {
    while(element.firstChild) element.removeChild(element.firstChild);
}

export const removeElement = (element) => {
    element.parentElement.removeChild(element);
}

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