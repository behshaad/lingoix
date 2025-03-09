// import { Link } from "react-router-dom";

// function HomePage() {
//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gray-100">
//       {/* ناوبار */}
//       <nav className="w-full py-4 bg-white shadow-md">
//         <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-blue-600">Lingoix</h1>
//           <div className="hidden md:flex">
//             <Link
//               to="/login"
//               className="px-4 py-2 text-blue-600 hover:underline"
//             >
//               ورود
//             </Link>
//             <Link
//               to="/register"
//               className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md"
//             >
//               ثبت‌نام
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* هدر */}
//       <header className="text-center mt-16 px-4 sm:px-6 md:px-12 lg:px-24">
//         <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
//           به Lingoix خوش آمدید!
//         </h2>
//         <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg">
//           یادگیری زبان را با بهترین متدهای آموزشی تجربه کنید.
//         </p>
//         <Link to="/register">
//           <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
//             همین حالا شروع کنید
//           </button>
//         </Link>
//       </header>

//       {/* بخش معرفی امکانات */}
//       <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl px-4 sm:px-6 md:px-12 lg:px-24">
//         <div className="p-6 bg-white shadow-md rounded-md text-center">
//           <h3 className="text-lg font-semibold text-blue-600">
//             دوره‌های متنوع
//           </h3>
//           <p className="text-gray-600 text-sm mt-2">
//             دسترسی به دوره‌های مختلف در سطوح متفاوت.
//           </p>
//         </div>
//         <div className="p-6 bg-white shadow-md rounded-md text-center">
//           <h3 className="text-lg font-semibold text-blue-600">
//             تمرینات تعاملی
//           </h3>
//           <p className="text-gray-600 text-sm mt-2">
//             تمرین‌های کاربردی برای یادگیری بهتر.
//           </p>
//         </div>
//         <div className="p-6 bg-white shadow-md rounded-md text-center">
//           <h3 className="text-lg font-semibold text-blue-600">
//             اساتید حرفه‌ای
//           </h3>
//           <p className="text-gray-600 text-sm mt-2">
//             یادگیری از بهترین اساتید زبان.
//           </p>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default HomePage;

// بدون تم

import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";

function HomePage() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900`}>
      {/* ناوبار */}
      <nav className="w-full py-4 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Lingoix</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <Link to="/login" className="hidden md:block px-4 py-2 text-blue-600 dark:text-blue-400 hover:underline">
              ورود
            </Link>
            <Link
              to="/register"
              className="hidden md:block ml-4 px-4 py-2 bg-blue-600 text-white dark:bg-blue-500 rounded-md"
            >
              ثبت‌نام
            </Link>
          </div>
        </div>
      </nav>

      {/* هدر */}
      <header className="text-center mt-16 px-4 sm:px-6 md:px-12 lg:px-24">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          به Lingoix خوش آمدید!
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg">
          یادگیری زبان را با بهترین متدهای آموزشی تجربه کنید.
        </p>
        <Link to="/register">
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white dark:bg-blue-500 rounded-md hover:bg-blue-700 transition">
            همین حالا شروع کنید
          </button>
        </Link>
      </header>
    </div>
  );
}

export default HomePage;

