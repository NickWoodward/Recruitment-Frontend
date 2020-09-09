export const renderJobs = ({ data: { jobs } }, element) => {
    const markup = jobs.map(({ title, wage, location, description }) => {
        return (
            `<div class="job-card"><h4 class="job-card__title">${title}</h4> 
            <div class="job-card__wage">${wage}</div> 
            <div class="job-card__location>${location}</div>
            <div class="job-card__description">${description}</div></div>`
        );
    }).join(''); 

    element.insertAdjacentHTML('afterbegin', markup);
}
