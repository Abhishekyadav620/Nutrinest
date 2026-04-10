import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import axiosClient from "../../api/axiosClient";

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { cart, cartTotal, clearCart } = useCart();

  // Check if coming from "Buy Now" (single product) or Cart
  const isBuyNow = Boolean(state?.product);
  const buyNowProduct = state?.product;
  const buyNowQty = state?.qty || 1;

  // Items to checkout
  const checkoutItems = isBuyNow
    ? [{ ...buyNowProduct, quantity: buyNowQty }]
    : cart;

  // Calculate total
  const subtotal = isBuyNow ? buyNowProduct.price * buyNowQty : cartTotal;

  const [form, setForm] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    postal: "",
    city: "",
    country: "India",
    saveInfo: false,
    paymentMethod: "cod",
  });

  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");

  const shippingFee = form.address ? 50 : 0;
  const total = subtotal + shippingFee;

  // Redirect if no items to checkout
  useEffect(() => {
    if (!isBuyNow && cart.length === 0) {
      navigate("/products");
    }
  }, [isBuyNow, cart, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const placeOrder = async () => {
    if (!form.email || !form.address || !form.firstName) {
      toast.error("Please fill required fields before placing order.");
      return;
    }

    const address = {
      name: form.firstName + (form.lastName ? " " + form.lastName : ""),
      line1: form.address,
      line2: form.apartment,
      city: form.city,
      postalCode: form.postal,
      country: form.country,
      email: form.email,
      phone: form.phone,
    };

    const items = isBuyNow
      ? [
          {
            product: buyNowProduct._id || buyNowProduct.id,
            quantity: buyNowQty,
          },
        ]
      : cart.map((item) => ({ product: item._id || item.id || item.productId, quantity: item.quantity }));

    // If payment method is not COD, simulate a payment gateway flow
    if (form.paymentMethod !== "cod") {
      const loadingToast = toast.loading("Processing payment...");
      try {
        if (form.paymentMethod === "card") {
          if (!card.number || !card.name || !card.expiry || !card.cvv) {
            toast.dismiss(loadingToast);
            toast.error("Please enter card details to continue");
            return;
          }
        } else if (form.paymentMethod === "upi") {
          if (!upiId) {
            toast.dismiss(loadingToast);
            toast.error("Please enter UPI ID to continue");
            return;
          }
        }

        // Simulate async payment (replace with real gateway integration)
        await new Promise((res) => setTimeout(res, 1200));
        toast.dismiss(loadingToast);
        toast.success("Payment successful", { style: { background: "#ecfdf5", color: "#065f46", fontWeight: 600 } });
      } catch (err) {
        toast.dismiss(loadingToast);
        toast.error("Payment failed, please try another method");
        return;
      }
    }

    try {
      await axiosClient.post("/orders", {
        address,
        paymentMethod: form.paymentMethod === "cod" ? "COD" : form.paymentMethod.toUpperCase(),
        items,
      });
      if (!isBuyNow) clearCart();
      toast.success("Order placed successfully!", { position: "top-right", duration: 4000, style: { background: "#ecfdf5", color: "#065f46", fontWeight: 600 } });
      navigate("/order-success");
    } catch (err) {
      toast.error("Order failed: " + (err?.response?.data?.message || err.message || "Unknown error"), { position: "top-right" });
    }
  };

  if (!isBuyNow && cart.length === 0) return null;

  return (
    <div className="w-full bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 px-6">
        {/* LEFT SECTION */}
        <div>
          {/* CONTACT */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-2">
                <label className="text-sm text-gray-600">Email Address</label>
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border p-3 rounded-lg focus:border-[#82D173] outline-none transition" />
              </div>
              <div className="mb-2">
                <label className="text-sm text-gray-600">Phone Number</label>
                <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="w-full border p-3 rounded-lg focus:border-[#82D173] outline-none transition" />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <input type="checkbox" name="saveInfo" onChange={handleChange} className="accent-[#82D173]" />
              Email me with news and offers
            </label>
          </div>

          {/* DELIVERY */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Delivery Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">First Name</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="w-full border p-3 rounded-lg focus:border-[#82D173] outline-none" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="w-full border p-3 rounded-lg focus:border-[#82D173] outline-none" />
              </div>
            </div>

            <label className="text-sm text-gray-600 mt-4 block">Address</label>
            <input type="text" name="address" value={form.address} onChange={handleChange} className="w-full border p-3 rounded-lg focus:border-[#82D173] outline-none" />

            <label className="text-sm text-gray-600 mt-4 block">Apartment, suite, etc. (Optional)</label>
            <input type="text" name="apartment" value={form.apartment} onChange={handleChange} className="w-full border p-3 rounded-lg focus:border-[#82D173] outline-none" />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm text-gray-600">Postal Code</label>
                <input type="text" name="postal" value={form.postal} onChange={handleChange} className="w-full border p-3 rounded-lg focus:border-[#82D173]" />
              </div>

              <div>
                <label className="text-sm text-gray-600">City</label>
                <input type="text" name="city" value={form.city} onChange={handleChange} className="w-full border p-3 rounded-lg focus:border-[#82D173]" />
              </div>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Payment Method</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card option */}
              <label className={`cursor-pointer p-4 rounded-lg border transition-shadow flex flex-col gap-3 ${form.paymentMethod === "card" ? "border-green-500 shadow-lg" : "border-gray-200 hover:shadow"}`}>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💳</div>
                  <div>
                    <div className="font-medium">Credit / Debit Card</div>
                    <div className="text-sm text-gray-500">Visa, MasterCard, Rupay</div>
                  </div>
                  <input type="radio" name="paymentMethod" value="card" checked={form.paymentMethod === "card"} onChange={handleChange} className="ml-auto accent-[#82D173]" />
                </div>

                {form.paymentMethod === "card" && (
                  <div className="mt-1 grid grid-cols-1 gap-3">
                    <input type="text" placeholder="Card number" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} className="w-full border p-3 rounded-lg focus:border-[#82D173] outline-none" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Name on card" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} className="w-full border p-3 rounded-lg focus:border-[#82D173] outline-none" />
                      <input type="text" placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} className="w-full border p-3 rounded-lg focus:border-[#82D173] outline-none" />
                    </div>
                    <input type="password" placeholder="CVV" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} className="w-36 border p-3 rounded-lg focus:border-[#82D173] outline-none" />
                  </div>
                )}
              </label>

              {/* UPI option */}
              <label className={`cursor-pointer p-4 rounded-lg border transition-shadow flex flex-col gap-3 ${form.paymentMethod === "upi" ? "border-green-500 shadow-lg" : "border-gray-200 hover:shadow"}`}>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📲</div>
                  <div>
                    <div className="font-medium">UPI</div>
                    <div className="text-sm text-gray-500">Google Pay, PhonePe, BHIM</div>
                  </div>
                  <input type="radio" name="paymentMethod" value="upi" checked={form.paymentMethod === "upi"} onChange={handleChange} className="ml-auto accent-[#82D173]" />
                </div>

                {form.paymentMethod === "upi" && (
                  <div className="mt-1">
                    <input type="text" placeholder="UPI ID (e.g. your@bank)" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full border p-3 rounded-lg focus:border-[#82D173] outline-none" />
                    <p className="text-sm text-gray-500 mt-2">You'll confirm payment via your UPI app.</p>
                  </div>
                )}
              </label>

              {/* COD option */}
              <label className={`cursor-pointer p-4 rounded-lg border transition-shadow flex items-center gap-3 ${form.paymentMethod === "cod" ? "border-green-500 shadow-lg" : "border-gray-200 hover:shadow"}`}>
                <div className="text-2xl">💵</div>
                <div>
                  <div className="font-medium">Cash on Delivery</div>
                  <div className="text-sm text-gray-500">Pay when your order arrives</div>
                </div>
                <input type="radio" name="paymentMethod" value="cod" checked={form.paymentMethod === "cod"} onChange={handleChange} className="ml-auto accent-[#82D173]" />
              </label>
            </div>

            <div className="mt-6">
              <button onClick={placeOrder} className="w-full bg-[#82D173] text-white py-3 rounded-lg font-semibold hover:bg-[#6CBD63] transition">{form.paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}</button>
            </div>
          </div>

        </div>

        {/* RIGHT SECTION — ORDER SUMMARY */}
        <div className="sticky top-20 bg-white shadow-md rounded-xl p-6 h-fit border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>

          {/* Products */}
          <div className="space-y-4 border-b pb-4 max-h-64 overflow-y-auto">
            {isBuyNow ? (
              <div className="flex items-center gap-4">
                <img src={buyNowProduct.image} className="w-20 h-20 rounded-lg object-cover border" />
                <div>
                  <h3 className="font-semibold text-gray-900">{buyNowProduct.name}</h3>
                  <p className="text-sm text-gray-500">{buyNowQty} item(s)</p>
                </div>
                <p className="ml-auto font-semibold text-gray-900">₹{buyNowProduct.price}</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.productId || item._id || item.id} className="flex items-center gap-4">
                  <img src={item.image || "https://placehold.co/100x100?text=Product"} className="w-16 h-16 rounded-lg object-cover border" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.quantity} × ₹{item.price}</p>
                  </div>
                  <p className="font-semibold text-gray-900">₹{item.price * item.quantity}</p>
                </div>
              ))
            )}
          </div>

          {/* Discount Code */}
          <div className="flex gap-3 mt-4">
            <input type="text" placeholder="Discount code" className="border p-3 rounded-lg flex-1 focus:border-[#82D173] outline-none" />
            <button className="px-4 bg-[#e5e7eb] rounded-lg hover:bg-gray-300 transition">Apply</button>
          </div>

          {/* Breakdown */}
          <div className="mt-5 text-gray-700 space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{form.address ? `₹${shippingFee}` : "Enter address"}</span></div>
            <div className="flex justify-between text-lg font-bold border-t pt-4"><span>Total</span><span className="text-green-600">₹{total}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
