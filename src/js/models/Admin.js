import JRS from '../api/jrs';

export default class Admin {
    
    //////////  Applicant Methods  ///////////
    getUsers({index, limit, orderField, orderDirection}) {
        return JRS.get('/admin/applicants', { params: { index, limit, orderField, orderDirection } });
    }
    getCv (applicantId) {
        return JRS.get(`/admin/cvs/${applicantId}`, { responseType: 'blob' });
    }
    editApplicant(applicantId, formData) {
        return JRS.post(`/admin/edit/applicant/${applicantId}`, formData);
    }
    deleteApplicant(applicantId) {
        return JRS.delete(`/admin/delete/applicant/${applicantId}`);
    }
    createApplicant(formData) {
        return JRS.post('/admin/create/applicant', formData);
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
        // for(let[key, value] of formData.entries()) console.log(key, value);
        return JRS.post(`/admin/create/job`, formData);
    }

    deleteJob(jobId) {
        return JRS.delete(`/admin/delete/job/${jobId}`);
    }


    ////////// Company Methods ///////////
    getCompanies({limit, index, orderField, orderDirection} = {}) {
        return JRS.get('/admin/companies', {
            params: {
                limit,
                index,
                orderDirection,
                orderField
            }
        });
    }

    createCompany(formData) {
        return JRS.post('/admin/create/company', formData);
    }

    deleteCompany(id) {
        return JRS.delete(`/admin/delete/company/${id}`);
    }

    editCompany(companyId, contactId, addressId, formData) {
        for(let[key, value] of formData.entries()) console.log(key, value);
        return JRS.post(`/admin/edit/company/${companyId}/${contactId}/${addressId}`, formData);
    }
}
