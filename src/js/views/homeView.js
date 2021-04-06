import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({ 
    defaults: { opacity: 0, ease: 'back' }, 
    
});

export const loadedAnimation = () => {
    console.log('animating');
    tl.from('.header', { autoAlpha: 0, ease: 'linear' })
        .from('.hero', { autoAlpha: 0, ease: 'linear' }, '<')
        .from('.candidate-search', { autoAlpha: 0, ease: 'linear' }, '<')
        .from('.header__logo', { y: 10, opacity: 0, duration: 2.3 }, '<')
        .from('.hero__tagline', { x: 40, duration: 2, ease: 'ease-out' }, '<')
        .from('.roles__title', { x: -20, duration: 1.2, ease:'ease-out' }, '<')
        .from('.roles__item', { y: 20, stagger: 0.3, duration: 1, ease: 'ease-out' }, '<')
        .from('.search__field', { y: 20, stagger: 0.3, duration: 1, ease: 'ease-out' }, '<' )
        .from('.search', { duration: 2, ease: 'ease-out' }, '<.02')
        .from('.nav__link', { y: 10, opacity: 0, duration: 1, stagger: { each: 0.2, from: 'end' }, ease:'ease-in' }, '<')
        .from('.nav__link--social', { y: -5, opacity: 0, duration: 1, stagger: { each: 0.1, from: 'start' }, ease: 'ease-in' }, '<0.5')
}

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