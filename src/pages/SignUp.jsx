import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const SignUp = () => {
  const { login } = useContext(AuthContext); // Handle login after signup
  const [isLogin, setIsLogin] = useState(false); // Toggle between login and signup
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Success message state
  const [emailError, setEmailError] = useState(""); // Email validation message
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Email validation for capital letter start
    if (name === "email") {
      if (value[0] === value[0]?.toUpperCase()) {
        setEmailError("Email should start with a lowercase letter.");
      } else {
        setEmailError(""); // Clear email error if input is valid
      }
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password || (!isLogin && !form.username)) {
      setError("All fields are required!");
      return;
    }

    if (emailError) {
      setError("Please fix the email format issue first.");
      return;
    }

    try {
      let res;
      if (isLogin) {
        res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/users/login`,
          form,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setSuccess("Login successful!");
      } else {
        res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/users/register`,
          form,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setSuccess("Registration successful!");
      }

      setError(""); // Clear errors
      login(res.data.token); // Log in user
      setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred. Try again."
      );
      setSuccess(""); // Clear success message if error occurs
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-4 text-center">
        {isLogin ? "Login" : "Sign Up"}
      </h2>
      {/* Error and Success Messages */}
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {success && <p className="text-green-500 mb-3">{success}</p>}
      {emailError && <p className="text-orange-500 mb-3">{emailError}</p>}{" "}
      {/* Email error */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded shadow-lg space-y-4"
      >
        {!isLogin && (
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!isLogin}
            />
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-all duration-300"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        {isLogin ? "New here?" : "Already a user?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 hover:underline"
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default SignUp;
