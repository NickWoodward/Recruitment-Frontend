import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import * as utils from '../utils/utils';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);


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
    tl.add(heroAnimation(), '<');
    tl.add(searchAnimation(), '<0.2');
};

const headerLoadingAnimation = () => {
  const tl = gsap.timeline({ defaults: { opacity: 0, ease: 'ease-in' } });
  tl.from('.header__logo', { y: 10, duration: 2 })
    .from('.nav__link', { y: 10, duration: 1, stagger: { each: 0.1, from: 'end' } }, '<')
    .from('.nav__link--social', { y: -5,  duration: 1, stagger: 0.1 }, '<0.5');
  return tl;
};
const heroAnimation = () => {
  const tl = gsap.timeline({ defaults: { opacity: 0, duration: 2, ease: 'ease-in' } });
  tl.from('.hero__tagline--head', { y: 40 })
    .from('.hero__tagline--sub', { x: -40 }, '<')
    .from('.signup-btn--hero', {  }, '<0.3')
    .from('.browse-btn--hero', {  }, '<0.3');
  return tl;
};
const searchAnimation = () => {
    const tl = gsap.timeline({ defaults: { opacity: 0, duration: 1, ease: 'ease-out' } });
    tl.from('.roles__title', { x: -20, duration: 1.2 })
      .from('.roles__divider', { y: 20 }, '<')
      .from('.search', { duration: 2 }, '<')
      .from('.roles__item', { y: 20, stagger: 0.3 }, '<0.5')
      .from('.search__field', { y: 20, stagger: 0.3 }, '<0.5');
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
    }
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
      opacity: 0
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

export const initParallax = () => {
    gsap.utils.toArray(".parallax").forEach((section, i) => {
        section.bg = section.querySelector(".background"); 

        // Do the parallax effect on each section
        if (i) {
          section.bg.style.backgroundPosition = `50% ${-innerHeight / 2}px`;

          gsap.to(section.bg, {
            backgroundPosition: `50% ${innerHeight / 2}px`,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              scrub: true
            }
          });
        } 
        
        // the first image should be positioned against the top. Use px on the animating part to work with GSAP. 
        else {
          section.bg.style.backgroundPosition = "50% 0px"; 
          console.log(section.querySelector('.hero__tagline'))

          gsap.to(section.bg, {
            backgroundPosition: `50% ${innerHeight / 2}px`,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top", 
              end: "bottom top",
              scrub: true
            }
          });
        }
      });
}