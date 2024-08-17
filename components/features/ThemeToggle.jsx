'use client';
import { useTheme } from "./ThemeProvider";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { useState, useEffect } from "react";

const ThemeToggle = ({ isSwitch = false }) => {
  const { theme, toggleTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');

  useEffect(() => {
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(systemPrefersDark);
    } else {
      setIsDarkMode(theme === 'dark');
    }
  }, [theme]);

  const handleToggle = () => {
    toggleTheme(isDarkMode ? 'light' : 'dark');
    setIsDarkMode(!isDarkMode);
  };

  const handleChange = (event) => {
    const selectedTheme = event.target.value;
    toggleTheme(selectedTheme);

    if (selectedTheme === 'system') {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(systemPrefersDark);
    } else {
      setIsDarkMode(selectedTheme === 'dark');
    }
  };
  return (
    <div className="p-4 flex items-center">
      {isSwitch ? (
        <div
          onClick={handleToggle}
          className={`cursor-pointer px-1 rounded-full flex items-center transition duration-500 ${
            isDarkMode ? 'bg-gray-600' : 'bg-yellow-400'
          }`}
          style={{ width: '50px', height: '25px' }}
        >
          <div
            className={`flex items-center transform transition-transform duration-500 ${
              isDarkMode ? 'translate-x-full' : ''
            }`}
            style={{ width: '25px', height: '20px' }}
          >
            {isDarkMode ? (
              <BsFillMoonFill className="text-yellow-400" />
            ) : (
              <BsFillSunFill className="text-gray-800" />
            )}
          </div>
        </div>
      ) : (
        <select
          value={theme}
          onChange={handleChange}
          className="p-2 bg-green-200 text-gray-800 rounded-md focus:outline-none focus:ring-none focus:ring-green-none"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      )}
    </div>
  );
};

export default ThemeToggle;