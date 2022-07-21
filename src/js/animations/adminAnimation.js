import { gsap } from 'gsap';
import * as loader from '../views/loader';

const SPEED_TEST = 2;
const SPEED_SLOW = 1;


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
    { autoAlpha: 1, duration: .2 }
);
}

export const animateSummaryModalOut = (modal) => {
    return gsap.to(modal, {
        autoAlpha: 0,
        duration: .2,
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
            duration:.2,
            immediateRender: false,
            onComplete: () => {
                loader.clearLoaders()
            }
        }
    );
}

//// PLACEHOLDERS ////
export const animateTablePlaceholderIn = (placeholder) => {
    return gsap.fromTo(placeholder, { autoAlpha: 0 }, { autoAlpha: 1, duration: .4 });
};
export const animateTablePlaceholderOut = (placeholder) => {
    return gsap.to(placeholder, { 
        autoAlpha: 0, 
        duration: .4, 
        onComplete: () => placeholder.parentElement.removeChild(placeholder) 
    });
}

//// PAGINATION ////
export const animateTablePaginationOut = (element) => {
    console.log(element.children);
    return gsap.to(element.children, { 
        autoAlpha: 0, 
        y: -10, 
        stagger: .1, 
    });
}

export const getPaginationSelectAnimations = () => {
    return [ animatePaginationSelectOut, animatePaginationSelectIn ];
}

const animatePaginationSelectOut = (element) => {
    return gsap.fromTo(element, { autoAlpha:1, y: 0 }, { autoAlpha:0, y:-10, duration:.2, ease: 'ease-in' })
}
const animatePaginationSelectIn = (element) => {
    return gsap.fromTo(element, { autoAlpha:0, y: -10 }, { autoAlpha:1, y:0, duration:.2, ease: 'ease-out' })
} 

//// SELECT ////
export const getSelectAnimations = () => {
    return [ animateSelectOut, animateSelectIn ];
}

const animateSelectOut = (element) => {
    return gsap.fromTo(element, { autoAlpha:1 }, { autoAlpha:0, duration:.2, ease: 'ease-in', immediateRender:false  })
}
const animateSelectIn = (element) => {
    return gsap.fromTo(element, { autoAlpha:0 }, { autoAlpha:1, duration:.2, ease: 'ease-out'})
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
        .fromTo(`.tbody--${table}`, {autoAlpha: 0},{autoAlpha: 1, duration: .2})
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
    const tableContent = document.querySelector(`.tbody--${table}`);
    
    return (
      gsap.fromTo(tableContent, { autoAlpha: 1 }, {autoAlpha: 0, duration: SPEED_SLOW, immediateRender:false})
    );
}


//// SUMMARIES ////

export const animateSummaryIn = (firstAnimation) => {
    const tl = gsap.timeline();
    console.log('SUMMARY IN');

    // Slower animations on first render
    const duration = firstAnimation? .4:.3;

        tl
        .fromTo('.summary__item--header', { autoAlpha: 0, y: 15 },{ autoAlpha: 1, y: 0, stagger: duration })
        .fromTo('.summary__section-content', { autoAlpha: 0, y: 15 },{ autoAlpha: 1, y: 0, stagger: duration }, `<.1`)
        .fromTo('.summary__btn', 
            { autoAlpha: 0, y: 10 },
            { 
                autoAlpha: 1, 
                y: function(index, target, targets) {
                    if(index === 0) return 1;
                    return 0;
                }, 
                stagger: { from: 'end', each: .1 } 
            }, 
        '<');
 

    return tl;
}

export const animateCompanySummaryIn = (jobsLength) => {
    const tl = gsap.timeline()
      .add(animateHeadingIn(), '<')
      .add(animateContactSectionIn(), `<.06`);

      if(jobsLength > 0) {
        //   tl.add(animateTableBodyIn('company-jobs'), `<.2`);
          // OR
          tl.add(animateCompanyJobSectionIn(document.querySelector('.tbody--company-jobs')), '<')

      } else {
          tl.add(animateTablePlaceholderIn(document.querySelector('.company-jobs-placeholder')), '<')
      }

    tl.fromTo('.pagination__content--company-jobs', {autoAlpha: 0, y:3 }, {autoAlpha:1, y: 0, duration: .35, ease: 'ease-out'}, '<')
    .add(animateContactControlsIn(), `<`)
    .add(animateAddressSectionIn(), `<.06`)
    .add(animateAddressControlsIn(), `<`)
    .add(animateCompanyJobControlsIn(), `<`);

    return tl;
}

export const animateSummaryOut = (page) => {
    const tl = gsap.timeline();

    // Check for modals to remove
    const modal = document.querySelector('.summary__modal');
    const confirmation = document.querySelector('.confirmation');
    const element = modal || confirmation;

    if(element) tl.add(animateSummaryModalOut(element));

    switch(page) {
        case 'companies': {
            tl.add(animateCompanySummaryOut());
        
            break;
        }
        default:
            // tl
            // .fromTo('.summary__header-content', { autoAlpha: 1, y: 0 },{ autoAlpha: 0, y: -10 , duration: .3})
            // .fromTo('.summary__section-content', { autoAlpha: 1, y: 0 },{ autoAlpha: 0, y:-10, stagger: { each: .1 } }, '<')
            // .fromTo('.summary__btn', { autoAlpha: 1, y: 0 },{ autoAlpha: 0, y:10, stagger: { from: 'end', each: .1 } }, '<');
            // console.log(tl.getChildren());
            
        tl
        .fromTo('.summary__item--header', { autoAlpha: 1, y: 0 },{ autoAlpha: 0, y: -15, stagger: .2 })
        .fromTo('.summary__section-content', { autoAlpha: 1, y: 0 },{ autoAlpha: 0, y: -15 }, `<.1`)
        .fromTo('.summary__btn', 
            { autoAlpha: 1, y: 0 },
            { 
                autoAlpha: 0, 
                y:15, 
                stagger: { from: 'end', each: .1 } 
            }, 
        '<');
    }

    return tl;
}

