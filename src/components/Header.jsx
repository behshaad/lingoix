import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="text-center mt-16 px-4 sm:px-6 md:px-12 lg:px-24">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
        به Lingoix خوش آمدید!
      </h2>
      <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg">
        یادگیری زبان را با بهترین متدهای آموزشی تجربه کنید.
      </p>
      <Link to="/register">
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white dark:bg-blue-500 rounded-md hover:bg-blue-700 transition">
          همین حالا شروع کنید
        </button>
      </Link>
    </header>
  );
};

export default Header;
