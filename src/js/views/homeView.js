import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import { elements } from './base';
import * as utils from '../utils/utils';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// FEATURED JOBS VARIABLES
let slides;
let prevBtn;
let nextBtn;
let playBtn;

let slideIndex = 0;
let currentSlide;

let autoplay = true;
let animatingOut = false;

let timer;
// END

export const populateSearchInputs = (menuData) => {
  elements.searchInputs.forEach(input => {
    if(input.name === 'title') {
      menuData.uniqueTitles.forEach(title => {
        const option = new Option(title, title);
        input.add(option, undefined);
      });
    } 
    if(input.name === 'location') {
      menuData.uniqueLocations.forEach(location => {
        const option = new Option(location, location);
        input.add(option, undefined);
      });
    }
  });
}


////////// ANIMATIONS + PARALLAX //////////

export const initialiseScrollAnimations = () => {
  // Featured animation can't be called until after the api call
  aboutAnimation();
  whyUsAnimation();
  testimonialAnimation();
  footerAnimation();
};

export const loadingAnimation = () => {
  const tl = gsap.timeline({ 
    defaults: { opacity: 0, ease: 'back' }, 
  });
  tl.add(utils.pageFadeIn());
  tl.add(headerLoadingAnimation(), '>');
  tl.add(searchAnimation(), '<');
  tl.add(heroAnimation(), '<');
};

// FEATURED JOB ANIMATION
export const jobSliderAnimation = () => {
  // Timer and navigation controls have to created and have listeners added 
  // after the jobs are retrived asynchronously

  slides = document.querySelectorAll('.featured-jobs__slide');
  currentSlide = slides[0];

  prevBtn = document.querySelector('.featured-jobs__prev-btn')
  nextBtn = document.querySelector('.featured-jobs__next-btn')
  playBtn = document.querySelector('.featured-jobs__play-btn')

  timer = gsap.from(".featured-jobs__bar", {
    scaleX:0, 
    transformOrigin:"0% 50%", 
    duration:6, 
    onComplete:() => {
      nextSlide();
    }
  }).pause();

  nextBtn.addEventListener('click', () => {
    if(autoplay) stopAutoPlay();
    nextSlide();
  });
  prevBtn.addEventListener('click', () => {
    if(autoplay) stopAutoPlay();
    prevSlide();

  });
  playBtn.addEventListener('change', () => {
    if(autoplay) {
      autoplay = false;
      timer.pause(0);
    } else {
      autoplay = true;
      nextSlide();
    }
  });

  showSlide();
}
function showSlide() {
  animatingOut = false;
  // Change the z-index 
  currentSlide.style.zIndex = 0;
  currentSlide = slides[slideIndex];
  currentSlide.style.zIndex = 1;
  gsap.to('.featured-jobs__bar', { opacity: 1 });
  gsap.to(currentSlide, { opacity: 1, duration: .3});
  gsap.fromTo(currentSlide.querySelectorAll('.job-card'), { y:50 }, { y: 0 });

  if(autoplay) timer.restart();
}
export function hideSlide() {
  if(!animatingOut) {
    gsap.to('.featured-jobs__bar', { opacity: 0 })
    gsap.to(currentSlide, { 
      opacity: 0, 
      duration: .3, 
      onComplete: () => {
        showSlide();
        changeDot(document.querySelector(`.featured-jobs__dot-${slideIndex}`));
      } 
    });
    gsap.to(currentSlide.querySelectorAll('.job-card'), { y: 50 });
  }
  animatingOut = true;
}
function nextSlide() {
  if(slideIndex === slides.length-1) {
    slideIndex = 0;
  } else {
    slideIndex++;
  }
  hideSlide();
}
function prevSlide() {
  if(slideIndex === 0) {
    slideIndex = slides.length -1;
  } else {
    slideIndex--;
  }
  hideSlide();
}
export function stopAutoPlay() {
    playBtn.checked = false;
    playBtn.dispatchEvent(new Event('change'));
}
// export function startAutoPlay() {
//     playBtn.checked = true;
//     playBtn.dispatchEvent(new Event('change'));
//     console.log('START AUTOPLAY ' + playBtn.checked + " AUTOPLAY: " + autoplay);
// }
// Exported for navigation btn listeners added in jobListView
export function setSlideIndex(index) {
  if(autoplay) stopAutoPlay();
  slideIndex = index;
}
function animateDot(prevDot, newDot) {
  gsap.to(prevDot, { scale: 1 });
  gsap.to(newDot, { scale: 1.2 });
}
export function changeDot(newDot) {
  const prevDot = document.querySelector('.featured-jobs__dot--active');

  // Change the active button
  prevDot.classList.remove('featured-jobs__dot--active');
  newDot.classList.add('featured-jobs__dot--active');

  animateDot(prevDot, newDot);
}
// END FEATURED JOB ANIMATION

