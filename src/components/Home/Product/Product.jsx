import {
  MdHeadsetMic,
  MdBarChart,
  MdMenuBook,
  MdInventory,
  MdAutorenew,
  MdTrendingUp,
} from "react-icons/md";
import { useTranslation } from "react-i18next";

const items = [
  {
    titleKey: "productSection.items.path.title",
    descriptionKey: "productSection.items.path.description",
    icon: (
      <MdHeadsetMic
        size={46}
        className="mx-auto text-gray-900 dark:text-white"
      />
    ),
  },
  {
    titleKey: "productSection.items.profile.title",
    descriptionKey: "productSection.items.profile.description",
    icon: (
      <MdBarChart size={46} className="mx-auto text-gray-900 dark:text-white" />
    ),
  },
  {
    titleKey: "productSection.items.resources.title",
    descriptionKey: "productSection.items.resources.description",
    icon: (
      <MdMenuBook size={46} className="mx-auto text-gray-900 dark:text-white" />
    ),
  },
  {
    titleKey: "productSection.items.exercises.title",
    descriptionKey: "productSection.items.exercises.description",
    icon: (
      <MdInventory
        size={46}
        className="mx-auto text-gray-900 dark:text-white"
      />
    ),
  },
  {
    titleKey: "productSection.items.review.title",
    descriptionKey: "productSection.items.review.description",
    icon: (
      <MdAutorenew
        size={46}
        className="mx-auto text-gray-900 dark:text-white"
      />
    ),
  },
  {
    titleKey: "productSection.items.conversation.title",
    descriptionKey: "productSection.items.conversation.description",
    icon: (
      <MdTrendingUp
        size={46}
        className="mx-auto text-gray-900 dark:text-white"
      />
    ),
  },
];

const Product = () => {
  const { t } = useTranslation();

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl xl:text-5xl font-pj">
            {t("productSection.title")}
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300 sm:mt-8 font-pj">
            {t("productSection.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 mt-10 text-center sm:mt-16 sm:grid-cols-2 sm:gap-x-12 gap-y-1 md:grid-cols-3 xl:grid-cols-3 xl:gap-x-1 xl:mt-24">
          {items.map((item, index) => (
            <div
              key={index}
              className={`md:p-8 lg:p-14 ${
                index % 3 !== 0
                  ? "md:border-l md:border-gray-200 dark:border-gray-700"
                  : ""
              } ${
                index >= 3
                  ? "md:border-t md:border-gray-200 dark:border-gray-700"
                  : ""
              } transition-all transform hover:scale-95 duration-700`}
            >
              {item.icon}
              <h3 className="mt-12 text-xl font-bold text-gray-900 dark:text-white font-pj">
                {t(item.titleKey)}
              </h3>
              <p className="mt-5 text-base text-gray-600 dark:text-gray-300 font-pj">
                {t(item.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Product;
