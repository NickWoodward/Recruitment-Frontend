export const clearElement = (element) => {
    while(element.firstChild) element.removeChild(element.firstChild);
}