const headerLoadingAnimation = () => {
  const tl = gsap.timeline({ defaults: { opacity: 0, ease: 'ease-in' } });
  tl.from('.header__logo', { y: 10, duration: 2 })
    .from('.nav__link', { y: 10, duration: 1, stagger: { each: 0.1, from: 'end' } }, '<')
    .from('.nav__link--social', { y: -5,  duration: 1, stagger: 0.1 }, '<0.5');
  return tl;
};
const heroAnimation = () => {
  const tl = gsap.timeline({ defaults: { opacity: 0, duration: 1.5, ease: 'ease-in' } });
  tl.from('.hero__tagline--head', { x: 40 })
    .from('.hero__tagline--sub', { x: -40 }, '<')
    .from('.signup-btn--hero', {  }, '<0.3')
    .from('.browse-btn--hero', {  }, '<0.3');
  return tl;
};
const searchAnimation = () => {
    const tl = gsap.timeline({ defaults: { opacity: 0, duration: .8, ease: 'ease-out' } });
    tl.from('.roles__title', { x: -20 })
      .from('.roles__divider', { y: 20 }, '<')
      .from('.search', { duration: 2 }, '<')
      .from('.roles__item', { y: 20, stagger: 0.3 }, '<')
      .from('.search__field', { y: 20, stagger: 0.3 }, '<');
    return tl;
};

const aboutAnimation = () => {
  const tl = gsap.timeline({ 
    defaults: {
      opacity: 1, duration: .6, ease: 'ease-in'
    },
    scrollTrigger: { 
      trigger: '.about',
      start: '15% 75%',
      end: '75% 25%',
      toggleActions: 'restart none none reverse',
      // markers: true
    } 
  }).from('.about__image', { y: 60 })
    .from('.about__title', { y: 60,  }, '<')
    .from('.btn-wrapper--about .btn', { y: -70, stagger: 0 }, '<')
    .from('.about__description', { opacity: 0 }, '>-.5');

  return tl;
};

export const featuredAnimation = () => {
  const tl = gsap.timeline({ 
    defaults: { opacity: .2},
    scrollTrigger: {
      trigger: '.featured-jobs',
      start: '15% 75%',
      end: '75% 25%',
      toggleActions: 'restart none none reverse',
      // markers: true
    },
  }).from('.featured-jobs__title', { y: -10, ease: 'ease-in' })
    .from('.job-card', { ease:'ease-in-out', stagger: { each: 0.1, ease: 'ease-out' }, duration: .7 }, '<');

  return tl;
};

const whyUsAnimation = () => {
  const tl = gsap.timeline({ 
    defaults: {
      opacity: 0,
      duration: 1,
      ease: 'ease-in'
    },
    scrollTrigger: {
      trigger: '.why-us',
      start: 'top 75%',
      end: '70% 20%',
      toggleActions: 'restart none none reverse',
      // markers: true
    }
  }).from('.why-us__title', { y: 10, duration: 1 })
    .from('.why-card__image-2', { }, '<') 
    .from('.why-card__image-1', { }, '<')
    .from('.why-card__image-3', { }, '<')
    .from('.why-card__title-2', { }, '<0.2')
    .from('.why-card__title-1', { }, '<')
    .from('.why-card__title-3', { }, '<')
    .from('.why-card__text-2', { }, '<')
    .from('.why-card__text-1', { }, '<')
    .from('.why-card__text-3', { }, '<')
};

