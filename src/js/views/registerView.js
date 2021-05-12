export const getAction = (e) => {
    const register = e.target.closest('.register__register-btn');
    const signIn = e.target.closest('.register__sign-in-btn');
    const cancel = e.target.closest('.modal') && (!e.target.closest('.register__content') || e.target.closest('.register__cancel-btn'));

    if(register) return 'register';
    if(cancel) return 'cancel';
    if(signIn) return 'sign-in';
};

export const getFormData = () => {
    return {
        firstName: document.querySelector('.register__input--fname').value,
        lastName: document.querySelector('.register__input--surname').value,
        email: document.querySelector('.register__input--email').value,
        phone: document.querySelector('.register__input--phone').value,
        password: document.querySelector('.register__input--password').value,
        confirmPassword: document.querySelector('.register__input--confirm-password').value,
    }
};

export const renderRegisterModal = () => {
    const markup = `
        <div class="modal register">
            <div class="register__content">
                <div class="register__header">
                    <div class="register__title">Register</div>
                    <button class="register__cancel-btn">
                        <svg class="register__cancel-svg">
                            <use xlink:href="svg/spritesheet.svg#close-icon">
                        </svg>
                    </button>
                </div>
                <div class="register__form">
                    <div class="register__field">
                        <label class="register__label--fname register__label" for="register__input--fname register__input">First Name</label>
                        <input class="register__input--fname register__input" id="register__input--fname" />
                    </div>
                    <div class="register__field">
                        <label class="register__label--surname register__label" for="register__input--surname register__input">Surname</label>
                        <input class="register__input--surname register__input" id="register__input--surname" />
                    </div>
                    <div class="register__field">
                        <label class="register__label--email register__label" for="register__input--email register__input">Email</label>
                        <input class="register__input--email register__input" id="register__input--email" />
                    </div>
                    <div class="register__field">
                        <label class="register__label--phone register__label" for="register__input--phone register__input">Phone</label>
                        <input class="register__input--phone register__input" id="register__input--phone" />
                    </div>
                    <div class="register__field">
                        <label class="register__label--password register__label" for="register__input--password register__input">Password</label>
                        <input class="register__input--password register__input" id="register__input--password" />
                    </div>
                    <div class="register__field">
                        <label class="register__label--confirm-password register__label" for="register__input--confirm-password register__input">Confirm Password</label>
                        <input class="register__input--confirm-password register__input" id="register__input--confirm-password" />
                    </div>
                    <button class="register__register-btn">Register</button>
                    <div class="register__sign-in-wrapper">
                        <div class="register__sign-in-text">Already a member?&nbsp</div>
                        <button class="register__sign-in-btn">Login</button>

                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', markup);
};