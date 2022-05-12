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
    company: 
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
            "number.max": `Must be < than 50`,
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
            "string.min": `Must be > 3 letters`,
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

export const validateJob = (data) => validate(data, newJobSchema);
export const validateJobField = (data) => validateProperty(data, newJobSchema);

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
const validateProperty = ({ field, name }, schema) => {
    console.log(field)
    const { error } = schema.extract(name).validate(field);
    if(!error) return null;
    return error.details[0].message;
};
  
export const setErrorFor = (input, message) => {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');

    small.innerText = message;
    formControl.classList.add('error') ;
}
  
export const setSuccessFor = (input) => {
    const formControl = input.parentElement;
    formControl.classList.add('success');
}
  

export const validateForm = (form, data) => {
    if(form === 'job') {
        console.log(getJobFormSchema().validate(data, {abortEarly: false}));
    }
};

