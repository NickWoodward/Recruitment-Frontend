
export const getAction = (e) => {
    const edit = e.target.closest('.job-form__submit--edit');
    const create = e.target.closest('.job-form__submit--create');

    const cancel = !e.target.closest('.job-form__content') || e.target.closest('.job-form__cancel');
    if(cancel) return 'cancel';
    if(edit) return 'edit';
    if(create) return 'create';
    
} 

export const getFormData = () => {
    return ({
        title: document.querySelector('.job-form__input--title').value,
        wage: document.querySelector('.job-form__input--wage').value,
        location: document.querySelector('.job-form__input--location').value,
        description: document.querySelector('.job-form__input--description').value
    })
}

export const renderJobForm = (e, type, data) => {
    const markup = `
        <div class="modal job-form job-form--${type}">
            <div class="job-form__content">
                <div class="job-form__header">
                <div class="job-form__title">${type === 'create'? 'Create':'Edit'} a Job</div>
                    <button class="job-form__cancel-btn">
                        <svg class="job-form__cancel-svg">
                            <use xlink:href="svg/spritesheet.svg#close-icon">
                        </svg>
                    </button>    
                </div>  

                <form class="job-form__form">
                    <div class="job-form__field">
                        <label class="job-form__label job-form__label--title" for="job-form__input--title">Title: </label>
                        <input  class="job-form__input--title job-form__input" id="job-form__input--title" value="${data? data.title: ''}" />
                    </div>
                    <div class="job-form__field">
                        <label class="job-form__label job-form__label--wage" for="job-form__input--wage">Wage: </label>
                        <input  class="job-form__input--wage job-form__input" id="job-form__input--wage" value="${data? data.wage: ''}" />
                    </div>
                    <div class="job-form__field">
                        <label class="job-form__label job-form__label--location" for="job-form__input--location">Location: </label>
                        <input  class="job-form__input--location job-form__input" id="job-form__input--location" value="${data? data.location: ''}" />
                    </div>
                    <div class="job-form__field">
                        <label class="job-form__label job-form__label--description" for="job-form__input--description">Description: </label>
                        <textarea  class="job-form__input--description job-form__input" id="job-form__input--description">${data? data.description: ''}</textarea>
                    </div>

                    <button class="job-form__submit job-form__submit--${type}" ${type === 'edit'? `data-id= ${data.id}`: ''}>${type === 'edit'? 'Edit':'Create'}</button>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', markup);
}