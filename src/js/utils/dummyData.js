const faker = require('faker');

export const createCompany = async (type, totalCompanies) => {
    const companyName = await faker.company.companyName()
    const firstLine = await faker.address.secondaryAddress()
    const secondLine = await faker.address.streetName();
    const city = await faker.address.city();
    const county = await faker.address.county();
    const postcode = createPostcode();
    const firstName = await faker.name.firstName();
    const lastName = await faker.name.lastName();
    const position = await faker.name.jobTitle();
    const phone = createPhone();
    const email = `${firstName}${lastName}@gmail.com`;

    createPostcode();

    return new Promise((resolve, reject) => {
        resolve({
            companyName,
            firstLine,
            secondLine,
            city,
            county,
            postcode,
            firstName,
            lastName,
            position,
            email,
            phone,
        });
       
    })
}

export const createJob = async (type, numCompanies) => {
    const titleElement = document.querySelector('.job-summary__title');
    const locationElement = document.querySelector('.job-summary__location');
    const wageElement = document.querySelector('.job-summary__wage');
    const descriptionElement = document.querySelector('.job-summary__description');


    const title = await faker.name.jobTitle();
    const location = await faker.address.cityName();
    const wage = `${Math.ceil(Math.random() * 15)}0000`;
    const description = await faker.lorem.sentences(3);

    if(type === 'new') {
        const companyIndex = Math.ceil(Math.random() * 4);
        const typeIndex = Math.ceil(Math.random() * 2);
        const positionIndex = Math.ceil(Math.random() * 2);
        const pqeIndex = Math.ceil(Math.random() * 10);

        const companyElement = document.querySelector('.job-summary__company');
        const typeElement = document.querySelector('.job-summary__type');
        const positionElement = document.querySelector('.job-summary__position');
        const pqeElement = document.querySelector('.job-summary__PQE');

        // Set Dropdown elements
        companyElement.selectedIndex = companyIndex;
        typeElement.selectedIndex = typeIndex;
        positionElement.selectedIndex = positionIndex;
        pqeElement.selectedIndex = pqeIndex; 
        companyElement.dispatchEvent(new Event('change', {'view': window,'bubbles': true}));

    }

    // Text inputs 
    insertData(
        [titleElement, locationElement, wageElement, descriptionElement],
        [title, location, wage, description]
    );

}

const createPhone = () => {
    return `07${Math.ceil(Math.random()*9)}${Math.ceil(Math.random()*9)}${Math.ceil(Math.random()*9)}${Math.ceil(Math.random()*9)}${Math.ceil(Math.random()*9)}${Math.ceil(Math.random()*9)}${Math.ceil(Math.random()*9)}${Math.ceil(Math.random()*9)}`;
}

const createPostcode = () => {
    const randomLetter = () => String.fromCharCode(Math.random()*26+65);

    return `${randomLetter()}${randomLetter()}${Math.ceil(Math.random()*20)} ${Math.ceil(Math.random()*9)}${randomLetter()}${randomLetter()}`;
}

export const insertData = (inputs, data) => {
    Object.values(data).forEach((item, index) => {
        inputs[index].innerText = item;
    });
};