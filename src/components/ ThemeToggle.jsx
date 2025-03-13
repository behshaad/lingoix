// import { useContext } from "react";
// import { ThemeContext } from "../context/ThemeContext";
// import { FiSun, FiMoon } from "react-icons/fi";

// const ThemeToggle = () => {
//   const { darkMode, setDarkMode } = useContext(ThemeContext);

//   return (
//     <label className="flex items-center cursor-pointer">
//       <input
//         type="checkbox"
//         checked={darkMode}
//         onChange={() => setDarkMode(!darkMode)}
//         className="hidden"
//       />
//       <div className="w-11 h-6 bg-transparent dark:bg-gray-800 rounded-full p-0.5 flex items-center relative transition-all shadow-md shadow-gray-400 dark:shadow-gray-900 backdrop-blur-lg">
//         {/* آیکون خورشید - سمت راست */}
//         <div
//           className={`absolute right-1 top-1 w-5 h-4 flex items-center justify-center transition-opacity duration-300 ${
//             darkMode ? "opacity-0" : "opacity-100"
//           }`}
//         >
//           <FiSun className="text-yellow-500 text-sm" />
//         </div>

//         {/* آیکون ماه - سمت چپ */}
//         <div
//           className={`absolute left-1 top-1 w-5 h-4 flex items-center justify-center transition-opacity duration-300 ${
//             darkMode ? "opacity-100" : "opacity-0"
//           }`}
//         >
//           <FiMoon className="text-white text-sm" />
//         </div>

//         {/* دایره سوئیچ */}
//         <div
//           className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${
//             darkMode ? "translate-x-6" : "translate-x-0"
//           }`}
//         ></div>
//       </div>
//     </label>
//   );
// };

// export default ThemeToggle;
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
        className="hidden"
      />
      <div className="w-10 h-6 bg-transparent dark:bg-gray-800 rounded-full p-0.5 flex items-center relative transition-all shadow-md shadow-gray-400 dark:shadow-gray-900 backdrop-blur-lg">
        {/* آیکون خورشید - سمت راست */}
        <div
          className={`absolute right-1 top-1 w-4 h-4 flex items-center justify-center transition-opacity duration-300 ${
            darkMode ? "opacity-0" : "opacity-100"
          }`}
        >
          <FiSun className="text-yellow-500 text-sm" />
        </div>

        {/* آیکون ماه - سمت چپ */}
        <div
          className={`absolute left-1 top-1 w-4 h-4 flex items-center justify-center transition-opacity duration-300 ${
            darkMode ? "opacity-100" : "opacity-0"
          }`}
        >
          <FiMoon className="text-white text-sm" />
        </div>

        {/* دایره سوئیچ با تغییر رنگ */}
        <div
          className={`w-4 h-4 rounded-full shadow-md transition-transform duration-300 ${
            darkMode
              ? "translate-x-5 bg-white" // در حالت تاریک دایره سفید است
              : "translate-x-0 bg-black" // در حالت روشن دایره مشکی است
          }`}
        ></div>
      </div>
    </label>
  );
};

export default ThemeToggle;