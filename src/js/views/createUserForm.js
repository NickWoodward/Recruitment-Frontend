export const getAction = (e) => {
    const submit = e.target.closest('.create-user__submit');
    // Background clicked?
    const cancel = !e.target.closest('.create-user__content') || e.target.closest('.create-user__cancel');
    if(cancel) return 'cancel';
    if(submit) return 'submit';
}

export const renderCreateUser = (element) => {
    const markup = `
        <div class="modal create-user">
            <div class="create-user__content">
                <div class="create-user__title">Create a User</div>
                    <form class="create-user__form">
                        <div class="create-user__field">
                            <label class="create-user__label--fname create-user__label" for="create-user__input--fname">First Name</label>
                            <input class="create-user__input--fname create-user__input" id="create-user__input--fname"/>
                        </div>
                        <div class="create-user__field">
                            <label class="create-user__label--lname create-user__label" for="create-user__input--lname">Last Name</label>
                            <input class="create-user__input--lname create-user__input" id="create-user__input--lname"/>
                        </div>
                        <div class="create-user__field">
                            <label class="create-user__label--email create-user__label" for="create-user__input--email">Email</label>
                            <input class="create-user__input--email create-user__input" id="create-user__input--email"/>
                        </div>
                        <div class="create-user__field">
                            <label class="create-user__label--phone create-user__label" for="create-user__input--phone">Phone</label>
                            <input class="create-user__input--phone create-user__input" id="create-user__input--phone"/>
                        </div>
                        <div class="create-user__field">
                            <label class="create-user__label--password create-user__label" for="create-user__input--password">Password</label>
                            <input class="create-user__input--password create-user__input" id="create-user__input--password"/>
                        </div>
                        <div class="create-user__field">
                            <label class="create-user__label--confirm create-user__label" for="create-user__input--confirm">Confirm</label>
                            <input class="create-user__input--confirm create-user__input" id="create-user__input--confirm"/>
                        </div>
                        <div class="create-user__field">
                            <label class="create-user__label--confirm create-user__label" for="create-user__input--confirm">Confirm</label>
                            <input class="create-user__input--confirm create-user__input" id="create-user__input--confirm" type="file"/>
                        </div>

                        <button class="create-user__submit">Submit</button>
                        <button class="create-user__cancel">Cancel</button>
                    </form>
                
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', markup);
}