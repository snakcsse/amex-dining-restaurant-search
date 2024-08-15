import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('Checking authentication...');
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/users/me', {
          withCredentials: true, // ensure cookies are included in requests sent to server (When making requests to a server, browsers by default do not include cookies or any other credentials in cross-origin requests)
        });
        setUser(res.data.data.user);
      } catch (err) {
        console.log('User is not authenticateed', err);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(
      'http://localhost:3000/api/v1/users/login',
      { email, password },
      { withCredentials: true }
    );
    setUser(res.data.data.user);
  };

  const signup = async (name, email, password, passwordConfirm) => {
    const res = await axios.post(
      'http://localhost:3000/api/v1/users/signup',
      {
        name,
        email,
        password,
        passwordConfirm,
      },
      { withCredentials: true }
    );
    setUser(res.data.data.user);
  };

  const logout = async () => {
    await axios.get('http://localhost:3000/api/v1/users/logout', { withCredentials: true });
    setUser(null);
  };

  const forgotPassword = async (email) => {
    await axios.post(
      'http://localhost:3000/api/v1/users/forgotPassword',
      {
        email,
      },
      { withCredentials: true }
    );
  };

  const resetPassword = async (token, password, passwordConfirm) => {
    await axios.patch(
      `http://localhost:3000/api/v1/users/resetPassword/${token}`,
      {
        password,
        passwordConfirm,
      },
      { withCredentials: true }
    );
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, signup, logout, forgotPassword, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
