import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import RightHero from "./RightHero";
import Pricing from "./Pricing";
import LeftHero from "./LeftHeroo";
import SecondNav from "./SecondNav";
const Header = () => {
  const { t } = useTranslation();

  return (
    <>
      <section>
        {/* نوبار دوم */}

        <SecondNav />
        {/* نوبار دوم */}

        <div class="relative py-12 overflow-hidden bg-gray-100 sm:py-16 lg:py-20 xl:py-24  dark:bg-gray-800">
          <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div class="flex flex-col">
              {/* سمت راست هیرو */}
              <RightHero />
              {/* سمت راست هیرو */}
              {/* عکس های پروفایل ها */}
              <LeftHero />
              {/* <Pricing/> */}
              {/* عکس های پروفایل ها */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Header;
