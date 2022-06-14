import axios, { AxiosError } from 'axios';
import AuthStorage from '../helper/AuthStorage';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const ax = axios.create();

function WithAxios(props: React.PropsWithChildren<{}>) {
    const navigate = useNavigate();

    // Add a request interceptor to send token of logged in user.
    ax.interceptors.request.use(
        (config) => {
            if (config.headers) {
                const bearerToken = new AuthStorage().getToken();
                if (bearerToken) {
                    config.headers.Authorization = bearerToken;
                }
            }
            config.baseURL = process.env.API_BASE_URL || '/api';

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Add a response interceptor to redirect to login if user is unauthorized.
    ax.interceptors.response.use(
        (res) => {
            return Promise.resolve(res);
        },
        (error: AxiosError) => {
            if (error.response?.status === 401) {
                navigate('/');
            }
            return Promise.reject(error);
        }
    );

    return <React.Fragment>{props.children}</React.Fragment>;
}

const ApiService = {
    get: ax.get,
    post: ax.post,
    put: ax.put,
    delete: ax.delete,
    patch: ax.patch,
};

export { WithAxios };
export default ApiService;
