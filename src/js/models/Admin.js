import JRS from '../api/jrs';

export default class Admin {
    
    //////////  Applicant Methods  ///////////
    getCv (applicantId) {
        return JRS.get(`/admin/cvs/${applicantId}`, { responseType: 'blob' });
    }
    editApplicant(applicantId, formData) {
        return JRS.post(`/admin/edit/applicant/${applicantId}`, formData);
    }
    deleteApplicant(applicantId) {
        return JRS.delete(`/admin/edit/applicant/${applicantId}`);
    }

    ///////////  Job Methods  ///////////
    getJobs() {
        return JRS.get('/admin/jobs');
    }

    editJob(jobId, formData) {
                        for(let [key, value] of formData.entries()) { console.log(key, value);}

        return JRS.post(`/admin/edit/job/${jobId}`, formData);
    }


    ////////// Company Methods ///////////
    getCompanies() {
        return JRS.get('/admin/companies');
    }
}
