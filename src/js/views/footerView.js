import { gsap } from 'gsap';
import * as loader from '../views/loader';
import * as utils from '../utils/utils';


export const getContactForm = () => {
    const email = document.querySelector('.footer__input--email').value;
    const subject = document.querySelector('.footer__input--subject').value;
    const message = document.querySelector('.footer__input--message').value;
  
  console.log(email, subject, message);
    if(email && subject && message) {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("subject", subject);
      formData.append("message", message);
  
      return formData;
    } else {
      return null;
    }
};

export const addContactLoader = () => {
    const contactForm = document.querySelector('.footer__contact');
    // Add Loader wrapper and Loader
    const wrapper = `<div class="loader-wrapper loader-wrapper--contact"></div>`;
    contactForm.insertAdjacentHTML('beforeend', wrapper);
    loader.renderLoader(document.querySelector('.loader-wrapper'), 'contact', 'beforeend');
}
export const removeContactLoader = () => {
    utils.removeElement(document.querySelector('.loader-wrapper'));
}
  

export const clearContactForm = () => {
    const inputs = document.querySelectorAll('.footer__input');
    inputs.forEach(input => input.value = '');
}

export const footerAnimation = () => {
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
  