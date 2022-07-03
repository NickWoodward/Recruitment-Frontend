import { elements, elementStrings } from './base';
import * as utils from '../utils/utils';
import * as userForm from './userForm';
import * as jobForm from './jobForm';
import { renderJobDetails } from './jobView';
import * as tableView from './tableView';
import * as loader from './loader';
import Select from './customSelect';

import gsap from 'gsap';

let summaryAnimationInProgress = false;

export const renderContent = (content, container) => {
    content.forEach(item => {
        container.insertAdjacentHTML('beforeend', item);

    });
};

export const forceDownload = (res, filename, ext) => {
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}`);
    document.body.appendChild(link);
    link.click();
};

// { company, jobsId, applicantId, position, personId, firstName, lastName, cvUrl }
// return div elements with the following datasets and add additional row controls:
// controls: delete/create
// firstName/lastName : personId
// position : jobsId
// 
export const formatApplications = (applications) => {
    // Headers should match the returned divs in createApplicationElement
    const headers = ['ID', 'Name','Surname','Position','Company','CV', 'Applied']
    const rows = applications.map(application => {
        
        return createApplicationElement(formatProperties(application, ['cvUrl']));
    });
    return { headers, rows };
}; 
const createApplicationElement = ({
    id,
    applicationDate,
    applicantId,
    applicant: {
        cvUrl,
        person: {
            id: personId,
            firstName,
            lastName
        }
    },
    job: {
        id: jobId,
        title,
        company: {
            id: companyId,
            name: companyName
        }
    }
}) => {

    let cvType;
    if(cvUrl) cvType = cvUrl.indexOf('doc') !== -1? 'doc':'pdf';

    const row = [
        `<td class="td-data--applicationId" data-application=${id}>${id}</td>`,
        `<td class="td-data--first-name" data-id=${personId}>${firstName}</td>`,
        `<td class="td-data--last-name" data-id=${personId}>${lastName}</td>`,
        `<td class="td-data--position" data-id=${jobId}>${title}</td>`,
        `<td class="td-data--company data-id=${companyId}">${companyName}</td>`,
        `<td class="td-data--cv" data-cvUrl=${applicantId}>
            <div class="cv-wrapper">
                <svg class="cv-icon">
                    ${cvUrl? 
                        (cvType === 'doc'? 
                            '<use xlink:href="svg/spritesheet.svg#doc">':
                            '<use xlink:href="svg/spritesheet.svg#pdf">'
                        ): '<use xlink:href="svg/spritesheet.svg#ios-minus-empty">'}
                </svg>
            </div>
        </td>`,
        `<td class="td-data--application-date data-id=${id}">${applicationDate}</td>`,

    ];
    return row;
};
const formatProperties = (object, skip) => {
    for(const key in object) {
        const value = object[key];
        if(!skip.includes(key)) object[key] = utils.capitalise(value);
    }
    return object;
};

// export const populateApplicationSummary = ({ 
//     id, 
//     applicationDate, 
//     jobId, 
//     job: { 
//         title, 
//         position, 
//         jobType, 
//         pqe, 
//         location, 
//         company: { 
//             id: 
//             companyId, 
//             name,
//             people: [ 
//                 {
//                     contact: { position: contactPosition },
//                     firstName: contactFirstName,
//                     lastName: contactLastName,
//                     phone: contactPhone,
//                     email: contactEmail
//                 } 
//             ]
//         } 
//     }, 
//     applicant: { 
//         person: { 
//             firstName, 
//             lastName, 
//             id: personId, 
//             email, 
//             phone 
//         } 
//     } 
// }) => {
//     const applicationSummary = document.querySelector('.application-summary');
//     console.log('valled?');
//     // applicationSummary.setAttribute('data-id', application.applicantId);
//     document.querySelector('.application-summary__id').innerText = `ID: ${id}`;
//     document.querySelector('.application-summary__field--date').innerText = applicationDate;

//     document.querySelector('.application-summary__field--title').innerText = title;
//     document.querySelector('.application-summary__field--company').innerText = name;
//     document.querySelector('.application-summary__field--contact-firstname').innerText = contactFirstName;
//     document.querySelector('.application-summary__field--contact-surname').innerText = contactLastName;
//     document.querySelector('.application-summary__field--contact-position').innerText = contactPosition;
//     document.querySelector('.application-summary__field--contact-phone').innerText = contactPhone;
//     document.querySelector('.application-summary__field--contact-email').innerText = contactEmail;

//     document.querySelector('.application-summary__field--applicant-firstname').innerText = firstName;
//     document.querySelector('.application-summary__field--applicant-surname').innerText = lastName;
//     document.querySelector('.application-summary__field--email').innerText = email;
//     document.querySelector('.application-summary__field--phone').innerText = phone;
    
//     // addCvElement(user);
// }

// const createApplicationSummary = (application) => {
//     const markup  = `
//         <div class="summary-wrapper">
//             <div class="application-summary summary">
//                 <div class="application-summary__details">

//                     <div class="application-summary__section application-summary__section--application">
//                         <div class="application-summary__id"></div>

//                         <div class="application-summary__item">
//                             <div class="application-summary__field application-summary__field--date" data-placeholder="Date" contenteditable=false></div>
//                         </div>
//                     </div>

//                     <div class="summary__heading">Position</div>

//                     <div class="application-summary__section application-summary__section--job">
//                         <div class="application-summary__item">
//                             <div class="application-summary__label application-summary__label--title">Title:</div>
//                             <div class="application-summary__field application-summary__field--title" data-placeholder="Job Title" contenteditable=false></div>
//                         </div>
//                         <div class="application-summary__item">
//                             <div class="application-summary__label application-summary__label--company">Company:</div>
//                             <div class="application-summary__field application-summary__field--company" data-placeholder="Company" contenteditable=false></div>
//                         </div>
//                         <div class="application-summary__item">
//                             <div class="application-summary__label application-summary__label--contact-name">Contact:</div>
//                             <div class="application-summary__field application-summary__field--contact-firstname" data-placeholder="Contact Name" contenteditable=false></div>
//                             <div class="application-summary__field application-summary__field--contact-surname" data-placeholder="Contact Surname" contenteditable=false></div>
//                         </div>
//                         <div class="application-summary__item">
//                             <div class="application-summary__label application-summary__label--contact-position">Contact Position:</div>
//                             <div class="application-summary__field application-summary__field--contact-position" data-placeholder="Contact Position" contenteditable=false></div>
//                         </div>
//                         <div class="application-summary__item">
//                             <div class="application-summary__label application-summary__label--contact-phone">Contact Phone:</div>
//                             <div class="application-summary__field application-summary__field--contact-phone" data-placeholder="Contact Phone" contenteditable=false></div>
//                         </div>
//                         <div class="application-summary__item">
//                             <div class="application-summary__label application-summary__label--contact-email">Contact Email:</div>
//                             <div class="application-summary__field application-summary__field--contact-email" data-placeholder="Contact Email" contenteditable=false></div>
//                         </div>
//                     </div>

//                     <div class="application-summary__section application-summary__section--person">
//                         <div class="summary__heading">Applicant</div>

//                         <div class="application-summary__item">
//                             <div class="application-summary__label application-summary__label--applicant-name">Applicant Name:</div>
//                             <div class="application-summary__field application-summary__field--applicant-firstname" data-placeholder="Applicant Name" contenteditable=false></div>
//                             <div class="application-summary__field application-summary__field--applicant-surname" data-placeholder="Applicant Surname" contenteditable=false></div>
//                         </div>
//                         <div class="application-summary__item">
//                             <div class="application-summary__label application-summary__label--email">Email:</div>
//                             <div class="application-summary__field application-summary__field--email" data-placeholder="Email" contenteditable=false></div>
//                         </div>
//                         <div class="application-summary__item">
//                             <div class="application-summary__label application-summary__label--phone">Phone:</div>
//                             <div class="application-summary__field application-summary__field--phone" data-placeholder="Phone" contenteditable=false></div>
//                         </div>
//                     </div>
                    
//                 </div>

//                 <div class="application-summary__controls">
//                     <div class="application-summary__btn application-summary__btn--new">
//                         <svg class="application-summary__new-icon application-summary__icon">
//                             <use xlink:href="svg/spritesheet.svg#add">
//                         </svg>
//                     </div>
                  
//                     <div class="application-summary__btn application-summary__btn--edit">
//                         <svg class="application-summary__edit-icon application-summary__icon">
//                             <use xlink:href="svg/spritesheet.svg#edit-np1">
//                         </svg>
//                     </div>
//                     <div class="application-summary__btn application-summary__btn--delete">
//                         <svg class="application-summary__delete-icon application-summary__icon">
//                             <use xlink:href="svg/spritesheet.svg#delete-np1">
//                         </svg>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     `;

//     return markup;
// };

export const animateSummaryWrapperOut = () => {
    return gsap.to('.summary-wrapper', {
        autoAlpha: 0,
        ease: 'ease-in',
        duration: .3
    })
}
export const animateSummaryWrapperIn = () => {
    return gsap.fromTo('.summary-wrapper', 
        {
            autoAlpha: 0
        },
        {
            autoAlpha: 1, 
            immediateRender: false,
            duration: .6,
            ease: 'ease-out'
        }
    )
}

export const switchSummary = (summary, newSummary) => {

    const summaryWrapper = document.querySelector('.summary-wrapper');
// console.log('swapping:', summary, summaryWrapper);
    // Remove the old summary and insert the new one
    summary.parentElement.removeChild(summary);
    summaryWrapper.insertAdjacentHTML('afterbegin', newSummary);
}

