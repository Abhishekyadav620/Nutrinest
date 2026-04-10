import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ProductCard from "../../components/product/ProductCard";
import ProductQuickView from "../../components/product/ProductQuickView";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

import SpecialOfferSection from "../../components/home/SpecialOfferSection";
import CustomerReviews from "../../components/home/CustomerReviews";
import ReviewForm from "../../components/home/ReviewForm";
import axiosClient from "../../api/axiosClient";
import almondsImg from "../../assets/almonds.png";
import cashewsImg from "../../assets/cashews.png";
import walnutsImg from "../../assets/walnuts.png";

const sampleProducts = [
  {
    _id: "p1",
    name: "Organic Almonds",
    price: 499,
    originalPrice: 699,
    image: almondsImg,
    rating: 5,
    numReviews: 12,
    discount: 28,
    badge: "HEALTHY CHOICE",
    category: "Dry Fruits",
  },
  {
    _id: "p2",
    name: "Premium Cashews",
    price: 599,
    originalPrice: 799,
    image: cashewsImg,
    rating: 5,
    numReviews: 15,
    discount: 25,
    badge: "TOP QUALITY",
    category: "Dry Fruits",
  },
  {
    _id: "p3",
    name: "Walnut Kernels",
    price: 450,
    originalPrice: 550,
    image: walnutsImg,
    rating: 5,
    numReviews: 8,
    discount: 18,
    badge: "BESTSELLER",
    category: "Dry Fruits",
  },
];

const Home = () => {
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();
  const [modalOpen, setModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [realProducts, setRealProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  // Fetch real products for home dry fruits section
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axiosClient.get("/products");
        // Safe fallback: ensure we have an array
        const list = Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data)
          ? data
          : [];
        setRealProducts(list.length > 0 ? list : sampleProducts);
      } catch {
        setRealProducts(sampleProducts);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetch();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await axiosClient.get("/reviews/site?limit=10");
      // Safe fallback: ensure we have an array
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.reviews)
        ? data.reviews
        : [];
      setReviews(list);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAddToCart = (product, qty = 1) => {
    addToCart(product._id || product.id, qty, product);
  };

  const handleAddToWishlist = (product) => {
    toggleWishlist(product);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    if (modalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => (document.body.style.overflow = "auto");
  }, [modalOpen]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-amber-50 overflow-hidden" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-amber-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-amber-50 transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Premium Quality</span>{" "}
                  <span className="block text-primary xl:inline">
                    Dry Fruits &amp; Nuts
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Boost your immunity and energy with our hand-picked, premium
                  quality dry fruits. Sourced from the best farms to ensure
                  freshness and nutrition in every bite.
                </p>
                <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-full text-white bg-[#77966D] hover:bg-[#607c56] md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
                  >
                    Shop Now
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-full text-white bg-[#77966D] hover:bg-[#607c56] md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.pexels.com/photos/1667427/pexels-photo-1667427.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Mixed Dry Fruits"
          />
        </div>
      </div>
      {/* ...rest of your component code... */}

      {/* Dry Fruits Section */}
      <div className="bg-white py-12" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-gray-900 mb-2">
                Premium Dry Fruits
              </h2>
              <div className="h-1 w-20 bg-[#82D173] rounded-full"></div>
            </div>
            <Link
              to="/products"
              className="group flex items-center gap-1 font-bold text-[#82D173] hover:text-[#6ebb5e] transition-colors"
            >
              View All{" "}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingProducts ? (
              <div className="col-span-3 text-center text-gray-400">
                Loading products...
              </div>
            ) : realProducts.length === 0 ? (
              <div className="col-span-3 text-center text-gray-400">
                No products available.
              </div>
            ) : (
              realProducts.slice(0, 3).map((product, idx) => (
                <div
                  key={product._id || product.id}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    onOpenModal={openModal}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {modalOpen && selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={closeModal}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
        />
      )}

      {/* About Teaser */}
      <div className="bg-gray-100 py-16" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title">Why Choose NutriNest?</h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-8">
            We are committed to providing the highest quality natural products,
            sourced sustainably and delivered with care. Your health is our
            priority.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">100% Organic</h3>
              <p className="text-gray-500">
                Certified organic ingredients for pure nutrition.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-500">
                Quick and reliable shipping to your doorstep.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-500">
                Guidance from nutrition experts anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Special Offer Section */}
      <SpecialOfferSection />

      <CustomerReviews />

      <ReviewForm onReviewAdded={fetchReviews} />
    </div>
  );
};

export default Home;
