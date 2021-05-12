import JRS from '../api/jrs';


export default class Applications {
    applyForJob(id, details) {
        return JRS.post(`applications/apply/${id}`, details);
    }
    getApplications() {
        return JRS.get('applications/all');
    }
    getApplication(id) {
        return JRS.get(`applications/${id}`);
    }
}