import { createContext, useState, useEffect } from "react";
import { getUserProfile, fetchChannelByUser } from "../api";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [channel, setChannel] = useState(null); // Track channel state
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      getUserProfile(token)
        .then(({ data }) => {
          setUser(data);
          return fetchChannelByUser(data._id, token);
        })
        .then(({ data }) => setChannel(data))
        .catch(() => logout());
    }
  }, [token]);

  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setChannel(null);
    setToken("");
  };

  return (
    <AuthContext.Provider
      value={{ user, channel, token, login, logout, setChannel }} // Add setChannel to context
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
