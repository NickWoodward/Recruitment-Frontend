

///////////////  COMPANY SUMMARY  ///////////////

export const createCompanySummary = ({id, companyName, companyDate, contacts, addresses, jobs}) => {
    const header = `
        <div class="summary__header summary__header--company">
            <div class="summary__header-item summary__company-id">${id}</div>
            <div class="summary__header-item summary__company-name">${companyName}</div>
            <div class="summary__header-item summary__company-date">${companyDate}</div>
        </div>
    `;
// summary wrapper added by add summary wrapper class
    const markup = `
        <div class="summary-wrapper summary-wrapper--company">
            <div class="summary summary--company">  
    
                ${header}
      
                <div class="summary__content summary__content--company">

                    ${createCompanyContactSection(contacts[0])}

                    ${createCompanyAddressSection(addresses[0])}

                    <div class="summary__section summary__section--jobs">
                        <div class="summary__heading">Jobs</div>
                        <div class="summary__table-wrapper--jobs table-wrapper--nested-jobs"></div>
                    </div>

                </div>

            </div>  
        </div>
    `;

    return markup;
};

const createCompanyAddressSection = (address) => {
    const addressSection = `
        <div class="summary__section summary__section--addresses">
            <div class="summary__heading summary__heading--addresses" data-id="${address.id}">
                <p>Addresses</p>
                <div class="summary__controls">
                    <div class="summary__btn summary__btn--new-address">
                        <svg class="summary__icon--new-address">
                            <use xlink:href="svg/spritesheet.svg#add">
                        </svg>
                    </div>
                    <div class="summary__btn summary__btn--edit-address">
                        <svg class="summary__icon--edit-address">
                            <use xlink:href="svg/spritesheet.svg#edit-np1">
                        </svg>
                    </div>
                    <div class="summary__btn summary__btn--delete-address">
                        <svg class="summary__icon--delete-address">
                            <use xlink:href="svg/spritesheet.svg#delete-np1">
                        </svg>
                    </div>
                </div>
            </div>

            <div class="summary__row">

                <div class="summary__column">    
                    <div class="summary__item">
                        <div class="summary__label">First Line:</div>
                        <div class="summary__field summary__field--first-line">${address.firstLine}</div>
                    </div>

                    ${address.secondLine? 
                        `<div class="summary__item">
                            <div class="summary__label">Second Line:</div>
                            <div class="summary__field summary__field--second-line">${address.secondLine}</div>
                        </div>`:''
                    }
                    
                    <div class="summary__item">
                        <div class="summary__label">City:</div>
                        <div class="summary__field summary__field--city">${address.city}</div>
                    </div>
                </div>

                <div class="summary__column">
                    <div class="summary__item">
                        <div class="summary__label">County:</div>
                        <div class="summary__field summary__field--county">${address.county}</div>
                    </div>
                    <div class="summary__item">
                        <div class="summary__label">Postcode:</div>
                        <div class="summary__field summary__field--postcode">${address.postcode}</div>
                    </div>
                </div>
            </div>

            <div class="pagination-wrapper pagination-wrapper--addresses"></div>
        </div>
    `;

    return addressSection;
}

const createCompanyContactSection = (contact) => {
    const contactSection = `
        <div class="summary__section summary__section--contacts">
            <div class="summary__heading summary__heading--contacts" data-id="${contact.contactId}">
                <p>Contacts</p>
                <div class="summary__controls">
                    <div class="summary__btn summary__btn--new-contact">
                        <svg class="summary__icon--new-contact">
                            <use xlink:href="svg/spritesheet.svg#add">
                        </svg>
                    </div>
                    <div class="summary__btn summary__btn--edit-contact">
                        <svg class="summary__icon--edit-contact">
                            <use xlink:href="svg/spritesheet.svg#edit-np1">
                        </svg>
                    </div>
                    <div class="summary__btn summary__btn--delete-contact">
                        <svg class="summary__icon--delete-contact">
                            <use xlink:href="svg/spritesheet.svg#delete-np1">
                        </svg>
                    </div>
                </div>
            </div>

            <div class="summary__row">
                <div class="summary__column">
                    <div class="summary__item">
                        <div class="summary__label">Name:</div>
                        <div class="summary__field summary__field--name">${contact.firstName} ${contact.lastName}</div>
                    </div>
                    <div class="summary__item">
                        <div class="summary__label">Position:</div>
                        <div class="summary__field summary__field--position">${contact.position}</div>
                    </div>
                </div>

                <div class="summary__column">
                    <div class="summary__item">
                        <div class="summary__label">Phone:</div>
                        <div class="summary__field summary__field--contact-phone">${contact.phone}</div>
                    </div>
                    <div class="summary__item">
                        <div class="summary__label">Email:</div>
                        <div class="summary__field summary__field--contact-email">
                            <a class="summary__link--contact-email">${contact.email}</a>
                            <svg class="summary__copy-svg"><use xlink:href="svg/spritesheet.svg#applications"></svg>    
                        </div>
                    </div>
                </div>
            </div>
            <div class="pagination-wrapper pagination-wrapper--contacts"></div>
        </div>
    `;
    return contactSection;
}

/////////////  END COMPANY SUMMARY  /////////////



/////////// TESTING:

export const renderPagination = (pages, current, container, tableName) => {
    // Remove pagination if present
    const pagination = document.querySelector(`.pagination--${tableName}`);
    if(pagination) utils.removeElement(pagination);  

    // Generate the individual pagination numbers
    const itemMarkup = generatePaginationMarkup(pages, current, tableName);

    const markup = `
        <div class="pagination pagination--${tableName}">
            <div class="pagination__previous pagination__previous--${tableName} ${current === 0? 'pagination__previous--inactive':''}">Previous</div>
            <div class="pagination__item-wrapper">${itemMarkup}</div>
            <div class="pagination__next pagination__next--${tableName} ${current === pages-1 || pages === 0? 'pagination__next--inactive':''}">Next</div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', markup);
}

const generatePaginationMarkup = (pages, current, table) => {
    let markup = '';
    for(let x = 0; x < pages; x++) {
        const temp = `
            <div class="pagination__item pagination__item--${table} pagination__item--${x+1} ${x === current? 'pagination__item--active':''}" data-id=${x}>
                ${x+1}
            </div>`;
        markup += temp;
    }
    return markup;
};