import JRS from '../api/jrs';

export default class User {
    getUsers({index, limit}) {
        return JRS.get('/admin/applicants', { params: { index, limit } });
    }
    getUserHeaders() {
        return JRS.get('/users/headers');
    }

    login({ email, password }) {
        return JRS.post('/auth/login', { email, password });
    }
    logout() {
        console.log('logging out');
        return JRS.post('/auth/logout');
    }

    deleteUser(id) {
        return JRS.delete(`/users/delete/${id}`);
    }

    deleteUserByEmail(email) {
        return JRS.delete(`/users/delete-email/${email}`);
    }

    editUser(id, firstName, lastName, email, phone, url) {
        return JRS.post(`/users/edit/${id}`, { firstName, lastName, email, phone, url });
    }

    createUser({firstName, lastName, email, phone, password, confirmPassword, url}) {
        return JRS.post('/users/register', { firstName, lastName, email, phone, password, confirmPassword, url });
    }
}

