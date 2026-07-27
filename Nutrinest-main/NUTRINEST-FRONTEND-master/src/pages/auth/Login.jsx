import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, Loader2, Eye, EyeOff, Check, Phone } from "lucide-react";
import { motion } from "framer-motion";
import PhoneLoginModal from "../../components/auth/PhoneLoginModal";
import AuthFieldError from "../../components/auth/AuthFieldError";
import { validateLogin, hasErrors } from "../../utils/authValidation";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const result = await login(formData);

    setLoading(false);

    if (result.success) {
      if (result.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const result = await loginWithGoogle();
    setLoading(false);
    if (result.success) navigate(from, { replace: true });
  };

  const handlePhoneLogin = () => {
    setPhoneOpen(true);
  };

  // Premium Features data
  const features = [
    "Premium Farm Fresh Products",
    "100% Natural & Chemical Free",
    "Rich in Nutrition & Antioxidants",
  ];

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#FFF8E8]/40 font-['Poppins'] overflow-x-hidden">
      {/* LEFT SIDE: Hero image & Taglines */}
      <div className="relative w-full md:w-[40%] lg:w-[45%] xl:w-[50%] min-h-[35vh] md:min-h-screen flex flex-col justify-between p-6 md:p-12 text-white overflow-hidden">
        {/* Background Image with Green Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/auth_hero_fruits.png"
            alt="Premium Dry Fruits"
            className="w-full h-full object-cover scale-105"
          />
          {/* Soft Green Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#5B7C4A]/90 via-[#7FA36B]/80 to-[#7FA36B]/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Top Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <Link
            to="/"
            className="text-3xl font-black tracking-tighter flex items-center gap-1 drop-shadow-sm"
          >
            <span className="text-white">NUTRI</span>
            <span className="text-[#FFF8E8]">NEST</span>
          </Link>
          <p className="text-xs text-[#FFF8E8]/90 font-medium tracking-widest uppercase mt-1">
            Fuel Your Health, Naturally
          </p>
        </motion.div>

        {/* Feature Cards Section (Desktop-only/Tablet-only layout alignment) */}
        <div className="relative z-10 mt-12 md:mt-auto space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-3"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.15, duration: 0.5 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-lg hover:bg-white/15 transition-all duration-300 group"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FFF8E8] text-[#5B7C4A] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-sm font-medium tracking-wide drop-shadow-sm">
                  {feature}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Small Elegant Footer tag */}
        <div className="relative z-10 hidden md:block text-xs text-[#FFF8E8]/60 mt-8 font-light">
          © {new Date().getFullYear()} NutriNest. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Auth Card Section */}
      <div className="w-full md:w-[60%] lg:w-[55%] xl:w-[50%] min-h-[65vh] md:min-h-screen flex items-center justify-center px-4 py-12 sm:px-8 lg:px-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white rounded-[24px] p-6 sm:p-10 shadow-[0_20px_50px_rgba(127,163,107,0.08)] hover:shadow-[0_25px_60px_-15px_rgba(127,163,107,0.15)] transition-shadow duration-500"
        >
          {/* Header */}
          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-extrabold text-[#1F2937] tracking-tight font-['Poppins']">
              Welcome Back 👋
            </h2>
            <p className="mt-2 text-sm text-[#6B7280] font-normal">
              Login to continue your healthy journey.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Email Field (mapped to username for backend) */}
            <div className="space-y-1">
              <label htmlFor="login-email" className="text-xs font-semibold text-[#1F2937] uppercase tracking-wider block pl-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#7FA36B] transition-colors duration-200">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  name="username"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={formData.username}
                  onChange={handleChange}
                  aria-invalid={!!errors.username}
                  className={`block w-full rounded-2xl border pl-12 pr-4 py-3.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm shadow-sm ${
                    errors.username
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-gray-200 focus:ring-[#7FA36B]/20 focus:border-[#7FA36B]"
                  }`}
                />
              </div>
              <AuthFieldError message={errors.username} />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="login-password" className="text-xs font-semibold text-[#1F2937] uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#7FA36B] transition-colors duration-200">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={!!errors.password}
                  className={`block w-full rounded-2xl border pl-12 pr-12 py-3.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm shadow-sm ${
                    errors.password
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-gray-200 focus:ring-[#7FA36B]/20 focus:border-[#7FA36B]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <AuthFieldError message={errors.password} />
            </div>

            {/* Options (Remember me & Forgot Password) */}
            <div className="flex items-center justify-between px-1 py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#7FA36B] border-gray-300 focus:ring-[#7FA36B] accent-[#7FA36B]"
                />
                <span className="text-sm font-medium text-[#6B7280]">
                  Remember Me
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-[#7FA36B] hover:text-[#5B7C4A] transition-colors duration-200"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-semibold text-white bg-[#7FA36B] hover:bg-[#5B7C4A] focus:outline-none focus:ring-4 focus:ring-[#7FA36B]/20 transition-all duration-200 disabled:opacity-70 shadow-lg shadow-[#7FA36B]/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Login to Continue"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-semibold text-[#6B7280]">
              <span className="bg-white/80 px-4 py-0.5 rounded-full backdrop-blur-sm">
                Or Continue With
              </span>
            </div>
          </div>

          {/* Social Sign-in Buttons */}
          <div className="grid grid-cols-2 gap-4">
            {/* Google Login */}
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center items-center gap-2.5 py-3 px-4 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-all duration-200 shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google</span>
            </motion.button>

            {/* Phone Login */}
            <motion.button
              type="button"
              onClick={handlePhoneLogin}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-all duration-200 shadow-sm disabled:opacity-50"
            >
              <Phone className="w-4 h-4 text-[#7FA36B]" />
              <span>Phone</span>
            </motion.button>
          </div>

          {/* Toggle Login/Signup */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[#6B7280] font-normal">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-[#7FA36B] hover:text-[#5B7C4A] transition-colors duration-200"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Phone Authentication Modal */}
      <PhoneLoginModal isOpen={phoneOpen} onClose={() => setPhoneOpen(false)} />
    </div>
  );
};

export default Login;

