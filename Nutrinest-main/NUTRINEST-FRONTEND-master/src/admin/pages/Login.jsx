import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

// ✅ API base from Vercel env
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // 1️⃣ Try ADMIN login first
    const result = await login(email, password);

    if (result.success) {
      navigate("/admin");
      return;
    }

    // 2️⃣ If admin login failed, try USER login
    try {
      const resp = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await resp.json();

      if (resp.ok) {
        navigate("/");
        return;
      }
    } catch (err) {
      // network error → handled below
    }

    // 3️⃣ Show error
    setError(result.message || "Invalid email or password");
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="card p-4 fixed-element"
        style={{ maxWidth: 420, width: "100%" }}
      >
        <h4 className="text-center mb-3">Admin Sign In</h4>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label small">Email</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small">Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-100">
            Sign In
          </Button>
        </form>

        <div className="mt-3 text-center">
          <small>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </small>
        </div>

        <div className="mt-3 p-2 bg-light border rounded">
          <small className="text-muted">
            Demo: <strong>admin@gmail.com</strong> / <strong>admin123</strong>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
