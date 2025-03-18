// import { useContext } from "react";
// import { ThemeContext } from "../../../context/ThemeContext.jsx"; 
// import { useTranslation } from "react-i18next";

// const SecondNav = () => {
//   const { t } = useTranslation();
//   const { theme, toggleTheme } = useContext(ThemeContext);

//   return (
//     <div>
//       <div className="bg-white dark:bg-gray-900 transition-all duration-300">
//         <div className="px-4 mx-auto sm:px-6 lg:px-8 xl:px-12">
//           <div className="flex items-center justify-between h-16 lg:h-[72px]">
//             {/* لینک‌های ناوبری */}
//             <div className="hidden lg:flex lg:justify-start lg:ml-16 lg:space-x-8 xl:space-x-14">
//               <a
//                 href="#"
//                 className="text-base font-medium text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
//               >
//                 {t("Translator")}
//                 {/* Translator */}
//                 {/* allArtworks */}
//               </a>
//               <a
//                 href="#"
//                 className="text-base font-medium text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
//               >
//                 {t("Dashboard")}
//                 {/* Dashboard */}
//                 {/* allArtists? */}
//               </a>
//               <a
//                 href="#"
//                 className="text-base font-medium text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
//               >
//                 {t("Resources")}
//                 {/* Resources */}
//                 {/* sellArtwork */}
//               </a>
//               <a
//                 href="#"
//                 className="text-base font-medium text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
//               >
//                 {t("Academy")}
//               </a>
//             </div>

//             {/* سمت چپ */}
//             <div className="flex items-center justify-end ml-auto">
//               <div className="hidden lg:flex lg:items-center lg:space-x-8">
//                 <a
//                   href="#"
//                   className="text-base font-medium text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
//                 >
//                   {t("createAccount")}
//                 </a>
//                 <a
//                   href="#"
//                   className="text-base font-medium text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
//                 >
//                   {t("login")}
//                 </a>
//               </div>

//               <div className="flex items-center space-x-4">
//                 {/* دکمه تغییر تم */}

//                 {/* سبد خرید */}
//                 <button
//                   type="button"
//                   className="relative p-2 text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
//                 >
//                   <svg
//                     className="w-6 h-6"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
//                     />
//                   </svg>
//                   <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-indigo-600 rounded-full">
//                     3
//                   </span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SecondNav;

import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext.jsx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"; // وارد کردن Link از react-router-dom

const SecondNav = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div>
      <div className="bg-white dark:bg-gray-900 transition-all duration-300">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* لینک‌های ناوبری */}
            <div className="hidden lg:flex lg:justify-start lg:ml-16 lg:space-x-8 xl:space-x-14">
              <Link
                to="/translator" // مسیر مورد نظر را تنظیم کنید
                className="text-base font-medium text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {t("Translator")}
              </Link>
              <Link
                to="/dashboard" // مسیر مورد نظر را تنظیم کنید
                className="text-base font-medium text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {t("Dashboard")}
              </Link>
              <Link
                to="/resources" // مسیر مورد نظر را تنظیم کنید
                className="text-base font-medium text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {t("Resources")}
              </Link>
              <Link
                to="/academy" // مسیر مورد نظر را تنظیم کنید
                className="text-base font-medium text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {t("Academy")}
              </Link>
            </div>

            {/* سمت چپ */}
            <div className="flex items-center justify-end ml-auto">
              <div className="hidden lg:flex lg:items-center lg:space-x-8">
                <Link
                  to="/SignUp" // مسیر ثبت‌نام
                  className="text-base font-medium text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {t("createAccount")}
                </Link>
                <Link
                  to="/login" // مسیر ورود
                  className="text-base font-medium text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {t("login")}
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                {/* سبد خرید */}
                {/* <button
                  type="button"
                  className="relative p-2 text-gray-900 dark:text-white transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-indigo-600 rounded-full">
                    3
                  </span>
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondNav;