import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("himalayan_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => setUser(r.data.user))
        .catch(() => { setToken(null); localStorage.removeItem("himalayan_token"); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  // handle OAuth redirect with token in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get("token");
    if (oauthToken) {
      localStorage.setItem("himalayan_token", oauthToken);
      setToken(oauthToken);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const register = async (name, email, password, role = "guest") => {
    const { data } = await axios.post(`${API}/auth/register`, { name, email, password, role });
    localStorage.setItem("himalayan_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem("himalayan_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await axios.post(`${API}/auth/logout`).catch(() => {});
    localStorage.removeItem("himalayan_token");
    setToken(null);
    setUser(null);
  };

  const loginWithGoogle = () => {
    window.location.href = `${API}/auth/google`;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, loginWithGoogle, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
