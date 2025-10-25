'use client';

import { useState } from 'react';
import { Code, Moon, Sun, Github, BookOpen } from 'lucide-react';

export function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

   const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              AI Coding Companion
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
            <BookOpen className="w-3 h-3" />
            For Students & Hackathons
          </div>
        </div>

        {/* <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="View on GitHub"
          >
            <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </a>
        </div> */}
         <div className="flex items-center gap-2">
      {/* <button
        onClick={toggleTheme}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Toggle theme"
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button> */}

      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="View on GitHub"
      >
        <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </a>
    </div>
      </div>
    </header>
  );
}
