import { Link } from "react-router-dom";

import CommunitySVG from "../../assets/logo/logo.png";

const Logo = () => {
  return (
    <Link
      to="/"
      className="app-logo"
      aria-label="Lingoix"
    >
      <img src={CommunitySVG} alt="" />
    </Link>
  );
};

export default Logo;
