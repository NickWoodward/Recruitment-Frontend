import JRS from '../api/jrs';
import axios from 'axios';


export let cancelTokenSource;

export default class Admin {    
    //////////  Applicant Methods  ///////////
    getUsers({index, limit, orderField, orderDirection}) {
        return JRS.get('/admin/applicants', { 
            params: { index, limit, orderField, orderDirection },     
            cancelToken: new axios.CancelToken(c => cancelTokenSource = c)
        });
    }

    getUserNames() {
        return JRS.get('/admin/applicantnames');
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

    /////////// Application Methods ////////////
    getApplications({index, limit, orderField, orderDirection}, indexId) {
        return JRS.get('/admin/applications', { 
            params: { index, limit, orderField, orderDirection, indexId}, 
            cancelToken: new axios.CancelToken(c => cancelTokenSource = c)

        });
    }
    createApplication(jobId, applicantId) {
        return JRS.post(`/admin/create/application/${jobId}/${applicantId}`);
    }
    deleteApplication(applicationId) {
        return JRS.delete(`/admin/delete/application/${applicationId}`);
    }

    ///////////  Job Methods  ///////////
    getJobs({limit, index, titles, locations, orderField, orderDirection} = {}, indexId) {
        return JRS.get('/admin/jobs', {
            params: {
                limit,
                index,
                titles,
                locations,
                orderField,
                orderDirection,
                indexId
            },
            cancelToken: new axios.CancelToken(c => cancelTokenSource = c)
        });
    }

    getJobNames() {
        return JRS.get('/admin/jobnames');
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
    getCompanies({limit, index, orderField, orderDirection} = {}, indexId) {
        return JRS.get('/admin/companies', {
            params: {
                limit,
                index,
                orderDirection,
                orderField,
                indexId
            },
            cancelToken: new axios.CancelToken(c => cancelTokenSource = c)

        });
    }
    getCompanyNames() {
        return JRS.get('/admin/companyNames');
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
