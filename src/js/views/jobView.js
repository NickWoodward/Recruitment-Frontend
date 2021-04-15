export const getAction = (e) => {
    const apply = e.target.closest('.job-details__btn--apply');
    const cancel = e.target.closest('.modal') && (!e.target.closest('.job-details__content') || e.target.closest('.job-details__cancel-btn'));
    const signIn = e.target.closest('.job-details__sign-in-btn')

    if(apply) return 'apply';
    if(cancel) return 'cancel';
    if(signIn) return 'sign-in';
};

export const renderJobDetails = (job, container = document.body, admin) => {
    const markup = `
        <div class="modal job-details">
            <div class="job-details__content">
                <button class="job-details__cancel-btn">
                    <svg class="job-details__cancel-svg">
                        <use xlink:href="svg/spritesheet.svg#close-icon">
                    </svg>
                </button>

                <div class="job-details__table">

                    <div class="job-details__title">${job.title}</div>
                    <div class="job-details__row">
                        <div class="job-details__location-label job-details__label">Location</div>
                        <div class="job-details__location-value job-details__value">${job.location}</div>
                    </div>
                    <div class="job-details__row">
                        <div class="job-details__wage-label job-details__label">Wage</div>
                        <div class="job-details__wage-value job-details__value">${job.wage}</div>
                    </div>
                    <div class="job-details__row">
                        <div class="job-details__type-label job-details__label">Type</div>
                        <div class="job-details__type-value job-details__value">Permanent</div>
                    </div>
                    <div class="job-details__row">
                        <div class="job-details__role-label job-details__label">Role</div>
                        <div class="job-details__role-value job-details__value">In House</div>
                    </div>
                    <div class="job-details__row">
                        <div class="job-details__PQE-label job-details__label">PQE</div>
                        <div class="job-details__PQE-value job-details__value">3+ years</div>
                    </div>
                    <div class="job-details__row">
                        <div class="job-details__details-label job-details__label">Details</div>
                        <div class="job-details__details-value job-details__value">${job.description}</div>
                    </div>
                    <div class="job-details__row">
                        <div class="job-details__date-label job-details__label">Posted</div>
                        <div class="job-details__date-value job-details__value">More than 3 days ago</div>
                    </div>
                    <div class="job-details__row job-details__row--btns">
                        <button class="job-details__btn job-details__btn--apply btn">Apply</button>
                        <div class="job-details__sign-in-text">or <button class="job-details__sign-in-btn">sign-in</button> to apply automatically</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('afterbegin', markup);
    // Prevent bg scrolling behind modal
    document.body.style.overflow = "hidden";
}