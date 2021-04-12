export const getAction = (e) => {
    const apply = e.target.closest('.job-details__btn--apply');
    const cancel = e.target.closest('.modal') && (!e.target.closest('.job-details__content') || e.target.closest('.job-details__btn--cancel'));

    if(apply) return 'apply';
    if(cancel) return 'cancel';
};

export const renderJobDetails = (job, container, admin) => {
    const markup = `
        <div class="modal job-details">
            <div class="job-details__content">
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
                    <button class="job-details__btn job-details__btn--cancel btn">Cancel</button>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('afterbegin', markup);
    // Prevent bg scrolling behind modal
    document.body.style.overflow = "hidden";
}