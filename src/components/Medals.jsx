
import React from "react";
import { useTranslation } from "react-i18next";
import goldMedal from "../assets/gold-medal.png"; // آدرس تصویر مدال طلا
import silverMedal from "../assets/silver-medal.png"; // آدرس تصویر مدال نقره
import bronzeMedal from "../assets/bronze-medal.png"; // آدرس تصویر مدال برنز

const Medals = ({ daysLearned }) => {
  const { t } = useTranslation();

  // مشخص کردن وضعیت مدال بر اساس روزهای یادگیری
  const getMedalStatus = (daysLearned) => {
    if (daysLearned >= 3) return "Gold";
    if (daysLearned >= 2) return "Silver";
    if (daysLearned >= 1) return "Bronze";
    return null;
  };

  // مشخص کردن مدال بعدی
  const getNextMedal = () => {
    if (daysLearned < 1) return "Bronze";
    if (daysLearned < 2) return "Silver";
    if (daysLearned < 3) return "Gold";
    return null;
  };

  const medalStatus = getMedalStatus(daysLearned);
  const nextMedal = getNextMedal();

  // تصاویر مختلف برای مدال‌ها
  const medalImages = {
    Gold: goldMedal,
    Silver: silverMedal,
    Bronze: bronzeMedal,
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6">{t("medals")}</h2>

      {/* نمایش مدال‌های کسب شده */}
      {medalStatus && (
        <div className="flex items-center space-x-4 mb-6">
          <img src={goldMedal} alt="Gold Medal" className="w-16 h-16" />

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {t(medalStatus)}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {medalStatus === "Gold" &&
                t("Learn 3 days in a week to earn Gold")}
              {medalStatus === "Silver" &&
                t("Learn 2 days in a week to earn Silver")}
              {medalStatus === "Bronze" &&
                t("Learn 1 day in a week to earn Bronze")}
            </p>
          </div>
        </div>
      )}

      {/* نمایش مدال بعدی */}
      {nextMedal && (
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-100">
            {t("Next Medal")}
          </h3>
          <p className="text-center text-gray-600 dark:text-gray-300">
            {t("You are 1 day away from earning")} {nextMedal}.
          </p>
          <img
            src={medalImages[nextMedal]}
            alt={`${nextMedal} medal`}
            className="w-16 h-16 mx-auto"
          />
          <p className="text-center text-gray-600 dark:text-gray-300">
            {nextMedal === "Bronze" &&
              t("Learn 1 day in a week to earn Bronze")}
            {nextMedal === "Silver" &&
              t("Learn 2 days in a week to earn Silver")}
            {nextMedal === "Gold" && t("Learn 3 days in a week to earn Gold")}
          </p>
        </div>
      )}

      {/* وضعیت ادامه یادگیری */}
      {!medalStatus && (
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-100">
            {t("Continue Learning")}
          </h3>
          <p className="text-center text-gray-600 dark:text-gray-300">
            {t("Keep learning to earn your first medal!")}
          </p>
        </div>
      )}
    </div>
  );
};

export default Medals;
// import goldMedal from "../assets/gold-medal.png";
// import silverMedal from "../assets/silver-medal.png";
// import bronzeMedal from "../assets/bronze-medal.png";

// const Medals = () => {
//   return (
//     <div>
//       <h2>Medals</h2>
//       <div>
        // <img src={goldMedal} alt="Gold Medal" />
//         <p>Gold - Learn 3 days in a week</p>
//       </div>
//       <div>
//         <img src={silverMedal} alt="Silver Medal" />
//         <p>Silver - Learn 2 days in a week</p>
//       </div>
//       <div>
//         <img src={bronzeMedal} alt="Bronze Medal" />
//         <p>Bronze - Learn 1 day in a week</p>
//       </div>
//     </div>
//   );
// };

// export default Medals;