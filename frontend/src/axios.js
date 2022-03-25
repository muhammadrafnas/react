import axios from 'axios'


export const axiosUser = axios.create({
  baseURL: "http://localhost:8000/",
  headers: { 'x-access-token': localStorage.getItem('token') }
});
