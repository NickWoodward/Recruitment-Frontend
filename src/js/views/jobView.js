import gsap from 'gsap';

import { createListJobCard } from './jobListView';
import * as utils from '../utils/utils';

export const getAction = (e) => {
    const apply = e.target.closest('.job-details__btn--apply') || e.target.closest('.job-card__apply-btn--details');
    const cancel = e.target.closest('.modal') && (!e.target.closest('.job-details__content') || e.target.closest('.job-details__back-btn') || e.target.closest('.job-details__close-btn'));
    const signIn = e.target.closest('.job-details__sign-in-btn');
    const viewMore = e.target.closest('.job-card__view-btn--details');

    console.log(apply, cancel, signIn, viewMore);
    if(apply) return 'apply';
    if(cancel) return 'cancel';
    if(signIn) return 'sign-in';
    if(viewMore) return 'view';
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

export const setJobGridHeight = () => {
    const jobGrid = document.querySelector('.jobs__grid');
    // BoundingClientRect is relative to the scroll of the page, so add the window.scrollY for 
    // a value relative to the top left of the document.
    const jobGridTop = jobGrid.getBoundingClientRect().top + window.scrollY;
    const screenHeight = window.innerHeight;

    const gridHeight = `${screenHeight - jobGridTop + 1 }px`;  // +1 displays scrollbars, which stops jankiness when updating the jobs
    jobGrid.style.minHeight = gridHeight;

}

export const setJobModalPosition = () => {
    const modal = document.querySelector('.modal');
    // const menu = document.querySelector('.jobs__menu-wrapper') || document.querySelector('.sidebar');
    const header = document.querySelector('.header');
    const { height: headerHeight } = header? header.getBoundingClientRect() : {};
    // const { width: menuWidth } = menu? menu.getBoundingClientRect() : {};
    const {width: viewPortWidth, height: viewPortHeight} = document.body.getBoundingClientRect() || {};
    
    // If there's a menu shift the modal to the right and adjust width
    // if(menuWidth) {
    //     modal.style.left = `${menuWidth}px`;
    //     modal.style.width = `${viewPortWidth - menuWidth}px`;
    // }
    // If there's a header, move down and shrink height
    if(headerHeight) {
        modal.style.top = `${headerHeight}px`;
        modal.style.height = `${viewPortHeight - headerHeight}px`;
    }
};

const createJobDetailsTable = (job) => { 
    const markup = `
    <div class="job-details__table-wrapper">
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
            <div class="job-details__row--btns">
                <button class="job-details__btn job-details__btn--apply btn">Apply</button>
            </div>
        </div>
        </div>`;
    return markup;
}
export const renderJobDetails = (job, container = document.body, jobs, event) => {
    const markup = `
        <div class="modal job-details">        
            <div class="job-details__back">
                <button class="job-details__back-btn">
                    <svg class="job-details__back-svg">
                        <use xlink:href="svg/spritesheet.svg#arrow-left">
                    </svg>
                    <div class="job-details__back-text">Back</div>
                </button>
            </div>
            <div class="job-details__content">
                    ${createJobDetailsTable(job)}
                <div class="job-details__featured-jobs">
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('afterbegin', markup);

    setJobModalPosition();

    const numFeaturedJobs = calculateNumFeaturedJobs(document.querySelector('.job-details__table-wrapper'));

    const featuredJobsList = document.querySelector('.job-details__featured-jobs');
    

    for(let x = 0; x < numFeaturedJobs && x < jobs.length; x++) {
        console.log(numFeaturedJobs, jobs);
        // console.log(job, container, jobs);
        featuredJobsList.insertAdjacentHTML('beforeend', createListJobCard(jobs[x], null, null, true));
    }

    // Prevent bg scrolling behind modal
    // document.body.style.overflow = "hidden";

    initTimeline();
    tl.play(0);
};

const calculateNumFeaturedJobs = (container) => {
    // const jobCard = document.querySelector('.job-card--details');
    const jobCardMargin = getComputedStyle(document.documentElement).getPropertyValue('--job-card-margin--details');
    const jobCardHeight = getComputedStyle(document.documentElement).getPropertyValue('--job-card-height--details');
    const containerHeight = container.clientHeight;
    const totalHeight = parseFloat(jobCardHeight) + parseFloat(jobCardMargin);

    // Top element doesn't have a margin so add to container height
    const numOfJobs = Math.floor((containerHeight + parseFloat(jobCardMargin)) / totalHeight);

    return numOfJobs;
}

const removeJobModal = () => {
    const modal = document.querySelector('.job-details');
    modal.parentElement.removeChild(modal);
}


//********** ANIMATION **********/
const tl = gsap.timeline({ 
    defaults: { 
        duration: .4 
    }, 
    onReverseComplete: () => { removeJobModal(); animationRunning = false; } 
});
let asideArray; 
let animationRunning = false;

//// MAIN TL ////
const initTimeline = () => {
    let progress = tl.progress();
    let reversed = tl.reversed();
    tl.reversed(false).progress(0, true).clear();

    tl.add(animateWrapperIn());
    tl.add(animateMainIn());
    tl.add(animateAsideIn());

    tl.reversed(reversed);
    tl.progress(progress);
}
const animateWrapperIn = () => {
    gsap.set('.job-details', { clearProps: "opacity" });

    return gsap.from('.job-details', {
        opacity: 0,
    });
}
const animateMainIn = () => {
    gsap.set('.job-details__table-wrapper', { clearProps: "all" });

    return gsap.from('.job-details__table-wrapper', {
        opacity: 0,
        y: 50,
        duration: .5
    });
}
const animateAsideIn = () => {
    asideArray = gsap.utils.toArray('.job-card--details');

    gsap.set(asideArray, { clearProps: "all" });
    
    return gsap.from(asideArray, {
      opacity: 0,
      x: 300,
      stagger: .2
    });  
}
//// MAIN TL END

//// JOB CHANGE TL ////
const changeJobs = (oldCard, newCard, oldDetails, newDetails) => {
    const swapTl = gsap.timeline({ 
        defaults: { duration: .4 },
        onStart: () => { animationRunning = true },
        onComplete: () => { animationRunning = false },
    });

    swapTl.add(animateCardOut(oldCard, newCard));
    swapTl.add(animateDetailsOut(oldDetails, newDetails), '<');

    swapTl.play(0);
}
//// JOB CHANGE TL END

//// TRANSITIONING ASIDE CARD IN ////
const animateCardOut = (oldCard, newCard) => {
    return gsap.to(oldCard, { 
                opacity: 0, 
                x: 300,
                onComplete: () => replaceCard(oldCard, newCard)
            });
}
const replaceCard = (oldCard, newCard) => {
    oldCard.insertAdjacentElement('beforebegin', newCard);
    utils.removeElement(oldCard);

    animateCardIn(newCard);
}
const animateCardIn = (newCard) => {
    gsap.fromTo(newCard, { opacity: 0, x: 300 }, { 
        opacity: 1, 
        x: 0,
    });
} 
//// END ASIDE CARD TRANSITION

//// TRANSITIONING THE JOB DETAILS IN ////
const animateDetailsOut = (oldDetails, newDetails) => {
    return gsap.to(oldDetails, { 
        opacity: 0, 
        x: -300,
        onComplete: () => { replaceDetails(oldDetails, newDetails); animateDetailsIn(newDetails) }
    });
}
const replaceDetails = (oldDetails, newDetails) => {
    oldDetails.insertAdjacentElement('beforebegin', newDetails);

    utils.removeElement(oldDetails);
    // animateDetailsIn(newDetails);
}
const animateDetailsIn = (newDetails) => {
    gsap.fromTo(newDetails, { opacity: 0, x: -300 }, {
        opacity: 1,
        x: 0,
        // initTimeline reinitialises the timeline and so includes the new card in the animation
        onComplete: initTimeline
    });
} 
//// END JOB DETAILS TRANSITION

export const updateJobView = (jobId, job, newAsideJob) => {
    const jobs = document.querySelectorAll('.job-card--details');

    // Find the current job card & create a new element to replace it
    const [ oldJobCard ] = Array.from(jobs).filter(job => job.dataset.id === jobId);
    const newJobCard = utils.templateStringToElement(createListJobCard(newAsideJob, null, null, true));

    // Create a new details panel to replace the current one
    const oldDetails = document.querySelector('.job-details__table-wrapper');
    const newDetails = utils.templateStringToElement(createJobDetailsTable(job));

    changeJobs(oldJobCard, newJobCard, oldDetails, newDetails);
}

export const getAnimationState = () => {
    return animationRunning;
}

export const animateJobDetailsOut = () => {
    if(!animationRunning) {
        tl.reverse();
        animationRunning = true;
    }
};

