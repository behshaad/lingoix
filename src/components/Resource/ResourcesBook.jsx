import React from "react";
import { Link } from "react-router-dom";
import { FiBook} from "react-icons/fi";

const ResourcesBook = ({ title, description, icon, link }) => {
  return (
    <div className="p-6 flex flex-col items-center text-center shadow-lg rounded-2xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
      <FiBook className="w-8 h-8 text-blue-500" />
      <h2 className="text-xl font-bold mt-4">Books</h2>
      <p className="text-gray-600 mt-2">
        معرفی منابع اصلی کتاب‌های آموزش زبان.
      </p>
      <Link
        to={"./books"}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
      >
        مشاهده منابع
      </Link>
    </div>
  );
};

export default ResourcesBook;

