import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT", // Default role
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    // Send plain role without ROLE_ prefix
    const registerPayload = { ...form };
    const registerRes = await axios.post(
      "http://localhost:8085/api/auth/register",
      registerPayload
    );

    console.log("Register response:", registerRes.data);

    // Login after registration
    const loginRes = await axios.post("http://localhost:8085/api/auth/login", {
      email: form.email,
      password: form.password,
    });

    console.log("Login response:", loginRes.data);

    const token = loginRes.data.token;
    const role =
      loginRes.data.role ||
      loginRes.data.userRole ||
      loginRes.data.roles?.[0] ||
      "STUDENT";

    // Save token & role to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", role); // use role directly

    setMessage("✅ Registration successful! Redirecting...");

    // Redirect by role
    setTimeout(() => {
      if (role === "INSTRUCTOR") navigate("/instructor-dashboard");
      else if (role === "ADMIN") navigate("/admin-dashboard");
      else navigate("/student-dashboard");
    }, 1000);
  } catch (err) {
    console.error("Error during registration:", err.response || err);
    setMessage(
      err.response?.data?.message ||
        "❌ Something went wrong, please try again!"
    );
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden w-11/12 md:w-3/4 lg:w-2/3">
        {/* Left info */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-700 to-indigo-700 text-white flex-col justify-center items-center p-10">
          <h1 className="text-4xl font-bold mb-4 tracking-wide">Join SkillForge</h1>
          <p className="text-gray-200 text-center leading-relaxed">
            Personalized AI courses that grow with you. Sign up to start your
            adaptive learning journey.
          </p>
        </div>

        {/* Right form */}
        <div className="w-full md:w-1/2 p-10 bg-white/80 backdrop-blur-md">
          <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
            Create Account
          </h2>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Create password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2"
              >
                <option value="STUDENT">Student</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl"
            >
              Register
            </button>

            {message && (
              <p className="text-center text-sm text-gray-700 mt-2">{message}</p>
            )}
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
