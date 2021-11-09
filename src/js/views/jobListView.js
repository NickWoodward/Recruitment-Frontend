import gsap from 'gsap/all';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import * as utils from '../utils/utils';
import { setSlideIndex, hideSlide, changeDot } from './homeView';

gsap.registerPlugin(ScrollTrigger);

// @TODO: This file has the jobs list and the featured jobs list mixed together - separate

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

export const initialiseScrollAnimation = () => {
    console.log('initialising');

    jobsMenuScrollAnimation();
}

const jobsMenuScrollAnimation = () => {
    const tl = gsap.timeline({ 
        defaults: { duration: .6 },
        scrollTrigger: {
            trigger: '.jobs-menu',
            start: 'top 70px',
            end: 'bottom bottom',
            toggleActions: 'restart none none reverse',
            // markers: true
        },
        
    }).to('.jobs__menu-wrapper', { scaleY: .8, transformOrigin: '0 0', backgroundColor: 'rgba(255,255,255, 1)', borderBottom:'1px solid lightgrey' }
    ).to('.jobs-menu', { scaleX: .8, transformOrigin: '0 0' }, '<'
    ).to('.jobs-menu__content', { scale: 1.3, transformOrigin: '0 0', borderTopWidth: '0px' }, '<');

    return tl;
}

// Check if user has scrolled to the bottom of the visible jobs list
export const isAtBottom = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    return (Math.ceil(scrollTop) + Math.ceil(clientHeight) ) + 1 >= scrollHeight;
};


export const renderFeaturedJobs = (jobs, element, jobsPerSlide) => {

    // Turn the jobs into an array of html elements
    jobs = jobs.map(job => createJobCard(job, null, true));

    // Chunk the job elements into groups of x in each slide
    let slides = utils.chunk(jobs, jobsPerSlide);

    // The slides are all on the page at once with opacity 0
    slides.forEach((slide, index) => {
        element.insertAdjacentHTML('beforeend', `<div class="featured-jobs__slide featured-jobs__slide-${index}">${slide.join('')}</div>`)
    });

    // Add a navigation dot per slide
    const nextBtn = document.querySelector('.featured-jobs__next-btn');
    for(let x = 0; x < slides.length; x++) {
        // const checkbox = `
        //     <div class="featured-jobs__checkbox featured-jobs__checkbox-${x}"></div>
        // `;
        // nextBtn.insertAdjacentHTML('beforebegin', checkbox);
        const dot = document.createElement('div');
        dot.setAttribute('class', `featured-jobs__dot featured-jobs__dot-${x} ${x === 0? 'featured-jobs__dot--active':''}`);
        nextBtn.insertAdjacentElement('beforebegin', dot);

        dot.addEventListener('click', () => {
            setSlideIndex(x);
            hideSlide();

            changeDot(dot);
        });
    }
};

export const renderJobs = (jobs, element, batchNum = 0) => {
    // tl = gsap.timeline({defaults: {opacity: 0, ease: 'back'}});
    // Add individually so that a stagger animation can be applied
    jobs.forEach((job) => {
        createJobCard(job, element);
     });
}

export const createJobCard = ({id, title, wage, location, description}, element, featured, details, batchNum) => {
    // description = featured? utils.limitText(description, 168): utils.limitText(description, 168);

    const markup = `
       <div class="job-card job-card-${batchNum} ${featured? 'job-card--featured':''} ${details? 'job-card--details':''}" data-id=${id}>
            <div class="job-card__title-wrapper ${featured? 'job-card__title-wrapper--featured':''} ${details? 'job-card__title-wrapper--details':''}">
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
                <div class="job-card__extra ${featured? 'job-card__extra--featured':''} ${details? 'job-card__extra--details':''}">
                    <svg class="job-card__extra-icon"><use xlink:href="svg/spritesheet.svg#clock"></svg>
                    <div class="job-card__extra-wrapper">    
                        <div class="job-card__type ${featured? 'job-card__type--featured':''}">Permanent</div>
                        <div class="job-card__position ${featured? 'job-card__position--featured':''}">In House</div>
                        <div class="job-card__PQE ${featured? 'job-card__PQE--featured':''}">PQE: 3+</div>
                    </div>        
                </div> 

                ${!details? 
                    `<div class="job-card__description ${featured? 'job-card__description--featured':''}">${description}</div>`:''
                }
            </div>    
            <div class="job-card__footer">
                <div class="job-card__btn-wrapper">
                    <button class="job-card__view-btn ${details? 'job-card__view-btn--details':''}">View More</button>
                    <button class="job-card__apply-btn ${details? 'job-card__apply-btn--details':''}">Apply</button>
                </div>
                <div class="job-card__date">Posted: 3+ days ago</div>
            </div>
        </div>                 
    `;

    if(!element) return markup;
    console.log('oh no');
    element.insertAdjacentHTML('beforeend', markup);
}

export const createListJobCard = ({id, title, wage, location, description}, element, featured, details) => {
    console.log(id, title, wage, location);
    const markup = `
        <div class="job-card ${featured? 'job-card--featured':''} ${details? 'job-card--details':''}" data-id=${id}>
            <div class="job-card__title-wrapper ${featured? 'job-card__title-wrapper--featured':''} ${details? 'job-card__title-wrapper--details':''}">
                <h3 class="job-card__title job-card__title--details ${featured? 'job-card__title--featured':''}">${title}</h3> 
                <div class="job-card__pin ${featured? 'job-card__pin--featured':''}">
                    <svg class="pin-icon">
                    <use xlink:href="svg/spritesheet.svg#pin-angle"></use>
                    </svg>
                </div>
            </div>
            <div class="job-card__content-wrapper job-card__content-wrapper--details">
                <div class="job-card__content ${featured? 'job-card__content--featured':''} job-card__content--details">
                    <div class="job-card__location ${featured? 'job-card__location--featured':''}">
                        <svg class="job-card__location-icon"><use xlink:href="svg/spritesheet.svg#location"></svg>
                        <div class="job-card__location-text">${location}</div>
                    </div>
                    <div class="job-card__wage ${featured? 'job-card__wage--featured':''}">
                        <svg class="job-card__wage-icon"><use xlink:href="svg/spritesheet.svg#sterling"></use></svg>
                        <div class="job-card__wage-text">£${wage}</div>

                    </div> 
                        <div class="job-card__extra ${featured? 'job-card__extra--featured':''} ${details? 'job-card__extra--details':''}">
                            <svg class="job-card__extra-icon"><use xlink:href="svg/spritesheet.svg#clock"></svg>
                            <div class="job-card__extra-wrapper--details">
                                <div class="job-card__type ${featured? 'job-card__type--featured':''}">Permanent</div>
                                <div class="job-card__position ${featured? 'job-card__position--featured':''} job-card__position--details">In House</div>
                                <div class="job-card__PQE ${featured? 'job-card__PQE--featured':''} job-card__PQE--details">PQE: 3+</div>
                            </div>
                        </div> 
                </div>    
                <div class="job-card__btn-wrapper job-card__btn-wrapper--details">
                    <button class="job-card__view-btn ${details? 'job-card__view-btn--details':''}">View More</button>
                    <button class="job-card__apply-btn ${details? 'job-card__apply-btn--details':''}">Apply</button>
                </div>
            </div>
        </div>                 
    `;
    if(!element) return markup;
    element.insertAdjacentHTML('beforeend', markup);
}

export const clearJobs = (element) => {
    while (element.firstChild) element.removeChild(element.firstChild);
}