import React from "react";
import { useTranslation } from "react-i18next";

const BilingualText = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md text-center">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        {t("welcome")}
      </h2>
      <p className="text-gray-700 dark:text-gray-300">{t("description")}</p>

    </div>
  );
};

export default BilingualText;
