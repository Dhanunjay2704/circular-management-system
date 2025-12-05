import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL || 'https://circular-management-backend.onrender.com'}/api`;

console.log('API_URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // allows cookies if needed
});

export default api;
