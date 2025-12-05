import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // allows cookies if needed
});

export default api;