export const removeSummaryModals = () => {
    const modal = document.querySelector('.summary__modal');
    const confirmation = document.querySelector('.confirmation');
    if(modal) {
        modal.parentElement.removeChild(modal)
    };
    if(confirmation) {
        confirmation.parentElement.removeChild(confirmation)  
    };
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

export const swapSummary = (oldSummary, newSummary, cb) => {

    const summaryWrapper = document.querySelector('.summary-wrapper');

    const modal = document.querySelector('.summary__modal');
    const confirmation = document.querySelector('.confirmation');

    const tl = gsap.timeline();
    tl
      .to(summaryWrapper, { 
        autoAlpha: 0, 
        ease: 'ease-in',
        duration: .3
      })
      .add(() => {
        oldSummary.parentElement.removeChild(oldSummary);
        summaryWrapper.insertAdjacentHTML('afterbegin', newSummary);
        document.querySelector('.summary').addEventListener('click', cb)


        if(modal) {
            modal.parentElement.removeChild(modal)
        };
        if(confirmation) {
            confirmation.parentElement.removeChild(confirmation)
            
        };

        // This is the new summary
      }).fromTo(
          summaryWrapper, 
          { 
              autoAlpha: 0
          }, 
          { 
              autoAlpha: 1, 
              immediateRender: false,
              duration: .6,
              ease: 'ease-out'
          }
        )
}

export const animateJobSummaryIn = (firstAnimation) => {
    const tl = gsap.timeline();

    // Slower animations on first render
    const duration = firstAnimation? 0.2:0.1;

    tl
    .fromTo('.summary__item--header', { autoAlpha: 0, y: 10 },{ autoAlpha: 1, y: 0 })
    .fromTo('.summary__content', { autoAlpha: 0, y: 10 },{ autoAlpha: 1, y: 0, stagger: duration }, `<${duration}`)
    .fromTo('.summary__btn--jobs', 
        { autoAlpha: 0, y: 10 },
        { 
            autoAlpha: 1, 
            y: function(index, target, targets) {
                if(index === 0) return 1;
                if(index === 1) return 2;
                return 0;
            }, 
            stagger: { from: 'end', each: .1 } 
        }, '<')    
    
    return tl;
}



export const animateSummaryOut = () => {
    const tl = gsap.timeline({
        defaults: { 
            duration: .2,
            immediateRender: false 
        },
    });

    tl
    .fromTo('.summary__header-content', { autoAlpha: 1, y: 0 },{ autoAlpha: 0, y: -10 })
    .fromTo('.summary__content', { autoAlpha: 1, y: 0 },{ autoAlpha: 0, y:-10, stagger: 0.1 }, '<0.1')
    .fromTo('.summary__btn', { autoAlpha: 1, y: 0 },{ autoAlpha: 0, y:10, stagger: { from: 'end', each: .1 } }, '<');

    return tl;
}
export const animateSummaryIn = (firstAnimation) => {
    const tl = gsap.timeline();

    // Slower animations on first render
    const duration = firstAnimation? 0.2:0.1;

    tl
    .fromTo('.summary__item--header', { autoAlpha: 0, y: 10 },{ autoAlpha: 1, y: 0 })
    .fromTo('.summary__content', { autoAlpha: 0, y: 10 },{ autoAlpha: 1, y: 0, stagger: duration }, `<${duration}`)
    .fromTo('.summary__btn', 
        { autoAlpha: 0, y: 10 },
        { 
            autoAlpha: 1, 
            y: function(index, target, targets) {
                if(index === 0) return 1;
                return 0;
            }, 
            stagger: { from: 'end', each: .1 } 
        }, '<')    
    
    return tl;
}


export const animateApplicationAnimation = (success, msg) => {
    const markup = `
        <div class="alert alert--success">
            <div class="alert__icon alert__icon--${success?'success':'error'}">
                <svg class="alert__svg alert__svg--${success?'success':'error'}"><use xlink:href="svg/spritesheet.svg#${success?'tick':'cross'}"></svg>
            </div>
            <div class="alert__status">${ success? 'Success':'Error' }</div>
            <div class="alert__message">${msg}</div>
        </div>
    `;

    const alertWrapper = document.querySelector('.alert-wrapper');

    applicationAlertTimeline.from(alertWrapper, {
        autoAlpha: 0
    }).to(alertWrapper, {
        autoAlpha: 0
    }, '+=3')

}



//////////  USER PAGE  //////////

export const formatUsers = (users) => {
    // Headers should match the returned divs in createUserElement
    const headers = ['ID', 'Name', 'Surname', 'Added'];
    const rows = users.map(user => {
        return createUserElement(formatProperties(user, ['applicantId', 'createdAt', 'jobs']));
    });
    return { headers, rows };
};
const createUserElement = ({ id, firstName, lastName, userDate }) => {
    const row = [
        `<td class="td-data--applicantId">${id}</td>`,
        `<td class="td-data--first-name" data-id=${id}>${firstName}</td>`,
        `<td class="td-data--last-name" data-id=${id}>${lastName}</td>`,
        `<td class="td-data--date" data-id=${id}>${userDate}</td>`
    ];
    return row;
}

export const createUserSummary = ({
    id, 
    firstName,
    lastName,
    phone,
    email,
    cvName,
    cvType,
    userDate,
    jobs,
    addresses
}) => {
    const header = `
        <div class="summary__header">
            <div class="summary__item summary__item--header">
                <div class="summary__id">${id}</div>
            </div>
            <div class="summary__item summary__item--header">
                <div class="summary__company-name">
                    ${firstName}
                </div>
            </div>
            <div class="summary__item summary__item--header">
                <div class="summary__item summary__date">${userDate}</div>
            </div>
        </div>
    `;

    const userControls = `
        <div class="summary__controls summary__user-controls--users summary__section--user-controls">
            <div class="summary__btn summary__new-user-btn--users">
                <svg class="summary__new-user-icon--users summary__icon">
                    <use xlink:href="svg/spritesheet.svg#add">
                </svg>
            </div>
            <div class="summary__btn summary__edit-user-btn--users">
                <svg class="summary__edit-user-icon--users summary__icon">
                    <use xlink:href="svg/spritesheet.svg#edit-np1">
                </svg>
            </div>
            <div class="summary__btn summary__delete-user-btn--users">
                <svg class="summary__delete-user-icon--users summary__icon">
                    <use xlink:href="svg/spritesheet.svg#delete-np1">
                </svg>
            </div>
        </div>
    `;

    const applicantControls = `
        <div class="summary__controls summary__applicant-controls--users">
            <div class="summary__btn summary__edit-applicant-btn--users">
                <svg class="summary__edit-applicant-icon--users summary__icon">
                    <use xlink:href="svg/spritesheet.svg#edit-np1">
                </svg>
            </div>
        </div>
    `;

    const addressControls = `
    <div class="summary__controls summary__address-controls--users">
        <div class="summary__btn summary__new-address-btn--users">
            <svg class="summary__new-address-icon--users summary__icon">
                <use xlink:href="svg/spritesheet.svg#add">
            </svg>
        </div>
        <div class="summary__btn summary__edit-address-btn--users">
            <svg class="summary__edit-address-icon--users summary__icon">
                <use xlink:href="svg/spritesheet.svg#edit-np1">
            </svg>
        </div>
        <div class="summary__btn summary__delete-address-btn--users ">
            <svg class="summary__delete-address-icon--users summary__icon">
                <use xlink:href="svg/spritesheet.svg#delete-np1">
            </svg>
        </div>
    </div>
`;


    const markup  = `
        <div class="summary" data-id="${id}">
            ${header}
            <div class="summary__details summary__details--users">
                <div class="summary__section summary__section--user">
                    <div class="summary__heading summary__heading--user">
                        Applicant
                        ${applicantControls}
                    </div>
                    <div class="summary__content summary__content--user">
                        <div class="summary__column">
                            <div class="summary__item">
                                <div class="summary__label">Name:</div>
                                <div class="summary__field summary__field--user-name">${firstName} ${lastName}</div>
                            </div>
                            <div class="summary__item">
                                <div class="summary__label">Phone:</div>
                                <div class="summary__field summary__field--user-phone">${phone}</div>
                            </div>
                        </div>
                        <div class="summary__column">
                            <div class="summary__item">
                                <div class="summary__label">Email:</div>
                                <div class="summary__field summary__field--user-email">
                                    <a class="summary__link summary__max-width">${email}</a>
                                    <svg class="copy-svg copy-svg--user"><use xlink:href="svg/spritesheet.svg#applications"></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="summary__section summary__section--user-addresses">
                    <div class="summary__heading summary__heading--users">
                        Addresses
                        ${addressControls}
                    </div>
                    ${createAddressSummary(addresses[0])}
                    <div class="pagination-wrapper pagination-wrapper--addresses"></div>
                </div>


                <div class="summary__section summary__section--user-jobs">
                    <div class="summary__heading summary__heading--users">Applications</div>
                    <div class="summary__content summary__content--user-jobs">

                        <div class="summary__jobs-table-wrapper table-wrapper--nested-user-jobs"></div>
                    </div>
                </div>
                ${userControls}
            </div>
        </div>          
    `;
    return markup;

    // <div class="summary__column-wrapper summary__column-wrapper--company">
    //                 <div class="summary__column summary__column--company summary__column--company-summary">
                        

    //                     <div class="summary__heading summary__heading--contacts" data-id="${contacts[0].contactId}">
    //                         Contacts
    //                         <div class="company-summary__controls company-summary__controls--contacts">
    //                             <div class="company-summary__btn company-summary__btn--new-contact company-summary__btn--contacts">
    //                                 <svg class="company-summary__new-icon company-summary__new-icon--contacts company-summary__icon">
    //                                     <use xlink:href="svg/spritesheet.svg#add">
    //                                 </svg>
    //                             </div>
    //                             <div class="company-summary__btn company-summary__btn--edit-contact company-summary__btn--contacts">
    //                                 <svg class="company-summary__edit-icon company-summary__edit-icon--contacts company-summary__icon">
    //                                     <use xlink:href="svg/spritesheet.svg#edit-np1">
    //                                 </svg>
    //                             </div>
    //                             <div class="company-summary__btn company-summary__btn--delete-contact company-summary__btn--contacts">
    //                                 <svg class="company-summary__delete-icon company-summary__delete-icon--contacts company-summary__icon">
    //                                     <use xlink:href="svg/spritesheet.svg#delete-np1">
    //                                 </svg>
    //                             </div>
    //                         </div>
    //                     </div>
                        

    //                     <div class="company-summary__section company-summary__section--contacts">
    //                         <div class="summary__column summary__column--small">    
    //                             <div class="company-summary__item summary__item company-summary__item--contact-name">
    //                                 <div class="company-summary__label company-summary__label--name">Name:</div>
    //                                 <div class="company-summary__field company-summary__field--name">${contacts[0].firstName} ${contacts[0].lastName}</div>
    //                             </div>
    //                             <div class="company-summary__item summary__item company-summary__item--position">
    //                                 <div class="company-summary__label company-summary__label--position">Position:</div>
    //                                 <div class="company-summary__field company-summary__field--position">${contacts[0].position}</div>
    //                             </div>
    //                         </div>
    //                         <div class="summary__column summary__column--large">
    //                             <div class="company-summary__item summary__item company-summary__item--contact-phone">
    //                                 <div class="company-summary__label company-summary__label--contact-phone">Phone:</div>
    //                                 <div class="company-summary__field company-summary__field--contact-phone">${contacts[0].phone}</div>
    //                             </div>
    //                             <div class="company-summary__item summary__item company-summary__item--contact-email">
    //                                 <div class="company-summary__label company-summary__label--contact-email">Email:</div>
    //                                 <div class="company-summary__field company-summary__field--contact-email">
    //                                     <a class="company-summary__field-text--contact-email">${contacts[0].email}</a>
    //                                     <svg class="company-summary__copy-svg copy-svg--company"><use xlink:href="svg/spritesheet.svg#applications"></svg>    
    //                                 </div>
    //                             </div>
    //                         </div>
                            
    //                     </div>
    //                     <div class="pagination-wrapper pagination-wrapper--contacts"></div>
 
    //                     <div class="summary__heading summary__heading--addresses" data-id="${addresses[0].id}">
    //                         Addresses
    //                         <div class="company-summary__controls company-summary__controls company-summary__controls--addresses">
    //                             <div class="company-summary__btn company-summary__btn--addresses company-summary__btn--new-address">
    //                                 <svg class="company-summary__new-icon company-summary__new-icon--addresses company-summary__icon">
    //                                     <use xlink:href="svg/spritesheet.svg#add">
    //                                 </svg>
    //                             </div>
    //                             <div class="company-summary__btn company-summary__btn--addresses company-summary__btn--edit-address">
    //                                 <svg class="company-summary__edit-icon company-summary__edit-icon--addresses company-summary__icon">
    //                                     <use xlink:href="svg/spritesheet.svg#edit-np1">
    //                                 </svg>
    //                             </div>
    //                             <div class="company-summary__btn company-summary__btn--addresses company-summary__btn--delete-address">
    //                                 <svg class="company-summary__delete-icon company-summary__delete-icon--addresses company-summary__icon">
    //                                     <use xlink:href="svg/spritesheet.svg#delete-np1">
    //                                 </svg>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     <div class="company-summary__section company-summary__section--addresses" >
    //                         <div class="summary__column summary__column--small">    
    //                             <div class="company-summary__item summary__item company-summary__item--first-line">
    //                                 <div class="company-summary__label company-summary__label--first-line">First Line:</div>
    //                                 <div class="company-summary__field company-summary__field--first-line">${addresses[0].firstLine}</div>
    //                             </div>
    //                             ${addresses[0].secondLine? 
    //                                 `<div class="company-summary__item summary__item company-summary__item--second-line">
    //                                     <div class="company-summary__label company-summary__label--second-line">Second Line:</div>
    //                                     <div class="company-summary__field company-summary__field--second-line">${addresses[0].secondLine}</div>
    //                                 </div>`:''
    //                             }
                                
    //                             <div class="company-summary__item summary__item company-summary__item--city">
    //                                 <div class="company-summary__label company-summary__label--city">City:</div>
    //                                 <div class="company-summary__field company-summary__field--city">${addresses[0].city}</div>
    //                             </div>
    //                         </div>
    //                         <div class="summary__column summary__column--large">
                                
    //                             <div class="company-summary__item summary__item company-summary__item--county">
    //                                 <div class="company-summary__label company-summary__label--county">County:</div>
    //                                 <div class="company-summary__field company-summary__field--county">${addresses[0].county}</div>
    //                             </div>
    //                             <div class="company-summary__item summary__item company-summary__item--postcode">
    //                                 <div class="company-summary__label company-summary__label--postcode">Postcode:</div>
    //                                 <div class="company-summary__field company-summary__field--postcode">${addresses[0].postcode}</div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                     <div class="pagination-wrapper pagination-wrapper--addresses"></div>
    //                 </div>
    //                 <div class="summary__column summary__column--company summary__column--company-jobs-table">            
    //                     <div class="summary__heading">
    //                         Jobs
    //                     </div>

    //                     <div class="company-summary__section company-summary__section--jobs">
    //                         <div class="company-summary__jobs-table-wrapper table-wrapper--nested-jobs">
    //                         </div>
    //                     </div>

    //                 </div>
    //                 <div class="company-summary__controls company-summary__controls--company">
    //                     <div class="company-summary__btn company-summary__btn--new">
    //                         <svg class="company-summary__new-icon company-summary__icon">
    //                             <use xlink:href="svg/spritesheet.svg#add">
    //                         </svg>
    //                     </div>
    //                     <div class="company-summary__btn company-summary__btn--hubspot">
    //                         <svg class="company-summary__hubspot-icon company-summary__icon">
    //                             <use xlink:href="svg/spritesheet.svg#hubspot">
    //                         </svg>
    //                     </div>
    //                     <div class="company-summary__btn company-summary__btn--edit">
    //                         <svg class="company-summary__edit-icon company-summary__icon">
    //                             <use xlink:href="svg/spritesheet.svg#edit-np1">
    //                         </svg>
    //                     </div>
    //                     <div class="company-summary__btn company-summary__btn--delete">
    //                         <svg class="company-summary__delete-icon company-summary__icon">
    //                             <use xlink:href="svg/spritesheet.svg#delete-np1">
    //                         </svg>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>

            
    //     </div>     
};


// export const createUserSummary = () => {
//     const markup = `
//         <div class="user-summary summary">
//             <div class="user-summary__details">
//                 <div class="user-summary__item user-summary__first-name" data-placeholder="First Name" contenteditable=false></div>
//                 <div class="user-summary__item user-summary__last-name" data-placeholder="Last Name" contenteditable=false></div>
//                 <div class="user-summary__item user-summary__phone" data-placeholder="Phone" contenteditable=false></div>
//                 <div class="user-summary__item user-summary__email" data-placeholder="Email" contenteditable=false></div>
//             </div>
//             <div class="user-summary__controls">
//                 <div class="user-summary__btn user-summary__btn--new">
//                     <svg class="user-summary__new-icon user-summary__icon">
//                         <use xlink:href="svg/spritesheet.svg#add">
//                     </svg>
//                 </div>
//                 <div class="user-summary__btn user-summary__btn--hubspot">
//                     <svg class="user-summary__hubspot-icon">
//                         <use xlink:href="svg/spritesheet.svg#hubspot">
//                     </svg>
//                 </div>
//                 <div class="user-summary__btn user-summary__btn--edit">
//                     <svg class="user-summary__edit-icon">
//                         <use xlink:href="svg/spritesheet.svg#edit-np1">
//                     </svg>
//                 </div>
//                 <div class="user-summary__btn user-summary__btn--delete">
//                     <svg class="user-summary__delete-icon">
//                         <use xlink:href="svg/spritesheet.svg#delete-np1">
//                     </svg>
//                 </div>
//             </div>
//         </div>
//     `;
//     return markup;
// };
export const populateUserSummary = (user) => {
    const userSummary = document.querySelector('.user-summary');
    userSummary.setAttribute('data-id', user.applicantId);
    document.querySelector('.user-summary__first-name').innerText = user.firstName;
    document.querySelector('.user-summary__last-name').innerText = user.lastName;
    document.querySelector('.user-summary__phone').innerText = user.phone;
    document.querySelector('.user-summary__email').innerText = user.email;
    addCvElement(user);
}

export const renderCompanyModal = (data, type) => {
    const summary = document.querySelector('.summary-wrapper');
    // Coordinates to position the modal on top of the summary
    const { left: summaryLeft, top: summaryTop, width: summaryWidth, height: summaryHeight} = summary.getBoundingClientRect();

    const adminWrapper = document.querySelector('.admin-wrapper');
    
    switch(type) {
        case 'new': 
            adminWrapper.insertAdjacentHTML('afterbegin', createCompanyModal(data, 'new-company', false));
            break; 
        case 'edit': 
            adminWrapper.insertAdjacentHTML('afterbegin', createCompanyModal(data, 'edit-company', true));
            break;
        case 'new-contact':
            // The new contact modal is just an edited new company modal
            const element = createCompanyModal(data, 'new-contact', false);
            adminWrapper.insertAdjacentHTML('afterbegin', element);
            break;
        case 'edit-contact':
            adminWrapper.insertAdjacentHTML('afterbegin', createCompanyModal(data, 'edit-contact', true));
            break; 
        case 'new-address':
            adminWrapper.insertAdjacentHTML('afterbegin', createCompanyModal(data, 'new-address', false));
            break; 
        case 'edit-address':
            adminWrapper.insertAdjacentHTML('afterbegin', createCompanyModal(data, 'edit-address', true));
            break;
        
    }
    // Set the modal to the same position and dimensions as the summary
    const modalElement = document.querySelector('.company-summary__modal');
    modalElement.style.left = `${summaryLeft}px`;
    modalElement.style.top = `${summaryTop}px`;
    modalElement.style.width = `${summaryWidth}px`;
    modalElement.style.height = `${summaryHeight}px`;

    gsap.timeline().fromTo(modalElement,
        {autoAlpha: 0},
        {autoAlpha: 1, duration: .2}
    );
};

export const renderJobModal = (data, type) => {
    const summary = document.querySelector('.summary-wrapper');
    // Coordinates to position the modal on top of the summary
    const { left: summaryLeft, top: summaryTop, width: summaryWidth, height: summaryHeight} = summary.getBoundingClientRect();
    const adminContent = document.querySelector('.admin__content');
    const { elementHeight: height } = utils.getInnerDimensions(adminContent);
    // const finalHeight = adminContent.getBoundingClientRect().height;
    const adminWrapper = document.querySelector('.admin-wrapper');

    switch(type) {
        case 'new': 
            adminWrapper.insertAdjacentHTML('afterbegin', createNewJobModal(data));
            populateNewJobModal(data);
            break;
        case 'edit':
            adminWrapper.insertAdjacentHTML('afterbegin', createEditJobModal(data));
            populateEditJobModal(data);
            break;
    }
   
    // Set the modal to the same position and dimensions as the summary
    const modalElement = document.querySelector('.job-summary__modal');
    modalElement.style.left = `${summaryLeft}px`;
    modalElement.style.top = `${summaryTop}px`;
    modalElement.style.width = `${summaryWidth}px`;
    modalElement.style.height = `${summaryHeight}px`;

    gsap.timeline().fromTo(modalElement,
        {autoAlpha: 0},
        {autoAlpha: 1, duration: .2}
    ).to(modalElement, {
        height: `${height}px`
    });
};

export const removeJobModal = () => {
    const jobSummary = document.querySelector('.job-summary__modal');
    gsap.timeline()
        .to(jobSummary, {
            height: () => document.querySelector('.summary-wrapper').getBoundingClientRect().height
        })
        .to(jobSummary, {
            autoAlpha: 0,
            duration: 0.2,
            onComplete: () => jobSummary.parentElement.removeChild(jobSummary)
        })
}

const populateNewJobModal = ({companies, jobTypes, jobPositions, jobPqes}) => {
    // Populate select elements
    const companySelect = document.querySelector('.form__company-input--new-job');
    const typeSelect = document.querySelector('.form__type-input--new-job');
    const positionSelect = document.querySelector('.form__position-input--new-job');
    const pqeSelect = document.querySelector('.form__pqe-input--new-job');
    const featuredSelect = document.querySelector('.form__featured-input--new-job');
    // Order the companies by name
    companies.sort((a, b) => a.companyName > b.companyName? 1:-1);

    const selects = [
        [companySelect, 'Company'], 
        [typeSelect, 'Type'], 
        [positionSelect, 'Position'],
        [pqeSelect, 'Experience'],
        [featuredSelect, 'Featured?']
    ];

    // Add placeholders
    selects.forEach(select => {
        const selectElement = select[0];
        const placeholder= new Option(select[1]);

        placeholder.setAttribute('disabled', 'disabled');
        placeholder.setAttribute('selected', 'selected');
        placeholder.className = 'placeholder';

        selectElement.appendChild(placeholder);
    });

    companies.forEach(company => {
        const option = new Option(company.name, company.id);
        option.className = 'company-option';
        companySelect.add(option);
    });

    Object.entries(jobTypes).forEach(type => {
        const option = new Option(type[1], type[1]);
        option.className = 'type-option';
        typeSelect.add(option);
    });

    Object.entries(jobPositions).forEach(position => {
        const option = new Option(position[1], position[1]);
        option.className = 'position-option';
        positionSelect.add(option);
    });

    jobPqes.forEach(pqe => {
        const option = new Option(`${pqe}+`, pqe);
        option.className = 'pqe-option';
        pqeSelect.add(option); 
    });

    [0, 1].forEach(featured => {
        const option = new Option(`${featured? 'Yes': 'No'}`, featured);
        option.className = 'featured-option';
        featuredSelect.add(option); 
    });
    // Create Custom Selects
    selects.forEach(select => createSelect(select[0], true));
};

const createNewJobModal = ({companies, jobNumber}) => {
    const today = new Date();
    const date = `${today.getDate()}/${today.getMonth()+1}/${+today.getFullYear()}`;
    const modal = `
        <div class="job-summary__modal job-summary__modal--new-job">

            <div class="job-summary__modal-header">
                <div class="job-summary__modal-item job-summary__modal-item--id">${jobNumber}</div>
                <div class="job-summary__modal-item job-summary__modal-item--date">${date}</div>
            </div>
           
            <form class="form--new-job">
                <div class="form__close--new-job">
                    <svg class="form__close-svg--new-job"><use xlink:href="svg/spritesheet.svg#cross"></svg>
                </div>
                <div class="form__content--new-job">
                    <div class="form__field--new-job form__title--new-job">
                        <label for="title" class="form__label--new-job">Title</label>
                        <input type="text" placeholder="Job Title" id="title" class="form__input--new-job form__title-input--new-job">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                    <div class="form__field--new-job form__company--new-job">
                        <label for="company" class="form__label--new-job">Company</label>
                        <select name="company" id="company" class="form__input--new-job form__company-input--new-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>
                    
                    <div class="form__field--new-job form__location--new-job">
                        <label for="location" class="form__label--new-job">Location</label>
                        <input type="text" placeholder="Location" id="location" class="form__input--new-job form__location-input--new-job">
                    
                        <i class="form__icon form__icon--success">
                            <svg><svg><use xlink:href="svg/spritesheet.svg#success"></svg></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--new-job form__wage--new-job">
                        <label for="wage" class="form__label--new-job">Wage</label>
                        <input type="number" placeholder="Wage" id="wage" class="form__input--new-job form__wage-input--new-job" min="10000" max="10000000" step="any">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--new-job form__type--new-job">
                        <label for="type" class="form__label--new-job">Type</label>
                        <select name="type" id="type" class="form__input--new-job form__type-input--new-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>

                    <div class="form__field--new-job form__position--new-job">
                        <label for="position" class="form__label--new-job">Position</label>
                        <select name="position" id="position" class="form__input--new-job form__position-input--new-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>

                    <div class="form__field--new-job form__pqe--new-job">
                        <label for="pqe" class="form__label--new-job">PQE</label>
                        <select name="pqe" id="pqe" class="form__input--new-job form__pqe-input--new-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>

                    <div class="form__field--new-job form__featured--new-job">
                        <label for="featured" class="form__label--new-job">Featured</label>
                        <select name="featured" id="featured" class="form__input--new-job form__featured-input--new-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>

                    <div class="form__field--new-job form__description--new-job">
                        <label for="description" class="form__label--new-job">Description</label>
                        <textarea name="description" id="description" class="form__input--new-job form__description-input--new-job"></textarea>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>

                    <button class="form__submit--new-job">Submit</button>

                </div>

            </form>
            <div class="alert-wrapper alert-wrapper--new-job alert-wrapper--hidden">
                
            </div>
        </div>
    `;

    return modal;
};

const populateEditJobModal = ({companies, job, jobTypes, jobPositions, jobPqes}) => {
        // Populate select elements
        const companySelect = document.querySelector('.form__company-input--edit-job');
        const typeSelect = document.querySelector('.form__type-input--edit-job');
        const positionSelect = document.querySelector('.form__position-input--edit-job');
        const pqeSelect = document.querySelector('.form__pqe-input--edit-job');
        const featuredSelect = document.querySelector('.form__featured-input--edit-job');
        
        const selects = [companySelect, typeSelect, positionSelect, pqeSelect, featuredSelect];

        // Order the companies by name
        companies.sort((a, b) => a.companyName > b.companyName? 1:-1);
    
        // Create the select options and set the relevant job option in the select
        companies.forEach(company => {
            const option = new Option(company.name, company.id);
            option.className = 'company-option';
            if(company.name === job.companyName) option.setAttribute('selected', 'selected');
            companySelect.add(option);
        });
    
        Object.entries(jobTypes).forEach(type => {
            const option = new Option(type[1], type[1]);
            option.className = 'type-option';
            // if(type[1] === job.type) option.setAttribute('selected', 'selected');
            typeSelect.add(option);
        });
    
        Object.entries(jobPositions).forEach(position => {
            const option = new Option(position[1], position[1]);
            option.className = 'position-option';
            if(position[1] === job.position) option.setAttribute('selected', 'selected');
            positionSelect.add(option);
        });
    
        jobPqes.forEach(pqe => {
            const option = new Option(`${pqe}+`, pqe);
            option.className = 'pqe-option';
            if(pqe === job.pqe) option.setAttribute('selected', 'selected');
            pqeSelect.add(option); 
        });
    
        [0, 1].forEach(featured => {
            const option = new Option(`${featured? 'Yes': 'No'}`, featured);
            option.className = 'featured-option';
            if(featured === job.featured) option.setAttribute('selected', 'selected');
            featuredSelect.add(option); 
        });
    
        selects.forEach(select => createSelect(select));
};

const createSelect = (select) => new Select(select);

const createEditJobModal = ({companies, job, jobNumber}) => {
    const today = new Date();
    const date = `${today.getDate()}/${today.getMonth()+1}/${+today.getFullYear()}`;
    const modal = `
        <div class="job-summary__modal job-summary__modal--edit-job">

            <div class="job-summary__modal-header">
                <div class="job-summary__modal-item job-summary__modal-item--id">${job.id}</div>
                <div class="job-summary__modal-item job-summary__modal-item--date">${job.jobDate}</div>
            </div>
           
            <form class="form--edit-job">
                <div class="form__close--edit-job">
                    <svg class="form__close-svg--edit-job"><use xlink:href="svg/spritesheet.svg#cross"></svg>
                </div>
                <div class="form__content--edit-job">
                    <div class="form__field--edit-job form__title--edit-job">
                        <label for="title" class="form__label--edit-job">Title</label>
                        <input type="text" placeholder="${job.title}" id="title" class="form__input--edit-job form__title-input--edit-job">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                    <div class="form__field--edit-job form__company--edit-job">
                        <label for="company" class="form__label--edit-job">Company</label>
                        <select name="company" id="company" data-placeholder="${job.companyId}" class="form__input--edit-job form__company-input--edit-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>
                    
                    <div class="form__field--edit-job form__location--edit-job">
                        <label for="location" class="form__label--edit-job">Location</label>
                        <input type="text"  placeholder="${job.location}" id="location" class="form__input--edit-job form__location-input--edit-job">
                    
                        <i class="form__icon form__icon--success">
                            <svg><svg><use xlink:href="svg/spritesheet.svg#success"></svg></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--edit-job form__wage--edit-job">
                        <label for="wage" class="form__label--edit-job">Wage</label>
                        <input type="number" placeholder="${job.wage}" id="wage" class="form__input--edit-job form__wage-input--edit-job" min="10000" max="10000000" step="any">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--edit-job form__type--edit-job">
                        <label for="type" class="form__label--edit-job">Type</label>
                        <select name="type" data-placeholder="${job.jobType}" id="type" class="form__input--edit-job form__type-input--edit-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--edit-job form__position--edit-job">
                        <label for="position" class="form__label--edit-job">Position</label>
                        <select name="position" data-placeholder="${job.position}" id="position" class="form__input--edit-job form__position-input--edit-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>

                    <div class="form__field--edit-job form__pqe--edit-job">
                        <label for="pqe" class="form__label--edit-job">PQE</label>
                        <select name="pqe" data-placeholder="${job.pqe}" id="pqe" class="form__input--edit-job form__pqe-input--edit-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>

                    <div class="form__field--edit-job form__featured--edit-job">
                        <label for="featured" class="form__label--edit-job">Featured</label>
                        <select name="featured" data-placeholder="${job.featured}" id="featured" class="form__input--edit-job form__featured-input--edit-job">
                            <!-- options added in js -->
                        </select>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>

                    <div class="form__field--edit-job form__description--edit-job">
                        <label for="description" class="form__label--edit-job">Description</label>
                        <textarea placeholder="${job.description}" name="description" id="description" class="form__input--edit-job form__description-input--edit-job">${job.description}
                        </textarea>
                        <i class="form__icon form__icon--success form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error form__icon--select">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg form__error-msg--select"></small>
                    </div>

                    <button class="form__submit--edit-job">Submit</button>

                </div>

            </form>
            <div class="alert-wrapper alert-wrapper--edit-job alert-wrapper--hidden">
                
            </div>
        </div>
    `;

    return modal;
};


export const getJobFields = (type) => {
    const titleField = document.querySelector(`.form__title-input--${type}-job`);
    const locationField = document.querySelector(`.form__location-input--${type}-job`);
    const wageField = document.querySelector(`.form__wage-input--${type}-job`);

    const descriptionField = document.querySelector(`.form__description-input--${type}-job`);
  
    return { titleField, locationField, wageField, descriptionField }
}

export const getJobCustomSelects = (type) => {
    // These are the hidden selects behind the custom selects
    const companyField = document.querySelector(`.form__company-input--${type}-job`);
    const typeField = document.querySelector(`.form__type-input--${type}-job`);
    const positionField = document.querySelector(`.form__position-input--${type}-job`);
    const pqeField = document.querySelector(`.form__pqe-input--${type}-job`);
    const featuredField = document.querySelector(`.form__featured-input--${type}-job`);

    return { companyField, typeField, positionField, pqeField, featuredField };
}

export const getJobValues = (fields, selects, editMode) => {

    const {titleField, locationField, wageField, descriptionField } = fields;
    const { companyField, typeField, positionField, pqeField, featuredField } = selects;

    const values = { changed: false };

    // Fields =>
    // (field.value: empty && field.placeholder: text) = the field is empty
    // (select.value: text && select.placeholder: undefined) = the select is empty


    Object.values(fields).forEach(field => {
        // If !value, return placeholder
        // For the description, just return value 
        switch(field) {
            case titleField: 
                if(editMode) {
                    values.title = titleField.value? titleField.value : titleField.placeholder;
                    values.changed = !!titleField.value && titleField.value !== titleField.placeholder ? true : values.changed;
                } else {
                    values.title = titleField.value.trim();
                }
                break;
            case locationField: 
                if(editMode) {
                    values.location = locationField.value? locationField.value : locationField.placeholder;
                    values.changed = !!locationField.value && locationField.value !== locationField.placeholder ? true : values.changed;

                } else { 
                    values.location = locationField.value.trim();
                }
                break;
            case wageField:
                if(editMode) {
                    values.wage = wageField.value? wageField.value : wageField.placeholder;
                    values.changed = !!wageField.value && wageField.value !== wageField.placeholder ? true : values.changed;
                } else 
                    values.wage = wageField.value.trim();
                break;
            case descriptionField:
                values.description = descriptionField.value;
                values.changed = descriptionField.placeholder !== descriptionField.value.trim() ? true : values.changed;
                break;
        }
    });

    Object.values(selects).forEach(select => {

        switch(select) {
            case companyField:
                values.companyId = companyField.value === 'Company'? -1 : companyField.value;
                values.companyName = select.options[select.selectedIndex].innerText;

                if(editMode){
                    values.changed = companyField.value !== companyField.dataset.placeholder? true : values.changed;
                }
                break;
            case typeField:
                values.type = typeField.value === 'Type'? '' : typeField.value;
                if(editMode){
                    values.changed = typeField.value !== typeField.dataset.placeholder? true : values.changed;
                }
                break;
            case positionField:
                values.position = positionField.value === 'Position'? '' : positionField.value;
                if(editMode){
                    values.changed = positionField.value.trim() !== positionField.dataset.placeholder? true : values.changed;
                }
                break
            case pqeField:
                values.pqe = pqe.value === 'Experience'? '' : pqeField.value;
                if(editMode){
                    values.changed = pqeField.value !== pqeField.dataset.placeholder? true : values.changed;
                }
                break;
            case featuredField:
                values.featured = featured.value === 'Featured?'? '' : featuredField.value
                if(editMode) {
                     values.changed = Boolean(Number(featuredField.value)) != Boolean(Number(featuredField.dataset.placeholder))? true : values.changed;
                }
        }
    });
    return values;
}

export const makeJobSummaryEditable = (editable, job) => {
    const jobTitle = document.querySelector('.job-summary__title');
    const location = document.querySelector('.job-summary__location');
    const wage = document.querySelector('.job-summary__wage');
    // const type = document.querySelector('.job-summary__type');
    // const position = document.querySelector('.job-summary__position');
    // const PQE = document.querySelector('.job-summary__PQE');
    const description = document.querySelector('.job-summary__description');

    const featuredWrapper = document.querySelector('.job-summary__featured-wrapper');
    const featuredIcon = document.querySelector('.job-summary__featured-icon');

    const fields = [jobTitle, location, wage, description];

    fields.forEach(field => {
        makeFieldEditable(field, editable);
    });

    if(editable) {
        const checkbox = `<input type="checkbox" class="job-summary__featured-checkbox" />`;
        featuredWrapper.insertAdjacentHTML('afterbegin', checkbox);
        if(job.featured) document.querySelector('.job-summary__featured-checkbox').checked = true;
        utils.removeElement(featuredIcon);
    } else {
        utils.removeElement(document.querySelector('.job-summary__featured-checkbox'));
    }
};

export const addCompanyDropdown = (companies, companyId) => {
    const companyItem = document.querySelector('.job-summary__company');

    const classNames = ['job-summary__field','job-summary__select', 'job-summary__select--editable', 'job-summary__company'];
    const dropdown = createSelectElement(companies, 'Company Name', classNames, companyId);
    utils.swapElement(companyItem, dropdown);
}
export const removeCompanyDropdown = (companyName) => {
    const companyElement = `
        <div class="job-summary__field job-summary__company" contenteditable=false>
            ${companyName}
        </div>`;
    
    utils.swapElement(document.querySelector('.job-summary__select'), companyElement);
};

export const addJobDropdowns = (job) => {
    const jobTypes = [ {id:1, name:'Permanent'}, {id: 2, name:'Interim'} ];
    const positions = [ {id:1, name:'In House'}, {id:1, name:'Private Practice'} ];
    let PQE = [];

    for(let x = 0; x < 10; x++) {
        const obj = {};
        obj.id = x + 1;
        obj.name = `${x+1}+`;
        PQE.push(obj);
    }

    const typesClassNames = ['job-summary__field','job-summary__select', 'job-summary__select--editable', 'job-summary__type'];
    const positionsClassNames = ['job-summary__field','job-summary__select', 'job-summary__select--editable', 'job-summary__position'];
    const PQEClassNames = ['job-summary__field','job-summary__select', 'job-summary__select--editable', 'job-summary__PQE'];

    const typesDropdown = createSelectElement(jobTypes, 'Job Type', typesClassNames);
    const positionsDropdown = createSelectElement(positions, 'Position', positionsClassNames);
    const PQEDropdown = createSelectElement(PQE, 'PQE', PQEClassNames);

    const typeElement = document.querySelector('.job-summary__type');
    const positionElement = document.querySelector('.job-summary__position');
    const PQEElement = document.querySelector('.job-summary__PQE');

    utils.swapElement(typeElement, typesDropdown);
    utils.swapElement(positionElement, positionsDropdown);
    utils.swapElement(PQEElement, PQEDropdown);

    // If there's a job it's being edited, not created, so use current values as placeholders
    if(job) {
        const [typesIndex] = jobTypes.filter(type => job.jobType === type.name).map(item => item.id);
        const [positionsIndex] = positions.filter(position => job.position === position.name).map(item => item.id);
        const [PQEIndex] = PQE.filter(pqe => job.pqe === pqe.id).map(item => item.id);

        typesDropdown.selectedIndex = typesIndex;
        positionsDropdown.selectedIndex = positionsIndex;
        PQEDropdown.selectedIndex = PQEIndex;
    }
};

export const removeJobDropdowns = ({type, position, pqe}) => {
    const typeElement = document.querySelector('.job-summary__type');
    const positionElement = document.querySelector('.job-summary__position');
    const PQEElement = document.querySelector('.job-summary__PQE');

    const newType= `<div class="job-summary__type job-summary__field">${type}</div>`;
    const newPosition = `<div class="job-summary__position job-summary__field">${position}</div>`;
    const newPQE = `<div class="job-summary__PQE job-summary__field">${pqe}</div>`;

    utils.swapElement(typeElement, newType);
    utils.swapElement(positionElement, newPosition);
    utils.swapElement(PQEElement, newPQE);
}

export const clearJobForm = () => {
    const fields = [
        document.querySelector('.job-summary__title'),
        document.querySelector('.job-summary__location'),
        document.querySelector('.job-summary__wage'),
 
        document.querySelector('.job-summary__featured-checkbox'),
        document.querySelector('.job-summary__description'),
    ];
    const defaultText = [
        'Job Title',
        'Location',
        'Wage',
        'NA',
        'Description'
    ];
    utils.clearForm(fields, defaultText);
}

const makeFieldEditable = (field, editable) => {
    const className = field.classList[0];

    if(!editable) {
        field.classList.remove(`${className}--editable`);
        field.setAttribute('contenteditable', false);
    } else {
        field.classList.add(`${className}--editable`);
        field.setAttribute('contenteditable', true);
    }
};

// @TODO: move from user section
export const makeEditable = (elements, makeEditable, exclude) => {

    elements.forEach((element, index) => {
        // Return if the element classList includes an item in the exclude array
        if(exclude && exclude.some(item => Array.from(element.classList).includes(item)))  return;
        
        const className = element.classList[0];

        if(!makeEditable) {
            element.classList.remove(`${className}--editable`);
            element.setAttribute('contenteditable', false);
        } else {
            element.classList.add(`${className}--editable`);
            element.setAttribute('contenteditable', true);
        }
    });
}

export const addCvElement = user => {
    const cvWrapper = document.querySelector('.user-summary__cv-wrapper');
    const cvName = user.cvName;
    const cvType = user.cvType;
    if(cvWrapper) utils.removeElement(cvWrapper);
    const cvElement = `
        <div class="user-summary__cv-wrapper">
            <div class="user-summary__cv-download">
                <div class="user-summary__btn user-summary__btn--${cvType === null ? 'upload':'cv'}" data-id=${user.applicantId}>
                    <svg class="user-summary__icon user-summary__${cvType === null ? 'upload':'cv'}-icon">
                        <use xlink:href="svg/spritesheet.svg#${cvType === '.pdf'? 'pdf':(cvType === '.doc' || cvType === '.docx'? 'doc':'upload-np')}">
                    </svg>
                </div>
                <div class="user-summary__cv-path" data-id=${user.applicantId}>${cvName}</div>
            </div>
        </div>
    `;

    document.querySelector('.user-summary__email').insertAdjacentHTML('afterend', cvElement);
}

export const addUploadElement = (cvName) => {
    const cvWrapper = document.querySelector('.user-summary__cv-wrapper');

    // Remove contents of cv wrapper
    if(cvWrapper) utils.removeElement(cvWrapper);

    const markup = `
        <div class="user-summary__cv-wrapper">
            <!-- Input inside label for custom styling -->
            <div class="user-summary__file-picker">
                <label class="user-summary__label user-summary__btn user-summary__btn--upload" for="user-summary__input">
                    <svg class="user-summary__icon user-summary__upload-icon">
                        <use xlink:href="svg/spritesheet.svg#upload-np">
                    </svg>
                    <input class="user-summary__input" id="user-summary__input" name="cv" type=file />
                </label>
                <label class="user-summary__upload-path" for="user-summary__input">${cvName !== 'No CV uploaded'? 'Update existing CV?' :'Add a CV'} <label/>
            </div>

        </div>`

    document.querySelector('.user-summary__email').insertAdjacentHTML('afterend', markup);
}

export const changeSummaryIconState = (state, summaryType) => {
    let sectionsToChange;

    switch(summaryType) {
        case 'company'  : sectionsToChange = [ 'company', 'address', 'contact' ]; break;
        case 'job'      : sectionsToChange = [ 'job' ]; break;
    }

    if(state === 'edited') {
        const saveBtn = document.querySelector(`.${summaryType}-summary__btn--save`);
        const btnsToSkip = [`${summaryType}-summary__btn--edit`];

        addEditedStateIcons(saveBtn, summaryType);
        toggleActiveBtns(true, summaryType, sectionsToChange, btnsToSkip);

    } else if(state === 'editing') {
        const editBtn = document.querySelector(`.${summaryType}-summary__btn--edit`);
        const btnsToSkip = [`${summaryType}-summary__btn--save`];

        addEditingStateIcons(editBtn, summaryType);
        toggleActiveBtns(false, summaryType, sectionsToChange, btnsToSkip);

    } else if(state === 'created') {
        const saveNewBtn = document.querySelector(`.${summaryType}-summary__btn--save-new`);
        const btnsToSkip = [`${summaryType}-summary__btn--new`];

        addCreatedStateIcons(saveNewBtn, summaryType);
        toggleActiveBtns(true, summaryType, sectionsToChange, btnsToSkip);

    } else if(state === 'creating') {
        const newBtn = document.querySelector(`.${summaryType}-summary__btn--new`);
        const btnsToSkip = [`${summaryType}-summary__btn--save-new`];

        addCreatingStateIcons(newBtn, summaryType);
        toggleActiveBtns(false, summaryType, sectionsToChange, btnsToSkip);
    }
}

const addCreatedStateIcons = (oldBtn, summaryType) => {
    const newBtn = `
        <div class="${summaryType}-summary__btn ${summaryType}-summary__btn--new">
            <svg class="${summaryType}-summary__new-icon">
                <use xlink:href="svg/spritesheet.svg#add">
            </svg>
        </div>
    `;

    utils.swapElement(oldBtn, newBtn);
};

const addCreatingStateIcons = (oldBtn, summaryType) => {
    const saveNewBtn = `
        <div class="${summaryType}-summary__btn ${summaryType}-summary__btn--save-new">
            <svg class="${summaryType}-summary__save-icon">
                <use xlink:href="svg/spritesheet.svg#save-np">
            </svg>
        </div>
    `;

    utils.swapElement(oldBtn, saveNewBtn);
};

const addEditedStateIcons = (oldBtn, summaryType) => {
    const editBtn = `
        <div class="${summaryType}-summary__btn ${summaryType}-summary__btn--edit">
            <svg class="${summaryType}-summary__edit-icon">
                <use xlink:href="svg/spritesheet.svg#edit-np1">
            </svg>
        </div>
    `;

    utils.swapElement(oldBtn, editBtn);
};

const addEditingStateIcons = (oldBtn, summaryType) => {
    const saveBtn = `
        <div class="${summaryType}-summary__btn ${summaryType}-summary__btn--save">
            <svg class="${summaryType}-summary__save-icon">
                <use xlink:href="svg/spritesheet.svg#save-np">
            </svg>
        </div>
    `;

    utils.swapElement(oldBtn, saveBtn);
};

export const changeEditIcon = (btnToDisplay, summaryType, skip) => {
    const editBtn = document.querySelector(`.${summaryType}-summary__btn--edit`);
    const saveBtn = document.querySelector(`.${summaryType}-summary__btn--save`);
    const delBtn = document.querySelector(`.${summaryType}-summary__btn--delete`);
    let markup;
    if(btnToDisplay === 'save') {
        utils.removeElement(editBtn);
        markup = `
            <div class="${summaryType}-summary__btn ${summaryType}-summary__btn--save">
                <svg class="${summaryType}-summary__save-icon">
                    <use xlink:href="svg/spritesheet.svg#save-np">
                </svg>
            </div>
        `;
    } else if(btnToDisplay === 'edit') {
        utils.removeElement(saveBtn);
        markup = `
            <div class="${summaryType}-summary__btn ${summaryType}-summary__btn--edit">
                <svg class="${summaryType}-summary__edit-icon">
                    <use xlink:href="svg/spritesheet.svg#edit-np1">
                </svg>
            </div>
        `;
    }

    delBtn.insertAdjacentHTML('beforebegin', markup);
    if(btnToDisplay === 'save') toggleActiveBtns(false, summaryType, skip);
    else toggleActiveBtns(true, summaryType, skip);
}

const toggleActiveBtns = (active, summaryType, sections, skip ) => {
    let btns = [];

    sections.forEach(section => {
        btns = [...document.querySelectorAll(`.${section}-summary__btn`), ...btns];
    });

    btns.forEach(btn => {
        // If none of the names in the skip list match any of those in the btn classList, or no list exists
        if(!skip || !skip.some(element => Array.from(btn.classList).includes(element))) {
            const btnIcon = btn.firstElementChild;
            if(!active) { 
                btn.classList.add(`summary__btn--disabled`); 
                btnIcon.classList.add(`summary__icon--disabled`);
            }
            else {
                btn.classList.remove(`summary__btn--disabled`);
                btnIcon.classList.remove(`summary__icon--disabled`);

            }
        }
    });
};

export const getUserEdits = (currentUser) => {
    const formData = new FormData();

    // Compare the current user to the edits made
    const { firstName, lastName, phone, email, cv } = getUserFormValues();

    let submit = false;
    firstName !== currentUser.firstName && (submit = true) ? formData.append('firstName', firstName) : formData.append('firstName', currentUser.firstName);
    lastName !== currentUser.lastName && (submit = true) ? formData.append('lastName', lastName) : formData.append('lastName', currentUser.lastName);
    phone !== currentUser.phone && (submit = true) ? formData.append('phone', phone) : formData.append('phone', currentUser.phone);
    email !== currentUser.email && (submit = true) ? formData.append('email', email) : formData.append('email', currentUser.email);
    
    if(cv) {
        formData.append('cv', cv);
        submit = true;
    }
    
    return submit? formData : null;
}

export const getNewUser = () => {
    const { firstName, lastName, phone, email, cv } = getUserFormValues();


    // Check the placeholders have been removed
    // @TODO FE validation here
    if(
        firstName === 'Name' ||
        lastName === 'Surname' ||
        phone === 'Phone' ||
        email === 'Email'
    ) return null;

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('phone', phone);
 
    if(cv) formData.append('cv', cv);
    return formData;
}

const getUserFormValues = () => {
    const firstName = document.querySelector('.user-summary__first-name').innerText;
    const lastName = document.querySelector('.user-summary__last-name').innerText;
    const phone = document.querySelector('.user-summary__phone').innerText;
    const email = document.querySelector('.user-summary__email').innerText;
    const cv = document.querySelector('.user-summary__input').files[0];

    return { firstName, lastName, phone, email, cv };
};


export const calculateRows = (tableName, header, pagination) => {
    // const tableWrapperHeight = document.querySelector(`.table-wrapper--${tableName}`).offsetHeight;

    const tableContentHeight = document.querySelector(`.table__content--${tableName}`).offsetHeight;
    const headerHeight = header? parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--table-header-height')) * 10 : 0;
    const paginationHeight = pagination? parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pagination-height')) * 10 : 0;
    const rowHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--row-height')) * 10;

    const numOfRows = Math.floor((tableContentHeight - parseFloat(headerHeight) - parseFloat(paginationHeight)) / parseFloat(rowHeight));
    // console.log('\ntableContentHeight',tableContentHeight);
    // console.log('headerHeight', headerHeight);
    // console.log('paginationHeigh', paginationHeight);
    // console.log('rowHeight',rowHeight);
    // console.log('numRows', numOfRows);
    return numOfRows;
}


export const getDeleteContactHtml = (contactId) => {
    const name = document.querySelector('.company-summary__field--name').innerText;
    const position = document.querySelector('.company-summary__field--position')?.innerText;
    const phone = document.querySelector('.company-summary__field--contact-phone').innerText;
    const email = document.querySelector('.company-summary__field--contact-email').innerText;

    return (`
        <div class='confirmation confirmation--delete'>
            <div class="company-summary__modal-header">
                <div>${contactId}</div>
            </div>
            <div class='confirmation__header'>
                <div class='confirmation__svg-wrapper'>
                    <svg class='confirmation__svg confirmation__svg--delete'><use xlink:href="svg/spritesheet.svg#alert-circled"></svg>
                </div>
                <div class='confirmation__message'>Delete contact ${contactId}?</div>
            </div>
            <div class='confirmation__contact'>
                <div class='confirmation__item'>
                    <div class='confirmation__label'>Name:</div>
                    <div class='confirmation__field'>${name}</div>
                </div>
                <div class='confirmation__item'>
                    <div class='confirmation__label'>Position:</div>
                    <div class='confirmation__field'>${position}</div>
                </div>
                <div class='confirmation__item'>
                    <div class='confirmation__label'>Phone:</div>
                    <div class='confirmation__field'>${phone}</div>
                </div>
                <div class='confirmation__item'>
                    <div class='confirmation__label'>Email:</div>
                    <div class='confirmation__field'>${email}</div>
                </div>
            </div>
            <div class='confirmation__controls'>
                <button class='confirmation__btn confirmation__btn--confirm'>Confirm</button>
                <button class='confirmation__btn confirmation__btn--cancel'>Cancel</button>
            </div>
            <div class="alert-wrapper">
            
            </div>
        </div>
    `);
}

export const getDeleteAddressHtml = (addressId) => {
    const firstLine = document.querySelector('.company-summary__field--first-line').innerText;
    const secondLine = document.querySelector('.company-summary__field--second-line')?.innerText;
    const city = document.querySelector('.company-summary__field--city').innerText;
    const county = document.querySelector('.company-summary__field--county').innerText;
    const postcode = document.querySelector('.company-summary__field--postcode').innerText;

    return (`
        <div class='confirmation confirmation--delete'>
            <div class="company-summary__modal-header">
                <div>${addressId}</div>
            </div>
            <div class='confirmation__header'>
                <div class='confirmation__svg-wrapper'>
                    <svg class='confirmation__svg confirmation__svg--delete'><use xlink:href="svg/spritesheet.svg#alert-circled"></svg>
                </div>
                <div class='confirmation__message'>Delete address ${addressId}?</div>
            </div>
            <div class='confirmation__address'>
                <div class='confirmation__item'>
                    <div class='confirmation__label'>First Line:</div>
                    <div class='confirmation__field'>${firstLine}</div>
                </div>
                ${secondLine?
                    `<div class='confirmation__item'>
                        <div class='confirmation__label'>Second Line:</div>
                        <div class='confirmation__field'>${secondLine}</div>
                    </div>`:''
                }
                
                <div class='confirmation__item'>
                    <div class='confirmation__label'>City:</div>
                    <div class='confirmation__field'>${city}</div>
                </div>
                <div class='confirmation__item'>
                    <div class='confirmation__label'>County:</div>
                    <div class='confirmation__field'>${county}</div>
                </div>
                <div class='confirmation__item'>
                    <div class='confirmation__label'>Postcode:</div>
                    <div class='confirmation__field'>${postcode}</div>
                </div>
            </div>
            <div class='confirmation__controls'>
                <button class='confirmation__btn confirmation__btn--confirm'>Confirm</button>
                <button class='confirmation__btn confirmation__btn--cancel'>Cancel</button>
            </div>
            <div class="alert-wrapper">
            
            </div>
        </div>
    `);
}
export const getDeleteCompanyHtml = (companyId) => {
    const companyDate = document.querySelector('.company-summary__field--date').innerText;
    const companyName = document.querySelector('.company-summary__company-name').innerText;
    const companyContact = document.querySelector('.company-summary__field--name').innerText;
    const location = document.querySelector('.company-summary__field--city').innerText;
    return (`
        <div class='confirmation confirmation--delete'>
            <div class="company-summary__modal-header">
                <div>${companyId}</div>
                <div>${companyDate}</div>
            </div>
            <div class='confirmation__header'>
                <div class='confirmation__svg-wrapper'>
                    <svg class='confirmation__svg confirmation__svg--delete'><use xlink:href="svg/spritesheet.svg#alert-circled"></svg>
                </div>
                <div class='confirmation__message'>Delete company ${companyId}?</div>
            </div>
            <div class='confirmation__company'>
                <div class='confirmation__item'>
                    <div class='confirmation__label'>Company:</div>
                    <div class='confirmation__field'>${companyName}</div>
                </div>
                <div class='confirmation__item'>
                    <div class='confirmation__label'>Main Contact:</div>
                    <div class='confirmation__field'>${companyContact}</div>
                </div>
                <div class='confirmation__item'>
                    <div class='confirmation__label'>Location:</div>
                    <div class='confirmation__field'>${location}</div>
                </div>
            </div>
            <div class='confirmation__controls'>
                <button class='confirmation__btn confirmation__btn--confirm'>Confirm</button>
                <button class='confirmation__btn confirmation__btn--cancel'>Cancel</button>
            </div>
            <div class="alert-wrapper">
            
            </div>
        </div>
    `);
}


export const getDeleteJobHtml = (jobId) => {
    const jobDate = document.querySelector('.job-summary__field--date').innerText;
    const positionName = document.querySelector('.job-summary__field--title').innerText;
    const positionCompany = document.querySelector('.job-summary__field--company').innerText;
    const location = document.querySelector('.job-summary__field--location').innerText;
    
    return (`
            <div class='confirmation confirmation--delete'>
                <div class="job-summary__modal-header">
                    <div>${jobId}</div>
                    <div>${jobDate}</div>
                </div>
                <div class='confirmation__header'>
                    <div class='confirmation__svg-wrapper'>
                        <svg class='confirmation__svg confirmation__svg--delete'><use xlink:href="svg/spritesheet.svg#alert-circled"></svg>
                    </div>
                    <div class='confirmation__message'>Delete job ${jobId}?</div>
                </div>
                <div class='confirmation__job'>
                    <div class='confirmation__item'>
                        <div class='confirmation__label'>Title:</div>
                        <div class='confirmation__field'>${positionName}</div>
                    </div>
                    <div class='confirmation__item'>
                        <div class='confirmation__label'>Company:</div>
                        <div class='confirmation__field'>${positionCompany}</div>
                    </div>
                    <div class='confirmation__item'>
                        <div class='confirmation__label'>Location:</div>
                        <div class='confirmation__field'>${location}</div>
                    </div>
                </div>
                <div class='confirmation__controls'>
                    <button class='confirmation__btn confirmation__btn--confirm'>Confirm</button>
                    <button class='confirmation__btn confirmation__btn--cancel'>Cancel</button>
                </div>
                <div class="alert-wrapper">
                
                </div>
            </div>
    `);
}
export const getDeleteApplicationHtml = (applicationId) => {
    const applicationDate = document.querySelector('.summary__date').innerText;
    const positionName = document.querySelector('.summary__field--title').innerText;
    const positionCompany = document.querySelector('.summary__field--company').innerText;
    const applicantName = `${document.querySelector('.summary__field--applicant').innerText}`;
    
    return (`
            <div class='confirmation confirmation--delete'>
                <div class="summary__modal-header">
                    <div>${applicationId}</div>
                    <div>${applicationDate}</div>
                </div>
                <div class='confirmation__header'>
                    <div class='confirmation__svg-wrapper'>
                        <svg class='confirmation__svg confirmation__svg--delete'><use xlink:href="svg/spritesheet.svg#alert-circled"></svg>
                    </div>
                    <div class='confirmation__message'>Delete application ${applicationId}?</div>
                </div>
                <div class='confirmation__application'>
                    <div class='confirmation__item'>
                        <div class='confirmation__label'>Title:</div>
                        <div class='confirmation__field'>${positionName}</div>
                    </div>
                    <div class='confirmation__item'>
                        <div class='confirmation__label'>Company:</div>
                        <div class='confirmation__field'>${positionCompany}</div>
                    </div>
                    <div class='confirmation__item'>
                        <div class='confirmation__label'>Applicant:</div>
                        <div class='confirmation__field'>${applicantName}</div>
                    </div>
                </div>
                <div class='confirmation__controls'>
                    <button class='confirmation__btn confirmation__btn--confirm'>Confirm</button>
                    <button class='confirmation__btn confirmation__btn--cancel'>Cancel</button>
                </div>
                <div class="alert-wrapper">
                
                </div>
            </div>
    `);
}

// toggle = true, insert placeholder
export const togglePlaceholders = (elements, toggle, values) => {
    elements.forEach((element, index) => {
        element.innerText = toggle? element.dataset.placeholder : values[index];
    });
};


// export const initialiseUserPage = () => {
//     // Remove existing content
//     utils.clearElement(elements.adminContent);

//     // Replace existing classname
//     elements.adminContent.className = "admin__content admin__content--users";

//     // Insert placeholders
//     elements.adminContent.insertAdjacentHTML('afterbegin', createUserSummary());
//     elements.adminContent.insertAdjacentHTML('beforeend', `<div class="users-table__wrapper"></div>`);

// };


//////////  JOBS PAGE  ///////////

// export const initialiseJobPage =  () => {
//     utils.clearElement(elements.adminContent);

//     // Replace admin content class name
//     elements.adminContent.className = "admin__content admin__content--jobs";

//     // Insert placeholders
//     elements.adminContent.insertAdjacentHTML('afterbegin', createJobSummary());
//     elements.adminContent.insertAdjacentHTML('beforeend', `<div class="jobs-table__wrapper"></div>`);
// };



    // const markup1 = `
    //     <div class="summary">
    //         <div class="job-summary__details">

    //             <div class="job-summary__section job-summary__section--header">
    //                 <div class="job-summary__item job-summary__item--header">
    //                     <div class="job-summary__id">${id}</div>
    //                 </div>

    //                 <div class="job-summary__item job-summary__item--header">
    //                     <div class="job-summary__field job-summary__field--date">${jobDate}</div>
    //                 </div>
    //             </div>



    //             <div class="summary__heading">Role</div>
               
    //             <div class="job-summary__section job-summary__section--job">
    //                 <div class="job-summary__item job-summary__item--job">
    //                     <div class="job-summary__label job-summary__label--title">Title:</div>
    //                     <div class="job-summary__field job-summary__field--title">${title}</div>
    //                 </div>

    //                 <div class="job-summary__item job-summary__item--job">
    //                     <div class="job-summary__label job-summary__label--company">Company:</div>
    //                     <div class="job-summary__field job-summary__field--company" data-id=${companyId}>
    //                         <a class="summary__link summary__link--company">${companyName}</a>
    //                     </div>
    //                 </div>

    //             </div>

    //             <div class="summary__heading">Details</div>

    //             <div class="job-summary__section job-summary__section--info">

    //                 <div class="summary__column">
    //                     <div class="job-summary__item job-summary__item--info">
    //                         <div class="job-summary__label job-summary__label--location">Location:</div>
    //                         <div class="job-summary__field job-summary__field--location">
    //                             ${location}
    //                         </div>
    //                     </div>

    //                     <div class="job-summary__item job-summary__item--info">
    //                         <div class="job-summary__label job-summary__label--wage">Wage:</div>
    //                         <div class="job-summary__field job-summary__field--wage">
    //                             ${utils.formatSalary(wage)}
    //                         </div>
    //                     </div>

    //                     <div class="job-summary__item job-summary__item--info">
    //                         <div class="job-summary__label job-summary__label--type">Type:</div>
    //                         <div class="job-summary__field job-summary__field--type">
    //                             ${jobType}
    //                         </div>
    //                     </div>
    //                 </div>

    //                 <div class="summary__column">
                        
    //                     <div class="job-summary__item job-summary__item--info">
    //                         <div class="job-summary__label job-summary__label--position">Position:</div>
    //                         <div class="job-summary__field job-summary__field--position">
    //                             ${position}
    //                         </div>
    //                     </div>
    //                     <div class="job-summary__item job-summary__item--info">
    //                         <div class="job-summary__label job-summary__label--pqe">PQE:</div>
    //                         <div class="job-summary__field job-summary__field--pqe">
    //                             ${pqe}
    //                         </div>
    //                     </div>

    //                     <div class="job-summary__item job-summary__item--info">
    //                         <div class="job-summary__label job-summary__label--featured">Featured:</div>
    //                         <div class="job-summary__field job-summary__field--featured">
    //                             ${featured? 'Yes':'No'}
    //                         </div>
    //                     </div>
    
    //                 </div>
    //             </div>    

    //             <div class="summary__heading">Description</div>

    //             <div class="job-summary__section job-summary__section--description">
    //                 <div class="job-summary__description job-summary__field scrollable" style="overflow:hidden">${description}</div>

    //                 <div class="summary__controls summary__controls--job">
    //                     <div class="job-summary__btn job-summary__btn--new">
    //                         <svg class="job-summary__new-icon job-summary__icon">
    //                             <use xlink:href="svg/spritesheet.svg#add">
    //                         </svg>
    //                     </div>
    //                     <div class="job-summary__btn job-summary__btn--hubspot">
    //                         <svg class="job-summary__hubspot-icon job-summary__icon">
    //                             <use xlink:href="svg/spritesheet.svg#hubspot">
    //                         </svg>
    //                     </div>
    //                     <div class="job-summary__btn job-summary__btn--edit">
    //                         <svg class="job-summary__edit-icon job-summary__icon">
    //                             <use xlink:href="svg/spritesheet.svg#edit-np1">
    //                         </svg>
    //                     </div>
    //                     <div class="job-summary__btn job-summary__btn--delete">
    //                         <svg class="job-summary__delete-icon job-summary__icon">
    //                             <use xlink:href="svg/spritesheet.svg#delete-np1">
    //                         </svg>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>

    //     </div>                 
    // `;





export const populateJobSummary = (job) => {
    const jobSummary = document.querySelector('.job-summary');
    jobSummary.setAttribute('data-id', job.id);

    const companyItem = document.querySelector('.job-summary__company');

    companyItem.innerText = job.companyName;
    companyItem.setAttribute('data-id', job.companyId);
    document.querySelector('.job-summary__title').innerText = job.title;
    document.querySelector('.job-summary__location').innerText = job.location;
    document.querySelector('.job-summary__wage').innerText = job.wage;
    document.querySelector('.job-summary__type').innerText = job.jobType;
    document.querySelector('.job-summary__position').innerText = job.position;
    document.querySelector('.job-summary__PQE').innerText = job.pqe;


    const iconExists = document.querySelector('.job-summary__featured-icon');
    const featuredWrapper = document.querySelector('.job-summary__featured-wrapper');

    if(job.featured) {
        const icon = `<svg class="job-summary__featured-icon job-summary__featured-icon--true"><use xlink:href="svg/spritesheet.svg#pin-ok"></use></svg>`;
        if(iconExists) utils.removeElement(iconExists);
        featuredWrapper.insertAdjacentHTML('afterbegin', icon);
    } else {
        const icon = `<svg class="job-summary__featured-icon job-summary__featured-icon--false"><use xlink:href="svg/spritesheet.svg#pin-angle"></use></svg>`;
        if(iconExists) utils.removeElement(iconExists);
        featuredWrapper.insertAdjacentHTML('afterbegin', icon);

    }

    document.querySelector('.job-summary__description').innerText = job.description;

};
export const clearJobSummary = () => {
    const items = document.querySelectorAll('.job-summary__field');
    items.forEach(item => {
        if(item.className.includes('job-summary__title')) item.innerText = 'Job Title';
        if(item.className.includes('job-summary__location')) item.innerText = 'Location';
        if(item.className.includes('job-summary__wage')) item.innerText = 'Wage';
        if(item.className.includes('job-summary__description')) item.innerText = 'Description';
        if(item.className.includes('job-summary__featured')) addFeaturedCheckbox(false, false);
    });
};

// export const toggleDropdown = (flag, item, dropdown) => {
//     if(flag) {
//         item.insertAdjacentElement('beforebegin', dropdown);
//         utils.removeElement(item);
//     } else {
//         dropdown.insertAdjacentHTML('beforebegin', item);
//         utils.removeElement(dropdown);
//     }
// }

export const createSelectElement = (options, defaultText, classNames, companyId) => {
    const dropdown = document.createElement('select'); 

    classNames.forEach(name => dropdown.classList.add(name));
    
    if(defaultText) {
        const placeholder = new Option(defaultText, defaultText)
        dropdown.add(placeholder);
        placeholder.setAttribute('disabled', true);
    }

    options.forEach(item => {
        const option = new Option(item.name, item.name);
        option.setAttribute('data-id', item.id);

        if(!defaultText && parseInt(option.dataset.id) === companyId) {
            option.selected = true;
        }

        dropdown.add(option);
    });

    return dropdown;
};

export const addFeaturedCheckbox = (visible, featured) => {
    const checkbox = document.querySelector('.job-summary__featured-checkbox');
    if(!visible && checkbox) {
        utils.removeElement(checkbox);
        return;
    }

    const featuredDiv = document.querySelector('.job-summary__featured');
    const markup = `<input type="checkbox" class="job-summary__featured-checkbox" value ="featured" ${featured? 'checked':'' } />`;
    
    featuredDiv.insertAdjacentHTML('beforeend', markup);   
};

// @TODO: move from job section
//@TODO: Same as the changeEditIcon?
export const changeNewIcon = (btnToDisplay, summaryType, skip) => {
    const newBtn = document.querySelector(`.${summaryType}-summary__btn--new`);
    const saveBtn = document.querySelector(`.${summaryType}-summary__btn--save-new`);
    const summaryControls = document.querySelector(`.${summaryType}-summary__controls`);

    let markup;
    if(btnToDisplay === 'save') {
        utils.removeElement(newBtn);
        markup = `
            <div class="${summaryType}-summary__btn ${summaryType}-summary__btn--save-new">
                <svg class="${summaryType}-summary__save-icon">
                    <use xlink:href="svg/spritesheet.svg#save-np">
                </svg>
            </div>
        `;
    } else if(btnToDisplay === 'new') {
        utils.removeElement(saveBtn);
        markup = `
            <div class="${summaryType}-summary__btn ${summaryType}-summary__btn--new">
                <svg class="${summaryType}-summary__edit-icon">
                    <use xlink:href="svg/spritesheet.svg#add">
                </svg>
            </div>
        `;
    }
    summaryControls.insertAdjacentHTML('afterbegin', markup);

    // Disable other btns if save is active
    if(btnToDisplay === 'save') toggleActiveBtns(false, summaryType, skip);
    else toggleActiveBtns(true, summaryType, skip);
};

export const getJobEdits = (currentJob) => {
    let { title, location, wage, type, position, PQE, featured, description } = getJobFormValues();
    const company = document.querySelector('.job-summary__company');
    const companyId = company.dataset.id;
    const companyName = company.innerText;

    const formData = new FormData();
    let submit = false;

    // The ID doesn't need comparison, just appending to the form
    formData.append('companyId', parseInt(companyId));

    // Compare the form values to the current values. Set submit to true if one varies
    // Company (as a select element) also has to be compared to '' 
    companyName && companyName !== currentJob.companyName && (submit = true) ? formData.append('companyName', companyName):formData.append('companyName', currentJob.companyName);
    title !== currentJob.title && (submit = true) ? formData.append('title', title):formData.append('title', currentJob.title);
    location !== currentJob.location && (submit = true) ? formData.append('location', location):formData.append('location', currentJob.location);
    parseInt(wage) !== currentJob.wage && (submit = true) ? formData.append('wage', wage):formData.append('wage', currentJob.wage);
    type !== currentJob.jobType && (submit = true) ? formData.append('jobType', type): formData.append('jobType', currentJob.jobType);
    position !== currentJob.position && (submit = true) ? formData.append('position', position): formData.append('position', currentJob.position);

    // Make sure the PQE is always a string in the format 'num+'
    PQE !== `${currentJob.pqe}+` && (submit = true) ? formData.append('pqe', PQE): formData.append('pqe', currentJob.pqe);

    description !== currentJob.description && (submit = true) ? formData.append('description', description):formData.append('description', currentJob.description);
    
    featured !== currentJob.featured && (submit = true) ? formData.append('featured', featured):formData.append('featured', currentJob.featured); 

    return submit ? formData : null;
}; 

export const getNewJob = () => {
    const { title, location, wage, type, position, PQE, featured, description } = getJobFormValues();

    const selectElement = document.querySelector('.job-summary__company');
    const companyName = selectElement.value;
    const companyId = selectElement.options[selectElement.selectedIndex].getAttribute('data-id');

    // Check the placeholders have been removed
    // @TODO FE validation here
    if(
        companyName === 'Company Name' ||
        title === 'Job Title' ||
        location === 'Location' ||
        wage === 'Wage' ||
        type === 'Job Type' ||
        position === 'position' ||
        PQE === 'PQE' ||
        description === 'Description'
    ) return null;

    const formData = new FormData();
    formData.append('companyId', companyId);
    formData.append('companyName', companyName);
    formData.append('title', title);
    formData.append('location', location);
    formData.append('wage', parseInt(wage));
    formData.append('jobType', type);
    formData.append('position', position);
    formData.append('pqe', PQE);
    formData.append('featured', featured);
    formData.append('description', description);

    return formData;
}

const getJobFormValues = () => {
    // Company name is retrieved by the calling function 
    const title = document.querySelector('.job-summary__title').innerText;
    const location = document.querySelector('.job-summary__location').innerText;
    const wage = document.querySelector('.job-summary__wage').innerText;
    const type = document.querySelector('.job-summary__type').value;
    const position = document.querySelector('.job-summary__position').value;
    let PQE = document.querySelector('.job-summary__PQE').value;
    PQE = PQE.substring(0, PQE.length - 1);
    const featured = document.querySelector('.job-summary__featured-checkbox').checked? 1:0;
    const description = document.querySelector('.job-summary__description').innerText;
    return { title, location, wage, type, position, PQE, featured, description };
}

export const formatJobs = (jobs) => {
    // Headers should match the returned divs in createJobsElement
    const headers = ['ID', 'Company','Title','Location', 'Added'];
    const rows = jobs.map(job => {
        return createJobElement(job);
    });
    return { headers, rows };
};
const createJobElement = (job) => {
    const row = [
        `<td class="td-data--jobId" data-id=${job.id}>${job.id}</td>`,
        `<td class="td-data--company" data-id=${job.id}>${job.companyName}</td>`,
        `<td class="td-data--title">${job.title}</td>`,
        `<td class="td-data--location">${job.location}</td>`,
        `<td class="td-data--location">${job.jobDate}</td>`

    ];
    return row;
}; 

export const changeActiveMenuItem = (newActiveItem) => {
    // Items contain the highlight, the links contain the fill and color for the text/icon
    const items = [ elements.adminMenuJobsItem, elements.adminMenuUsersItem, elements.adminMenuApplicationsItem, elements.adminMenuCompaniesItem, elements.adminMenuSettingsItem ];

    // const newActiveItem = e.target.closest(elementStrings.adminMenuItem);
    if(newActiveItem) {
        const newActiveLink = newActiveItem.childNodes[1];
    
        if(!newActiveItem.classList.contains('sidebar__item--active')) newActiveItem.classList.add('sidebar__item--active');
        if(!newActiveLink.classList.contains('sidebar__link--active')) newActiveLink.classList.add('sidebar__link--active');
    
        items.forEach(item => {
            if(item !== newActiveItem) {
                item.classList.remove('sidebar__item--active');
                item.childNodes[1].classList.remove('sidebar__link--active');
            }
        });
    }
}

// @TODO: delete?
// export const addTableListeners = (type) => {
//     const deleteButtons = type==='jobs'? 
//                             document.querySelectorAll(elementStrings.deleteJobsBtn):
//                             document.querySelectorAll(elementStrings.deleteUsersBtn);

//     const editButtons = type==='jobs'?
//                             document.querySelectorAll(elementStrings.editJobsBtn):
//                             document.querySelectorAll(elementStrings.editUsersBtn);

//     const hubspotButtons = type === 'users'? 
//                             document.querySelectorAll(elementStrings.hubspotBtn):
//                             [];

//     // Row buttons
//     deleteButtons.forEach(button => {
//         button.addEventListener('click', (e) => {
//             const item = type==='jobs'? getJob(e): getUser(e);
//             if(item) {
//                 // Change the display info for the modal based on the table
//                 const modalParams = type === 'jobs'? [item.id, item.title]: [item.id, `${item.fName} ${item.lName}`];
//                 displayModal('delete', type, modalParams);
//             }
//         });
//     });
//     editButtons.forEach(button => {
//         button.addEventListener('click', (e) => {
//             const item = type==='jobs'? getJob(e): getUser(e);
//             if(item)
//                 if(type === 'jobs') {
//                     jobForm.renderJobForm(e, 'edit', item)
//                 } else {
//                     userForm.renderUserForm(e, 'edit', item);
//                 }
//         });
//     });
//     if(type === 'users') {
//         hubspotButtons.forEach(button => {
//             button.addEventListener('click', (e) => {
//                 const {id, fName, lName} = getUser(e);
//                 displayModal('add', type, [id, `${fName} ${lName}`]);
//             });
//         });
//     }

//     // Row links
//     const table = document.querySelector('.table');
//     if(table) table.addEventListener('click', (e) => {
//         // If a row was clicked but not the edit or delete buttons
//         const row = e.target.closest('.table-row') && (!e.target.closest('.td--edit') && !e.target.closest('.td--delete'));
//         if(row && type === 'jobs') {
//             const job = getJob(e);
//             if(type === 'jobs') renderJobDetails(job, elements.adminContent);
//         }
//     });

//     // Table controls
//     if(type === 'jobs') {
//         document.querySelector('.create-job-btn')
//         .addEventListener('click', (e) => {
//             jobForm.renderJobForm(e, 'create')
//         })
//     } else if (type === 'users') {
//         document.querySelector('.create-user-btn')
//             .addEventListener('click', (e) => {
//                 userForm.renderUserForm(e, 'create')
//             })
//     }
// }

// This is for the warning modal
export const getAction = (e) => {
    const confirmJob = e.target.closest(`.delete-btn--jobs`);
    const confirmUser = e.target.closest(`.delete-btn--users`);
    const addUser = e.target.closest(`.add-btn--users`);
    // @TODO: This logic doesn't work
    const cancel = e.target.closest('.cancel-btn--warn') || !e.target.closest('.modal__content');

    if(addUser) return 'addUser';
    if(confirmJob) return 'deleteJob';
    if(confirmUser) return 'deleteUser';
    if(cancel) return 'cancel';
}

const getUser = (e) => {
    // Associate the row/button with a user
    const row = e.target.closest('.table-row');
    let user = {};
    if(row) {
        user.id = row.dataset.id;
        user.fName = row.querySelector('.td--firstName').innerText;
        user.lName = row.querySelector('.td--lastName').innerText;
        user.phone = row.querySelector('.td--phone').innerText;
        user.email = row.querySelector('.td--email').innerText;
    }
    return user;
}

const getJob = (e) => {
    const row = e.target.closest('.table-row');
    let job = {};
    if(row) {
        job.id = row.dataset.id;
        job.title = row.querySelector('.td--title').innerText;
        job.wage = row.querySelector('.td--wage').innerText;
        job.location = row.querySelector('.td--location').innerText;
        job.description = row.querySelector('.td--description').innerText;
    }
    return job;
}



//////////  COMPANIES PAGE  ///////////

export const formatCompanies = (companies) => {
    // Headers should match the returned divs in createCompanyElement
    const headers = ['ID', 'Name', 'Added'];
    const rows = companies.map(company => {
        return createCompanyElement(formatProperties(company, ['companyId', 'companyDate']));
    });
    return { headers, rows };
};

const createCompanyElement = ({ id, companyName, companyDate }) => {
    const row = [
        `<td class="td-data--company-id">${id}</td>`,
        `<td class="td-data--company-name" data-id=${id}>${companyName}</td>`,
        `<td class="td-data--date" data-id=${id}>${companyDate}</td>`
    ];
    return row;
}

// For the nested table in the company summary
export const formatCompanyJobs = (jobs) => {
    const headers = ['Id','Title', 'Added'];
    const rows = jobs.map(job => {
        return createCompanyJobElement(job);
    });
    return { headers, rows };
};
const createCompanyJobElement = (job) => {
    const row = [
        `<td class="td-data--jobId" data-id=${job.jobId}>${job.jobId}</td>`,
        `<td class="td-data--title">${job.title}</td>`,
        `<td class="td-data--location">${job.jobDate}</td>`
    ];
    return row;
}; 

export const formatUserJobs = (jobs) => {
    const headers = ['Id','Company','Title', 'Added'];
    const rows = jobs.map(job => {
        return createUserJobElement(job);
    });
    return { headers, rows };
}
const createUserJobElement = (job) => {
    console.log(job)
    const row = [
        `<td class="td-data--jobId" data-id=${job.jobId}>${job.jobId}</td>`,
        `<td class="td-data--title">${job.companyName}</td>`,
        `<td class="td-data--title">${job.title}</td>`,
        `<td class="td-data--location">${job.jobDate}</td>`
    ];
    return row;
}; 


export const generateCompanyJobsPlaceholder = () => {
    const markup = `
        <div class="company-jobs-placeholder">
            <div class="company-jobs-placeholder__message">No Current Jobs</div>
            <div class="company-jobs-placeholder__add-link"><a>Add Job</a></div>
        </div>
    `;
    return(markup);
}
export const generateUserJobsPlaceholder = () => {
    const markup = `
        <div class="company-jobs-placeholder">
            <div class="company-jobs-placeholder__message">No Current Jobs</div>
            <div class="company-jobs-placeholder__add-link"><a>Add Job</a></div>
        </div>
    `;
    return(markup);
}

    /**
     * Create the markup for the new/edit company modal
     * @param {Object | Object[]} data: The company data to be rendered
     * @param {string} type: The type of modal to be created, determining the fields to be disabled. Opts: 'new-company'/'new-contact'/'new-address'.
     * @param {boolean} editMode: Changes the placeholder information in each input
     * @returns {string} A markup string is returned
    */
const createCompanyModal = ({companyNumber, companyName, contact, address, contact: {firstName, lastName, position, phone, email}, address: {firstLine, secondLine, city, county, postcode}}, type, editMode) => {
    
    // Potential states:
    // Form     |   editMode   |  type                      |   Disabled sections

    // company      false         type === 'new-company'        No sections disabled
    // contact      false         type === 'new-contact'        Company && Address disabled
    // address      false         type === 'new-address'        Company && Contact disabled

    // company      true          type === 'edit-company'       No sections disabled
    // contact      true          type === 'edit-contact'       Company && Address disabled
    // address      true          type === 'edit-address'       Company && Contact disabled


    const contactDisabled = type === 'new-address' || type === 'edit-address';
    const addressDisabled = type === 'new-contact' || type === 'edit-contact';
    const companyDisabled = type === 'new-address' || type === 'edit-address' || type==='new-contact' || type === 'edit-contact';

    const edit = type === 'edit-address' || type === 'edit-contact' || type === 'edit-address' || type === 'edit-company';

console.log(type, 'contactDisabled:', contactDisabled, 'addressDisabled:', addressDisabled, 'companyDisabled:', companyDisabled);

    const today = new Date();
    const date = `${today.getDate()}/${today.getMonth()+1}/${+today.getFullYear()}`;

    const action = edit? 'Edit':'Create';
    const markup  = `
    <div class="company-summary__modal company-summary__modal--${type}">

        <div class="company-summary__modal-header">
            <div class="company-summary__modal-item company-summary__modal-item--id">${companyNumber}</div>
            <div>${action} a${edit? 'n Existing':' New'} ${type==='new-company' || type==='edit-company'? 'Company' : type === 'new-contact' || type === 'edit-contact'? 'Contact':'Address'}</div>
            <div class="company-summary__modal-item company-summary__modal-item--date">${date}</div>
        </div>
    
        <form class="form--${type}">
            <div class="form__close--${type}">
                <svg class="form__close-svg--${type}"><use xlink:href="svg/spritesheet.svg#cross"></svg>
            </div>

            <div class="form__content--${type}">
                <div class="summary__column summary__column--${type} summary__column--${type}-company">
                     <div class="summary__heading ${companyDisabled ? 'summary__heading--disabled':''} summary__heading--company">Company</div>

                     <div class="form__field--${type} form__company-name--${type} ${type === 'new-company' || type === 'edit-company' ?  '':'disabled'}">
                        <label for="company-name" class="form__label--${type}">Company Name</label>
                        <input type="text" placeholder=${edit || companyDisabled ? companyName : 'Company Name'} id="company-name" class="form__input--${type} form__company-name-input--${type}" ${companyDisabled ? 'disabled': ''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                </div>

                <div class="summary__column summary__column--${type} summary__column--${type}-contact">
                    <div class="summary__heading ${contactDisabled ? 'summary__heading--disabled' : ''} summary__heading--contacts">Contact</div>

                    <div class="form__field--${type} form__contact-first-name--${type} ${contactDisabled? 'disabled':''}">
                        <label for="contact-first-name" class="form__label--${type}">First Name</label>
                        <input type="text" placeholder="${edit || contactDisabled ? firstName : 'First Name'}" id="contact-first-name" class="form__input--${type} form__contact-first-name-input--${type}" ${contactDisabled ? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                    <div class="form__field--${type} form__contact-surname--${type} ${contactDisabled ? 'disabled':''}">
                        <label for="contact-surname" class="form__label--${type}">Surname</label>
                        <input type="text" placeholder="${edit || contactDisabled ? lastName : 'Surname'}" id="contact-surname" class="form__input--${type} form__contact-surname-input--${type}" ${contactDisabled ? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                    <div class="form__field--${type} form__position--${type} ${contactDisabled ? 'disabled':''}">
                        <label for="position" class="form__label--${type}">Position</label>
                        <input type="text" placeholder="${edit || contactDisabled ? position : 'Surname'}" class="form__input--${type} form__position-input--${type}" ${contactDisabled ? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                    <div class="form__field--${type} form__phone--${type} ${contactDisabled? 'disabled':''}">
                        <label for="phone" class="form__label--${type}">Phone</label>
                        <input type="text" placeholder="${edit || contactDisabled ? phone : 'Phone'}" id="phone" class="form__input--${type} form__phone-input--${type}" ${contactDisabled? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                    <div class="form__field--${type} form__email--${type} ${contactDisabled? 'disabled':''}">
                        <label for="email" class="form__label--${type}">Email</label>
                        <input type="text" placeholder="${edit || contactDisabled ? email : 'Email'}" id="email" class="form__input--${type} form__email-input--${type}" ${contactDisabled ? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                </div>

                <div class="summary__column summary__column--${type} summary__column--${type}-address">
                    <div class="summary__heading ${addressDisabled ? 'summary__heading--disabled' : ''} summary__heading--addresses">Address</div>

                    <div class="form__field--${type} form__first-line--${type} ${addressDisabled ? 'disabled':''}">
                        <label for="first-line" class="form__label--${type}">First Line</label>
                        <input type="text" placeholder="${edit || addressDisabled ? firstLine : 'First Line'}" id="first-line" class="form__input--${type} form__first-line-input--${type}" ${addressDisabled? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--${type} form__second-line--${type} ${addressDisabled ? 'disabled':''}">
                        <label for="second-line" class="form__label--${type}">Second Line</label>
                        <input type="text" placeholder="${edit || addressDisabled ? secondLine : 'Second Line'}" id="second-line" class="form__input--${type} form__second-line-input--${type}" ${addressDisabled? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--${type} form__city--${type} ${addressDisabled ? 'disabled':''}">
                        <label for="city" class="form__label--${type}">City</label>
                        <input type="text" placeholder="${edit || addressDisabled ? city : 'City'}" id="city" class="form__input--${type} form__city-input--${type}" ${addressDisabled ? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--${type} form__county--${type} ${addressDisabled ? 'disabled':''}">
                        <label for="county" class="form__label--${type}">County</label>
                        <input type="text" placeholder="${edit || addressDisabled ? county :'County'}" id="county" class="form__input--${type} form__county-input--${type}" ${addressDisabled ? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--${type} form__postcode--${type} ${addressDisabled ? 'disabled':''}">
                        <label for="postcode" class="form__label--${type}">Postcode</label>
                        <input type="text" placeholder="${edit || addressDisabled ? postcode:'Postcode'}" id="postcode" class="form__input--${type} form__postcode-input--${type}" ${addressDisabled ? 'disabled':''}>
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                </div>
                
                <button class="form__submit--${type}">Submit</button>
                <div class="alert-wrapper alert-wrapper--${type} alert-wrapper--hidden"></div>
            </div>
        </form>
    </div>
    `;
    return markup;
}

const createEditCompanyModal = ({ companyNumber }) => {
    const today = new Date();
    const date = `${today.getDate()}/${today.getMonth()+1}/${+today.getFullYear()}`;
    const markup  = `
    <div class="company-summary__modal company-summary__modal--new-company">

        <div class="company-summary__modal-header">
            <div class="company-summary__modal-item company-summary__modal-item--id">${companyNumber}</div>
            <div>Create a New Company</div>
            <div class="company-summary__modal-item company-summary__modal-item--date">${date}</div>
        </div>
    
        <form class="form--new-company">
            <div class="form__close--new-company">
                <svg class="form__close-svg--new-company"><use xlink:href="svg/spritesheet.svg#cross"></svg>
            </div>

            <div class="form__content--new-company">
                <div class="summary__column summary__column--new-company summary__column--new-company-company">
                     <div class="summary__heading summary__heading--company">Company</div>

                     <div class="form__field--new-company form__company-name--new-company">
                        <label for="company-name" class="form__label--new-company">Company Name</label>
                        <input type="text" placeholder="Company Name" id="company-name" class="form__input--new-company form__company-name-input--new-company">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                </div>

                <div class="summary__column summary__column--new-company summary__column--new-company-contact">
                    <div class="summary__heading summary__heading--contacts">Contact</div>

                    <div class="form__field--new-company form__contact-first-name--new-company">
                        <label for="contact-first-name" class="form__label--new-company">First Name</label>
                        <input type="text" placeholder="First Name" id="contact-first-name" class="form__input--new-company form__contact-first-name-input--new-company">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                    <div class="form__field--new-company form__contact-surname--new-company">
                        <label for="contact-surname" class="form__label--new-company">Surname</label>
                        <input type="text" placeholder="Surname" id="contact-surname" class="form__input--new-company form__contact-surname-input--new-company">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                    <div class="form__field--new-company form__position--new-company">
                        <label for="position" class="form__label--new-company">Position</label>
                        <input type="text" placeholder="Position" id="position" class="form__input--new-company form__position-input--new-company">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                    <div class="form__field--new-company form__phone--new-company">
                        <label for="phone" class="form__label--new-company">Phone</label>
                        <input type="text" placeholder="Phone" id="phone" class="form__input--new-company form__phone-input--new-company">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                    <div class="form__field--new-company form__email--new-company">
                        <label for="email" class="form__label--new-company">Email</label>
                        <input type="text" placeholder="Email" id="email" class="form__input--new-company form__email-input--new-company">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>
                </div>

                <div class="summary__column summary__column--new-company summary__column--new-company-address">
                    <div class="summary__heading summary__heading--addresses">Address</div>

                    <div class="form__field--new-company form__first-line--new-company">
                        <label for="first-line" class="form__label--new-company">First Line</label>
                        <input type="text" placeholder="First Line" id="first-line" class="form__input--new-company form__first-line-input--new-company">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--new-company form__second-line--new-company">
                        <label for="second-line" class="form__label--new-company">Second Line</label>
                        <input type="text" placeholder="Second Line" id="second-line" class="form__input--new-company form__second-line-input--new-company">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--new-company form__city--new-company">
                        <label for="city" class="form__label--new-company">City</label>
                        <input type="text" placeholder="City" id="city" class="form__input--new-company form__city-input--new-company">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--new-company form__county--new-company">
                        <label for="county" class="form__label--new-company">County</label>
                        <input type="text" placeholder="County" id="county" class="form__input--new-company form__county-input--new-company">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                    <div class="form__field--new-company form__postcode--new-company">
                        <label for="postcode" class="form__label--new-company">Postcode</label>
                        <input type="text" placeholder="Postcode" id="postcode" class="form__input--new-company form__postcode-input--new-company">
                        <i class="form__icon form__icon--success">
                            <svg><use xlink:href="svg/spritesheet.svg#success"></svg>
                        </i>
                        <i class="form__icon form__icon--error">
                            <svg><use xlink:href="svg/spritesheet.svg#error"></svg>
                        </i>
                        <small class="form__error-msg"></small>
                    </div>

                </div>
                
                <button class="form__submit--new-company">Submit</button>
                <div class="alert-wrapper alert-wrapper--new-company alert-wrapper--hidden">

            </div>

        </form>

            
        </div>
    </div>
    `;
    return markup;
};

export const getCompanyFields = (type) => {
    const companyNameField = document.querySelector(`.form__company-name-input--${type}`);
    const contactFirstNameField = document.querySelector(`.form__contact-first-name-input--${type}`);
    const contactSurnameField = document.querySelector(`.form__contact-surname-input--${type}`);
    const contactPositionField = document.querySelector(`.form__position-input--${type}`);
    const phoneField = document.querySelector(`.form__phone-input--${type}`);
    const emailField = document.querySelector(`.form__email-input--${type}`);
    const firstLineField = document.querySelector(`.form__first-line-input--${type}`);
    const secondLineField = document.querySelector(`.form__second-line-input--${type}`);
    const cityField = document.querySelector(`.form__city-input--${type}`);
    const countyField = document.querySelector(`.form__county-input--${type}`);
    const postcodeField = document.querySelector(`.form__postcode-input--${type}`);
  
    return { 
        companyNameField, 
        contactFirstNameField, 
        contactSurnameField, 
        contactPositionField, 
        phoneField, 
        emailField, 
        firstLineField, 
        secondLineField, 
        cityField, 
        countyField,
        postcodeField 
    }
}
export const getCompanyValues = (fields, editMode) => {

    const {                
        companyNameField, 
        contactFirstNameField,
        contactSurnameField,
        contactPositionField,
        phoneField,
        emailField,
        firstLineField,
        secondLineField,
        cityField,
        countyField,
        postcodeField 
    } = fields;

    const values = { changed: [] };

    // Fields =>
    // (field.value: empty && field.placeholder: text) = the field is empty

    Object.values(fields).forEach(field => {
        // If !value, return placeholder
        switch(field) {
            case companyNameField: 
                if(editMode) {
                    values.companyName = companyNameField.value? companyNameField.value : companyNameField.placeholder;
                    if(!!companyNameField.value && companyNameField.value !== companyNameField.placeholder) values.changed.push('companyName');
                } else {
                    values.companyName = companyNameField.value.trim();
                }
                break;
            case contactFirstNameField: 
                if(editMode) {
                    values.firstName = contactFirstNameField.value? contactFirstNameField.value : contactFirstNameField.placeholder;
                    if(!!contactFirstNameField.value && contactFirstNameField.value !== contactFirstNameField.placeholder) values.changed.push('firstName');

                } else { 
                    values.firstName = contactFirstNameField.value.trim();
                }
                break;
            case contactSurnameField:
                if(editMode) {
                    values.lastName = contactSurnameField.value? contactSurnameField.value : contactSurnameField.placeholder;
                    if(!!contactSurnameField.value && contactSurnameField.value !== contactSurnameField.placeholder) values.changed.push('surname');
                } else 
                    values.lastName = contactSurnameField.value.trim();
                break;
            case contactPositionField:
                if(editMode) {
                    values.position = contactPositionField.value? contactPositionField.value : contactPositionField.placeholder;
                    if(!!contactPositionField.value && contactPositionField.value !== contactPositionField.placeholder) values.changed.push('position');
                } else 
                    values.position = contactPositionField.value.trim();
                break;
            case phoneField:
                if(editMode) {
                    values.phone = phoneField.value? phoneField.value : phoneField.placeholder;
                   if(!!phoneField.value && phoneField.value !== phoneField.placeholder) values.changed.push('phone');
                } else 
                    values.phone = phoneField.value.trim();
                break;
            case emailField:
                if(editMode) {
                    values.email = emailField.value? emailField.value : emailField.placeholder;
                    if(!!emailField.value && emailField.value !== emailField.placeholder) values.changed.push('email');
                } else 
                    values.email = emailField.value.trim();
                break;
            case firstLineField:
                if(editMode) {
                    values.firstLine = firstLineField.value? firstLineField.value : firstLineField.placeholder;
                    if(!!firstLineField.value && firstLineField.value !== firstLineField.placeholder) values.changed.push('firstLine');
                } else 
                    values.firstLine = firstLineField.value.trim();
                break;
            case secondLineField:
                if(editMode) {
                    values.secondLine = secondLineField.value? secondLineField.value : secondLineField.placeholder;
                    if(!!secondLineField.value && secondLineField.value !== secondLineField.placeholder) values.changed.push('secondLine');
                } else 
                    values.secondLine = secondLineField.value.trim();
                break;
            case cityField:
                if(editMode) {
                    values.city = cityField.value? cityField.value : cityField.placeholder;
                    if(!!cityField.value && cityField.value !== cityField.placeholder) values.changed.push('city');
                } else 
                    values.city = cityField.value.trim();
                break;
            case countyField:
                if(editMode) {
                    values.county = countyField.value? countyField.value : countyField.placeholder;
                    if(countyField.value && countyField.value !== countyField.placeholder) values.changed.push('county');
                } else 
                    values.county = countyField.value.trim();
                break;
            case postcodeField:
                if(editMode) {
                    values.postcode = postcodeField.value? postcodeField.value : postcodeField.placeholder;
                    if(!!postcodeField.value && postcodeField.value !== postcodeField.placeholder) values.changed.push('postcode');
                } else 
                    values.postcode = postcodeField.value.trim();
                break;
        }
    });

    return values;
}

export const removeCompanyModal = () => {
    const companySummary = document.querySelector('.company-summary__modal');
    gsap
    .to(companySummary, {
        autoAlpha: 0,
        duration: 0.2,
        onComplete: () => companySummary.parentElement.removeChild(companySummary)
    })
}


export const createCompanySummary = ({id, companyName, companyDate, contacts, addresses, jobs}) => {
    // const markup  = `
    //         <div class="company-summary summary">
    //             <div class="company-summary__details">

    //                 <div class="company-summary__item company-summary__company" data-placeholder="Company" contenteditable=false></div>
    //             </div>
    //             <div class="company-summary__controls">
    //                 <div class="company-summary__btn company-summary__btn--new">
    //                     <svg class="company-summary__new-icon company-summary__icon">
    //                         <use xlink:href="svg/spritesheet.svg#add">
    //                     </svg>
    //                 </div>
    //                 <div class="company-summary__btn company-summary__btn--hubspot">
    //                     <svg class="company-summary__hubspot-icon company-summary__icon">
    //                         <use xlink:href="svg/spritesheet.svg#hubspot">
    //                     </svg>
    //                 </div>
    //                 <div class="company-summary__btn company-summary__btn--edit">
    //                     <svg class="company-summary__edit-icon company-summary__icon">
    //                         <use xlink:href="svg/spritesheet.svg#edit-np1">
    //                     </svg>
    //                 </div>
    //                 <div class="company-summary__btn company-summary__btn--delete">
    //                     <svg class="company-summary__delete-icon company-summary__icon">
    //                         <use xlink:href="svg/spritesheet.svg#delete-np1">
    //                     </svg>
    //                 </div>
    //             </div>
    //         </div>         
    // `;

    // ${createAddressSummary()}

    // ${createContactSummary()}
    const markup  = `
        <div class="company-summary summary" data-id="${id}">
            <div class="company-summary__details">

                <div class="company-summary__header">
                    <div class="company-summary__item summary__item company-summary__item--header">
                        <div class="company-summary__id">${id}</div>
                    </div>
                    <div class="company-summary__item summary__item company-summary__item--header">
                        <div class="company-summary__company-name">
                            ${companyName}
                        </div>
                    </div>
                    <div class="company-summary__item summary__item company-summary__item--header">
                        <div class="company-summary__field company-summary__field--date">${companyDate}</div>
                    </div>
                </div>

                <div class="summary__column-wrapper summary__column-wrapper--company">
                    <div class="summary__column summary__column--company summary__column--company-summary">
                        

                        <div class="summary__heading summary__heading--contacts" data-id="${contacts[0].contactId}">
                            Contacts
                            <div class="company-summary__controls company-summary__controls--contacts">
                                <div class="company-summary__btn company-summary__btn--new-contact company-summary__btn--contacts">
                                    <svg class="company-summary__new-icon company-summary__new-icon--contacts company-summary__icon">
                                        <use xlink:href="svg/spritesheet.svg#add">
                                    </svg>
                                </div>
                                <div class="company-summary__btn company-summary__btn--edit-contact company-summary__btn--contacts">
                                    <svg class="company-summary__edit-icon company-summary__edit-icon--contacts company-summary__icon">
                                        <use xlink:href="svg/spritesheet.svg#edit-np1">
                                    </svg>
                                </div>
                                <div class="company-summary__btn company-summary__btn--delete-contact company-summary__btn--contacts">
                                    <svg class="company-summary__delete-icon company-summary__delete-icon--contacts company-summary__icon">
                                        <use xlink:href="svg/spritesheet.svg#delete-np1">
                                    </svg>
                                </div>
                            </div>
                        </div>
                        

                        <div class="company-summary__section company-summary__section--contacts">
                            <div class="summary__column summary__column--small">    
                                <div class="company-summary__item summary__item company-summary__item--contact-name">
                                    <div class="company-summary__label company-summary__label--name">Name:</div>
                                    <div class="company-summary__field company-summary__field--name">${contacts[0].firstName} ${contacts[0].lastName}</div>
                                </div>
                                <div class="company-summary__item summary__item company-summary__item--position">
                                    <div class="company-summary__label company-summary__label--position">Position:</div>
                                    <div class="company-summary__field company-summary__field--position">${contacts[0].position}</div>
                                </div>
                            </div>
                            <div class="summary__column summary__column--large">
                                <div class="company-summary__item summary__item company-summary__item--contact-phone">
                                    <div class="company-summary__label company-summary__label--contact-phone">Phone:</div>
                                    <div class="company-summary__field company-summary__field--contact-phone">${contacts[0].phone}</div>
                                </div>
                                <div class="company-summary__item summary__item company-summary__item--contact-email">
                                    <div class="company-summary__label company-summary__label--contact-email">Email:</div>
                                    <div class="company-summary__field company-summary__field--contact-email">
                                        <a class="company-summary__field-text--contact-email">${contacts[0].email}</a>
                                        <svg class="company-summary__copy-svg copy-svg--company"><use xlink:href="svg/spritesheet.svg#applications"></svg>    
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div class="pagination-wrapper pagination-wrapper--contacts"></div>
 
                        <div class="summary__heading summary__heading--addresses" data-id="${addresses[0].id}">
                            Addresses
                            <div class="company-summary__controls company-summary__controls company-summary__controls--addresses">
                                <div class="company-summary__btn company-summary__btn--addresses company-summary__btn--new-address">
                                    <svg class="company-summary__new-icon company-summary__new-icon--addresses company-summary__icon">
                                        <use xlink:href="svg/spritesheet.svg#add">
                                    </svg>
                                </div>
                                <div class="company-summary__btn company-summary__btn--addresses company-summary__btn--edit-address">
                                    <svg class="company-summary__edit-icon company-summary__edit-icon--addresses company-summary__icon">
                                        <use xlink:href="svg/spritesheet.svg#edit-np1">
                                    </svg>
                                </div>
                                <div class="company-summary__btn company-summary__btn--addresses company-summary__btn--delete-address">
                                    <svg class="company-summary__delete-icon company-summary__delete-icon--addresses company-summary__icon">
                                        <use xlink:href="svg/spritesheet.svg#delete-np1">
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div class="company-summary__section company-summary__section--addresses" >
                            <div class="summary__column summary__column--small">    
                                <div class="company-summary__item summary__item company-summary__item--first-line">
                                    <div class="company-summary__label company-summary__label--first-line">First Line:</div>
                                    <div class="company-summary__field company-summary__field--first-line">${addresses[0].firstLine}</div>
                                </div>
                                ${addresses[0].secondLine? 
                                    `<div class="company-summary__item summary__item company-summary__item--second-line">
                                        <div class="company-summary__label company-summary__label--second-line">Second Line:</div>
                                        <div class="company-summary__field company-summary__field--second-line">${addresses[0].secondLine}</div>
                                    </div>`:''
                                }
                                
                                <div class="company-summary__item summary__item company-summary__item--city">
                                    <div class="company-summary__label company-summary__label--city">City:</div>
                                    <div class="company-summary__field company-summary__field--city">${addresses[0].city}</div>
                                </div>
                            </div>
                            <div class="summary__column summary__column--large">
                                
                                <div class="company-summary__item summary__item company-summary__item--county">
                                    <div class="company-summary__label company-summary__label--county">County:</div>
                                    <div class="company-summary__field company-summary__field--county">${addresses[0].county}</div>
                                </div>
                                <div class="company-summary__item summary__item company-summary__item--postcode">
                                    <div class="company-summary__label company-summary__label--postcode">Postcode:</div>
                                    <div class="company-summary__field company-summary__field--postcode">${addresses[0].postcode}</div>
                                </div>
                            </div>
                        </div>
                        <div class="pagination-wrapper pagination-wrapper--addresses"></div>
                    </div>
                    <div class="summary__column summary__column--company summary__column--company-jobs-table">            
                        <div class="summary__heading">
                            Jobs
                        </div>

                        <div class="company-summary__section company-summary__section--jobs">
                            <div class="company-summary__jobs-table-wrapper table-wrapper--nested-jobs">
                            </div>
                        </div>

                    </div>
                    <div class="company-summary__controls company-summary__controls--company">
                        <div class="company-summary__btn company-summary__btn--new">
                            <svg class="company-summary__new-icon company-summary__icon">
                                <use xlink:href="svg/spritesheet.svg#add">
                            </svg>
                        </div>
                        <div class="company-summary__btn company-summary__btn--hubspot">
                            <svg class="company-summary__hubspot-icon company-summary__icon">
                                <use xlink:href="svg/spritesheet.svg#hubspot">
                            </svg>
                        </div>
                        <div class="company-summary__btn company-summary__btn--edit">
                            <svg class="company-summary__edit-icon company-summary__icon">
                                <use xlink:href="svg/spritesheet.svg#edit-np1">
                            </svg>
                        </div>
                        <div class="company-summary__btn company-summary__btn--delete">
                            <svg class="company-summary__delete-icon company-summary__icon">
                                <use xlink:href="svg/spritesheet.svg#delete-np1">
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>         
    `;
    return markup;
};

export const populateCompanySummary = ({ id, name }) => {
    const companySummary = document.querySelector('.company-summary');
    companySummary.setAttribute('data-id', id);
    
    document.querySelector('.company-summary__company').innerText = name;

};

export const getSummaryCompanyId =  () => {
    return document.querySelector('.company-summary').dataset.id;
};
export const getSummaryAddressId = () => {
    return document.querySelector('.address-summary').dataset.id;
};
export const getSummaryContactId = () => {
    return document.querySelector('.contact-summary').dataset.id;
};

export const getNewCompany = () => {
    const companyName = document.querySelector('.company-summary__company').innerText;
    
    // @TODO: Add validation
    if(companyName === 'Company') return null;
    const formData = new FormData();
    formData.append('companyName', companyName);
    return formData;
};
export const getNewAddress = () => {
    const { firstLine, secondLine, city, county, postcode } = getAddressFormValues();

    // @TODO: Add validation
    if(
        firstLine === 'First Line' ||
        secondLine === 'Second Line' ||
        city === 'City' ||
        county === 'County' ||
        postcode === 'Postcode'
    ) return null;

    const formData = new FormData();
    formData.append('firstLine', firstLine);
    formData.append('secondLine', secondLine);
    formData.append('city', city);
    formData.append('county', county);
    formData.append('postcode', postcode);

    return formData;
};
const getAddressFormValues = () => {
    const firstLine = document.querySelector('.address-summary__first-line').innerText;
    const secondLine = document.querySelector('.address-summary__second-line').innerText;
    const city = document.querySelector('.address-summary__city').innerText;
    const county = document.querySelector('.address-summary__county').innerText;
    const postcode = document.querySelector('.address-summary__postcode').innerText;

    return { firstLine, secondLine, city, county, postcode };
};
export const getNewContact = () => {
    const { firstName, lastName, position, email, phone } = getContactFormValues();

    // @TODO: Add validation
    if(
        firstName === 'First Name' ||
        lastName === 'Last Name' ||
        position === 'Position' ||
        email === 'Email' ||
        phone === 'Phone'
    ) return null;

    const formData = new FormData();

    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('position', position);
    formData.append('email', email);
    formData.append('phone', phone);

    return formData;
};
const getContactFormValues = () => {
    const firstName = document.querySelector('.contact-summary__firstname').innerText;
    const lastName = document.querySelector('.contact-summary__lastname').innerText;
    const position = document.querySelector('.contact-summary__position').innerText;
    const phone = document.querySelector('.contact-summary__phone').innerText;
    const email = document.querySelector('.contact-summary__email').innerText;

    return { firstName, lastName, position, phone, email };
};

export const createAddressSummary = ({id,firstLine, secondLine, city, county, postcode} = { id: 'None', firstLine: 'None', secondLine: 'None', city: 'None', county: 'None', postcode: 'None' }) => {
    const markup = `
        <div class="summary__content summary__content--user-addresses" data-id=${id}>
            <div class="summary__column">
                <div class="summary__item">
                    <div class="summary__label">First Line:</div>
                    <div class="summary__field summary__field--user-first-line">${firstLine}</div>
                </div>
                ${ secondLine?
                    `<div class="summary__item">
                        <div class="summary__label">Second Line:</div>
                        <div class="summary__field summary__field--user-second-line">${secondLine}</div>
                    </div>` : ''
                }
                <div class="summary__item">
                    <div class="summary__label">City:</div>
                    <div class="summary__field summary__field--user-city">${city}</div>
                </div>
            </div>
            <div class="summary__column">
                <div class="summary__item">
                    <div class="summary__label">County:</div>
                    <div class="summary__field summary__field--user-county">${county}</div>
                </div>
                <div class="summary__item">
                    <div class="summary__label">Postcode:</div>
                    <div class="summary__field summary__field--user-postcode">${postcode}</div>
                </div>
            </div>
        </div>
    `;

    // const markup  = `
    //     <div class="address-summary summary">
    //         <div class="address-summary__details">
    //             <div class="address-summary__item address-summary__address" data-placeholder="Address" contenteditable=false></div>
    //         </div>
    //         <div class="address-summary__controls">
    //             <div class="address-summary__btn address-summary__btn--new">
    //                 <svg class="address-summary__new-icon address-summary__icon">
    //                     <use xlink:href="svg/spritesheet.svg#add">
    //                 </svg>
    //             </div>
    //             <div class="address-summary__btn address-summary__btn--edit">
    //                 <svg class="address-summary__edit-icon address-summary__icon">
    //                     <use xlink:href="svg/spritesheet.svg#edit-np1">
    //                 </svg>
    //             </div>
    //             <div class="address-summary__btn address-summary__btn--delete">
    //                 <svg class="address-summary__delete-icon address-summary__icon">
    //                     <use xlink:href="svg/spritesheet.svg#delete-np1">
    //                 </svg>
    //             </div>
    //         </div>
    //     </div>
    // `;

    return markup;
};
export const populateAddressSummary = (id, address) => {
    const addressSummary = document.querySelector('.address-summary');
    addressSummary.setAttribute('data-id', address.addressId);
    addressSummary.setAttribute('data-company-id', id);
    
    populateAddress(address);
};

export const makeAddressEditable = (editable, type, address) => {
    const addressDetails = document.querySelector('.address-summary__details');
    utils.clearElement(addressDetails);
    if(editable) {
        const markup = `
            <div class="address-summary__item address-summary__first-line address-summary__item--editable" data-placeholder="First Line" contenteditable=false>${type === 'placeholder'? '':address.firstLine}</div>
            <div class="address-summary__item address-summary__second-line address-summary__item--editable" data-placeholder="Second Line" contenteditable=false>${type === 'placeholder'? '':address.secondLine}</div>
            <div class="address-summary__item address-summary__city address-summary__item--editable" data-placeholder="City" contenteditable=false>${type === 'placeholder'? '':address.city}</div>
            <div class="address-summary__item address-summary__county address-summary__item--editable" data-placeholder="County" contenteditable=false>${type === 'placeholder'? '':address.county}</div>
            <div class="address-summary__item address-summary__postcode address-summary__item--editable" data-placeholder="Postcode" contenteditable=false>${type === 'placeholder'? '':address.postcode}</div>
        `;
        addressDetails.insertAdjacentHTML('afterbegin', markup);
        makeEditable(document.querySelectorAll('.address-summary__item'), true, []);
    } else {
        addressDetails.insertAdjacentHTML('afterbegin', '<div class="address-summary__item address-summary__address" data-placeholder="Address" contenteditable=false></div>');
        populateAddress(address);
    }
};

export const populateAddress = ({firstLine, secondLine, city, county, postcode} = {}) => {
    const address = 
        firstLine? `${firstLine} ${secondLine? `\n${secondLine}`:'\ '} ${city? `\n${city}`:'\ '} ${county? `\n${county}`:'\ '} ${postcode? `\n${postcode}`: ''}`
        : 'Please add an address';
    document.querySelector('.address-summary__address').innerText = address;
};

export const createContactSummary = () => {
    const markup  = `
        <div class="contact-summary summary">
            <div class="contact-summary__details">
                <div class="contact-summary__item contact-summary__firstname" data-placeholder="First Name" contenteditable=false></div>
                <div class="contact-summary__item contact-summary__lastname" data-placeholder="Last Name" contenteditable=false></div>
                <div class="contact-summary__item contact-summary__position" data-placeholder="Position" contenteditable=false></div>
                <div class="contact-summary__item contact-summary__email" data-placeholder="Email" contenteditable=false></div>
                <div class="contact-summary__item contact-summary__phone" data-placeholder="Phone" contenteditable=false></div>
            </div>
            <div class="contact-summary__controls">
                <div class="contact-summary__btn contact-summary__btn--new">
                    <svg class="contact-summary__new-icon contact-summary__icon">
                        <use xlink:href="svg/spritesheet.svg#add">
                    </svg>
                </div>
                <div class="contact-summary__btn contact-summary__btn--edit">
                    <svg class="contact-summary__edit-icon contact-summary__icon">
                        <use xlink:href="svg/spritesheet.svg#edit-np1">
                    </svg>
                </div>
                <div class="contact-summary__btn contact-summary__btn--delete">
                    <svg class="contact-summary__delete-icon contact-summary__icon">
                        <use xlink:href="svg/spritesheet.svg#delete-np1">
                    </svg>
                </div>
            </div>
        </div>
    `;

    return markup;
};

export const populateContactSummary = (id, contact) => {
    const contactSummary = document.querySelector('.contact-summary');
    contactSummary.setAttribute('data-id', contact.personId);
    contactSummary.setAttribute('data-company-id', id);
    document.querySelector('.contact-summary__firstname').innerText = contact.firstName;
    document.querySelector('.contact-summary__lastname').innerText = contact.lastName;
    document.querySelector('.contact-summary__position').innerText = contact.position;
    document.querySelector('.contact-summary__position').innerText = contact.position;
    document.querySelector('.contact-summary__email').innerText = contact.email;
    document.querySelector('.contact-summary__phone').innerText = contact.phone;
};


export const renderCompanies = (companies) => {
    const markup = `
        ${companies.map(company => {
            return renderCompany(company);
        })}
    `;
    utils.clearElement(elements.adminContent);

    document.querySelector('.admin__content').insertAdjacentHTML('afterbegin', markup);
};
const renderCompany = (company) => {
    return `
        <div class="company-wrapper" data-set="${company.id}">
                <div class="company-item company-item--${company.name}">${company.name}</div>
                <div class="company-item company-item--${company.address}">${company.address}</div>
        </div>
        `
};





// export const animateSummaryIn = () => {
//     return gsap.fromTo('.summary', { autoAlpha:0 }, {autoAlpha: 1 });
// }
// export const animateSummaryOut = () => {
//     return gsap.fromTo('.summary', { autoAlpha: 1 }, {autoAlpha: 0, duration: .2}, '<')
// }

export const animateAdminLoadersIn = () => {
    return gsap.fromTo('.loader', {autoAlpha:0}, {autoAlpha:1, duration: .2});
}
export const animateAdminLoadersOut = () => {
    return gsap.fromTo(
        '.loader', 
        { autoAlpha: 1 }, 
        { 
            autoAlpha: 0, 
            duration: .2,
            immediateRender: false,
            onComplete: () => {
                loader.clearLoaders()
            }
        }
    );
}

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
        .fromTo(`.tbody--${table}`, {autoAlpha: 0},{autoAlpha: 1, duration: .4})
        .from(`.row--${table}`, {
            x: -15, 
            autoAlpha: 0,
            stagger: {
                each: .12
            },
            ease: 'power2.out',
        
        }, '<')
}
export const animateTableContentOut = () => {
    const tableContent = document.querySelector('tbody');

    return (
      gsap.fromTo(tableContent, { autoAlpha: 1 }, {autoAlpha: 0, duration: .4})
    );
}
export const renderAdminLoaders = () => {
    const tableContent = document.querySelector('.table__content');
    // const summaryWrapper = document.querySelector('.summary-wrapper');

    // Add a loader to the table wrapper
    loader.renderLoader({
        parent: tableContent,
        type: 'admin-table',
        position: 'afterbegin',
        inFlow: false
    });
    // // Add a loader to the summary wrapper
    // loader.renderLoader({
    //     parent: summaryWrapper,
    //     type: 'admin-summary',
    //     position: 'afterbegin',
    //     inFlow: false
    // });
}



