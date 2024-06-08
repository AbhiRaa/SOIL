import axios from 'axios';
import EventEmitter from 'events';

export const eventEmitter = new EventEmitter();

const API_HOST = "http://localhost:4000/api";

const API = axios.create({
  baseURL: API_HOST,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to append the token to every request
API.interceptors.request.use(function (config) {
  const token = localStorage.getItem('access_token');
  config.headers.Authorization =  token ? `Bearer ${token}` : '';
  return config;
});

// Add a response interceptor to handle expired or invalid tokens
API.interceptors.response.use(
  response => response, // Simply return the response if there is no error
  error => {
    if (error.response && error.response.status === 401) {
      eventEmitter.emit('unauthorized');  // Emit an event when unauthorized
    }
    return Promise.reject(error);
  }
);

export default API;
