import axios from "axios";

const api = axios.create({
  baseURL: "https://prasa-app-eh1g.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  }
  // ❌ withCredentials REMOVED
});

/* Debug logs */
api.interceptors.request.use((config) => {
  console.log("API REQUEST:", config.method?.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("API RESPONSE:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("API ERROR:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
