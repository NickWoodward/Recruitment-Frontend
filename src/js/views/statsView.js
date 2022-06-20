export const createCompanyStatsSummary = (data) => {
    const header = `
        <div class="stats__header">
            <div class="stats__header-item ">Stats</div>
        </div>
    `;

    // Should have a stats wrapper added by another class, like summaries and tables (REMOVE HERE)
    const markup = `
        <div class="stats-wrapper stats-wrapper--company">
            <div class="stats stats--company">
                ${header}

                <div class="stats__content stats__content--company">
                    <div class="stats__section stats__section--viewed">
                        <div class="stats__heading">Jobs Viewed</div>
                    </div>
                    <div class="stats__section stats__section--applications">
                        <div class="stats__heading">Applications Made</div>
                    </div>
                    <div class="stats__section stats__section--trend">
                    <div class="stats__heading">3 Month Trend</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return markup;
}