export const whyUsHoverAnimation = () => {
  let cards = document.querySelectorAll('.why-card');

  cards.forEach(card => {
    const bar = card.querySelector('.why-card__bar');
    const btnWrapper = card.querySelector('.why-card__btn-wrapper');
    const btns = card. querySelectorAll('.why-card__btn');
    let exitTime = 0;
    gsap.set(bar, { scaleX: 0, transformOrigin: "left center", duration: 0.5 });

    const tl = gsap.timeline({ paused: true })
      .to(bar, { scaleX: 1 })
      .to(btns, { color: "white", duration: .1, border: "1px solid white" }, ">-.3")
      .addPause();
    exitTime = tl.duration();
    tl.to(btns, { color: "rgba(0,0,0,0)", duration: .1,  border: "1px solid rgba(0,0,0,0)" })
      .to(bar, { x: 450 }, "<");
 


    card.addEventListener('mouseenter', () => {
      if(tl.time() < exitTime)
        tl.play();
      else 
        tl.restart();
    });
    card.addEventListener('mouseleave', () => {
      if(tl.time() < exitTime) {
        tl.reverse();
      } else {
        tl.play();
      }
    });
  });


};

const testimonialAnimation = () => {
  const tl = gsap.timeline({ 
    defaults: { opacity: 0 },
    scrollTrigger: {
      trigger: '.testimonials',
      start: 'top 80%',
      end: '30% 20%',
      toggleActions: 'restart none none reverse',
      // markers: true
    } 
  }).from('.testimonial', { stagger: { amount: 0.4, ease: 'ease-in' }, duration: 1.4 })
    .from('.testimonials__quote', { x: -30, duration: .8 }, '>');
};

const footerAnimation = () => {
  const tl = gsap.timeline({
    defaults: {
      opacity: 0, duration: 1
    },
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 75%',
      toggleActions: 'restart none none reverse',
      // markers: true
    }
  }).from('.footer__details', { scaleX: .4, transformOrigin: '0% 0%' })
    .from('.footer__contact', { scaleY: .1, transformOrigin: '0% 0%' }, '<')
    .from('.footer__address', { x: -50 }, '<0.3')
    .from('.footer__phone-email-wrapper', { x: -50 }, '<.3')
    .from('.footer__contact-row', { y: -50, stagger: 0.3 }, '<');

};

// export const initParallax = () => {
//     gsap.utils.toArray(".parallax").forEach((section, i) => {
//         section.bg = section.querySelector(".background"); 

//         // Do the parallax effect on each section
//         if (i) {
//           section.bg.style.backgroundPosition = `50% ${-innerHeight / 2}px`;

//           gsap.to(section.bg, {
//             backgroundPosition: `50% ${innerHeight / 2}px`,
//             ease: "none",
//             scrollTrigger: {
//               trigger: section,
//               scrub: true
//             }
//           });
//         } 
        
//         // the first image should be positioned against the top. Use px on the animating part to work with GSAP. 
//         else {
//           section.bg.style.backgroundPosition = "50% 0px"; 

//           gsap.to(section.bg, {
//             backgroundPosition: `50% ${innerHeight / 2}px`,
//             ease: "none",
//             scrollTrigger: {
//               trigger: section,
//               start: "top top", 
//               end: "bottom top",
//               scrub: true
//             }
//           });
//         }
//       });
// }

export const initParallax = () => {
  gsap.utils.toArray('.parallax').forEach((section, i) => {
    const image = section.querySelector('.background-image');
    
    if(i) {
        gsap.fromTo(image, {
            y: (i, el) => (500 - el.offsetHeight)
        }, {
            y: 0,
            duration: 4,
            ease: "none",
            scrollTrigger: {
                  trigger: section,
                  start: "top-=50 bottom", 
                  end: "bottom+=50 top",
                  scrub: true,
                  // markers: true,
                  toggleActions: "restart pause reverse reset"
            }
        });
    } else {
      gsap.fromTo(image, {
        y: (i, el) => (500 - (el.offsetHeight - 500))
      }, {
        y: 200,
        duration: 4,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top", 
          end: "bottom-=100 top",
          scrub: true,
          // markers: true,
          // toggleActions: "restart pause reverse reset"
        }
      });
    }
  });
  
};