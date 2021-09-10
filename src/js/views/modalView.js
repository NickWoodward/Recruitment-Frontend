export const displayOptionModal = (message, container) => {
    const modal = `
        <div class='modal'>
            <div class='edit-notification'>
                Hello
            </div>
        </div>
    `;

    container.insertAdjacentHTML('afterbegin', modal);
}