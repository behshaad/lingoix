import React from "react";

import Logo from "../../assets/logo/logo.png";

const are = () => {

  return (
    <>
      {/* کانتینر اصلی */}
      <div className="flex flex-col md:flex-row m-4 md:m-9">
        {/* بخش چپ */}
        <div className="flex items-center justify-center  w-full md:w-1/2 mb-8 md:mb-0">
          <img
            src={Logo}
            className="  object-contain "
          />
        </div>

        {/* بخش راست */}
        <div className="flex items-center justify-center w-full md:w-1/2">
          <h1>kkkskd</h1>{" "}
        </div>
      </div>
    </>
  );
};

export default are;
