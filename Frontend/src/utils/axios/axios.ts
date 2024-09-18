import axios, { AxiosError } from "axios";

async function refreshToken () {
    try {
        const response = await axiosInstance.post('api/v1/users/refresh-token');
        console.log(response)
        return response.data.data.accessToken;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error("Error refreshing token:", error?.response?.data || error.message);
        } else {
            console.error("Error refreshing token:", error);
        }
        throw error;
    }
}

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
})

axios.interceptors.response.use(
    (response) => response,
    async ( error ) => {
        console.log("Trying to refresh")
        if(error.response && error.response.status === 401 && !error.config._retry) {
            const originalRequest = error.config;
            originalRequest._retry = true;
            try {
                const newToken = await refreshToken();
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                return axios(originalRequest);
            } catch (refreshError) {
                if (refreshError instanceof AxiosError) {
                    console.error('Token refresh failed:', refreshError?.response?.data || refreshError.message);
                } else {
                    console.error('Token refresh failed:', refreshError);
                }
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;