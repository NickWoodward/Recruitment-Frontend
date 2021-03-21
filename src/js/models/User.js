import JRS from '../api/jrs';

export default class User {
    async getUsers() {
        return await JRS.get('/users/all');
    }

    async login({ email, password }) {
        return await JRS.post('/auth/login', { email, password });
    }
}

