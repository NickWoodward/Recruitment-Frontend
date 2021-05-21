import JRS from '../api/jrs';

export default class Admin {
    getCv (applicantId) {
        return JRS.get(`/admin/cvs/${applicantId}`, { responseType: 'blob' });
    }
}