export const clearAdminPage = (page) => {
    const adminMain = document.querySelector('.admin__main');    
    // Clear the admin page
    while(adminMain.firstChild) {
        adminMain.removeChild(adminMain.firstChild);
    }
}
export const initAdminSection = (tl, sectionName) => {
    const adminMain = document.querySelector('.admin__main');
    let adminTemplate;
    let loaderContainers;
    // Fade out the adminMain
    tl
      .to(adminMain, { autoAlpha: 0 })
      .add(() => clearAdminPage());     
      
    // Create the admin template based on the page selected
    adminTemplate = createAdminTemplate(sectionName);

    // List the elements that will contain a loader, and the css selector
    switch(sectionName) {
        case 'applications':
            loaderContainers = [['.table-wrapper', 'admin-table'], ['.summary__section--application-person', 'person-summary'], ['.summary__section--application-job', 'job-summary']];
            break;
        case 'jobs':
            loaderContainers = [
                ['.table-wrapper', 'admin-table'], 
                ['.summary__section--details', 'details-summary'],
                ['.summary__section--description', 'description-summary']
            ];
            break;
        case 'companies':
            loaderContainers = [['.table-wrapper', 'admin-table'], ['.summary-wrapper', 'summary']];
            break;
        case 'users':
            loaderContainers = [['.table-wrapper', 'admin-table'], ['.summary-wrapper', 'summary']];
            break;
    }
    tl
    .add(() => {
        // Add the template to the main page
        adminMain.appendChild(adminTemplate)
        // Add loaders where needed
        loaderContainers.forEach(selector => {
            loader.renderLoader({
                parent: document.querySelector(selector[0]),
                type: selector[1],
                inFlow: false
            });
        });
    })
    .to(adminMain, {autoAlpha:1})

} 

