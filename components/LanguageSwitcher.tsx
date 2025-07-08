"use client";

import { useLocale } from "next-intl";
import { useState, useEffect, useRef } from "react";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "az", label: "Azərbaycan", flag: "🇦🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

const LanguageSwitcher = () => {
  const currentLocale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lang: string) => {
    if (lang === currentLocale) return;
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
    window.location.reload();
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-700 font-medium">
          {languages.find((l) => l.code === currentLocale)?.flag}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-20 bg-white border border-gray-200 rounded-lg shadow-lg p-2 transition-all duration-300">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center justify-center space-x-3 px-4 py-2 rounded-md hover:bg-gray-100 transition-all ${
                currentLocale === lang.code
                  ? "font-bold bg-gray-200"
                  : "text-gray-700"
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;