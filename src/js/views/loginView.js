import { elements } from './base'; 

export const getAction = (e) => {
    const submit = e.target.closest('.login__submit');
    // Background or cancel button clicked
    const cancel = !e.target.closest('.login__content') || e.target.closest('.login__cancel-btn');
    // Register button clicked
    const register = e.target.closest('.login__register-link');
    const forgot = e.target.closest('.login__forgot-password');

    if(submit) return 'submit';
    if(register) return 'register';
    if(cancel) return 'cancel';
    if(forgot) return 'forgot';
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
                <div class="login__header">
                    <div class="login__title">Sign in to your account</div>  
                    <button class="login__cancel-btn">
                        <svg class="login__cancel-svg">
                            <use xlink:href="svg/spritesheet.svg#close-icon">
                        </svg>
                    </button>    
                </div>   
                <form class="login__form">
                    <div class="login__field">
                        <label class="login__label--email login__label" for="login__input--email login__input">Email</label>
                        <input class="login__input--email login__input" id="login__input--email" />
                    </div>
                    <div class="login__field">
                        <label class="login__label--password login__label" for="login__input--password">Password</label>
                        <input class="login__input--password login__input" id="login__input--password" />
                    </div>
                    <button class="login__submit btn">Submit</button>
                    <div class="login__forgot-password">Forgot your password?</div>
                    <div class="login__register-wrapper">
                        <div class="login__register-text">Don't have an account? Register&nbsp</div>
                        <button class="login__register-link">here</button>

                    </div>
                </form>
            </div>
    
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', markup);
}