import { API } from '../services/axios';

const authService = {
    login: async (data) => await API.post('/api/v1/users/login', data),
    logout: async () => await API.post('/api/v1/users/logout'),
    getCurrentUser: async () => await API.get('/api/v1/users/current-user'),
};

export default authService;
