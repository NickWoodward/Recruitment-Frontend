import JRS from '../api/jrs';

export default class Admin {
    getCv (applicantId) {
        return JRS.get(`/admin/cvs/${applicantId}`, { responseType: 'blob' });
    }
    editApplicant(applicantId, formData) {
        console.log('applicantId');
        return JRS.post(`/admin/applicants/${applicantId}`, formData);
    }
}
