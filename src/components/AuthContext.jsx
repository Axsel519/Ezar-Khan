/** @format */

// ============================================
// AUTHENTICATION CONTEXT
// ============================================
// Provides authentication state and actions to the entire application
// Manages user authentication with localStorage persistence

import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../services/api";

// Create authentication context
const AuthContext = createContext();

// ============================================
// CUSTOM HOOK: useAuth
// ============================================
/**
 * Custom hook for accessing authentication context
 * @returns {Object} Authentication context values
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ============================================
// AUTH PROVIDER COMPONENT
// ============================================
/**
 * Authentication provider component
 * Manages auth state persisted in localStorage
 * Synchronizes auth across multiple tabs/windows
 */
export const AuthProvider = ({ children }) => {
  // ========== STATE MANAGEMENT ==========
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    currentUser: null,
    isLoading: true,
  });

  // ========== UTILITY FUNCTIONS ==========
  /**
   * Checks authentication status from localStorage
   * @returns {Object} Login status and user data
   */
  const checkAuth = () => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userData = JSON.parse(localStorage.getItem("currentUser") || "null");
    return { loggedIn, userData };
  };

  /**
   * Updates authentication state from localStorage
   */
  const updateAuthState = () => {
    const { loggedIn, userData } = checkAuth();
    setAuthState({
      isLoggedIn: loggedIn,
      currentUser: userData,
      isLoading: false,
    });
  };

  // ========== EFFECTS ==========
  // Initialize auth state and listen for storage changes
  useEffect(() => {
    updateAuthState();

    // Listen for cross-window localStorage changes
    const handleStorageChange = () => updateAuthState();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ========== AUTHENTICATION METHODS ==========
  /**
   * Logs in a user and persists data to localStorage
   * @param {Object} userData - User information with token
   */
  const login = (userData, token) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("authToken", token);
    }

    setAuthState({ isLoggedIn: true, currentUser: userData, isLoading: false });
    window.dispatchEvent(new Event("authStateChanged"));
  };

  /**
   * Logs out the current user and clears localStorage
   */
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");

    setAuthState({ isLoggedIn: false, currentUser: null, isLoading: false });
    window.dispatchEvent(new Event("authStateChanged"));
  };

  /**
   * Updates the user's profile picture
   * @param {string} imageUrl - URL or base64 string of the new profile image
   */
  const updateProfilePicture = (imageUrl) => {
    if (!authState.currentUser) return;
    const updatedUser = { ...authState.currentUser, profileImage: imageUrl };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setAuthState((prev) => ({ ...prev, currentUser: updatedUser }));
  };

  /**
   * Verifies if user is logged in before performing an action
   * @param {Function} action - The action to perform if logged in
   * @returns {boolean} True if action was performed, false if login required
   */
  const verifyLoginBeforeAction = (action) => {
    if (!authState.isLoggedIn) {
      // User is not logged in - show notification or redirect
      window.dispatchEvent(new CustomEvent("loginRequired"));
      return false;
    }

    // User is logged in - perform the action
    if (typeof action === "function") {
      action();
    }
    return true;
  };

  // Listen for intra-window auth updates
  useEffect(() => {
    const handleAuthChange = () => updateAuthState();
    window.addEventListener("authStateChanged", handleAuthChange);
    return () =>
      window.removeEventListener("authStateChanged", handleAuthChange);
  }, []);

  // ========== CONTEXT VALUE ==========
  const contextValue = {
    isLoggedIn: authState.isLoggedIn,
    currentUser: authState.currentUser,
    isLoading: authState.isLoading,
    login,
    logout,
    updateProfilePicture,
    verifyLoginBeforeAction, // Added verification method
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
