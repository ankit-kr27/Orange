import axios from "axios";
import store from "../app/store.js"
import { refreshToken } from "../features/authSlice.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    async (config) => {
        const {accessToken} = store.getState().auth;
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) =>{
        const originalRequest = error.config;
        if(error.response && error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            await store.dispatch(refreshToken());
            const {accessToken} = store.getState().auth;
            if(accessToken){
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axios(originalRequest);
            }
        }
        return Promise.reject(error);  
    }
);

// The use case for the Axios response interceptor in your code is to handle situations where an API request fails due to an expired access token (HTTP 401 Unauthorized), and then automatically refresh the token and retry the original request. This process ensures a smooth user experience without requiring manual intervention or re-authentication from the user.

// For requests where authentication is not required the server won't return a 401 status code, so the interceptor won't be triggered. In this case, the request will be sent as usual.

// The interceptor is a function that Axios calls before sending a request or after receiving a response. It can modify the request or response, or handle errors. In your code, the response interceptor is used to handle 401 errors by refreshing the access token and retrying the original request.

export default api;