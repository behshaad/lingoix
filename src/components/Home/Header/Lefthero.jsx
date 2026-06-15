import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";  // Import Link

const Lefthero = () => {
  const { t } = useTranslation();

  return (
    <div className="text-gray-900 dark:text-white">
      <div className="flex flex-col gap-32 max-w-md mx-auto text-center xl:max-w-lg lg:text-left">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:leading-tight xl:text-6xl text-center dark:text-white mb-6">
            {t("hero.title")}
          </h1>
          <p className="mt-6 text-lg font-medium lg:mt-10 text-center dark:text-white">
            {t("hero.subtitle")}
          </p>
        </div>

        <div className="mt-8 lg:mt-12 text-center">
          <Link
            to="/Product"
            title=""
            className="inline-flex items-center justify-center px-8 py-3 text-base font-bold leading-7 text-white bg-gray-900 border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 font-pj hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
            role="button"
          >
            {t("moto")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Lefthero;