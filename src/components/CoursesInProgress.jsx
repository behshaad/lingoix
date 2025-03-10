// import React, { useState, useEffect, useRef } from "react";
// import { useTranslation } from "react-i18next";
// import { IoClose, IoGrid } from "react-icons/io5";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const courses = [
//   {
//     id: 1,
//     title: { en: "React for Beginners", de: "React für Anfänger" },
//     imageUrl: "https://via.placeholder.com/100",
//     lastActive: { en: "2 days ago", de: "Vor 2 Tagen" },
//     progress: 75,
//   },
//   {
//     id: 2,
//     title: { en: "JavaScript Mastery", de: "JavaScript-Meisterklasse" },
//     imageUrl: "https://via.placeholder.com/100",
//     lastActive: { en: "1 week ago", de: "Vor 1 Woche" },
//     progress: 40,
//   },
// ];

// const CoursesInProgress = () => {
//   const { t, i18n } = useTranslation();
//   const [showAllCourses, setShowAllCourses] = useState(false);
//   const popupRef = useRef(null);
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     if (showAllCourses) {
//       gsap.fromTo(
//         popupRef.current,
//         { y: 50, opacity: 0, scale: 0.95 },
//         { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
//       );

//       gsap.to(scrollRef.current, {
//         scrollTrigger: {
//           trigger: scrollRef.current,
//           start: "top top",
//           end: "bottom bottom",
//           scrub: 1,
//           ease: "power2.out",
//         },
//       });
//     }
//   }, [showAllCourses]);

//   return (
//     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md relative">
//       <div className="flex justify-between items-center mb-3">
//         <h2 className="text-xl font-semibold">{t("title")}</h2>
//         <div className="flex items-center">
//           <button
//             onClick={() =>
//               i18n.changeLanguage(i18n.language === "en" ? "de" : "en")
//             }
//             className="text-gray-600 dark:text-gray-300 hover:text-blue-500 mx-2"
//           >
//             {/* {i18n.language === "en" ? "🇩🇪" : "🇺🇸"} */}
//           </button>
//           <button
//             onClick={() => setShowAllCourses(true)}
//             className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
//           >
//             <IoGrid size={24} />
//           </button>
//         </div>
//       </div>

//       {/* نمایش آخرین دوره */}
//       <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md flex items-center">
//         <img
//           src={courses[0].imageUrl}
//           alt={courses[0].title[i18n.language]}
//           className="w-16 h-16 rounded-lg mr-4"
//         />
//         <div className="flex flex-col flex-grow">
//           <h3 className="text-lg font-semibold">
//             {courses[0].title[i18n.language]}
//           </h3>
//           <p className="text-sm text-gray-500 dark:text-gray-300">
//             {t("lastActive")}: {courses[0].lastActive[i18n.language]}
//           </p>
//           <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 mt-2">
//             <div
//               className="bg-blue-500 h-2 rounded-full transition-all duration-500"
//               style={{ width: `${courses[0].progress}%` }}
//             ></div>
//           </div>
//           <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//             {t("progress")}: {courses[0].progress}%
//           </p>
//         </div>
//         <button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
//           {t("continue")}
//         </button>
//       </div>

//       {/* پاپ‌آپ لیست همه دوره‌ها */}
//       {showAllCourses && (
//         <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-40 backdrop-blur-lg">
//           <div
//             ref={popupRef}
//             className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-1/2 max-h-96 overflow-hidden"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-2xl font-semibold">{t("allCourses")}</h3>
//               <button
//                 onClick={() => setShowAllCourses(false)}
//                 className="text-red-500 hover:text-red-600 p-2 rounded-full focus:outline-none"
//               >
//                 <IoClose size={24} />
//               </button>
//             </div>
//             <div
//               ref={scrollRef}
//               className="max-h-80 overflow-y-auto pr-2"
//               style={{ scrollbarWidth: "thin", scrollbarColor: "#888 #f1f1f1" }}
//             >
//               {courses.map((course) => (
//                 <div
//                   key={course.id}
//                   className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4 shadow-sm flex items-center transform transition-all duration-300 hover:scale-105"
//                 >
//                   <img
//                     src={course.imageUrl}
//                     alt={course.title[i18n.language]}
//                     className="w-12 h-12 rounded-lg mr-4"
//                   />
//                   <div className="flex flex-col flex-grow">
//                     <h3 className="text-lg font-semibold">
//                       {course.title[i18n.language]}
//                     </h3>
//                     <p className="text-sm text-gray-600 dark:text-gray-300">
//                       {t("lastActive")}: {course.lastActive[i18n.language]}
//                     </p>
//                     <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 mt-2">
//                       <div
//                         className="bg-blue-500 h-2 rounded-full transition-all duration-500"
//                         style={{ width: `${course.progress}%` }}
//                       ></div>
//                     </div>
//                     <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                       {t("progress")}: {course.progress}%
//                     </p>
//                   </div>
//                   <button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
//                     {t("continue")}
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CoursesInProgress;
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { IoClose, IoGrid } from "react-icons/io5";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const courses = [
  {
    id: 1,
    title: { en: "React for Beginners", de: "React für Anfänger" },
    imageUrl: "https://via.placeholder.com/100",
    lastActive: { en: "2 days ago", de: "Vor 2 Tagen" },
    progress: 75,
  },
  {
    id: 2,
    title: { en: "JavaScript Mastery", de: "JavaScript-Meisterklasse" },
    imageUrl: "https://via.placeholder.com/100",
    lastActive: { en: "1 week ago", de: "Vor 1 Woche" },
    progress: 40,
  },
];

const CoursesInProgress = () => {
  const { t, i18n } = useTranslation();
  const [showAllCourses, setShowAllCourses] = useState(false);
  const popupRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (showAllCourses) {
      gsap.fromTo(
        popupRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
      );

      gsap.to(scrollRef.current, {
        scrollTrigger: {
          trigger: scrollRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          ease: "power2.out",
        },
      });
    }
  }, [showAllCourses]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md relative">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">{t("title")}</h2>
        <div className="flex items-center">
          <button
            onClick={() =>
              i18n.changeLanguage(i18n.language === "en" ? "de" : "en")
            }
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 mx-2"
          >
            {/* {i18n.language === "en" ? "🇩🇪" : "🇺🇸"} */}
          </button>
          <button
            onClick={() => setShowAllCourses(true)}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
          >
            <IoGrid size={24} />
          </button>
        </div>
      </div>

      {/* نمایش آخرین دوره */}
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center">
        <img
          src={courses[0].imageUrl}
          alt={courses[0].title[i18n.language]}
          className="w-16 h-16 rounded-lg mb-4 sm:mb-0 sm:mr-4"
        />
        <div className="flex flex-col flex-grow">
          <h3 className="text-lg font-semibold">
            {courses[0].title[i18n.language]}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {t("lastActive")}: {courses[0].lastActive[i18n.language]}
          </p>
          <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${courses[0].progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {t("progress")}: {courses[0].progress}%
          </p>
        </div>
        <button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
          {t("continue")}
        </button>
      </div>

      {/* پاپ‌آپ لیست همه دوره‌ها */}
      {showAllCourses && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-40 backdrop-blur-lg">
          <div
            ref={popupRef}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 sm:w-1/2 max-h-96 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">{t("allCourses")}</h3>
              <button
                onClick={() => setShowAllCourses(false)}
                className="text-red-500 hover:text-red-600 p-2 rounded-full focus:outline-none"
              >
                <IoClose size={24} />
              </button>
            </div>
            <div
              ref={scrollRef}
              className="max-h-80 overflow-y-auto pr-2"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#888 #f1f1f1" }}
            >
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4 shadow-sm flex items-center transform transition-all duration-300 hover:scale-105"
                >
                  <img
                    src={course.imageUrl}
                    alt={course.title[i18n.language]}
                    className="w-12 h-12 rounded-lg mr-4"
                  />
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold">
                      {course.title[i18n.language]}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t("lastActive")}: {course.lastActive[i18n.language]}
                    </p>
                    <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {t("progress")}: {course.progress}%
                    </p>
                  </div>
                  <button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
                    {t("continue")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesInProgress;