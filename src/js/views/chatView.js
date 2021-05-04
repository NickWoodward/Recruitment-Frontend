export const addChatResponse = (message, client) => {
    const markup = `
        <div class="chatbox__bubble chatbox__bubble--${client? 'client':'server'}">
            <div class="chatbox__text">${message}</div>
        </div>
    `;

    const chatHistory = document.querySelector('.chatbox__history');
    if(chatHistory) chatHistory.insertAdjacentHTML('afterbegin', markup);
};

export const renderChat = () => {
    const markup = `
        <div class="chatbox">
            <div class="chatbox__header">
                
                <div class="chatbox__header-text">Let's chat!</div>      
                <svg class="chatbox__close-icon"><use xlink:href="svg/spritesheet.svg#arrow-up"></svg>

            </div>
            <div class="chatbox__content">
                <form class="chatbox__signup">
                    <div class="chatbox__signup-item">
                        <label class="chatbox__fname-label chatbox__signup-label" for="chatbox__fname-input">First Name:</label>
                        <input class="chatbox__fname-input chatbox__signup-input">
                    </div>
                    <div class="chatbox__signup-item">
                        <label class="chatbox__sname-label chatbox__signup-label" for="chatbox__sname-input">Surname:</label>
                        <input class="chatbox__sname-input chatbox__signup-input">
                    </div>

                    <div class="chatbox__signup-item">
                        <label class="chatbox__email-label chatbox__signup-label" for="chatbox__email-input">Email:</label>
                        <input class="chatbox__email-input chatbox__signup-input">
                    </div>
                    <button class="chatbox__signup-submit">Submit</button>
                </form>
                <div class="chatbox__history"></div>
                <form class="chatbox__form">
                    <input class="chatbox__input">
                    <button class="chatbox__submit"><svg class="chatbox__submit-icon"><use xlink:href="svg/spritesheet.svg#paperplane"></svg></button>

                </form>
            </div>

        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', markup);
};

export const closeChatbox = () => {
    const chatbox = document.querySelector('.chatbox__content');
    console.log(chatbox.style.maxHeight);
    if(chatbox.style.maxHeight === '100%')
        chatbox.style.maxHeight = 0;
    else chatbox.style.maxHeight = '100%';
};