import { Link } from "react-router-dom";

import CommunitySVG from "../../assets/logo/logo.png";

const Logo = () => {
  return (
    <Link
      to="/"
      className="text-3xl font-semibold "
    >
      {/* Lingoix */}
      <img src={CommunitySVG} alt="lingoix" className="w-16 h-16 rounded " />
    </Link>
  );
};

export default Logo;
