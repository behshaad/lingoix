import { useTranslation } from "react-i18next";

import LeftHero from "./LeftHeroo";
import RightHero from "./RightHero";

const Hero = () => {
  const { t } = useTranslation();
  return (
    <div class="relative py-12 overflow-hidden bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white sm:py-16 lg:py-20 xl:py-24">
      <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div class="flex flex-col">
          <RightHero />
          <LeftHero />
        </div>
      </div>
    </div>
  );
};

export default Hero;

// className = "  bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white";