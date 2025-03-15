// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { CgProfile } from "react-icons/cg";

// const UserMenu = ({ user, setUser }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//     navigate("/");
//   };

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//         className="flex items-center gap-2"
//       >
//         <img
//           src={user.profilePic || "https://i.pravatar.cc/150"}
//           alt="Profile"
//           className="w-9 h-9 rounded-full border border-gray-300 shadow-sm"
//         />
//         <CgProfile />
//       </button>

//       {/* منوی کشویی حساب کاربری */}
//       {isDropdownOpen && (
//         <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2">
//           <p className="text-sm font-semibold text-gray-700 dark:text-white px-3 py-2">
//             {user.name}
//           </p>
//           <hr className="border-gray-300 dark:border-gray-700" />
//           <Link
//             to="/dashboard"
//             className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
//           >
//             Dashboard
//           </Link>
//           <button
//             onClick={handleLogout}
//             className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-400 rounded-md"
//           >
//             Exit
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserMenu;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";

const UserMenu = () => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleProfileClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="relative">
      <button onClick={handleProfileClick} className="flex items-center gap-2">
        <img
          src={user?.profilePic || "https://i.pravatar.cc/150"}
          alt="Profile"
          className="w-9 h-9 rounded-full border border-gray-300 shadow-sm"
        />
        <CgProfile />
      </button>

      {isDropdownOpen && user && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-white px-3 py-2">
            {user.name || "Guest"}
          </p>
          <hr className="border-gray-300 dark:border-gray-700" />
          <button
            onClick={() => navigate("/dashboard")}
            className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-400 rounded-md"
          >
            Exit
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

// این کامپوننت وظیفه دارد که نام کاربر، عکس پروفایل و منوی کشویی برای خروج را مدیریت کند.
