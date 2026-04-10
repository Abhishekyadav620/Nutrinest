import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { initialCustomers } from "../data/customers";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";

const Customers = () => {
  const [customers, setCustomers] = useState(() =>
    getFromLocalStorage("customers", initialCustomers)
  );
  const [query, setQuery] = useState("");

  // If you want to persist edits later, call saveToLocalStorage

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
  );

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchReviews = async () => {
      try {
        const { data } = await axiosClient.get("/reviews/site?limit=50");
        if (mounted) {
          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.reviews)
            ? data.reviews
            : [];
          setReviews(list);
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };
    fetchReviews();
    return () => (mounted = false);
  }, []);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Customers</h3>
        <input
          className="form-control"
          style={{ maxWidth: 320 }}
          placeholder="Search name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <b>{c.name}</b>
                  </td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.orders}</td>
                  <td>
                    <b>₹{c.totalSpent}</b>
                  </td>
                  <td>{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="mb-3">Site Reviews</h5>
          <div className="row g-3">
            {reviews.length === 0 ? (
              <div className="col-12 small text-muted">No reviews found.</div>
            ) : (
              reviews.map((r, i) => (
                <div className="col-md-6" key={r._id || i}>
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="mb-1">
                            {r.title ||
                              (r.text ? r.text.slice(0, 40) + "..." : "Review")}
                          </h6>
                          <div className="small text-muted">
                            By {r.username || r.author || "Anonymous"}
                          </div>
                        </div>
                        <div className="text-end">
                          <div style={{ color: "#77966D" }}>
                            {"★".repeat(Math.round(r.rating || 0))}
                          </div>
                          <div className="small text-muted">
                            {new Date(
                              r.createdAt || r.date || Date.now()
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 mb-0">
                        {r.text || r.quote || r.comment}
                      </p>
                      {r.productName && (
                        <div className="small text-muted mt-2">
                          Product: {r.productName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
