import React from "react";

const SignUpCallToAction = () => {
  return (
    <div className="cta-section bg-white  dark:bg-gray-800 p-6  sm:p-8 md:p-10 lg:p-12 xl:p-14 rounded-lg shadow-lg text-center max-w-md mx-auto">
      <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white mb-4">
        Join Lingoix Now!
      </h2>
      <p className="text-lg sm:text-xl text-gray-800 dark:text-gray-200 mb-6">
        Sign up today and start learning.
      </p>
      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
        Sign Up
      </button>
    </div>
  );
};

export default SignUpCallToAction;


  // <div className="cta-section py-12 text-center">
  //       <SignUpCallToAction ctaText={t("cta")} />
  //     </div>