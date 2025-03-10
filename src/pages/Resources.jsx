import { useTranslation } from "react-i18next";

const Resources = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {t("resources")}
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        {t("resources_description")}
      </p>

      {/* لیست منابع */}
      <ul className="mt-4 space-y-3">
        <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
          <a
            href="https://www.deutsch-lernen.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Deutsch-Lernen.com
          </a>{" "}
          - {t("learn_german_online")}
        </li>
        <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
          <a
            href="https://www.dw.com/de/deutsch-lernen/s-2055"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            DW Deutsch Lernen
          </a>{" "}
          - {t("dw_german_courses")}
        </li>
        <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
          <a
            href="https://www.goethe.de/de/spr/ueb.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Goethe Institut
          </a>{" "}
          - {t("goethe_online_exercises")}
        </li>
      </ul>
    </div>
  );
};

export default Resources;
