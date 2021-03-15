import JRS from '../api/jrs';

export default class User {
    async login({ email, password }) {
        return await JRS.post('/auth/login', { email, password });
    }
}