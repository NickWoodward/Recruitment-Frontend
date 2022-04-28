import gsap from 'gsap/gsap-core';
import * as utils from '../utils/utils';

let alertAnimationInProgress = false;

export const displayOptionModal = (message, container) => {
    const modal = `
        <div class='modal'>
            <div class='edit-notification'>
                Hello
            </div>
        </div>
    `;

    container.insertAdjacentHTML('afterbegin', modal);
}

// export const displayAlert = (msg, success, element) => {
//     const markup = `
//     <div class="alert-wrapper">
//         <div class="alert alert--success">
//             <div class="alert__icon alert__icon--${success?'success':'error'}">
//                 <svg class="alert__svg alert__svg--${success?'success':'error'}"><use xlink:href="svg/spritesheet.svg#${success?'tick':'cross'}"></svg>
//             </div>
//             <div class="alert__status">${ success? 'Success':'Error' }</div>
//             <div class="alert__message">${msg}</div>
//         </div>
//     </div>`;
//     element.insertAdjacentHTML('afterbegin', markup);

//     console.log(alertAnimationInProgress);
//     // if(alertAnimationInProgress) utils.removeElement(document.querySelector('.alert-wrapper'));

//     addAlertAnimation();
// }

export const getAlert = (msg, success) => {
    return `
        <div class="alert alert--success">
            <div class="alert__icon alert__icon--${success?'success':'error'}">
                <svg class="alert__svg alert__svg--${success?'success':'error'}"><use xlink:href="svg/spritesheet.svg#${success?'tick':'cross'}"></svg>
            </div>
            <div class="alert__status">${ success? 'Success':'Error' }</div>
            <div class="alert__message">${msg}</div>
        </div>
    `;
}

const addAlertAnimation = () => {

    alertAnimationInProgress = true;

    const tl = gsap.timeline({ 
        defaults: { opacity: 0, duration: .5}
    })
    .fromTo('.alert-wrapper', { opacity: 0 },{ opacity: 1 })
    .to('.alert-wrapper', { 
        opacity: 0,
        onComplete: () => {
            utils.removeElement(document.querySelector('.alert-wrapper'));
            alertAnimationInProgress = false;
            
        } 
    }, '>5');
};
