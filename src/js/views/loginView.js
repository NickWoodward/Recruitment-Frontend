import { elements } from './base'; 

export const getAction = (e) => {
    const submit = e.target.closest('.login__submit');
    // Background or cancel button clicked
    const cancel = !e.target.closest('.login__content') || e.target.closest('.login__cancel');

    if(submit) return 'submit';
    if(cancel) return 'cancel';
}

export const getLoginDetails = () => {
    return {
        email: document.querySelector('.login__input--email').value,
        password: document.querySelector('.login__input--password').value
    }
}

// Modal
export const renderLogin = () => {
    const markup = `
        <div class="modal login">
            <div class="login__content">   
                <div class="login__title"></div>         
                <form class="login__form">
                    <div class="login__field">
                        <label class="login__label--email login__label" for="login__input--email login__input">Email</label>
                        <input class="login__input--email login__input" id="login__input--email" />
                    </div>
                    <div class="login__field">
                        <label class="login__label--password login__label" for="login__input--password">Password</label>
                        <input class="login__input--password" id="login__input--password" />
                    </div>
                    <button class="login__submit">Submit</button>
                    <button class="login__cancel">Cancel</button>

                </form>
            </div>
    
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', markup);
}