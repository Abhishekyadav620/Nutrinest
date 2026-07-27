import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";
import { X, Phone, ShieldCheck, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const PhoneLoginModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Phone input, 2: OTP input
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // OTP states
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputsRef = useRef([]);
  
  // Loading & Resend Timer states
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { loginWithPhone } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Focus utility for OTP fields
  useEffect(() => {
    if (step === 2 && otpInputsRef.current[0]) {
      otpInputsRef.current[0].focus();
    }
  }, [step]);

  // Countdown timer for resend code
  useEffect(() => {
    if (step === 2 && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step, timer]);

  // Reset modal when closed
  const handleClose = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStep(1);
    setPhoneNumber("");
    setOtp(["", "", "", "", "", ""]);
    setLoading(false);
    onClose();
  };

  // Step 1: Send OTP code via Backend API
  const handleSendOTP = async (e) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\s+/g, "");
    if (!/^\d{10}$/.test(cleanPhone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    const fullPhone = `${countryCode}${cleanPhone}`;

    try {
      await axiosClient.post("/auth/send-otp", { phone: fullPhone });
      toast.success("Verification code sent!");
      setStep(2);
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      console.error("Twilio SMS send error:", err);
      toast.error(err.response?.data?.message || "Failed to send verification SMS");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Resend OTP code via Backend API
  const handleResendOTP = async () => {
    if (!canResend) return;
    setLoading(true);
    const fullPhone = `${countryCode}${phoneNumber.replace(/\s+/g, "")}`;

    try {
      await axiosClient.post("/auth/send-otp", { phone: fullPhone });
      toast.success("Verification code resent!");
      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      if (otpInputsRef.current[0]) otpInputsRef.current[0].focus();
    } catch (err) {
      console.error("Resend SMS error:", err);
      toast.error(err.response?.data?.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Inputs
  const handleOtpChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal) return;

    const newOtp = [...otp];
    newOtp[index] = cleanVal.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (index < 5 && cleanVal) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      
      // If current is empty, clear previous box and focus it
      if (otp[index] === "" && index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        otpInputsRef.current[index - 1].focus();
      } else {
        // Clear current box
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().replace(/\D/g, "").slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      otpInputsRef.current[5].focus();
    }
  };

  // Step 3: Verify OTP code via Auth Context
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter a 6-digit verification code");
      return;
    }

    setLoading(true);
    const fullPhone = `${countryCode}${phoneNumber.replace(/\s+/g, "")}`;

    try {
      const successResult = await loginWithPhone(fullPhone, otpString);
      if (successResult.success) {
        handleClose();
        navigate("/");
      }
    } catch (err) {
      console.error("Twilio verify error:", err);
      toast.error(err.message || "Authentication failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#1F2937]/50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-md bg-white/90 backdrop-blur-xl border border-white rounded-[24px] p-8 shadow-[0_20px_50px_rgba(127,163,107,0.12)] font-['Poppins'] z-10"
          >
            {/* Close Trigger */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            {/* STEP 1: Enter Phone Number */}
            {step === 1 ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-[#7FA36B]/10 text-[#7FA36B] flex items-center justify-center mb-3">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Phone Login
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    We will send you a 6-digit verification code to log in.
                  </p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1F2937] uppercase tracking-wider block pl-1">
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      {/* Country Code Selection */}
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="rounded-2xl border border-gray-200 px-3 py-3.5 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#7FA36B]/20 focus:border-[#7FA36B] font-medium"
                      >
                        <option value="+91">+91 (IN)</option>
                        <option value="+1">+1 (US)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+61">+61 (AU)</option>
                      </select>
                      {/* Phone Input */}
                      <input
                        type="tel"
                        required
                        placeholder="98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                        className="block w-full rounded-2xl border border-gray-200 px-4 py-3.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7FA36B]/20 focus:border-[#7FA36B] transition-all duration-200 text-sm shadow-sm font-medium tracking-wide"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-semibold text-white bg-[#7FA36B] hover:bg-[#5B7C4A] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#7FA36B]/20 transition-all duration-200 disabled:opacity-70 shadow-md shadow-[#7FA36B]/20"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Send Verification Code"
                    )}
                  </motion.button>
                </form>
              </div>
            ) : (
              /* STEP 2: Verify OTP Code */
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-[#7FA36B]/10 text-[#7FA36B] flex items-center justify-center mb-3">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Verify Code
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Enter the code sent to <span className="font-semibold text-gray-700">{countryCode} {phoneNumber}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-5">
                  {/* 6 box input */}
                  <div className="flex justify-between gap-2 py-2" onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        required
                        ref={(el) => (otpInputsRef.current[index] = el)}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-14 text-center rounded-2xl border border-gray-200 bg-white text-gray-900 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#7FA36B]/20 focus:border-[#7FA36B] transition-all duration-200 shadow-sm"
                      />
                    ))}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-semibold text-white bg-[#7FA36B] hover:bg-[#5B7C4A] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#7FA36B]/20 transition-all duration-200 disabled:opacity-70 shadow-md shadow-[#7FA36B]/20"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Verify & Log In"
                    )}
                  </motion.button>

                  {/* Resend and timer options */}
                  <div className="flex justify-between items-center px-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1 font-semibold text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Edit Number
                    </button>

                    {timer > 0 ? (
                      <span className="text-gray-400 font-medium">
                        Resend in <span className="text-[#7FA36B] font-bold">{timer}s</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={loading}
                        className="inline-flex items-center gap-1 font-bold text-[#7FA36B] hover:text-[#5B7C4A] transition-colors duration-200 disabled:opacity-50"
                      >
                        <RefreshCw className="w-3 h-3" /> Resend Code
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PhoneLoginModal;