// export const createContentTemplate = (page) => {
//     const adminContent = document.createElement('div');
//     adminContent.setAttribute('class', `admin__content admin__content--${page}`);

//     return adminContent;
// }
export const createAdminTemplate = (page) => {
    const adminContent = document.createElement('div');
    adminContent.setAttribute('class', `admin__content admin__content--${page}`);

    // Create conditional here for different page types/structure 
    if(page === 'users') {
        addTableWrapper(adminContent, page);
        addSummaryWrapper(adminContent, page);
    } else if(page === 'companies') {
        addTableWrapper(adminContent, page);
        addSummaryWrapper(adminContent, page);

    } else if(page === 'applications') {
        addTableWrapper(adminContent, page);
        addApplicationSummaryTemplate(adminContent);
    } else if(page === 'jobs') {
        addTableWrapper(adminContent, page);
        addJobSummaryTemplate(adminContent);
    }

    return adminContent;
}


const addJobSummaryTemplate = (adminContent) => {
    // Create the summary, minus the content divs that'll be animated in after the axios request
    const summaryWrapper = createSummaryElement('summary-wrapper summary-wrapper--jobs');
    const summary = createSummaryElement('summary summary--jobs-page');
    const details = createSummaryElement('summary__details summary__details--jobs-page');
    const header = createSummaryElement('summary__header');

    // Sections
    const detailsSection = createSummaryElement('summary__section summary__section--details');
    const detailsHeading = createSummaryElement('summary__heading summary__heading--jobs-page');
    const descriptionSection = createSummaryElement('summary__section summary__section--description');
    const descriptionHeading = createSummaryElement('summary__heading summary__heading--jobs-page');

    const controls = createSummaryElement('summary__controls summary__job-controls--jobs-page');
    detailsHeading.innerText = 'Details';
    descriptionHeading.innerText = 'Description';

    detailsSection.appendChild(detailsHeading);
    descriptionSection.appendChild(descriptionHeading);
    details.append(header, detailsSection, descriptionSection, controls);
    summary.appendChild(details);
    summaryWrapper.append(summary);
    adminContent.append(summaryWrapper);
}

