export const getAction = (e) => {
    const submit = e.target.closest('.create-job__submit');
    // Background clicked?
    const cancel = !e.target.closest('.create-job__content') || e.target.closest('.create-job__cancel');
    if(cancel) return 'cancel';
    if(submit) return 'submit';
}

export const renderCreateJob = (element) => {
    const markup = `
        <div class="modal create-job">
            <div class="create-job__content">
                <div class="create-job__title">Create a Job</div>
                    <form class="create-job__form">
                        <div class="create-job__field">
                            <label class="create-job__label--fname create-job__label" for="create-job__input--fname">First Name</label>
                            <input class="create-job__input--fname create-job__input" id="create-job__input--fname"/>
                        </div>
                        <div class="create-job__field">
                            <label class="create-job__label--lname create-job__label" for="create-job__input--lname">Last Name</label>
                            <input class="create-job__input--lname create-job__input" id="create-job__input--lname"/>
                        </div>
                        <div class="create-job__field">
                            <label class="create-job__label--email create-job__label" for="create-job__input--email">Email</label>
                            <input class="create-job__input--email create-job__input" id="create-job__input--email"/>
                        </div>
                        <div class="create-job__field">
                            <label class="create-job__label--phone create-job__label" for="create-job__input--phone">Phone</label>
                            <input class="create-job__input--phone create-job__input" id="create-job__input--phone"/>
                        </div>
                        <div class="create-job__field">
                            <label class="create-job__label--password create-job__label" for="create-job__input--password">Password</label>
                            <input class="create-job__input--password create-job__input" id="create-job__input--password"/>
                        </div>
                        <div class="create-job__field">
                            <label class="create-job__label--confirm create-job__label" for="create-job__input--confirm">Confirm</label>
                            <input class="create-job__input--confirm create-job__input" id="create-job__input--confirm"/>
                        </div>
                        <div class="create-job__field">
                            <label class="create-job__label--confirm create-job__label" for="create-job__input--confirm">Confirm</label>
                            <input class="create-job__input--confirm create-job__input" id="create-job__input--confirm" type="file"/>
                        </div>

                        <button class="create-job__submit">Submit</button>
                        <button class="create-job__cancel">Cancel</button>
                    </form>
                
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', markup);
}