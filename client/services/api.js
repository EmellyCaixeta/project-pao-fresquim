import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/";

const api = axios.create({
  baseURL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export default api;
