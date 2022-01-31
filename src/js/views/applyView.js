import {gsap} from 'gsap';

export const getAction = (e) => {
    const request = e.target.closest('.request__submit');
    const login = e.target.closest('.login__submit--apply');
    const forgot = e.target.closest('.login__forgot-password--apply');
    const register = e.target.closest('.login__register-link--apply');
    const cancel = e.target.closest('.modal') && (!e.target.closest('.apply__content') || e.target.closest('.apply__cancel-btn') || e.target.closest('.loader__message-close--apply') );

    if(request) return 'request';
    if(login) return 'login';
    if(forgot) return 'forgot';
    if(register) return 'register';
    if(cancel) return 'cancel';
}

export const getApplicationDetails = () => {
    const formData = new FormData();
    formData.append('firstName', document.querySelector('.request__input--first-name').value);
    formData.append('lastName', document.querySelector('.request__input--surname').value);
    formData.append('email', document.querySelector('.request__input--email').value);
    formData.append('phone', document.querySelector('.request__input--phone').value);
    formData.append('cv', document.querySelector('.request__input--cv').files[0]);
    return formData;
}

export const renderApplyForm = (id) => {
    const markup = `
        <div class="modal apply" data-id="${id}">

            <div class="apply__content">
                <div class="request">
                    
                    <form class="request__form">
                        <div class="request__field">
                            <label class="request__label--first-name request__label" for="request__input--first-name">First Name</label>
                            <input class="request__input--first-name request__input" id="request__input--first-name" />
                        </div>
                        <div class="request__field">
                            <label class="request__label--surname request__label" for="request__input--surname">Surname</label>
                            <input class="request__input--surname request__input" id="request__input--surname" />
                        </div>
                        <div class="request__field">
                            <label class="request__label--email request__label" for="request__input--email request__input">Email</label>
                            <input class="request__input--email request__input" id="request__input--email" />
                        </div>
                        <div class="request__field">
                            <label class="request__label--phone request__label" for="request__input--phone">Phone</label>
                            <input class="request__input--phone request__input" id="request__input--phone" />
                        </div>
                        <div class="request__field request__field--cv">
                        <!-- Input inside label for custom styling -->
                            <div class="request__label request__label--dummy">CV</div>
                            <div class="request__file-picker">
                                <label class="request__label--cv request__label" for="request__input--cv">
                                Upload
                                    <input class="request__input--cv request__input" id="request__input--cv" name="cv" type=file />
                                </label>
                                <div class="request__input-path"><span>No file chosen</span></div>
                            </div>

                        </div>
                        <button class="request__submit btn">Submit</button>

                    </form>
                </div>
            </div>
            
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', markup);
    animateApplyFormIn();
};

const animateApplyFormIn = () => {
    console.log('apply form in');
    const tl = gsap.timeline({
        defaults: { duration: .5 }
    })
    .from('.apply', {  opacity: 0 })
    .from('.apply__content', {  opacity: 0 }, '<');
}
export const animateApplyFormOut = (callback) => {
    console.log('animate');
    const tl = gsap.timeline({
        defaults: { duration: .4 },
        onComplete: callback
    })
    .to('.apply', { opacity: 0, scale: 1.1 })
    .to('.apply__content', { opacity: 0 }, '<');
}




{/* <div class="apply__divider">Or</div>

<div class="login__content--apply">   
    <div class="login__header--apply">
        <div class="login__title--apply">Sign in to your account</div>  
        <div class="login__subtitle--apply">...to apply automatically</div>
        
    </div>   
    <form class="login__form--apply">
        <div class="login__field--apply">
            <label class="login__label--email login__label--apply" for="login__input--email">Email</label>
            <input class="login__input--email login__input--apply" id="login__input--email" />
        </div>
        <div class="login__field--apply">
            <label class="login__label--password login__label--apply" for="login__input--password">Password</label>
            <input class="login__input--password login__input--apply" id="login__input--password" />
        </div>
        <button class="login__submit--apply btn">Sign In</button>
        <div class="login__forgot-password--apply">Forgot your password?</div>
        <div class="login__register-wrapper--apply">
            <div class="login__register-text--apply">Don't have an account? Register&nbsp</div>
            <button class="login__register-link--apply">here</button>

        </div>
    </form>
</div> */}