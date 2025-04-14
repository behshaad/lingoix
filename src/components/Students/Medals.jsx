import { useTranslation } from "react-i18next";

// Import image files directly
import goldMedal from "../../assets/Headercards/community.svg";
import silverMedal from "../../assets/Headercards/lesen.svg";
import bronzeMedal from "../../assets/Headercards/location.svg";

export default function Medals({ daysLearned = 0 }) {
  const { t } = useTranslation();

  const medals = [
    { type: "gold", threshold: 3, image: goldMedal },
    { type: "silver", threshold: 2, image: silverMedal },
    { type: "bronze", threshold: 1, image: bronzeMedal },
  ];

  const currentMedal = medals.find((medal) => daysLearned >= medal.threshold);

  const nextMedal = !currentMedal
    ? medals[medals.length - 1]
    : currentMedal.type !== "gold"
    ? medals[medals.findIndex((m) => m.type === currentMedal.type) - 1]
    : null;

  const daysNeeded = nextMedal ? nextMedal.threshold - daysLearned : 0;

  return (
    <div className="rounded-lg shadow-md p-6 max-w-md mx-auto">
      {/* بخش مدال فعلی */}
      {currentMedal ? (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">
            {t("medals.current.title", {
              medal: t(`medals.types.${currentMedal.type}`),
            })}
          </h3>

          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4">
              <img
                src={currentMedal.image}
                alt={t(`medals.types.${currentMedal.type}`)}
                className="w-20 h-20 object-contain"
              />
            </div>

            <div>
              <h4 className="font-medium text-base">
                {t(`medals.types.${currentMedal.type}`)}
              </h4>
              <p className="text-sm text-gray-600">
                {t(`medals.descriptions.${currentMedal.type}`, {
                  days: currentMedal.threshold,
                })}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <p className="text-center font-medium">{t("medals.motivation")}</p>
        </div>
      )}

      {/* بخش مدال بعدی */}
      {nextMedal && (
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-semibold mb-3">
            {t("medals.next.title")}
          </h3>

          <p className="mb-3 text-sm">
            {t("medals.next.daysAway", {
              count: daysNeeded,
              medal: t(`medals.types.${nextMedal.type}`),
            })}
          </p>

          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4">
              <img
                src={nextMedal.image}
                alt={t(`medals.types.${nextMedal.type}`)}
                className="w-16 h-16 object-contain opacity-70"
              />
            </div>

            <div>
              <h4 className="font-medium text-base">
                {t(`medals.types.${nextMedal.type}`)}
              </h4>
              <p className="text-sm text-gray-500">
                {t(`medals.descriptions.${nextMedal.type}`, {
                  days: nextMedal.threshold,
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
