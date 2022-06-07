import axios from 'axios';
import AuthStorage from '../helper/AuthStorage';

// Add a request interceptor
axios.interceptors.request.use(
    function (config) {
        if (config.headers) {
            const bearerToken = new AuthStorage().getToken();
            if (bearerToken) {
                config.headers.Authorization = bearerToken;
            }
        }
        config.baseURL = process.env.API_BASE_URL || '/api';

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

const ApiService = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    patch: axios.patch,
};

export default ApiService;
