import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const VolunteerAuthContext = createContext(null);

export function VolunteerAuthProvider({ children }) {
  const [volunteer, setVolunteer] = useState(null);
  const [volunteerToken, setVolunteerToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("volunteerToken");
    const storedVolunteer = localStorage.getItem("volunteerUser");

    if (storedToken && storedVolunteer) {
      try {
        setVolunteerToken(storedToken);
        setVolunteer(JSON.parse(storedVolunteer));
      } catch {
        // Corrupt data — clear it
        localStorage.removeItem("volunteerToken");
        localStorage.removeItem("volunteerUser");
      }
    }
    setLoading(false);
  }, []);

  const signup = async (formData) => {
    const res = await api.post("/api/auth/volunteer/register", formData);
    const { token, volunteer: volunteerData } = res.data;

    localStorage.setItem("volunteerToken", token);
    localStorage.setItem("volunteerUser", JSON.stringify(volunteerData));

    setVolunteerToken(token);
    setVolunteer(volunteerData);

    return res.data;
  };

  const login = async (email, password) => {
    const res = await api.post("/api/auth/volunteer/login", { email, password });
    const { token, volunteer: volunteerData } = res.data;

    localStorage.setItem("volunteerToken", token);
    localStorage.setItem("volunteerUser", JSON.stringify(volunteerData));

    setVolunteerToken(token);
    setVolunteer(volunteerData);

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("volunteerToken");
    localStorage.removeItem("volunteerUser");
    setVolunteerToken(null);
    setVolunteer(null);
  };

  // Refresh volunteer data from server (e.g., after profile update)
  const refreshVolunteer = async () => {
    try {
      const res = await api.get("/api/auth/volunteer/me");
      const updated = res.data.volunteer;
      const slim = {
        id: updated._id,
        fullName: updated.fullName,
        email: updated.email,
        preferredDomain: updated.preferredDomain,
        status: updated.status,
      };
      localStorage.setItem("volunteerUser", JSON.stringify(slim));
      setVolunteer(slim);
    } catch {
      // Token invalid — force logout
      logout();
    }
  };

  const isAuthenticated = !!volunteerToken;

  return (
    <VolunteerAuthContext.Provider
      value={{
        volunteer,
        volunteerToken,
        loading,
        isAuthenticated,
        signup,
        login,
        logout,
        refreshVolunteer,
      }}
    >
      {children}
    </VolunteerAuthContext.Provider>
  );
}

export function useVolunteerAuth() {
  const context = useContext(VolunteerAuthContext);
  if (!context) {
    throw new Error(
      "useVolunteerAuth must be used within VolunteerAuthProvider"
    );
  }
  return context;
}

export default VolunteerAuthContext;
