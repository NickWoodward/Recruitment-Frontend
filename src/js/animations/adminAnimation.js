import { gsap } from 'gsap';
import * as loader from '../views/loader';

const SPEED_TEST = 2;
const SPEED_SLOW = 1;
const SPEED_MEDIUM = .8;
const SPEED_FAST = .4;
const SPEED_FASTER = .2;
const SPEED_FASTEST = .1;

//// ALERTS ////

export const animateAlert = (alertWrapper, paused) => {
    
    const tl = gsap.timeline({paused: paused})
    return tl
        .fromTo(alertWrapper, 
            { autoAlpha: 0 },
            { 
                autoAlpha: 1, 
                duration: SPEED_SLOW
            }
        )
        .fromTo(alertWrapper,
            { autoAlpha: 1 },
            {
                autoAlpha: 0,
                duration: 1,
                immediateRender: false
        }, '+=1')
}

//// MODALS ////

export const animateSummaryModalIn = (modal) => {
    gsap.fromTo(modal, 
    { autoAlpha: 0,  }, 
    { autoAlpha: 1, duration: SPEED_FASTER }
);
}

export const animateSummaryModalOut = (modal) => {
    return gsap.to(modal, {
        autoAlpha: 0,
        duration: SPEED_FASTER,
        onComplete: () => {
            modal.parentElement.removeChild(modal);
        }
    })
} 

//// LOADERS ////

export const animateAdminLoadersIn = () => {
    return gsap.fromTo('.loader', {autoAlpha:0}, {autoAlpha:1, duration: SPEED_TEST});
}

export const animateAdminLoadersOut = () => {
    return gsap.fromTo(
        '.loader', 
        { autoAlpha: 1 }, 
        { 
            autoAlpha: 0, 
            duration: SPEED_FASTER,
            immediateRender: false,
            onComplete: () => {
                loader.clearLoaders()
            }
        }
    );
}

//// TABLES ////

export const animateTableContentIn = (table) => {
    const tl = gsap.timeline();

    return tl
        .fromTo('.table__heading', {autoAlpha: 0, y: -15}, {autoAlpha: 1, y: 0,  duration: .4})
        .fromTo(`.table--${table}`, {autoAlpha: 0},{autoAlpha: 1, duration: .8}, '<')
        .from(`.row--${table}`, {
            x: -15, 
            autoAlpha: 0,
            stagger: {
                each: .12
            },
            ease: 'power2.out',
        
        }, '<')
}

export const animateTableBodyIn = (table) => {
    const tl = gsap.timeline()

    return tl
        .fromTo(`.tbody--${table}`, {autoAlpha: 0},{autoAlpha: 1, duration: SPEED_FAST})
        .from(`.row--${table}`, {
            x: -15, 
            autoAlpha: 0,
            stagger: {
                each: .12
            },
            ease: 'power2.out',
        }, '<')
}

// @TODO: RENAME TO animatTableBodyOut & check that the tbody selector can be changed to a template string
export const animateTableContentOut = (table) => {
    // const tableContent = document.querySelector(`.tbody--${table}`);
    const tableContent = document.querySelector('tbody');
    
    return (
      gsap.fromTo(tableContent, { autoAlpha: 1 }, {autoAlpha: 0, duration: SPEED_SLOW, immediateRender:false})
    );
}


//// SUMMARIES ////

export const animateSummaryIn = (firstAnimation) => {
    const tl = gsap.timeline();

    // Slower animations on first render
    const duration = firstAnimation? SPEED_FASTER:SPEED_FASTEST;

    tl
    .fromTo('.summary__item--header', { autoAlpha: 0, y: 10 },{ autoAlpha: 1, y: 0 })
    .fromTo('.summary__section-content', { autoAlpha: 0, y: 10 },{ autoAlpha: 1, y: 0, stagger: duration }, `<${duration}`)
    .fromTo('.summary__btn', 
        { autoAlpha: 0, y: 10 },
        { 
            autoAlpha: 1, 
            y: function(index, target, targets) {
                if(index === 0) return 1;
                return 0;
            }, 
            stagger: { from: 'end', each: SPEED_FASTEST } 
        }, '<')    
    
    return tl;
}

export const animateSummaryOut = () => {
    const tl = gsap.timeline({
        defaults: { 
            duration: SPEED_FASTER,
            immediateRender: false 
        },
    });

    // Check for modals to remove
    const modal = document.querySelector('.summary__modal');
    const confirmation = document.querySelector('.confirmation');
    const element = modal || confirmation;

    // if(element) tl.fromTo(element, { autoAlpha: 1 }, { autoAlpha: 0, duration: 2, onComplete: () => { element.parentElement.removeChild(element) } });
    if(element) tl.add(animateSummaryModalOut(element));

    tl
    .fromTo('.summary__header-content', { autoAlpha: 1, y: 0 },{ autoAlpha: 0, y: -10 })
    .fromTo('.summary__section-content', { autoAlpha: 1, y: 0 },{ autoAlpha: 0, y:-10, stagger: SPEED_FASTEST }, '<0.1')
    .fromTo('.summary__btn', { autoAlpha: 1, y: 0 },{ autoAlpha: 0, y:10, stagger: { from: 'end', each: SPEED_FASTEST } }, '<');

    return tl;
}
