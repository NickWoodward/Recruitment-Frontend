export const getAction = (e) => {
    const submit = e.target.closest('.forgot-password__submit');
    const cancel = e.target.closest('.modal') && (!e.target.closest('.forgot-password__content') || e.target.closest('.forgot-password__cancel-btn'));
    if(submit) return 'submit';
    if(cancel) return 'cancel';
};

export const renderForgotModal = () => {
    const markup = `
        <div class="modal forgot-password">
            <div class="forgot-password__content">   
                <div class="forgot-password__header">
                    <div class="forgot-password__title">Enter your email address</div>  
                    <button class="forgot-password__cancel-btn">
                        <svg class="forgot-password__cancel-svg">
                            <use xlink:href="svg/spritesheet.svg#close-icon">
                        </svg>
                    </button>    
                </div>   
                <form class="forgot-password__form">
                    <div class="forgot-password__field">
                        <label class="forgot-password__label--email forgot-password__label" for="forgot-password__input--email forgot-password__input">Email</label>
                        <input class="forgot-password__input--email forgot-password__input" id="forgot-password__input--email" />
                    </div>       
                    <button class="forgot-password__submit btn">Send</button>       
                    <div class="forgot-password__message">An email will be sent to the above address with a reset link</div>         
                </form>
            </div>
    
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', markup);
};