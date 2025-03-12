import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link
      to="/"
      className="text-3xl font-semibold text-gray-900 dark:text-white tracking-wide"
    >
      Lingoix
    </Link>
  );
};

export default Logo;
