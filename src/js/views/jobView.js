import gsap from 'gsap';

import { createListJobCard } from './jobListView';
import * as utils from '../utils/utils';

export const getAction = (e) => {
    const apply = e.target.closest('.job-details__btn--apply');
    const cancel = e.target.closest('.modal') && (!e.target.closest('.job-details__content') || e.target.closest('.job-details__back-btn') || e.target.closest('.job-details__close-btn'));
    const signIn = e.target.closest('.job-details__sign-in-btn')
    console.log(apply, cancel, signIn);
    if(apply) return 'apply';
    if(cancel) return 'cancel';
    if(signIn) return 'sign-in';
};

export const renderJobDetails = (job, container = document.body, jobs, event) => {
    const markup = `
        <div class="modal job-details">
        
            <div class="job-details__content">
                <div class="job-details__back">
                    <button class="job-details__back-btn">
                        <svg class="job-details__back-svg">
                            <use xlink:href="svg/spritesheet.svg#arrow-left">
                        </svg>
                        <div class="job-details__back-text">Back</div>
                    </button>
                </div>
                <div class="job-details__table-wrapper">
                    ${createJobDetailsTable(job)}
                </div>
                <div class="job-details__featured-jobs">
                    ${createListJobCard(jobs[0], null, true, true)}
                    ${createListJobCard(jobs[1], null, true, true)}
                    ${createListJobCard(jobs[2], null, true, true)}
                </div>
            </div>
 
        </div>
    `;

    container.insertAdjacentHTML('afterbegin', markup);
    setJobModalPosition();

    // Prevent bg scrolling behind modal
    // document.body.style.overflow = "hidden";

    animateJobDetailsIn(event);
};

let detailsAnimating = false;
export const updateJobDetailsTable = (job) => {
    if(detailsAnimating) return;
    detailsAnimating = true;

    const jobDetailsWrapper = document.querySelector('.job-details__table-wrapper');
    const tl = gsap.timeline({ defaults: { opacity: 1, duration: .8 } });

    // Details animating out, then back in
    tl.to(jobDetailsWrapper, { 
        opacity: 0,
        x: -80,
        ease: 'ease-in',
        onComplete: () => { utils.clearElement(jobDetailsWrapper); jobDetailsWrapper.insertAdjacentHTML('afterbegin', createJobDetailsTable(job)); tl.reverse();  },
        onReverseComplete: () => { detailsAnimating = false }
    });
}

export const updateFeaturedJobsAside = (removeId, newJob) => {
    // Find the element with the selected job
    const jobs = document.querySelectorAll('.job-card--details');
    const [ oldJobElement ] = Array.from(jobs).filter(job => job.dataset.id === removeId);
    
    const newJobElement = createListJobCard(newJob, null, true, true);


    const tl = gsap.timeline({ defaults: { opacity: 0 } });
    tl.add(transitionAsideJob(oldJobElement, newJobElement));
    // tl.add(animateInAsideJob(newJobElement));
} 

const transitionAsideJob = (element, newElement) => {
    const tl = gsap.timeline();
    tl.to(element, { opacity: 0, x: 300, duration: 1, onComplete: () => populateAsideCard(element, newElement) });

    return tl;
}

const populateAsideCard = (element, newElement) => {
    const placeholder = document.createElement('div');
    placeholder.insertAdjacentHTML('afterbegin', newElement);
    const card = placeholder.firstElementChild;
    card.style.opacity = 0;

    element.insertAdjacentElement('beforebegin', card);

    // element.insertAdjacentHTML('beforebegin', newElement);
    utils.removeElement(element);
    
    animateInAsideJob(card);
}
const animateInAsideJob = (element) => {
    const tl = gsap.timeline({ defaults: { duration: 1  } });
    tl.fromTo(element, { opacity: 0, x: 300 }, { opacity: 1, x:0 });
}

const createJobDetailsTable = (job) => { 
    const markup = `
        <div class="job-details__table" data-id=${job.id}>
            <div class="job-details__header">
                <div class="job-details__title">${job.title}</div>
                <div class="job-card__pin job-card__pin--details">
                    <svg class="pin-icon">
                    <use xlink:href="svg/spritesheet.svg#pin-angle"></use>
                    </svg>
                </div>
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
            </div>
        </div>
    `;
    return markup;
}



let tl;

const animateJobDetailsIn = (event) => {
    // const {x, y} = event.path[0].getBoundingClientRect();
    tl = gsap.timeline({
    defaults: { opacity: 1, duration: .4 },
    })
    .from('.job-details', { opacity: 0 });

    tl.add(animateJobDetailsTableIn(), '<+.6');
    tl.add(animateFeaturedJobsAside(), '>-.4');
    tl.play(0);
};

const animateFeaturedJobsAside = () => {
    const tl = gsap.timeline({ defaults: { opacity: 1, duration: .4 }});
    tl.from('.job-card--details', { opacity: 0, x: 300, duration: .8, stagger: .2 }, '>-.4');
    return tl;
}
const animateJobDetailsTableIn = () => {
    const tl = gsap.timeline({ defaults: { opacity: 1, duration: .4 } });
    tl.from('.job-details__table-wrapper', { opacity: 0, y: 50, duration: .5 });
    return tl;
}

export const animateJobDetailsOut = (callback) => {
    tl.eventCallback('onReverseComplete', callback)
    tl.reverse();
};

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
