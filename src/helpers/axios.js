// axiosInstance.js
import axios from 'axios';
const base_url="http://localhost:5000"
const Axios = axios.create({
    // https://precision-farming-server.onrender.com
  baseURL:'http://localhost:5000', // Your API base URL
});

export{
Axios,
base_url
}    