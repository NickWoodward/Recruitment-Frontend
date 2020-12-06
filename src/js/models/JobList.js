import JRS from '../api/jrs';

export default class JobList {


    getJobs({ 
        limit, 
        index,
        jobTypes,
        locations
    } = {}) {
        // Handle async from the jobs controller 
        return JRS.get('/jobs/all', {
            params: {
                limit,
                index,
                jobTypes,
                locations
            }
        });
    }

    // Get unique entries for Job attributes (to be made into filter options)
    getMenuData() {
        return JRS.get('/jobs/menudata', {

        });
    }
}