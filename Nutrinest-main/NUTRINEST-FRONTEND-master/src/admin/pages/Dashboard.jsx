import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { getFromLocalStorage } from "../utils/localStorage";
import { initialProducts } from "../data/products";
import { initialOrders } from "../data/orders";
import { initialCustomers } from "../data/customers";
import axiosClient from "../../api/axiosClient";
import { io as ioClient } from "socket.io-client";

const Dashboard = () => {
  const [products, setProducts] = useState(() =>
    getFromLocalStorage("products", initialProducts)
  );
  const [orders, setOrders] = useState(() =>
    getFromLocalStorage("orders", initialOrders)
  );
  const customers = getFromLocalStorage("customers", initialCustomers);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [pRes, oRes] = await Promise.all([
          axiosClient.get("/products"),
          axiosClient.get("/admin/orders"),
        ]);
        if (!mounted) return;
        if (pRes.data && Array.isArray(pRes.data.products)) {
          setProducts(
            pRes.data.products.map((p) => ({
              id: p._id || p.id,
              name: p.name,
              category: p.category || "General",
              price: p.price,
              stock: p.stock || 0,
              image: p.image || "",
              status: p.status || "Active",
            }))
          );
        }
        if (oRes.data && Array.isArray(oRes.data)) {
          const mapped = oRes.data.map((o) => ({
            id: o._id || o.id,
            customer: (o.user && o.user.name) || "User",
            date: new Date(o.createdAt || Date.now()).toLocaleDateString(),
            total: o.totalAmount || 0,
            status: o.status || "Pending",
          }));
          setOrders(mapped);
        }
      } catch (err) {
        // keep local data if backend unavailable
      }
    };
    fetchData();
    return () => (mounted = false);
  }, []);

  // realtime: listen for new orders and stock updates
  useEffect(() => {
    const apiBase = (
      import.meta.env.VITE_API_URL
    ).replace(/\/api$/, "");
    const socket = ioClient(apiBase);

    socket.on("newOrder", (o) => {
      if (!o || typeof o !== "object") return;
      
      const mapped = {
        id: o._id || o.id,
        customer: (o.user && o.user.name) || "User",
        date: new Date(o.createdAt || Date.now()).toLocaleDateString(),
        total: o.totalAmount || 0,
        status: o.status || "Pending",
      };
      setOrders((prev) => {
        if (prev.some((p) => p.id === mapped.id)) return prev;
        return [mapped, ...prev].slice(0, 20);
      });

      // also decrement product stock locally for quick feedback
      if (Array.isArray(o.items)) {
        setProducts((prev) => {
          const next = prev.map((prod) => {
            const match = o.items.find((it) => {
              const pid = it.product && (it.product._id || it.product);
              return pid && (prod.id === pid || prod.id === String(pid));
            });
            if (match) {
              return {
                ...prod,
                stock: Math.max(
                  0,
                  (prod.stock || 0) - (match.quantity || match.qty || 1)
                ),
              };
            }
            return prod;
          });
          return next;
        });
      }
    });

    socket.on("productStockUpdate", (updates) => {
      if (!Array.isArray(updates)) return;
      
      setProducts((prev) => {
        const byId = {};
        updates.forEach((u) => {
          if (u && u.product) byId[String(u.product)] = u.stock;
        });
        return prev.map((p) => ({
          ...(p || {}),
          stock: byId[String(p.id)] ?? p.stock,
        }));
      });
    });

    return () => socket.disconnect();
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <div className="container-fluid">
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <StatCard title="Products" value={products.length} />
        </div>
        <div className="col-md-3">
          <StatCard title="Orders" value={orders.length} />
        </div>
        <div className="col-md-3">
          <StatCard title="Customers" value={customers.length} />
        </div>
        <div className="col-md-3">
          <StatCard title="Revenue" value={`₹${totalRevenue}`} />
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5>Recent Orders</h5>
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id}>
                    <td>
                      <b>{o.id}</b>
                    </td>
                    <td>{o.customer}</td>
                    <td>{o.date}</td>
                    <td>
                      <b>₹{o.total}</b>
                    </td>
                    <td>
                      <span className="badge text-dark">{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
