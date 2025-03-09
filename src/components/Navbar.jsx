// import { useContext } from "react";
// import { ThemeContext } from "../context/ThemeContext";
// import { useTranslation } from "react-i18next";
// import { Link } from "react-router-dom";
// import LanguageSwitcher from "./LanguageSwitcher";
// import { FiSun, FiMoon } from "react-icons/fi"; // آیکون‌های مدرن

// const Navbar = () => {
//   const { darkMode, setDarkMode } = useContext(ThemeContext);
//   const { t } = useTranslation();

//   return (
//     <nav className="w-full py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md fixed top-0 z-50">
//       <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
//         {/* لوگو */}
//         <Link
//           to="/"
//           className="text-3xl font-semibold text-gray-900 dark:text-white tracking-wide"
//         >
//           Lingoix
//         </Link>

//         <div className="flex items-center gap-4">
//           {/* دکمه تغییر تم */}
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className="p-2 rounded-full transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
//           >
//             {darkMode ? (
//               <FiSun size={22} color="#facc15" />
//             ) : (
//               <FiMoon size={22} color="#94a3b8" />
//             )}
//           </button>

//           {/* سوییچر زبان */}
//           <LanguageSwitcher />

//           {/* لینک‌های ورود و ثبت‌نام */}
//           <Link
//             to="/login"
//             className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
//           >
//             {t("login")}
//           </Link>
//           <Link
//             to="/register"
//             className="px-4 py-2 bg-blue-600 text-white dark:bg-blue-500 rounded-full text-sm font-medium shadow-md hover:bg-blue-700 dark:hover:bg-blue-400 transition"
//           >
//             {t("register")}
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { FiSun, FiMoon } from "react-icons/fi"; // آیکون‌های مدرن

const Navbar = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <nav className="w-full py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md fixed top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        {/* لوگو */}
        <Link
          to="/"
          className="text-3xl font-semibold text-gray-900 dark:text-white tracking-wide"
        >
          Lingoix
        </Link>

        <div className="flex items-center gap-4">
          {/* دکمه تغییر تم */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? (
              <FiSun size={22} color="#facc15" />
            ) : (
              <FiMoon size={22} color="#94a3b8" />
            )}
          </button>

          {/* سوییچر زبان */}
          <LanguageSwitcher />

          {/* لینک‌های ورود و ثبت‌نام */}
          <Link
            to="/login"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            {t("login")}
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-blue-600 text-white dark:bg-blue-500 rounded-full text-sm font-medium shadow-md hover:bg-blue-700 dark:hover:bg-blue-400 transition"
          >
            {t("register")}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
