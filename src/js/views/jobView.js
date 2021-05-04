import gsap from 'gsap';

export const getAction = (e) => {
    const apply = e.target.closest('.job-details__btn--apply');
    const cancel = e.target.closest('.modal') && (!e.target.closest('.job-details__content') || e.target.closest('.job-details__back-btn') || e.target.closest('.job-details__close-btn'));
    const signIn = e.target.closest('.job-details__sign-in-btn')
    console.log(apply, cancel, signIn);
    if(apply) return 'apply';
    if(cancel) return 'cancel';
    if(signIn) return 'sign-in';
};

export const renderJobDetails = (job, container = document.body, featured, admin) => {

    const markup = `
        <div class="modal job-details">
            <div class="job-details__content ${featured? 'job-details__content--featured':''}">
            ${featured? '':`<button class="job-details__back-btn">
                            <svg class="job-details__back-svg">
                                <use xlink:href="svg/spritesheet.svg#arrow-left">
                            </svg>
                            <div class="job-details__back-text">Back</div>
                         </button>`}

                <div class="job-details__table">
                    <div class="job-details__header">
                        <div class="job-details__title">${job.title}</div>

                        ${featured? `
                                <button class="job-details__close-btn">
                                    <svg class="job-details__close-svg">
                                        <use xlink:href="svg/spritesheet.svg#close-icon">
                                    </svg>
                                </button>
                        `:''}
                    </div>
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
    setJobModalPosition();

    // Prevent bg scrolling behind modal
    document.body.style.overflow = "hidden";
}

export const renderJobNotification = (job = {jobId: 20, title: 'Corporate Commercial Partner', wage: 20000, location: 'Devizes'}) => {
    const markup = `
        <div class="job-notification" data-id=${job.jobId}>
            <div class="job-notification__header job-notification__item">
                <svg class="job-notification__icon"><use xlink:href="svg/spritesheet.svg#info"></svg>
                <div class="job-notification__text">New job added: </div> 
            </div>
            <div class="job-notification__title job-notification__item">${job.title} in&nbsp;</div>
            <div class="job-notification__location job-notification__item">${job.location}&nbsp;</div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', markup);
    gsap.from(document.querySelector('.job-notification'), { opacity: 0, y: '100%', duration: 1, ease: 'ease-out' });

    // Remove element after 5 seconds
    // setTimeout(()=> {
    //     const jobNotification = document.querySelector('.job-notification');
    //     jobNotification.parentElement.removeChild(jobNotification);
    // }, 5000);
}

export const setJobModalPosition = () => {
    const modal = document.querySelector('.modal');
    const menu = document.querySelector('.jobs__menu-wrapper') || document.querySelector('.sidebar');
    const header = document.querySelector('.header');
    const { height: headerHeight } = header? header.getBoundingClientRect() : {};
    const { width: menuWidth } = menu? menu.getBoundingClientRect() : {};
    const {width: viewPortWidth, height: viewPortHeight} = document.body.getBoundingClientRect() || {};
    
    console.log(headerHeight, menuWidth);

    // If there's a menu shift the modal to the right and adjust width
    if(menuWidth) {
        modal.style.left = `${menuWidth}px`;
        modal.style.width = `${viewPortWidth - menuWidth}px`;
    }
    // If there's a header, move down and shrink height
    if(headerHeight) {
        modal.style.top = `${headerHeight}px`;
        modal.style.height = `${viewPortHeight - headerHeight}px`;
    }
};