const animateCompanySummaryOut = () => {

    const tl = gsap.timeline()
        .add(animateHeadingOut())
        .add(animateContactSectionOut(), `<.06`)

    const tbody = document.querySelector('.tbody--company-jobs');

    // If there's a tbody, animate it out and remove it
    if(tbody) {
        tl.add(animateCompanyJobSectionOut(tbody), `<`);
    } 

    // If there's a placeholder animate it out and remove it
    const placeholder = document.querySelector('.company-jobs-placeholder');
    if(placeholder) {
        tl.add(animateTablePlaceholderOut(placeholder), '<');
    }
    

    tl.to('.pagination__content--company-jobs', {autoAlpha: 0, y:3, duration: .3, ease: 'ease-out'}, '<')
      .add(animateContactControlsOut(), `<`)
      .add(animateAddressSectionOut(), `<.06`)
      .add(animateAddressControlsOut(), `<`)
      .add(animateCompanyJobControlsOut(), `<`);

    return tl;
}


const animateHeadingOut = () => {
    return gsap.to(
        '.summary__item--header', 
        { autoAlpha: 0, y: -3, duration: .3, ease: 'ease-out' }
    );
}
const animateHeadingIn = () => {
    return gsap.fromTo(
        '.summary__item--header', 
        { autoAlpha: 0, y: 3 }, 
        { autoAlpha: 1, y: 0, duration: .35,  ease: 'ease-out' }
    );
}

const animateContactSectionOut = () => {
    return gsap.timeline()
        .to('.summary__section-content--contacts', { autoAlpha: 0, y: -3, duration: .3,  ease: 'ease-out' })
        .to('.pagination__content--company-contacts', { autoAlpha: 0, y: -3, duration: .3, ease: 'ease-out' }, '<')
}
function animateContactSectionIn() {
    return gsap.timeline()
        .fromTo(
            '.summary__section-content--contacts', 
            { autoAlpha: 0, y: 3 },
            { autoAlpha: 1, y: 0, duration: .35, ease: 'ease-out' })
        .fromTo('.pagination__content--company-contacts', {autoAlpha: 0, y:3 }, {autoAlpha:1, y: 0, duration: .35, ease: 'ease-out'}, '<')
}

function animateContactControlsOut() {
    return gsap.to('.summary__btn--contacts', { autoAlpha: 0, y: -3, stagger: { amount: 0.1 },  ease: 'ease-out' });
}
function animateContactControlsIn() {
    return gsap.fromTo(
      '.summary__btn--contacts', 
      { autoAlpha: 0, y: 3 },
      { autoAlpha: 1, y: 0, stagger: { amount: 0.2 }, ease: 'ease-out' }
    );
}

function animateAddressSectionOut() {
    return gsap.timeline()
        .to('.summary__section-content--addresses', { autoAlpha: 0, y: -3, duration: .3,  ease: 'ease-out' })
        .to('.pagination__content--company-addresses', {autoAlpha:0, y: -3, duration: .3, ease: 'ease-out'}, '<')

}
function animateAddressSectionIn() {
    return gsap.timeline()
        .fromTo(
            '.summary__section-content--addresses', 
            { autoAlpha: 0, y: 3 },
            { autoAlpha: 1, y: 0, duration: .35, ease: 'ease-out' } )
        .fromTo('.pagination__content--company-addresses', {autoAlpha: 0, y:3 }, {autoAlpha:1, y: 0, duration: .35, ease: 'ease-out'}, '<')

}

function animateAddressControlsOut() {
    return gsap.to('.summary__btn--addresses', { autoAlpha: 0, y: -3, stagger: { amount: 0.1 },  ease: 'ease-out' });
}
function animateAddressControlsIn() {
    return gsap.fromTo(
        '.summary__btn--addresses', 
        { autoAlpha: 0, y: 3 },
        { autoAlpha: 1, y: 0, stagger: { amount: 0.2 }, ease: 'ease-out'}
    );
}

function animateCompanyJobSectionOut(tbody) {
    return gsap.timeline().to('.row--company-jobs', 
        { 
            autoAlpha: 0, 
            y: -8, 
            stagger: .1, 
    
            onComplete: () => { 
                tbody.parentElement.removeChild(tbody);
            }
        })

}
function animateCompanyJobSectionIn() {

    return gsap.timeline().fromTo(
      '.row--company-jobs', 
      { autoAlpha: 0, y: 8 },
      { 
          autoAlpha: 1, 
          y: 0, 
          stagger: .1, 
      })

}

function animateCompanyJobControlsOut() {
    return gsap.to('.summary__btn--company-jobs', { autoAlpha: 0, y: -3, stagger: { amount: 0.1 },  ease: 'ease-out'  });
}
function animateCompanyJobControlsIn() {
    return gsap.fromTo(
      '.summary__btn--company-jobs', 
      { autoAlpha: 0, y: 3 },
      { autoAlpha: 1, y: 0, stagger: { amount: 0.2 }, ease: 'ease-out' }
    );
}