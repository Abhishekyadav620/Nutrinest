import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { io as ioClient } from "socket.io-client";
import { toast } from "react-hot-toast";

// API base strictly from env
const API_BASE = import.meta.env.VITE_API_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("/admin/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      toast.error("Failed to load orders from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Realtime: listen for new orders
    if (API_BASE) {
      const socket = ioClient(API_BASE, { transports: ["websocket"] });
      socket.on("newOrder", (newOrder) => {
        setOrders((prev) => {
          if (prev.some((o) => o._id === newOrder._id)) return prev;
          return [newOrder, ...prev];
        });
        toast.success("New order received!", { position: "top-right" });
      });
      return () => socket.disconnect();
    }
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axiosClient.put(`/admin/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, deliveryStatus: newStatus } : o)));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleCompleteAndRemove = async (orderId) => {
    if (!window.confirm("Mark this order as complete and remove it from the dashboard?")) return;
    try {
      await axiosClient.delete(`/admin/orders/${orderId}`);
      setOrders(orders.filter((o) => o._id !== orderId));
      toast.success("Order marked as completed and removed");
    } catch (err) {
      toast.error("Failed to remove order");
    }
  };

  const filtered = orders.filter((o) => {
    const searchStr = `${o._id} ${o.address?.name || ""} ${o.user?.name || ""} ${o.user?.username || ""}`.toLowerCase();
    return searchStr.includes(query.toLowerCase());
  });

  if (loading) return <div className="p-10 text-center">Loading orders...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          <p className="text-gray-500 text-sm">Monitor and manage customer orders real-time.</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Order ID, Name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none w-full md:w-80 shadow-sm"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Order / Photo</th>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Delivery Address</th>
                <th className="px-6 py-4">Payment / Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    {/* PHOTO & ID */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border">
                          {order.items?.[0]?.product?.image ? (
                            <img
                              src={order.items[0].product.image}
                              alt="Product"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                              No Pix
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-mono text-gray-400">ID: #{order._id.slice(-6)}</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {order.items?.length} Item(s)
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CUSTOMER */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-bold text-gray-900">
                          {order.user?.name || order.address?.name || order.user?.username || "Guest User"}
                        </p>
                        <p className="text-gray-500">{order.address?.email || order.user?.email || "N/A"}</p>
                        <p className="text-gray-500 font-medium">{order.address?.phone || "No Phone"}</p>
                      </div>
                    </td>

                    {/* ADDRESS */}
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600 max-w-[200px] leading-relaxed">
                        <p>{order.address?.line1}</p>
                        {order.address?.line2 && <p>{order.address.line2}</p>}
                        <p>
                          {order.address?.city}, {order.address?.postalCode}
                        </p>
                      </div>
                    </td>

                    {/* PAYMENT */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            order.paymentMethod === "COD"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {order.paymentMethod}
                        </span>
                        <p className="mt-1 text-lg font-bold text-gray-900">₹{order.totalAmount}</p>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <select
                        value={order.deliveryStatus || order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className={`text-xs font-bold px-4 py-2 rounded-full border-0 outline-none cursor-pointer shadow-sm transition-all ${
                          (order.deliveryStatus || order.status) === "delivered"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : (order.deliveryStatus || order.status) === "shipped"
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : (order.deliveryStatus || order.status) === "cancelled"
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                      >
                        <option value="pending">Not Completed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleCompleteAndRemove(order._id)}
                        className="text-xs bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition transform hover:scale-105"
                      >
                        Complete ✓
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
