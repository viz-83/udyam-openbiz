import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Backend API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
