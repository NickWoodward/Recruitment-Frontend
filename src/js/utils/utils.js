export const clearElement = (element) => {
    while(element.firstChild) element.removeChild(element.firstChild);
}

export const removeElement = (element) => {
    element.parentElement.removeChild(element);
}

export const warn = (message, controls, data) => {
    const markup = `
        <div class="modal modal--warn warn">
            <div class="warn__content">
                <div class="warn__message">${message}</div>
                <div class="warn__controls">
                    ${controls.map(item => {
                        return `<button class="btn ${item}-btn--warn" data-id="${data}">${item}</button>`
                    }).join('')}
                </div>
            </div>
        </div>
    `;
    return markup;
}