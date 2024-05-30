import axios from 'axios';

const API_HOST = "http://localhost:4000/api";

const API = axios.create({
  baseURL: API_HOST,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
API.interceptors.request.use(function (config) {
  const token = localStorage.getItem('access_token');
  config.headers.Authorization =  token ? `Bearer ${token}` : '';
  return config;
});

export default API;
