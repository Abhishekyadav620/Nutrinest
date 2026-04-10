import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";
import { Star, Send } from "lucide-react";

const ReviewForm = ({ onReviewAdded }) => {
  const { user } = useAuth();

  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to write a review");
      return;
    }

    if (!text.trim()) {
      toast.error("Please write some content");
      return;
    }

    try {
      setLoading(true);
      await axiosClient.post("/reviews/site", { rating, text });
      toast.success("Review submitted successfully!");
      setText("");
      setRating(5);
      onReviewAdded?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-gradient-to-br from-[#5F7354] to-[#4f6247] py-20 px-4 mt-20">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h3 className="text-3xl md:text-4xl font-serif mb-3">
          Share Your Experience
        </h3>
        <p className="text-white/80 mb-10 max-w-2xl mx-auto">
          We’d love to hear from you! Rate your experience and leave a review to
          help us serve you better.
        </p>

        {!user ? (
          <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl border border-white/20 inline-block shadow-xl">
            <p className="text-white mb-6 text-lg">
              Please log in to share your thoughts with our community.
            </p>
            <a
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#5F7354] font-semibold rounded-full hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
            >
              Login to Write a Review
            </a>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto bg-white/95 text-gray-800 rounded-2xl p-8 shadow-2xl"
          >
            {/* Rating */}
            <div className="flex flex-col items-center gap-2 mb-8">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Your Rating
              </label>
              <div
                className="flex gap-1"
                onMouseLeave={() => setHoveredStar(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                  >
                    <Star
                      size={26}
                      fill={
                        star <= (hoveredStar || rating) ? "#FACC15" : "none"
                      }
                      className={`${
                        star <= (hoveredStar || rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Input + Submit (KEY FIX HERE) */}
            <div className="flex items-center bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your experience..."
                className="flex-1 bg-transparent px-6 py-3 text-sm outline-none placeholder-gray-400"
              />

              {/* Desktop Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  hidden sm:inline-flex
                  items-center gap-2
                  h-12
                  px-8
                  text-sm font-semibold text-white
                  bg-[#77966D]
                  rounded-r-full
                  shadow-md
                  transition-all duration-300
                  hover:bg-[#607c56]
                  active:scale-95
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Submit <Send size={16} />
                  </>
                )}
              </button>

              {/* Mobile Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  sm:hidden
                  w-12 h-12
                  flex items-center justify-center
                  bg-[#77966D]
                  rounded-r-full
                  shadow-md
                  transition-all
                  hover:bg-[#607c56]
                  active:scale-95
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={18} className="text-white" />
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default ReviewForm;
