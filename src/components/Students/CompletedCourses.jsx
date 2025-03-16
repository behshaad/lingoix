import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function CompletedCourses() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const courses = [
    {
      id: 1,
      name: "React Basics",
      score: 85,
      certificate: "https://cert.example.com/react",
    },
    {
      id: 2,
      name: "Advanced JavaScript",
      score: 92,
      certificate: "https://cert.example.com/js",
    },
    {
      id: 3,
      name: "UI/UX Design",
      score: 78,
      certificate: "https://cert.example.com/uiux",
    },
  ];

  const filteredCourses = courses
    .filter((course) =>
      course.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortBy === "score" ? b.score - a.score : a.name.localeCompare(b.name)
    );

  return (
    <div className="p-6 max-w-2xl mx-auto text-gray-900 dark:text-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold  mb-4">{t("completedCourses")}</h2>

      <input
        type="text"
        placeholder={t("search")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border dark:text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-500  outline-none transition"
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => setSortBy("name")}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {t("sortByName")}
        </button>
        <button
          onClick={() => setSortBy("score")}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          {t("sortByScore")}
        </button>
      </div>

      <div className="mt-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3 ">{t("courseName")}</th>
              <th className="p-3 ">{t("score")}</th>
              <th className="p-3 ">{t("certificate")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr
                key={course.id}
                className="border-b hover:bg-gray-10 transition"
              >
                <td className="p-3 ">{course.name}</td>
                <td className="p-3 ">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">
                    {course.score}
                  </span>
                </td>
                <td className="p-3">
                  <a
                    href={course.certificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    {t("download")}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

//   🇩🇪 DE

