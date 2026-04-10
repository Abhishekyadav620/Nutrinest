import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
  Check,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0b0b0b] text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* About */}
              <div className="space-y-6">
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                  Premium dry fruits and wellness foods, sourced responsibly and
                  delivered fresh. Designed for a healthier lifestyle.
                </p>

                <div className="flex gap-4">
                  {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className="w-9 h-9 border border-gray-700 rounded-md
                                   flex items-center justify-center text-gray-400
                                   hover:text-white hover:border-white transition"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-xs font-semibold tracking-widest text-gray-300 uppercase mb-6">
                  Company
                </h4>
                <ul className="space-y-3">
                  {[
                    { name: "About Us", path: "/about" },
                    { name: "Products", path: "/products" },
                    { name: "Contact", path: "/contact" },
                  ].map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-gray-400 hover:text-white transition"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-xs font-semibold tracking-widest text-gray-300 uppercase mb-6">
                  Support
                </h4>
                <ul className="space-y-3">
                  {[
                    { name: "FAQ", path: "/faq" },
                    { name: "Shipping & Returns", path: "/shipping" },
                    { name: "Privacy Policy", path: "/privacy" },
                    { name: "Terms of Service", path: "/terms" },
                  ].map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-gray-400 hover:text-white transition"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE – CTA CARD */}
          <div className="bg-[#ffab66] text-black rounded-2xl p-8 flex flex-col justify-between shadow-lg">
            <div>
              <h3 className="text-2xl font-semibold mb-6">
                Never miss an offer
              </h3>

              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black shrink-0" />
                  Get exclusive discounts & early access
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black shrink-0" />
                  Save more on every NutriNest purchase
                </li>
              </ul>
            </div>

            <div className="flex gap-3 mt-8">
              <button className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition">
                Subscribe →
              </button>
              <button className="flex-1 bg-white text-black py-3 rounded-lg font-medium border border-black/20 hover:bg-gray-100 transition">
                Learn more
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-gray-500">
            © {new Date().getFullYear()} NutriNest. All rights reserved.
          </p>

          <div className="flex gap-6 text-gray-500">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a key={item} href="#" className="hover:text-white transition">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
