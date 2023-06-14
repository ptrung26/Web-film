import axios from "axios";
const baseURL = `https://api.themoviedb.org/3`;

const tmdbAPI = axios.create({
  baseURL,
  params: {
    api_key: process.env.REACT_APP_API_KEY,
  },
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

tmdbAPI.interceptors.request.use(
  async (config) => {
    return config;
  },
  (err) => {
    throw err;
  }
);

tmdbAPI.interceptors.response.use(
  async (response) => {
    return response;
  },
  (err) => {
    throw err.response;
  }
);

export default tmdbAPI;
