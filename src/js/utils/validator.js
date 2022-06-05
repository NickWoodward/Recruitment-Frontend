import Joi from 'joi';

const newJobSchema = Joi.object({
    title: 
        Joi.string().trim().min(3).max(50).required().messages({
            "string.base": `Must be text`,
            "string.empty": `Cannot be empty`,
            "string.min": `Must be > 3`,
            "string.max": `Must be < than 50`,
            "any.required": `Required`,
          }),
    companyId: 
        Joi.number().integer().greater(0).less(50).required().messages({
            "number.base": `Select an option`,
            "number.empty": `Select an option`,
            "number.greater": `Select an option`,
            "number.less": `Select an option`,
            "number.max": `Select an option`,
            "any.required": `Select an option`,
          }),
    wage: 
        Joi.number().integer().min(10000).max(10000000).required().messages({
            "number.base": `Enter a number`,
            "number.empty": `Enter a number`,
            "number.min": `Must be > 3`,
            "number.max": `Must be < than 10 million`,
            "any.required": `Enter a number`,
          }),
    location: 
        Joi.string().trim().min(3).max(50).required().messages({
            "string.base": `Must be text`,
            "string.empty": `Cannot be empty`,
            "string.min": `Must be > 3 letters`,
            "string.max": `Must be < than 50 letters`,
            "any.required": `Required`,
          }),
    type: 
        Joi.string().trim().min(2).max(50).required().messages({
            "string.base": `Select an option`,
            "string.empty": `Select an option`,
            "string.min": `Select an option`,
            "string.max": `Select an option`,
            "any.required": `Select an option`,
          }),
    position: 
        Joi.string().trim().min(2).max(50).required().messages({
            "string.base": `Select an option`,
            "string.empty": `Select an option`,
            "string.min": `Select an option`,
            "string.max": `Select an option`,
            "any.required": `Select an option`,
          }),
    pqe: 
        Joi.number().integer().greater(0).less(11).required().messages({
            "number.base": `Select an option`,
            "number.empty": `Select an option`,
            "number.min": `Select an option`,
            "number.max": `Select an option`,
            "any.required": `Select an option`,
          }),
    description: 
        Joi.string().trim().min(5).max(500).messages({
            "string.base": `Must be text`,
            "string.empty": `Cannot be empty`,
            "string.min": `Must be > 5 letters`,
            "string.max": `Must be < than 50 letters`,
            "any.required": `Required`,
        }) ,
    featured: 
        Joi.number().integer().greater(-1).less(2).required().messages({
            "number.base": `Select an option`,
            "number.empty": `Select an option`,
            "number.min": `Select an option`,
            "number.max": `Select an option`,
            "any.required": `Select an option`,
        })   
});

