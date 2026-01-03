"use client"

import { useEffect, useState } from "react"

export function Navigation() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark")
      setTheme("dark")
    } else {
      document.documentElement.classList.remove("dark")
      setTheme("light")
    }
  }, [])

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark")
      localStorage.theme = "light"
      setTheme("light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.theme = "dark"
      setTheme("dark")
    }
  }

  return (
    <div className="fixed top-6 left-0 right-0 flex justify-center z-50 px-4 pointer-events-none">
      <nav className="glass-nav flex w-full max-w-5xl pointer-events-auto rounded-full pt-3 pr-3 pb-3 pl-6 shadow-2xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-emerald-500"
          >
            <path d="M12 10a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h.5a2.5 2.5 0 0 1 2.5 2.5V19a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2v-4.5" />
            <path d="M12 2a8 8 0 0 1 8 7v2.5" />
            <path d="M12 2a8 8 0 0 0-8 7v2.5" />
          </svg>
          <span className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 font-geist uppercase">
            HA NOI QUAN
          </span>
        </div>

        {/* Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-8 text-sm text-gray-600 dark:text-gray-400 font-medium">
          <a
            href="#menu"
            className="text-gray-900 dark:text-white transition-colors hover:text-emerald-500 dark:hover:text-emerald-400 font-geist"
          >
            Menu
          </a>
          <a href="#about" className="hover:text-gray-900 dark:hover:text-white transition-colors font-geist">
            About
          </a>
          <a href="#space" className="hover:text-gray-900 dark:hover:text-white transition-colors font-geist">
            Our Space
          </a>
          <a href="#hours" className="hover:text-gray-900 dark:hover:text-white transition-colors font-geist">
            Hours
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle Theme"
          >
            {/* Sun Icon (for Dark Mode) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="hidden dark:block w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            {/* Moon Icon (for Light Mode) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="block dark:hidden w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          <a
            href="#contact"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300 font-geist"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Open Today
          </a>
          <button className="px-5 py-2 rounded-full border border-white/20 bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-500 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] font-geist">
            Book a Table
          </button>
          <button className="lg:hidden text-gray-900 dark:text-white flex items-center ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 22c-4.714 0-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22"
                opacity=".5"
              />
              <path
                fill="currentColor"
                d="M18.75 8a.75.75 0 0 1-.75.75H6a.75.75 0 0 1 0-1.5h12a.75.75 0 0 1 .75.75m0 4a.75.75 0 0 1-.75.75H6a.75.75 0 0 1 0-1.5h12a.75.75 0 0 1 .75.75m0 4a.75.75 0 0 1-.75.75H6a.75.75 0 0 1 0-1.5h12a.75.75 0 0 1 .75.75"
              />
            </svg>
          </button>
        </div>
      </nav>
    </div>
  )
}
