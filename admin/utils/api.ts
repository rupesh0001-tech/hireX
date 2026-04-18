import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api", // Assume backend is on 5000
  withCredentials: true,
});
