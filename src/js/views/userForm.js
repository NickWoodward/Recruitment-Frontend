
export const getAction = (e) => {
    const edit = e.target.closest('.user-form__submit--edit');
    const create = e.target.closest('.user-form__submit--create');
    // Background clicked?
    const cancel = !e.target.closest('.user-form__content') || e.target.closest('.user-form__cancel');
    if(cancel) return 'cancel';
    if(edit) return 'edit';
    if(create) return 'create';
}

export const getFormData = (type) => {
    const user = {
        fname: document.querySelector('.user-form__input--fname').value,
        lname: document.querySelector('.user-form__input--lname').value,
        email: document.querySelector('.user-form__input--email').value,
        phone: document.querySelector('.user-form__input--phone').value,
    }

    if(type === 'create') {
        user.password = document.querySelector('.user-form__input--password').value;
        user.confirm = document.querySelector('.user-form__input--confirm').value;
    }

    return user;
}

export const renderUserForm = (e, type, data) => {
    const markup = `
        <div class="modal user-form user-form--${type}">
            <div class="user-form__content">
                <div class="user-form__title">${type === 'create'? 'Create': 'Edit'} a User</div>
                    <form class="user-form__form">
                        <div class="user-form__field">
                            <label class="user-form__label--fname user-form__label" for="user-form__input--fname">First Name</label>
                            <input class="user-form__input--fname user-form__input" id="user-form__input--fname" value="${data? data.fName:''}" />
                        </div>
                        <div class="user-form__field">
                            <label class="user-form__label--lname user-form__label" for="user-form__input--lname">Last Name</label>
                            <input class="user-form__input--lname user-form__input" id="user-form__input--lname" value="${data? data.lName:''}" />
                        </div>
                        <div class="user-form__field">
                            <label class="user-form__label--email user-form__label" for="user-form__input--email">Email</label>
                            <input class="user-form__input--email user-form__input" id="user-form__input--email" value="${data? data.email:''}"/>
                        </div>
                        <div class="user-form__field">
                            <label class="user-form__label--phone user-form__label" for="user-form__input--phone">Phone</label>
                            <input class="user-form__input--phone user-form__input" id="user-form__input--phone" value="${data? data.phone:''}"/>
                        </div>
                        
                        <!-- No password fields for editing -->
                        ${ type === 'create'? 
                            `<div class="user-form__field">
                                <label class="user-form__label--password user-form__label" for="user-form__input--password">Password</label>
                                <input class="user-form__input--password user-form__input" id="user-form__input--password"/>
                            </div>
                            <div class="user-form__field">
                                <label class="user-form__label--confirm user-form__label" for="user-form__input--confirm">Confirm</label>
                                <input class="user-form__input--confirm user-form__input" id="user-form__input--confirm"/>
                            </div>`
                            : 
                            ''
                        }
                        
                        <div class="user-form__field">
                            <label class="user-form__label--confirm user-form__label" for="user-form__input--confirm">Confirm</label>
                            <input class="user-form__input--confirm user-form__input" id="user-form__input--confirm" type="file"/>
                        </div>

                        <button class="user-form__submit user-form__submit--${type}" ${type === 'edit'? `data-id= ${data.id}`: ''}>Submit</button>
                        <button class="user-form__cancel user-form__cancel--${type}">Cancel</button>
                    </form>
                
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', markup);
}