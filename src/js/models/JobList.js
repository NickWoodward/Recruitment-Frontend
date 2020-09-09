import JRS from '../api/jrs';

export default class JobList {

    // Handle async from the jobs controller (jobs.js)
    getJobs() {
        return JRS.get('/jobs/all', {});
    }
}