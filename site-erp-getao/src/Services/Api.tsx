import axios from "axios";

const BASE = "http";
const URL = "localhost:8080";

const api = axios.create({
  baseURL: `${BASE}://${URL}/api`, // URL da sua API
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
