import { Link, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import WishlistDropdown from "../wishlist/WishlistDropdown";
import CartDropdown from "../cart/CartDropdown";
import { ShoppingCart, Heart, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartDropdown, setCartDropdown] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [shadow, setShadow] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => setShadow(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Shop", to: "/products" },
    { name: "About Us", to: "/about" },
  ];

  return (
    <nav
      className={`bg-white sticky top-0 z-50 w-full transition-all duration-300 ${
        shadow ? "shadow-md py-4" : "shadow-sm py-5"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center">
          {/* LEFT SIDE: LOGO & NAV LINKS */}
          <div className="flex items-center gap-12">
            {/* LOGO */}
            <Link
              to="/"
              className="text-3xl font-black tracking-tighter transition-transform duration-300 hover:scale-105 transform-gpu flex items-center"
            >
              <span className="text-gray-900">NUTRI</span>
              <span className="text-[#82D173]">NEST</span>
            </Link>

            {/* NAV MENU (DESKTOP) */}
            <div className="hidden md:flex gap-10">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={`relative text-sm font-bold tracking-wide transition-colors duration-300 group py-1 ${
                      isActive ? "text-[#82D173]" : "text-black hover:text-[#82D173]"
                    }`}
                  >
                    {item.name}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-[#82D173] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </Link>
                );
              })}
            </div>
          </div>

            {/* RIGHT SIDE ICONS */}
          <div className="flex items-center gap-6 lg:gap-8">
            {/* ACCOUNT */}
            <div className="hidden md:flex items-center gap-3 cursor-pointer group transition-all duration-300">
              <div className="p-2 rounded-full group-hover:bg-gray-50 transition-colors">
                <User className="w-6 h-6 text-gray-700 group-hover:text-[#82D173] transition-colors" />
              </div>
              <div className="leading-tight text-sm">
                {user ? (
                  <>
                    <p className="font-bold text-gray-900 mb-0">
                      {user.username}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="text-gray-500 text-[10px] uppercase tracking-wider hover:text-red-500 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div>
                    <p className="font-bold text-gray-900 tracking-tight">ACCOUNT</p>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider">
                      <Link to="/signup" className="hover:text-[#82D173] transition-colors">
                        Register
                      </Link>
                      {" / "}
                      <Link to="/login" className="hover:text-[#82D173] transition-colors">
                        Login
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* WISHLIST */}
            <div className="hidden md:flex items-center relative">
              <button
                onClick={() => setWishlistOpen(!wishlistOpen)}
                className="relative p-2 rounded-full hover:bg-gray-50 transition-all duration-300 hover:scale-110 active:scale-95 transform-gpu text-gray-700 hover:text-[#82D173]"
              >
                <Heart className="w-6 h-6" />
                <span className="absolute top-1.5 right-1.5 bg-[#82D173] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold border-2 border-white shadow-sm">
                  {wishlist.length}
                </span>
              </button>

              {wishlistOpen && (
                <div className="absolute top-12 right-0 z-50 animate-fadeIn">
                  <WishlistDropdown onClose={() => setWishlistOpen(false)} />
                </div>
              )}
            </div>

            {/* CART */}
            <div className="relative hidden md:flex items-center">
              <button
                onClick={() => setCartDropdown(!cartDropdown)}
                className="relative p-2 rounded-full hover:bg-gray-50 transition-all duration-300 hover:scale-110 active:scale-95 transform-gpu text-gray-700 hover:text-[#82D173]"
              >
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-[#82D173] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold border-2 border-white shadow-sm">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>

            {/* MOBILE MENU */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-[#82D173] transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>


      {/* Cart Sidebar Dropdown */}
      <AnimatePresence>
        {cartDropdown && (
          <CartDropdown onClose={() => setCartDropdown(false)} />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
