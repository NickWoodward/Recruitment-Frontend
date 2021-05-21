import JRS from '../api/jrs';
import axios from 'axios';

export default class Applications {

    // Don't set headers - otherwise the browser won't deal with boundaries
    // Use a FormData object for Details so multipart/form-data is set
    applyForJob(id, details) {
        return JRS.post(`http://localhost:8080/applications/apply/${id}`, details);
                
    }
    getApplications() {
        return JRS.get('applications/all');
    }
    getApplication(id) {
        return JRS.get(`applications/${id}`);
    }
}