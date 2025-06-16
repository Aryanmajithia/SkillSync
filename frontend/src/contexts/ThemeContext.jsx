import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [isSystemTheme, setIsSystemTheme] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("skillSync-theme");
    const savedSystemTheme =
      localStorage.getItem("skillSync-system-theme") === "true";

    if (savedTheme && !savedSystemTheme) {
      setTheme(savedTheme);
      setIsSystemTheme(false);
    } else {
      // Check system preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setTheme(systemTheme);
      setIsSystemTheme(true);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    // Add current theme class
    root.classList.add(theme);

    // Add transition class for smooth theme switching
    root.classList.add("transition-colors", "duration-300");

    // Store theme preference
    if (!isSystemTheme) {
      localStorage.setItem("skillSync-theme", theme);
      localStorage.setItem("skillSync-system-theme", "false");
    } else {
      localStorage.setItem("skillSync-system-theme", "true");
    }
  }, [theme, isSystemTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!isSystemTheme) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [isSystemTheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    setIsSystemTheme(false);
  };

  const setSystemTheme = () => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    setTheme(systemTheme);
    setIsSystemTheme(true);
  };

  const value = {
    theme,
    isSystemTheme,
    toggleTheme,
    setSystemTheme,
    setTheme: (newTheme) => {
      setTheme(newTheme);
      setIsSystemTheme(false);
    },
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
