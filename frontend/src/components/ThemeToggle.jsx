import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = () => {
  const { theme, isSystemTheme, toggleTheme, setSystemTheme, setTheme } =
    useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions = [
    {
      id: "light",
      name: "Light",
      icon: Sun,
      description: "Light theme",
    },
    {
      id: "dark",
      name: "Dark",
      icon: Moon,
      description: "Dark theme",
    },
    {
      id: "system",
      name: "System",
      icon: Monitor,
      description: "Follow system preference",
    },
  ];

  const getCurrentThemeIcon = () => {
    if (isSystemTheme) return Monitor;
    return theme === "dark" ? Moon : Sun;
  };

  const getCurrentThemeName = () => {
    if (isSystemTheme) return "System";
    return theme === "dark" ? "Dark" : "Light";
  };

  const handleThemeSelect = (themeId) => {
    if (themeId === "system") {
      setSystemTheme();
    } else {
      setTheme(themeId);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Main Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {React.createElement(getCurrentThemeIcon(), {
            className: "w-4 h-4 text-gray-700 dark:text-gray-300",
          })}
        </motion.div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
          {getCurrentThemeName()}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="py-2">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isActive =
                  (option.id === "system" && isSystemTheme) ||
                  (option.id === theme && !isSystemTheme);

                return (
                  <motion.button
                    key={option.id}
                    onClick={() => handleThemeSelect(option.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{option.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </div>
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
