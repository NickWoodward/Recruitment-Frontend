export const getAction = (e) => {
    const submit = e.target.closest('.create-job__submit');
    // Background clicked?
    const cancel = !e.target.closest('.create-job__content') || e.target.closest('.create-job__cancel');
    if(cancel) return 'cancel';
    if(submit) return 'submit';
}

export const renderCreateJob = (element) => {
    // const markup = `
    //     <div class="modal create-job">
    //         <div class="create-job__content">
    //             <div class="create-job__title">Create a Job</div>
    //                 <form class="create-job__form">
    //                     <div class="create-job__field">
    //                         <label class="create-job__label--fname create-job__label" for="create-job__input--fname">First Name</label>
    //                         <input class="create-job__input--fname create-job__input" id="create-job__input--fname"/>
    //                     </div>
    //                     <div class="create-job__field">
    //                         <label class="create-job__label--lname create-job__label" for="create-job__input--lname">Last Name</label>
    //                         <input class="create-job__input--lname create-job__input" id="create-job__input--lname"/>
    //                     </div>
    //                     <div class="create-job__field">
    //                         <label class="create-job__label--email create-job__label" for="create-job__input--email">Email</label>
    //                         <input class="create-job__input--email create-job__input" id="create-job__input--email"/>
    //                     </div>
    //                     <div class="create-job__field">
    //                         <label class="create-job__label--phone create-job__label" for="create-job__input--phone">Phone</label>
    //                         <input class="create-job__input--phone create-job__input" id="create-job__input--phone"/>
    //                     </div>
    //                     <div class="create-job__field">
    //                         <label class="create-job__label--password create-job__label" for="create-job__input--password">Password</label>
    //                         <input class="create-job__input--password create-job__input" id="create-job__input--password"/>
    //                     </div>
    //                     <div class="create-job__field">
    //                         <label class="create-job__label--confirm create-job__label" for="create-job__input--confirm">Confirm</label>
    //                         <input class="create-job__input--confirm create-job__input" id="create-job__input--confirm"/>
    //                     </div>
    //                     <div class="create-job__field">
    //                         <label class="create-job__label--confirm create-job__label" for="create-job__input--confirm">Confirm</label>
    //                         <input class="create-job__input--confirm create-job__input" id="create-job__input--confirm" type="file"/>
    //                     </div>

    //                     <button class="create-job__submit">Submit</button>
    //                     <button class="create-job__cancel">Cancel</button>
    //                 </form>
                
    //         </div>
    //     </div>
    // `;

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


    document.body.insertAdjacentHTML('afterbegin', markup);
}