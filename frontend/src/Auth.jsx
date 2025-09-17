// src/pages/Auth.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "email" ? value.toLowerCase() : value,
    });
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = "Username is required";

    if (mode === "signup") {
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Invalid email format";
      }
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url =
        mode === "login"
          ? `${API_BASE}/api/auth/login`
          : `${API_BASE}/api/auth/register`;

      const payload =
        mode === "login"
          ? { username: formData.username, password: formData.password }
          : { username: formData.username, email: formData.email, password: formData.password };

      await axios.post(url, payload, { withCredentials: true });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.msg ||
          "Something went wrong"
      );
    }
  };

  // Toggle mode
  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
    setFieldErrors({});
    setFormData({ username: "", email: "", password: "" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
  
  {/* App Title - outside the card */}
  <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center drop-shadow-sm">
    School Payment and Dashboard Application
  </h1>

  {/* Auth Box */}
  <form
    onSubmit={handleSubmit}
    className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-96 border border-gray-200"
  >
    {/* Form Heading */}
    <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
      {mode === "login" ? "Welcome Back" : "Create Account"}
    </h2>

        {/* Backend error */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center font-medium">{error}</p>
        )}

        {/* Username */}
        <div className="mb-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.username}
            onChange={handleChange}
          />
          {fieldErrors.username && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>
          )}
        </div>

        {/* Email (signup only) */}
        {mode === "signup" && (
          <div className="mb-4">
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.email}
              onChange={handleChange}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>
        )}

        {/* Password */}
        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.password}
            onChange={handleChange}
          />
          {fieldErrors.password && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold 
             hover:bg-white hover:text-blue-600 border border-blue-600 
             transition-all"
>
  {mode === "login" ? "Login" : "Sign Up"}
</button>

        {/* Toggle mode */}
        <p className="text-sm mt-6 text-center text-gray-600">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 font-medium hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 font-medium hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}

export default Auth;
