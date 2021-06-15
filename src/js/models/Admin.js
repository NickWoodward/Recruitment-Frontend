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
    getJobs({limit, index, titles, locations, orderField, orderDirection} = {}) {
        return JRS.get('/admin/jobs', {
            params: {
                limit,
                index,
                titles,
                locations,
                orderField,
                orderDirection,
               
            }
        });
    }

    editJob(jobId, formData) {
        return JRS.post(`/admin/edit/job/${jobId}`, formData);
    }

    createJob(formData) {
        return JRS.post(`/admin/create/job`, formData);
    }

    deleteJob(jobId) {
        return JRS.delete(`/admin/delete/job/${jobId}`);
    }


    ////////// Company Methods ///////////
    getCompanies() {
        return JRS.get('/admin/companies');
    }
}
