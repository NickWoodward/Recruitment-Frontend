import { gsap } from 'gsap';
import * as utils from '../utils/utils';

var tl;
var featuredSlides = [];

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


export const renderFeaturedJobs = (jobs, element, jobsPerSlide) => {

    // Turn the jobs into html elements
    jobs = jobs.map(job => createJob(job, element, true));

    // Chunk the job elements into groups of x in each slide
    let slides = utils.chunk(jobs, jobsPerSlide);

    // Map each slide into a wrapper
    slides = slides.map((slide, index) => {
        return `<div class="featured-jobs__slide featured-jobs__slide-${index}">${slide}</div>`
    });

    // The slides are all on the page at once with opacity 0
    slides.forEach(slide => element.insertAdjacentHTML('beforeend', slide));

    const nextBtn = document.querySelector('.featured-jobs__next-btn');
    for(let x = 0; x < slides.length; x++) {
        const checkbox = `
            <div class="featured-jobs__checkbox featured-jobs__checkbox-${x}"></div>
        `;
        nextBtn.insertAdjacentHTML('beforebegin', checkbox);
    }
};

export const renderJobs = (jobs, element, batchNum = 0) => {
    // tl = gsap.timeline({defaults: {opacity: 0, ease: 'back'}});
    // Add individually so that a stagger animation can be applied
    jobs.forEach((job) => {
        createJob(job, element);
     });
}

const createJob = ({id, title, wage, location, description}, element, featured, batchNum) => {
    description = featured? utils.limitText(description, 168): utils.limitText(description, 168);

    const markup = `
       <div class="job-card job-card-${batchNum} ${featured? 'job-card--featured':''}" data-id=${id}>
            <div class="job-card__title-wrapper ${featured? 'job-card__title-wrapper--featured':''}">
                <h3 class="job-card__title ${featured? 'job-card__title--featured':''}">${title}</h3> 
                <div class="job-card__pin ${featured? 'job-card__pin--featured':''}">
                    <svg class="pin-icon">
                    <use xlink:href="svg/spritesheet.svg#pin-angle"></use>
                    </svg>
                </div>
            </div>
            <div class="job-card__content ${featured? 'job-card__content--featured':''}">
                <div class="job-card__location ${featured? 'job-card__location--featured':''}">
                    <svg class="job-card__location-icon"><use xlink:href="svg/spritesheet.svg#location"></svg>
                    <div class="job-card__location-text">${location}</div>
                </div>
                <div class="job-card__wage ${featured? 'job-card__wage--featured':''}">
                    <svg class="job-card__wage-icon"><use xlink:href="svg/spritesheet.svg#sterling"></use></svg>
                    <div class="job-card__wage-text">£${wage}</div>

                </div> 
                <div class="job-card__extra ${featured? 'job-card__extra--featured':''}">
                    <svg class="job-card__extra-icon"><use xlink:href="svg/spritesheet.svg#clock"></svg>
                    <div class="job-card__type ${featured? 'job-card__type--featured':''}">Permanent</div>
                    <div class="job-card__position ${featured? 'job-card__position--featured':''}">In House</div>
                    <div class="job-card__PQE ${featured? 'job-card__PQE--featured':''}">PQE: 3+</div>
                </div> 

                <div class="job-card__description ${featured? 'job-card__description--featured':''}">${description}</div>
            </div>    
            <div class="job-card__footer">
                <div class="job-card__btn-wrapper">
                    <button class="job-card__view-btn">View More</button>
                    <button class="job-card__apply-btn">Apply</button>
                </div>
                <div class="job-card__date">Posted: 3+ days ago</div>
            </div>
        </div>                 
    `;

    if(featured) return markup;

    element.insertAdjacentHTML('beforeend', markup);
}

export const clearJobs = (element) => {
    while (element.firstChild) element.removeChild(element.firstChild);
}