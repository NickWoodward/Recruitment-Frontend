export const renderJobDetails = (job, container) => {
    const markup = `
        <div class="modal job-details">
            <div class="job-details__content">
                
            </div>
        </div>
    `;

    container.insertAdjacentHTML('afterbegin', markup);
}