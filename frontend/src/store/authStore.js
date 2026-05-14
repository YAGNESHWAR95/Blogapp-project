// import zustand and axios
import { create } from "zustand";
import axios from "axios";
import BASE_URL from "../components/config/baseAPI";

// create auth store
export const useAuth = create((set) => ({
  // initial state
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // login function
  login: async (userCredWithRole) => {
    // Pass whatever credentials are provided (including role) to the backend
    const userCredObj = userCredWithRole;

    try {
      set({ loading: true, error: null });

      const res = await axios.post(`${BASE_URL}/common-api/login`, userCredObj, {
        withCredentials: true,
      });

      set({
        loading: false,
        error: null,
        isAuthenticated: true,
        currentUser: res.data.payload,
      });
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Login Failed",
      });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });

      await axios.get(
        `${BASE_URL}/common-api/logout`,
        { withCredentials: true }
      );

      set({
        loading: false,
        error: null,
        isAuthenticated: false,
        currentUser: null,
      });
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Logout Failed",
      });
    }
  },

// restore login
  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${BASE_URL}/common-api/check-auth`, { withCredentials: true });

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      // If user is not logged in → do nothing
      if (err.response?.status === 401) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
        });
        return;
      }

      // other errors
      console.error("Auth check failed:", err);
      set({ loading: false });
    }
  }
}));

