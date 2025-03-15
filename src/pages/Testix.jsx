import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
          name: username.split("@")[0], // استخراج نام از ایمیل
          profilePic: `https://i.pravatar.cc/150?u=${username}`, // عکس تصادفی
        })
      );
      navigate("/dashboard");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center bg-fixed sc"
      style={{
        backgroundImage:
          "url('https://codingstella.com/wp-content/uploads/2024/01/download-6-scaled.jpeg')",
      }}
    >
      <div className="relative w-96 p-10 bg-white/10 backdrop-blur-lg border-2 border-gray-400 rounded-xl shadow-lg text-white">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-gray-400 w-36 h-16 rounded-b-2xl">
          <span className="text-xl text-black font-bold">Login</span>
        </div>

        <div className="flex flex-col mt-16 space-y-5">
          {/* فیلد ایمیل */}
          <div className="relative">
            <input
              type="email"
              className="w-full h-14 bg-transparent text-white px-5 border-2 border-gray-400 rounded-full outline-none focus:ring-2 focus:ring-gray-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Email"
            />
            <label className="absolute top-4 left-5 text-gray-300 transition-all ">
              {/* email */}
            </label>
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* فیلد رمز عبور */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full h-14 bg-transparent text-white px-5 border-2 border-gray-400 rounded-full outline-none focus:ring-2 focus:ring-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" Password"
            />
            <label className="absolute top-4 left-5 text-gray-300 transition-all">
              {/* Password */}
            </label>
            <button
              type="button"
              className="absolute right-5 top-4 text-gray-300 hover:text-white"
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
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="hover:underline">
              Forgot password?
            </a>
          </div>

          {/* دکمه ورود */}
          <button
            onClick={handleLogin}
            className="w-full h-12 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-white transition"
          >
            Login
          </button>

          {/* لینک ثبت‌نام */}
          <div className="text-center text-sm">
            <span>
              Don't have an account?{" "}
              <a href="#" className="font-medium hover:underline">
                Register
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
