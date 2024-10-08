import React, { createContext, useContext, useState, useEffect } from 'react';

const LoginContext = createContext();

export const useLogin = () => {
    return useContext(LoginContext);
};

export const LoginProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        // Retrieve the login state from localStorage
        const token = localStorage.getItem('token');
        return token ? true : false; // Check if token exists to determine logged-in state
    });

    const login = (token) => {
        setIsLoggedIn(true);
        localStorage.setItem('token', token); // Store the token in localStorage
    };

    const logout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token'); // Remove the token from localStorage
    };

    return (
        <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
};