const addApplicationSummaryTemplate = (adminContent) => {
    // Create the summary, minus the content divs that'll be animated in after the axios request
    const summaryWrapper = createSummaryElement('summary-wrapper summary-wrapper--applications');
    const summary = createSummaryElement('summary summary--applications-page');
    const details = createSummaryElement('summary__details summary__details--applications-page');
    const header = createSummaryElement('summary__header');
    const positionSection = createSummaryElement('summary__section summary__section--application-job');
    const positionHeading = createSummaryElement('summary__heading summary__heading--applications-page');
    const applicantSection = createSummaryElement('summary__section summary__section--application-person');
    const applicantHeading = createSummaryElement('summary__heading summary__heading--applications-page');
    const controls = createSummaryElement('summary__controls summary__application-controls--applications-page');
    positionHeading.innerText = 'Position';
    applicantHeading.innerText = 'Applicant';


    positionSection.appendChild(positionHeading);
    applicantSection.appendChild(applicantHeading);
    details.append(header, applicantSection, positionSection, controls);
    summary.appendChild(details);
    summaryWrapper.append(summary);
    adminContent.append(summaryWrapper);
}
const createSummaryElement = (classes) => {
    const summary = document.createElement('div');
    summary.setAttribute('class', classes);
    return summary;
}
const addSummaryWrapper = (adminContent, page) => {
    const summary = document.createElement('div');
    summary.setAttribute('class', `summary-wrapper summary-wrapper--${page}`);

    adminContent.appendChild(summary);
}
const addTableWrapper = (adminContent, page) => {
    // Create a table wrapper
    const tableWrapper = document.createElement('div');
    tableWrapper.setAttribute('class', `table-wrapper table-wrapper--${page}`);

    // Create a table header and a content wrapper
    const tableHeader = createTableHeader(page, `${page[0].toUpperCase()}${page.substring(1)}`);
    const tableContent = createTableContent(page);
    const tablePagination = createTablePagination(page);

    tableWrapper.append(tableHeader, tableContent, tablePagination);

    adminContent.appendChild(tableWrapper);
}

