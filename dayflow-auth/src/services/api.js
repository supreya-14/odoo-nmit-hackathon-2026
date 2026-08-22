import axios from "axios";

// Single Axios instance used by every service file (authService,
// employeeService, taskService, ...). Centralizing it here means the
// base URL and the token-attaching logic only live in one place.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT (if we have one) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dayflow_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend ever says the token is invalid/expired, clear it and
// send the user back to the login page instead of showing a broken UI.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("dayflow_token");
      localStorage.removeItem("dayflow_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
