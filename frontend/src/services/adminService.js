import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // Include cookies if needed (optional)
});

const adminService = {
  getUserCounts: () => API.get('/admin/users/counts'),
  getCircularCount: () => API.get('/admin/circulars/count'),
  getEventCount: () => API.get('/admin/events/count'),
};

export default adminService;
