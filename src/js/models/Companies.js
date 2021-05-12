import JRS from '../api/jrs';

export default class Companies {
    getCompanies() {
        return JRS.get('/companies/all');
    }
}