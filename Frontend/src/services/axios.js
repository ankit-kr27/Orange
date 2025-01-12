import { navigate } from '../lib/navigation';
import axios from 'axios';

const options = {
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
};

const TokenRefreshClient = axios.create(options);

TokenRefreshClient.interceptors.response.use((response) => response.data);

export const API = axios.create(options);

API.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const { config } = error;
        const { status, data } = error.response;
        console.log(status, data.message);
        if (status === 401 && (data.message === 'jwt expired' || data.message === 'Unauthorized request')) {
            try {
                await TokenRefreshClient.post('/api/v1/users/refresh-token');
                return TokenRefreshClient(config);
            } catch (error) {
                console.error(error);
                navigate('/login', {
                    state: {
                        // to pass data to the login page for redirecting the user back to the page they were on
                        redirectUrl: window.location.pathname,
                    },
                });
            }
        }
        return Promise.reject(error);
    }
);
