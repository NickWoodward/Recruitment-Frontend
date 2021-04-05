import { elements } from './base';
import { gsap } from 'gsap';

var tl;

export const animateJobs = (batchNum) => {
    // Use autoAlpha to stop FOUC
    // tl.from(elements.jobsMain, { ease: 'linear', autoAlpha: 0})
    // .from('.logo--header', {duration: 3.5})

    // .from('.tagline__title', {y:80, duration: .6, ease: 'ease-out'}, "<")
    // .from('.tagline__sub', {duration:1}, "<.05")
    // .from('.tagline__date', {y:80, duration: 1.3}, "<.24")

    tl.from(`.job-card-${batchNum}`, { opacity: 0, transformOrigin: "50% 50%", stagger: { amount: 2.6 }, ease: 'ease-out'})
        .from('.box', {opacity: 0, transformOrigin: "50% 50%", ease: "ease-out"}, "<");

}

// Check if user has scrolled to the bottom of the visible jobs list
export const isAtBottom = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    return (Math.ceil(scrollTop) + Math.ceil(clientHeight) ) + 1 >= scrollHeight;
};

export const renderJobs = (jobs, element, batchNum) => {
    tl = gsap.timeline({defaults: {opacity: 0, ease: 'back'}});
    // Add individually so that a stagger animation can be applied
    jobs.forEach((job) => {
        // setTimeout(() => { renderJob(job, element) }, 1000)
        renderJob(job, element, batchNum);
     });
}

const renderJob = ({id, title, wage, location, description}, element, batchNum) => {
    const markup =            
    `<div class="job-card job-card-${batchNum}">
        <div class="job-card__title-wrapper">
            <h3 class="job-card__title">${title}</h3> 
            <div class="job-card__pin">
                <svg class="pin-icon">
                <use xlink:href="svg/spritesheet.svg#pin-angle"></use>

                </svg>
            </div>
        </div>
        <div class="job-card__content">
        ${id}
            <div class="job-card__location">${location}</div>
            <div class="job-card__wage">£${wage} per annum</div> 
            <div class="job-card__description">${description}</div>
        </div>    
        <div class="job-card__footer">
            <button class="job-card__view-btn">View</button>
        
        </div>
    </div>`;
    element.insertAdjacentHTML('beforeend', markup);
}

export const clearJobs = (element) => {
    while (element.firstChild) element.removeChild(element.firstChild);
}