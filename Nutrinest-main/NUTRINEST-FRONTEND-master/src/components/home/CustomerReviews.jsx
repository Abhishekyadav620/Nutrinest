import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const demoReviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    text: "The quality of the almonds I received was outstanding! Crisp, fresh, and perfectly packaged. Will definitely order again.",
    role: "Verified Buyer",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    rating: 5,
    text: "NutriNest has become my go-to for dry fruits. The cashews are premium sized and taste amazing. Delivery was super fast too!",
    role: "Loyal Customer",
  },
  {
    id: 3,
    name: "Emily Davis",
    rating: 4,
    text: "Great selection of products. The mixed nuts pack is perfect for my daily snack. Slightly pricey but worth it for the quality.",
    role: "Health Enthusiast",
  },
  {
    id: 4,
    name: "Amit Patel",
    rating: 5,
    text: "Impressed with the freshness. I usually buy from local markets, but this is far superior. Highly recommended!",
    role: "Verified Buyer",
  },
  {
    id: 5,
    name: "Jessica Lee",
    rating: 5,
    text: "Love the eco-friendly packaging and the products are top notch. The walnuts were fresh and not bitter at all.",
    role: "Verified Buyer",
  },
];

const CustomerReviews = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Don't just take our word for it. Here's what our community loves about NutriNest.
          </p>
        </div>

        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="pb-12"
        >
          {demoReviews.map((review) => (
            <SwiperSlide key={review.id} className="h-auto">
              <div className="bg-gray-50 rounded-2xl p-8 h-full flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="flex-grow text-gray-700 italic mb-6">
                  "{review.text}"
                </blockquote>
                <div className="mt-auto">
                  <div className="font-bold text-gray-900">{review.name}</div>
                  <div className="text-sm text-green-600 font-medium">
                    {review.role}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CustomerReviews;