export const createTableHeader = (page, title) => {
    const header = document.createElement('div');
    header.setAttribute('class', `table__header table__header--${page}`);

    return header;
}
const createTableContent = (page) => {
    const content = document.createElement('div');
    content.setAttribute('class', `table__content table__content--${page}`);
    return content;
};
const createTablePagination = (page) => {
    const pagination = document.createElement('div');
    pagination.setAttribute('class', `pagination-wrapper pagination-wrapper--${page}`);
    return pagination;
};


export const initialiseAdminPage = (page) => {
    // Animate and remove existing content

    utils.clearElement(elements.adminContent);

    // Replace existing classname
    elements.adminContent.className = `admin__content admin__content--${page}`;

    // Insert new Summary
    insertSummary(page);

    // Insert a Table wrapper
    elements.adminContent.insertAdjacentHTML('beforeend', `<div class="${page}-table__wrapper"></div>`);
};

const insertSummary = (page) => {
    let createSummary;

    switch(page) {
        case 'users':           createSummary = createUserSummary; break;
        case 'jobs':            createSummary = createJobSummary; break;
        case 'companies':       createSummary = createCompanySummary; break;
        case 'applications':    createSummary = createApplicationSummary; break;
    }

    // Insert placeholders
    if(createSummary) elements.adminContent.insertAdjacentHTML('afterbegin', createSummary());
}




