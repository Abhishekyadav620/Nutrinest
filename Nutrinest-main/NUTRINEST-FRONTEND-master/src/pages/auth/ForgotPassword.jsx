import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Mail, Loader2, ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      await axiosClient.post('/auth/send-otp', { email });
      toast.success('OTP sent to your email');
      navigate('/verify-otp', { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

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

        {/* Feature Cards Section */}
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
              Forgot Password
            </h2>
            <p className="mt-2 text-sm text-[#6B7280] font-normal">
              Enter your email address below to receive a 6-digit verification code.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1F2937] uppercase tracking-wider block pl-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#7FA36B] transition-colors duration-200">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  className="block w-full rounded-2xl border border-gray-200 pl-12 pr-4 py-3.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7FA36B]/20 focus:border-[#7FA36B] transition-all duration-200 text-sm shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-semibold text-white bg-[#7FA36B] hover:bg-[#5B7C4A] focus:outline-none focus:ring-4 focus:ring-[#7FA36B]/20 transition-all duration-200 disabled:opacity-70 shadow-lg shadow-[#7FA36B]/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send OTP"}
            </motion.button>
          </form>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#7FA36B] hover:text-[#5B7C4A] transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
