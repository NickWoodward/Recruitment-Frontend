const faker = require('faker');

export const createCompany = async () => {
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