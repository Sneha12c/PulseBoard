import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      username: "",
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        setLoading(true);

        await api.post(
          "/auth/signup",
          formData
        );

        navigate(
          "/login"
        );
      } catch (error: any) {
        alert(
          error.response?.data
            ?.message ||
            "Registration failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={
          handleSubmit
        }
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Register
        </h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full border p-3 rounded mb-4"
          onChange={
            handleChange
          }
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          onChange={
            handleChange
          }
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          onChange={
            handleChange
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-3 rounded"
        >
          {loading
            ? "Loading..."
            : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;
