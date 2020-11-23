
// Check if user has scrolled to the bottom of the visible jobs list
export const isAtBottom = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    return scrollTop + clientHeight >= scrollHeight;
};

export const renderJobs = (jobs, element) => {
    const markup = jobs.map(({ id, title, wage, location, description }) => {
        return (
            `<div class="job-card">
                <h3 class="job-card__title">${title}</h3> 
                <div class="job-card__content">
                    <div class="job-card__wage">${wage}</div> 
                    <div class="job-card__location">${location}</div>
                    <div class="job-card__description">${description}</div>
                </div>    
                <div class="job-card__footer">
                    <button class="job-card__view-btn">View</button>
                
                </div>
            </div>`
        );
    }).join(''); 

    element.insertAdjacentHTML('beforeend', markup);
}

export const clearJobs = (element) => {
    while (element.firstChild) element.removeChild(element.firstChild);
}