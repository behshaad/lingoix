// import { useTranslation } from "react-i18next";

// const Resources = () => {
//   const { t } = useTranslation();

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
//         {t("resources")}
//       </h1>
//       <p className="text-lg text-gray-700 dark:text-gray-300">
//         {t("resources_description")}
//       </p>

//       {/* لیست منابع */}
//       <ul className="mt-4 space-y-3">
//         <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
//           <a
//             href="https://www.deutsch-lernen.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 dark:text-blue-400 hover:underline"
//           >
//             Deutsch-Lernen.com
//           </a>{" "}
//           - {t("learn_german_online")}
//         </li>
//         <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
//           <a
//             href="https://www.dw.com/de/deutsch-lernen/s-2055"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 dark:text-blue-400 hover:underline"
//           >
//             DW Deutsch Lernen
//           </a>{" "}
//           - {t("dw_german_courses")}
//         </li>
//         <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
//           <a
//             href="https://www.goethe.de/de/spr/ueb.html"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 dark:text-blue-400 hover:underline"
//           >
//             Goethe Institut
//           </a>{" "}
//           - {t("goethe_online_exercises")}
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Resources;

import React from "react";

const Test = () => {
  return (
    <div className="bg-[#001220] text-white ">
      {/* Header Section */}
      <header className="flex justify-center ">
        <nav className=" w-96 bg-opacity-40 bg-gray-600 text-black py-2 text-center flex justify-around rounded-full backdrop-blur-sm">
          <ul className="flex justify-between w-4/5">
            <li className="font-bold">
              <a href="#portfolio">Portfolio</a>
            </li>
            <li className="font-bold">
              <a href="#press">Press</a>
            </li>
            <li className="font-bold">
              <a href="#shop">Shop</a>
            </li>
            <li className="font-bold">
              <a href="#about">About</a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Sections */}
      <section
        id="portfolio"
        className="h-screen flex justify-center items-center"
      >
        <h2 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-900 to-green-400 bg-clip-text text-transparent">
          starten wir
        </h2>
      </section>

      <section id="press" className="h-screen flex justify-center items-center">
        <h2 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-900 to-green-400 bg-clip-text text-transparent">
          Menschen
        </h2>
      </section>

      <section id="shop" className="h-screen flex justify-center items-center">
        <h2 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-900 to-green-400 bg-clip-text text-transparent">
          Shop
        </h2>
      </section>

      <section id="about" className="h-screen flex justify-center items-center">
        <h2 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-900 to-green-400 bg-clip-text text-transparent">
          About
        </h2>
      </section>
    </div>
  );
};

export default Test ;