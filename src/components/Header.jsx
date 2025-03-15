import React from "react";
import { useTranslation } from "react-i18next";
import RightHero from "./RightHero";
import SecondNav from "./SecondNav";
import LanguageCards from "./languageCards";

const Header = () => {
  const { t } = useTranslation();

  return (
    <>
      <SecondNav />

      <div className="flex flex-col lg:flex-row overflow-hidden bg-gray-100 dark:bg-gray-800/60">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row px-4 mx-auto sm:px-6  max-w-7xl sm:py-16 lg:py-20 xl:py-24">
            <div className="lg:w-1/2 flex justify-center lg:justify-start">
              <RightHero />
            </div>
            <div className="lg:w-1/2 mt-8 lg:mt-0">
              <LanguageCards />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(Header);