import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import OrderTracking from "../../components/order/OrderTracking";
import { Package, Calendar, MapPin, CreditCard } from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <a
            href="/products"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Order Header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {order.items?.[0]?.product?.image ? (
                        <img
                          src={order.items[0].product.image}
                          alt={order.items[0].product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">
                        {order.items?.[0]?.product?.name || "Product"}
                        {order.items?.length > 1 && ` +${order.items.length - 1} more`}
                      </p>
                      <p className="text-sm text-gray-500">
                        Order #{order._id.slice(-8)} • {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ₹{order.totalAmount}
                      </p>
                      <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      order.deliveryStatus === "Delivered" ? "bg-green-500" :
                      order.deliveryStatus === "Cancelled" ? "bg-red-500" :
                      "bg-yellow-500"
                    }`} />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order._id && (
                <div className="border-t border-gray-100 p-6 space-y-6">
                  {/* Order Tracking */}
                  <OrderTracking status={order.deliveryStatus} />

                  {/* Order Items */}
                  <div>
                    <h3 className="font-bold text-gray-800 mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          {item.product?.image && (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {item.product?.name || "Product"}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity} × ₹{item.priceAtPurchase}
                            </p>
                          </div>
                          <p className="font-bold text-gray-900">
                            ₹{item.priceAtPurchase * item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Shipping Address
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-800">{order.address?.name}</p>
                      <p className="text-sm text-gray-600">{order.address?.line1}</p>
                      {order.address?.line2 && (
                        <p className="text-sm text-gray-600">{order.address.line2}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {order.address?.city}, {order.address?.postalCode}
                      </p>
                      <p className="text-sm text-gray-600">{order.address?.country}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Phone: {order.address?.phone}
                      </p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method</span>
                        <span className="font-medium text-gray-800">{order.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-gray-600">Payment Status</span>
                        <span className={`font-medium ${
                          order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                        <span className="font-bold text-gray-800">Total Amount</span>
                        <span className="font-bold text-gray-900">₹{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
