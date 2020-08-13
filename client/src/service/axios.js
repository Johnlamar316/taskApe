import axios from "axios";

// Default config options
const defaultOptions = {
  baseURL: "http://127.0.0.1:3011/api",
  headers: {
    "x-api-key": "task-ape",
  },
};

// Update instance
const instance = axios.create(defaultOptions);

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
