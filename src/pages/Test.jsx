// import React, { useState } from "react";
// import { FiBook, FiHeadphones, FiVideo, FiSearch } from "react-icons/fi";

// const resources = [
//   {
//     title: "کتاب‌ها",
//     description: "معرفی منابع اصلی کتاب‌های آموزش زبان.",
//     icon: <FiBook className="w-8 h-8 text-blue-500" />,
//     link: "#books",
//   },
//   {
//     title: "منابع صوتی",
//     description: "فایل‌های صوتی برای تقویت مهارت شنیداری.",
//     icon: <FiHeadphones className="w-8 h-8 text-green-500" />,
//     link: "#audio",
//   },
//   {
//     title: "ویدیوهای آموزشی",
//     description: "مجموعه‌ای از ویدیوهای مرتبط با یادگیری زبان.",
//     icon: <FiVideo className="w-8 h-8 text-red-500" />,
//     link: "#videos",
//   },
// ];

// export default function ResourcesPage() {
//   const [search, setSearch] = useState("");

//   const filteredResources = resources.filter((resource) =>
//     resource.title.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="p-6">
//       {/* نوار جستجو */}
//       <div className="flex items-center mb-6 border rounded-lg p-2 shadow-sm">
//         <FiSearch className="text-gray-500 w-5 h-5 mr-2" />
//         <input
//           type="text"
//           placeholder="جستجوی منابع..."
//           className="w-full p-2 outline-none"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* کارت‌های منابع */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredResources.map((resource, index) => (
//           <a
//             key={index}
//             href={resource.link}
//             className="p-6 flex flex-col items-center text-center shadow-lg rounded-2xl border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl"
//           >
//             {resource.icon}
//             <h2 className="text-xl font-bold mt-4">{resource.title}</h2>
//             <p className="text-gray-600 mt-2">{resource.description}</p>
//             <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
//               مشاهده منابع
//             </button>
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// }

// با سرج بالا
