export const renderJobDetails = (job) => {
    const markup = `
        <div class="modal job-details">
            ${job}
        </div>
    `;

    body.insertAdjacentHTML('afterbegin', markup);
}