import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL.endsWith('/') 
  ? import.meta.env.VITE_API_URL 
  : `${import.meta.env.VITE_API_URL}/`;

console.log('API Base URL:', baseURL);

const instance = axios.create({
  baseURL: baseURL,
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Axios request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Axios response error:', error.response || error);
    return Promise.reject(error);
  }
);

export default instance;