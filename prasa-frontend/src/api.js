
import axios from "axios";

const api = axios.create({
  baseURL: "https://prasa-app-eh1g.onrender.com/api",
  timeout: 20000,
});

// 👌 Do NOT auto redirect on Android failures
api.interceptors.response.use(
  res => res,
  err => {
    console.log("API ERROR:", err?.response?.status);

    if (!err.response) {
      alert("Network offline. Data will sync later.");
      return Promise.reject(err);
    }

    // avoid redirect loop on Android
    if (err.response.status === 401) {
      alert("Session expired. Please login again.");
    }

    return Promise.reject(err);
  }
);

export default api;