// @TODO: move to modal module
const displayModal = (action, type, item) => {
    // Create modal and insert into DOM
    const warningModal = utils.warn(
        `Are you sure you want to ${action} ${item[1]} (id: ${item[0]})?`,
        [`${action}`, 'cancel'],
        type,
        item[0]
    );
    document.body.insertAdjacentHTML('afterbegin', warningModal);
};


////////// Event Handlers //////////

export const inputChangeHandler = (e) => {
    const cvPath = document.querySelector('.user-summary__upload-path');
    cvPath.innerText = `${e.target.files[0].name}`;
};

export const focusInNewUserHandler = (e) => {
    e.target.innerText = '';
};
export const focusOutNewUserHandler = (e) => {
    e.target.innerText = e.target.innerText || e.target.dataset.placeholder;
};

export const focusInEditUserHandler = (e) => {
    window.getSelection().selectAllChildren(e.target);
};

export const focusOutEditUserHandler = (user, e) => {
    let value;

    //@TODO: This should be validation
    // If blank, replace with original value
    if(!e.target.innerText) {
        switch(e.target.dataset.placeholder) {
            case 'First Name':  value = user['firstName']; break;
            case 'Last Name':   value = user['lastName']; break;
            case 'Phone':       value = user['phone']; break;
            case 'Email':       value = user['email']; break;
        }
    }
    e.target.innerText = value? value : e.target.innerText;
};

