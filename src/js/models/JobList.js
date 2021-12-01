import JRS from '../api/jrs';

export default class JobList {

    addHubspotUser(id) {
        return JRS.post(`/users/addHubspotUser/${id}`);
    };

    getJobs({ 
        limit, 
        index,
        titles,
        locations,
        salaries,
        types,
        orderField,
        orderDirection
    } = {}) {
        console.log(salaries);
        // Handle async from the jobs controller 
        return JRS.get('/jobs/all', {
            params: {
                limit,
                index,
                titles,
                locations,
                salaries,
                types,
                orderField,
                orderDirection
            }
        }, {withCredentials:true});
    }

    getFeaturedJobs() {
        
        return JRS.get(`jobs/featured`);
    }

    // applyForJob(id, details) {
    //     return JRS.post(`jobs/apply/${id}`, details);
    // }

    getJob(id) {
        return JRS.get(`jobs/${id}`);
    }

    createJob(job) {
        return JRS.post('/jobs/create', job);
    }

    deleteJob(id) {
        return JRS.delete(`/jobs/delete/${id}`);
    }

    editJob(id, job) {
        return JRS.post(`/jobs/edit/${id}`, job);
    }

    // Get unique entries for Job attributes (to be made into filter options)
    getMenuData() {
        return JRS.get('/jobs/menudata', {

        });
    }
}