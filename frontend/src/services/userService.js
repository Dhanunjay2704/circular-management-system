// src/services/userService.js
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/users`;

const getUsers = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

const userService = {
  getUsers,
};

export default userService;
