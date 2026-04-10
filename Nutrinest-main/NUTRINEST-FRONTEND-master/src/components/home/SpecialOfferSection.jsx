import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import ProductQuickView from "../product/ProductQuickView";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

import almondsImg from "../../assets/almonds.png";
import cashewsImg from "../../assets/cashews.png";
import walnutsImg from "../../assets/walnuts.png";
import dealBg from "../../assets/deal2.png";

const SpecialOfferSection = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;

    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const dealProducts = [
    {
      _id: "deal1",
      name: "Organic Almonds (250g)",
      price: 350,
      originalPrice: 500,
      image: almondsImg,
      discount: 30,
    },
    {
      _id: "deal2",
      name: "Premium Cashews (200g)",
      price: 420,
      originalPrice: 600,
      image: cashewsImg,
      discount: 32,
    },
    {
      _id: "deal3",
      name: "Walnuts Kernels (200g)",
      price: 480,
      originalPrice: 700,
      image: walnutsImg,
      discount: 31,
    },
  ];

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [modalOpen]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 overflow-hidden border-t border-b border-yellow-200">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${dealBg})` }}
      />
      <div className="absolute inset-0 bg-[#fff7e6]/85 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14" data-aos="fade-up">
          <p className="uppercase tracking-[0.25em] text-xs text-orange-600">
            Limited Time Offer
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">
            Deal of the Day
          </h2>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto">
            Save big on today’s handpicked NutriNest bestsellers. Offers valid
            until midnight!
          </p>
        </div>

        {/* Timer */}
        <div
          className="flex justify-center gap-6 mb-14"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {[
            { label: "HRS", value: timeLeft.hours },
            { label: "MIN", value: timeLeft.minutes },
            { label: "SEC", value: timeLeft.seconds },
          ].map((box, i) => (
            <div
              key={i}
              className="bg-white w-24 h-24 rounded-xl shadow-lg border
                         flex flex-col items-center justify-center text-[#77966D]"
            >
              <span className="text-3xl font-extrabold">{box.value}</span>
              <span className="text-xs tracking-wide font-semibold opacity-70">
                {box.label}
              </span>
            </div>
          ))}
        </div>

        {/* Slider */}
        <div data-aos="fade-up" data-aos-delay="400">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            spaceBetween={30}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-10"
          >
            {dealProducts.map((p) => (
              <SwiperSlide key={p._id}>
                {/* CARD */}
                <div
                  className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl
                                transition h-[420px] flex flex-col"
                >
                  {/* IMAGE */}
                  <div className="w-full h-48 flex items-center justify-center mb-4">
                    <img
                      src={p.image}
                      alt={p.name}
                      onClick={() => openModal(p)}
                      className="max-h-full max-w-full object-contain
                                 cursor-pointer hover:scale-105
                                 transition-transform duration-300"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="flex flex-col flex-1">
                    <h3 className="font-semibold text-lg leading-snug">
                      {p.name}
                    </h3>

                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-[#77966D] font-bold text-xl">
                        ₹{p.price}
                      </p>
                      <p className="line-through text-gray-400">
                        ₹{p.originalPrice}
                      </p>
                    </div>

                    {/* PUSH TO BOTTOM */}
                    <div className="mt-auto">
                      <p
                        className="text-sm bg-green-100 text-green-700
                                    px-3 py-1 rounded-full inline-block"
                      >
                        {p.discount}% OFF
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* CTA */}
        <div className="text-center mt-10" data-aos="fade-up">
          <button
            onClick={() => navigate("/products")}
            className="px-10 py-3 bg-[#77966D] text-white rounded-full
                       font-semibold shadow-md hover:bg-[#647d5a] transition"
          >
            Shop Collection
          </button>
        </div>
      </div>

      {/* Quick View */}
      {modalOpen && selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={closeModal}
          onAddToCart={(product, qty = 1) => {
            addToCart(product._id, qty, product);
            closeModal();
          }}
          onAddToWishlist={() => toggleWishlist(selectedProduct)}
        />
      )}
    </section>
  );
};

export default SpecialOfferSection;
