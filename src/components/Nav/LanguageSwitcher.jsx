import { useState } from "react";
import { FaGlobe } from "react-icons/fa"; // وارد کردن آیکن کره زمین
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false); // وضعیت باز و بسته بودن منو
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false); // بعد از تغییر زبان منو بسته شود
  };

  return (
    <div className="relative">
      {/* آیکن کره زمین */}
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-xl">
        <FaGlobe />
      </button>

      {/* نمایش دکمه‌های زبان در صورت باز بودن منو */}
      {isOpen && (
        <div className="absolute top-8 right-0 bg-white dark:bg-gray-800 shadow-md rounded-md p-2">
          <button
            onClick={() => changeLanguage("de")}
            className="block px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
          >
            Deutsch
          </button>
          <button
            onClick={() => changeLanguage("en")}
            className="block px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
          >
            English
          </button>

          <button
            onClick={() => changeLanguage("fa")}
            className="block px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
          >
            فارسی
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
