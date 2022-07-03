import {gsap} from 'gsap';

import Select from './customSelect';


export const getAlert = (msg, success) => {
    return `
        <div class="alert alert--${success?'success':'error'}">
            <div class="alert__icon alert__icon--${success?'success':'error'}">
                <svg class="alert__svg alert__svg--${success?'success':'error'}"><use xlink:href="svg/spritesheet.svg#${success?'tick':'alert-circled'}"></svg>
            </div>
            <div class="alert__content alert__content--${success? 'success':'error'}">
                <div class="alert__status">${ success? 'Success':'Error' }</div>
                <div class="alert__message">${msg}</div>
            </div>
        </div>
    `;
}

//// APPLICATION MODALS ////

export const renderNewApplicationModal = (data) => {
    const summary = document.querySelector('.summary__details');
    const modal = createNewApplicationModal(data);

    summary.insertAdjacentHTML('afterbegin', modal);

    gsap.fromTo('.summary__modal--new-application', 
        { autoAlpha: 0,  }, 
        { autoAlpha: 1, duration: .2 }
    );

    populateApplicationModal(data);
};


const createNewApplicationModal = ({jobs, users, appNumber}) => {

    const today = new Date();
    const day = `${today.getDate()}`.padStart(2, '0');;
    const month = `${today.getMonth()+1}`.padStart(2, '0');
    const year = `${today.getFullYear()}`.substring(2);
    const date = `${day}/${month}/${year}`;
    const modal = `
        <div class="summary__modal summary__modal--new-application">

            <div class="summary__modal-header summary__modal-header--applications">
                <div>${appNumber}</div>
                <div>${date}</div>
            </div>
            <div class="new-application__close">
                <svg class="new-application__close-svg"><use xlink:href="svg/spritesheet.svg#cross"></svg>
            </div>
            <div class="new-application__form-wrapper">

                <form class="new-application">
                    <div class="new-application__field">
                        <div class="new-application__label">Job:</div>
                        <select name="job" id="job" class="new-application__input new-application__input--job">
                            <!-- options added in js -->
                        </select>
                    </div>
                    
                    <div class="new-application__field">
                        <div class="new-application__label">Applicant:</div>
                        <select name="applicant" id="applicant" class="new-application__input new-application__input--applicant">
                            <!-- options added in js -->
                        </select>
                    </div>

                    <button class="new-application__submit">Submit</button>

                </form>
            </div>
            <div class="alert-wrapper">
                
            </div>
        </div>
    `;

    return modal;
};

const populateApplicationModal = ({ jobs, users }) => {
    const jobsInput = document.querySelector('.new-application__input--job');
    const userInput = document.querySelector('.new-application__input--applicant');

    // Order the jobs by the company name
    jobs.sort((a, b) => a.companyName > b.companyName? 1:-1);

    const jobPlaceholder = new Option('Jobs');
    jobPlaceholder.setAttribute('disabled', 'disabled');
    jobPlaceholder.setAttribute('selected', 'selected');
    jobsInput.append(jobPlaceholder)

    const userPlaceholder = new Option('Applicants');
    userPlaceholder.setAttribute('disabled', 'disabled');
    userPlaceholder.setAttribute('selected', 'selected');
    userInput.append(userPlaceholder)

    jobs.forEach(job => {
        let group = jobsInput.querySelector(`optgroup[label="${job.companyName}"]`);
        if(!group) {
            group = document.createElement("optgroup");
            group.label = job.companyName;
        }
        const option = new Option(`${job.title}`, job.id);
        option.setAttribute('data-group', group.label.toLowerCase());
        group.append(option);

        jobsInput.appendChild(group);
    });

    users.forEach(applicant => {
        const option = new Option(`${applicant.applicantId}: ${applicant.firstName} ${applicant.lastName}`, applicant.applicantId);
        option.className = 'job-option';
        userInput.add(option, undefined);
    });

    [jobsInput, userInput].forEach(input => new Select(input));
}


//// END APPLICATION MODALS ////