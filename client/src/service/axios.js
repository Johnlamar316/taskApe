import axios from "axios";
import authService from "./auth";

// Default config options
const defaultOptions = {
  baseURL: "http://127.0.0.1:3011/api",
  headers: {
    "x-api-key": "task-ape",
  },
};

// Update instance
const instance = axios.create(defaultOptions);

//set the Auth token for any request
instance.interceptors.request.use(
  (config) => {
    const token = authService.getUserSession(); // token
    config.headers["Authorization"] = token;
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response.data;
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error.response);
  }
);

export default instance;

export const createAPIRequest = (config) => instance(config);