export const focusInNewJobHandler = (e) => {
    if(e.target.nodeName !== 'DIV') return;

    window.getSelection().selectAllChildren(e.target);
};
export const focusOutNewJobHandler = (e) => {
    if(e.target.nodeName !== 'DIV') return;
    e.target.innerText = e.target.innerText || e.target.dataset.placeholder;
};
export const focusInEditJobHandler = (e) => {
    window.getSelection().selectAllChildren(e.target);
};
export const focusOutEditJobHandler = (job, e) => {
    if(e.target.nodeName !== 'DIV') return;
    let value;
    // @TODO: put validation here
    if(!e.target.innerText) {
        switch(e.target.dataset.placeholder) {
            //case 'company':    
            case 'title':       value = job['title']; break;
            case 'location':    value = job['location']; break;
            case 'wage':        value = job['wage']; break;
            case 'description': value = job['description']; break;
        }
    }
    e.target.innerText = value? value : e.target.innerText;
};
export const focusInNewCompanyHandler = (e) => {
    window.getSelection().selectAllChildren(e.target);

};
export const focusOutNewCompanyHandler = (e) => {
    e.target.innerText = e.target.innerText || e.target.dataset.placeholder;
};

export const focusInEditCompanyHandler = (e) => {
    window.getSelection().selectAllChildren(e.target);

};
export const focusOutEditCompanyHandler = (company, e) => {
    let value;

    if(!e.target.innerText) {
        value = company['name'];
    }

    e.target.innerText = value? value : e.target.innerText;
};