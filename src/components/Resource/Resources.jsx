import { useState } from "react";
import useFilterResources from "../../hooks/useFilterResources";
import ResourceCard from "./FilterSearch";

const resources = [
  {
    title: "React Docs",
    description: "مستندات رسمی React",
    link: "https://react.dev",
  },
  {
    title: "MDN Web Docs",
    description: "منبع عالی برای HTML, CSS, JS",
    link: "https://developer.mozilla.org",
  },
  {
    title: "TailwindCSS",
    description: "فریمورک قدرتمند برای استایل‌دهی",
    link: "https://tailwindcss.com",
  },
];

const Resources = () => {
  const { searchTerm, setSearchTerm, filteredResources } =
    useFilterResources(resources);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">لیست منابع</h1>
      <input
        type="text"
        placeholder="جستجو..."
        className="w-full p-2 border rounded-md mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredResources.map((resource, index) => (
          <ResourceCard key={index} {...resource} />
        ))}
      </div>
    </div>
  );
};

export default Resources;
