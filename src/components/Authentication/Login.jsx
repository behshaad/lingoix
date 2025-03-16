import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!username) {
      errors.username = "ایمیل نمی‌تواند خالی باشد.";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(username)) {
      errors.username = "لطفاً یک ایمیل معتبر وارد کنید.";
      isValid = false;
    }

    if (!password) {
      errors.password = "رمز عبور نمی‌تواند خالی باشد.";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: username,
          name: username.split("@")[0],
          profilePic: `https://i.pravatar.cc/150?u=${username}`,
        })
      );
      navigate("/dashboard");
    }
  };

  return (
    <div
      className="h-screen w-screen flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://codingstella.com/wp-content/uploads/2024/01/download-6-scaled.jpeg')",
      }}
    >
      <div className="relative max-w-sm w-96 p-8 bg-white/10 backdrop-blur-lg border border-gray-400 rounded-xl shadow-lg text-white">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-gray-400 w-32 h-14 rounded-b-xl">
          <span className="text-lg text-black font-bold">Login</span>
        </div>

        <div className="flex flex-col mt-16 space-y-4">
          {/* فیلد ایمیل */}
          <div className="relative">
            <input
              type="email"
              className="w-full h-12 bg-transparent text-white px-4 border border-gray-400 rounded-full outline-none focus:ring-2 focus:ring-gray-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="ایمیل"
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* فیلد رمز عبور */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full h-12 bg-transparent text-white px-4 border border-gray-400 rounded-full outline-none focus:ring-2 focus:ring-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="رمز عبور"
            />
            <button
              type="button"
              className="absolute right-4 top-3 text-gray-300 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* گزینه‌های اضافی */}
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember">مرا به خاطر بسپار</label>
            </div>
            <a href="#" className="hover:underline">
              فراموشی رمز عبور؟
            </a>
          </div>

          {/* دکمه ورود */}
          <button
            onClick={handleLogin}
            className="w-full h-12 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-white transition"
          >
            ورود
          </button>

          {/* لینک ثبت‌نام */}
          <div className="text-center text-sm">
            <span>
              حساب کاربری ندارید؟{" "}
              {/* <a href="#" className="font-medium hover:underline">
                ثبت‌نام کنید
              </a> */}
              <Link to="/signup" className="font-medium hover:underline">
                ثبت‌نام کنید
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
