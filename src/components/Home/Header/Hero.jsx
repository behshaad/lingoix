import React from "react";
import SecondNav from "./SecondNav";
import RightHero from "./Righthero";
import Lefthero from "./Lefthero";

const Hero = () => {
  return (
    <>
      <SecondNav />

      {/* کانتینر اصلی */}
      <div className="flex flex-col md:flex-row m-4 md:m-9">
        {/* بخش چپ */}
        <div className="flex items-center justify-center  w-full md:w-1/2 mb-8 md:mb-0">
          <Lefthero />
        </div>

        {/* بخش راست */}
        <div className="flex items-center justify-center w-full md:w-1/2">
          <RightHero />
        </div>
      </div>
    </>
  );
};

export default Hero;
