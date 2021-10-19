import JRS from '../api/jrs';

export default class Contact {
    sendContactForm(formData) {
        return JRS.post('/contact', formData);
    }
}