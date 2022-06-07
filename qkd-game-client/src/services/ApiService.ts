import axios from 'axios';
import Auth from '../helper/Auth';

// Add a request interceptor
axios.interceptors.request.use(
    function (config) {
        if (config.headers) {
            const bearerToken = new Auth().getToken();
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
