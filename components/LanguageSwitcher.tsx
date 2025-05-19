"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState, useEffect, useRef } from "react";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "az", label: "Azərbaycan", flag: "🇦🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lang: string) => {
    if (lang === currentLocale) return;

    // Set cookie for the locale
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
    
    // Update the URL path to reflect the new locale
    if (pathname) {
      const newPath = pathname.replace(/^\/(en|az|ru)/, `/${lang}`);
      router.push(newPath);
      
      // Force reload the page to ensure all components get the new locale
      // This is optional and should be removed once the other fixes are in place
      // window.location.href = newPath;
    }
    
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