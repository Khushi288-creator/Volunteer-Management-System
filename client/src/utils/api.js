import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
});

// ── Request interceptor ────────────────────────────────────────────────────
// Attach the right token depending on which part of the API is being called.
// Admin routes (/api/admin, /api/auth/login) → adminToken
// Volunteer routes (/api/volunteers, /api/auth/volunteer) → volunteerToken
// Both tokens exist independently and never interfere.
api.interceptors.request.use((config) => {
  const url = config.url || "";

  const isVolunteerRoute =
    url.startsWith("/api/auth/volunteer") ||
    url.startsWith("/api/volunteers/profile") ||
    url.startsWith("/api/volunteers/dashboard");

  if (isVolunteerRoute) {
    const token = localStorage.getItem("volunteerToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Default: admin token for /api/admin/* and /api/auth/login
    const token = localStorage.getItem("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ── Response interceptor ───────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";

      if (
        url.startsWith("/api/auth/volunteer") ||
        url.startsWith("/api/volunteers/profile") ||
        url.startsWith("/api/volunteers/dashboard")
      ) {
        // Volunteer session expired
        localStorage.removeItem("volunteerToken");
        localStorage.removeItem("volunteerUser");
        if (window.location.pathname.startsWith("/volunteer/")) {
          window.location.href = "/volunteer/login";
        }
      } else {
        // Admin session expired
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        if (window.location.pathname.startsWith("/admin/dashboard")) {
          window.location.href = "/admin/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