const newCompanySchema = Joi.object({
    companyName: 
        Joi.string().trim().min(1).max(50).required().messages({
            "string.base": `Must be text`,
            "string.empty": `Cannot be empty`,
            "string.min": `Must be > 1`,
            "string.max": `Must be < than 50`,
            "any.required": `Required`,
        }),
    firstName:
        Joi.string().trim().min(2).max(50).required().messages({
            "string.base": `Must be text`,
            "string.empty": `Cannot be empty`,
            "string.min": `Must be > 2`,
            "string.max": `Must be < than 50`,
            "any.required": `Required`,
        }),
    lastName: 
        Joi.string().trim().min(2).max(50).required().messages({
            "string.base": `Must be text`,
            "string.empty": `Cannot be empty`,
            "string.min": `Must be > 2`,
            "string.max": `Must be < than 50`,
            "any.required": `Required`,
        }),
    position: 
        Joi.string().trim().min(2).max(50).required().messages({
            "string.base": `Must be text`,
            "string.empty": `Cannot be empty`,
            "string.min": `Must be > 2`,
            "string.max": `Must be < than 50`,
            "any.required": `Required`,
        }),
    phone: 
        Joi.string().trim().replace(/\s*/g,"").pattern(new RegExp(/^0([1-6][0-9]{8,10}|7[0-9]{9})$/)).messages({
            "string.empty": `Cannot be empty`,
            'string.pattern.base': `Please enter a UK phone number`
        }),
    email: 
        Joi.string().trim().email({tlds:{allow: false}}).messages({
            "string.empty": `Cannot be empty`,
            'string.domain': 'Must contain a valid domain name',
            'string.email': 'Must be a valid email',
        }),
    firstLine: 
        Joi.string().trim().min(3).max(50).required().messages({
            "string.base": `Must be text`,
            "string.empty": `Cannot be empty`,
            "string.min": `Must be > 3`,
            "string.max": `Must be < than 50`,
            "any.required": `Required`,
        }),
    secondLine: 
        Joi.string().trim().min(3).max(50).required().messages({
            "string.base": `Must be text`,
            "string.empty": `Cannot be empty`,
            "string.min": `Must be > 3`,
            "string.max": `Must be < than 50`,
            "any.required": `Required`,
        }),
    city: 
        Joi.string().trim().min(3).max(50).required().messages({
            "string.base": `Must be text`,
            "string.empty": `Cannot be empty`,
            "string.min": `Must be > 3`,
            "string.max": `Must be < than 50`,
            "any.required": `Required`,
        }),
    county: 
        Joi.string().trim().min(3).max(50).required().messages({
            "string.base": `Must be text`,
            "string.empty": `Cannot be empty`,
            "string.min": `Must be > 3`,
            "string.max": `Must be < than 50`,
            "any.required": `Required`,
        }),
    postcode:
        Joi.string().trim().pattern(new RegExp(/^([a-zA-Z]{1,2}[a-zA-Z\d]{1,2})\s?(\d[a-zA-Z]{2})$/)).messages({
            "string.empty": `Cannot be empty`,
            'string.pattern.base': `Please enter a valid postcode`
        }),
});

const newContactSchema = Joi.object({
    firstName:
        Joi.string().trim().min(2).max(50).required().messages({
            "string.base": `Must be text`,
            "string.empty": `Cannot be empty`,
            "string.min": `Must be > 2`,
            "string.max": `Must be < than 50`,
            "any.required": `Required`,
        }),
    lastName: 
        Joi.string().trim().min(2).max(50).required().messages({
            "string.base": `Must be text`,
            "string.empty": `Cannot be empty`,
            "string.min": `Must be > 2`,
            "string.max": `Must be < than 50`,
            "any.required": `Required`,
        }),
    position: 
        Joi.string().trim().min(2).max(50).required().messages({
            "string.base": `Must be text`,
            "string.empty": `Cannot be empty`,
            "string.min": `Must be > 2`,
            "string.max": `Must be < than 50`,
            "any.required": `Required`,
        }),
    phone: 
        Joi.string().trim().replace(/\s*/g,"").pattern(new RegExp(/^0([1-6][0-9]{8,10}|7[0-9]{9})$/)).messages({
            "string.empty": `Cannot be empty`,
            'string.pattern.base': `Please enter a UK phone number`
        }),
    email: 
        Joi.string().trim().email({tlds:{allow: false}}).messages({
            "string.empty": `Cannot be empty`,
            'string.domain': 'Must contain a valid domain name',
            'string.email': 'Must be a valid email',
        }),

});

export const validateJob = (data) => validate(data, newJobSchema);
export const validateJobField = (data) => validateProperty(data, newJobSchema);

export const validateCompany = (data) => validate(data, newCompanySchema);
export const validateCompanyField = (data) => validateProperty(data, newCompanySchema);

export const validateContact = (data) => validate(data, newContactSchema);

// ************* Reusable validation code *************

const validate = (data, schema) => {
    const options = { abortEarly: false }
    const { error } = schema.validate(data, options);
    if(!error) return null;
    
    const errors = {};
    error.details.forEach(error => {
      errors[error.path[0]] = error.message
    })
    return errors;
}
const validateProperty = ({ value, name }, schema) => {
    const { error } = schema.extract(name).validate(value);
    if(!error) return null;
    return error.details[0].message;
};
  
export const setErrorFor = (input, message) => {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');

    small.innerText = message;
    if(formControl.classList.contains('success')) formControl.classList.remove('success');
    formControl.classList.add('error') ;
}
  
export const setSuccessFor = (input) => {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');


    if(formControl.classList.contains('error')) {
        small.innerText = '';
        formControl.classList.remove('error');
    }
    formControl.classList.add('success');
}
  

