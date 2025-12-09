import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ setIsAuthenticated, setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // ✅ 1. LOGIN API
      const res = await axios.post("http://localhost:8085/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;

      // ✅ 2. SAVE TOKEN
      localStorage.setItem("token", token);
      localStorage.setItem("email", res.data.email);

      // ✅ 3. AUTH TRUE
      setIsAuthenticated(true);

      // ✅ 4. PROFILE API WITH PROPER HEADER
      const profile = await axios.get(
        "http://localhost:8085/api/user/profile",
        {
          headers: {
            Authorization: "Bearer " + token,   // ✅ SAFE FORMAT
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ 5. ROLE EXTRACT
      const role = profile.data.role.replace("ROLE_", "");

      // ✅ 6. ROLE STATE + STORAGE
      setRole(role);                         // ✅ MISSING LINE FIXED
      localStorage.setItem("role", role);
console.log("FULL RESPONSE:", res);
console.log("RESPONSE DATA:", res.data);
console.log("TOKEN FROM BACKEND:", res.data.token);

      // ✅ 7. ROLE BASED REDIRECT
      if (role === "INSTRUCTOR") navigate("/instructor-dashboard");
      else if (role === "STUDENT") navigate("/student-dashboard");
      else if (role === "ADMIN") navigate("/admin-dashboard");
      else navigate("/");

      setMessage("✅ Login successful!");
    } catch (err) {
      console.error("Login error:", err);
      setMessage("❌ Invalid email/password OR Access Denied (403)");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden w-11/12 md:w-3/4 lg:w-2/3">

        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-700 to-purple-700 text-white flex-col justify-center items-center p-10">
          <h1 className="text-4xl font-bold mb-4 tracking-wide">Welcome Back!</h1>
          <p className="text-gray-200 text-center leading-relaxed">
            Continue your AI-driven learning journey with SkillForge.
          </p>
        </div>

        <div className="w-full md:w-1/2 p-10 bg-white/80 backdrop-blur-md">
          <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
            Sign In
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 border rounded-xl"
            />

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 border rounded-xl"
            />

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-xl"
            >
              Login
            </button>

            {message && (
              <p className="text-center text-sm text-gray-700 mt-2">
                {message}
              </p>
            )}
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link to="/registration" className="text-indigo-600 font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
