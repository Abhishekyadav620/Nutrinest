import { Heart, ShoppingBag, Eye } from "lucide-react";
import { useState } from "react";
import { useWishlist } from "../../context/WishlistContext";

const ProductCard = ({ product, onAddToCart, onAddToWishlist, onOpenModal }) => {
  const [hover, setHover] = useState(false);
  const { wishlist } = useWishlist();
  const isFav = wishlist.some((item) => item._id === product._id);

  return (
    <div
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* IMAGE SECTION */}
      <div className="relative bg-gray-50 p-4 flex justify-center items-center">
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="absolute top-4 right-4 z-10 bg-red-500 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-lg">
            {product.discount}% OFF
          </span>
        )}

        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-48 w-auto object-contain transition-transform duration-700 ease-out group-hover:scale-110"
            onClick={() => onOpenModal && onOpenModal(product)}
          />
        ) : (
          <div 
            className="h-48 w-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs font-medium rounded-lg"
            onClick={() => onOpenModal && onOpenModal(product)}
          >
            No Photo Available
          </div>
        )}

        {/* Hover Icons */}
        {hover && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-4">
            {/* Wishlist */}
            <button
              onClick={() => onAddToWishlist && onAddToWishlist(product)}
              className="bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition"
            >
              <Heart
                size={18}
                className={
                  isFav ? "text-red-500 fill-red-500" : "text-gray-700"
                }
              />
            </button>

            <button
              onClick={() => onAddToCart && onAddToCart(product)}
              className="bg-white hover:bg-[#82D173] shadow-lg rounded-full p-3 transition"
            >
              <ShoppingBag
                size={18}
                className="pointer-events-none"
              />
            </button>


            {/* View */}
            <button
              onClick={() => onOpenModal && onOpenModal(product)}
              className="bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition"
            >
              <Eye size={18} />
            </button>
          </div>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className="p-6">
        {/* Product Name */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-[#82D173] transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-3 mb-3">
          <p className="text-2xl font-black text-[#82D173]">₹{product.price}</p>
          {product.originalPrice && (
            <p className="text-sm text-gray-400 line-through font-medium">₹{product.originalPrice}</p>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex text-yellow-400 text-xs shadow-black">
            {"★★★★★".slice(0, Math.floor(product.rating || 0))}
            {"☆☆☆☆☆".slice(Math.floor(product.rating || 0))}
          </div>
          <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            {product.numReviews > 0
              ? `(${product.numReviews} reviews)`
              : "No reviews"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
