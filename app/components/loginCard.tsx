"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginCard() {
  const [form, setForm] = useState({
    armyId: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const validate = () => {
    if (!form.armyId.trim()) return "Army ID is required";
    if (!form.password.trim()) return "Password is required";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const err = validate();
    if (err) return setError(err);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          armyId: form.armyId, // 🔥 FIXED
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid Army ID or password");
        return;
      }

      setSuccess("Login successful!");

      // 🔥 Optional: store token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // 🔥 Redirect to dashboard/home
      router.push("/home");

    } catch (error) {
      setError("Unable to login. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 
      bg-fixed bg-[radial-gradient(circle_at_30%_20%,#2e4f2f_0%,#0f1a0f_40%,#0a140a_70%)]
      bg-blend-overlay overflow-hidden -mt-[70px]"
    >
      <div className="bg-[#1b2a1f]/90 border border-green-700 shadow-xl p-8 rounded-2xl w-full max-w-md text-green-100 backdrop-blur-sm">

        <h2 className="text-2xl font-bold mb-2 text-center tracking-widest text-green-300">
          RAKSHAK HQ LOGIN
        </h2>
        <p className="text-center text-green-400 text-sm mb-6">
          Secure Access for Authorized Personnel Only
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* ARMY ID */}
          <input
            type="text"
            placeholder="Army ID / Service Number"
            value={form.armyId}
            onChange={handleChange("armyId")}
            className="w-full p-3 rounded-lg bg-[#132016] border border-green-700 focus:border-green-400 outline-none text-green-100"
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange("password")}
              className="w-full p-3 rounded-lg bg-[#132016] border border-green-700 focus:border-green-400 outline-none text-green-100 pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 text-green-300"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* ERROR / SUCCESS */}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {success && <p className="text-green-300 text-sm text-center">{success}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition py-3 rounded-lg font-semibold tracking-wide"
          >
            Login
          </button>
        </form>

        <p className="text-center text-xs mt-4 text-green-400">
          Don’t have an account?{" "}
          <span className="underline cursor-pointer text-green-300">
            <Link href="/signup">Sign Up</Link>
          </span>
        </p>
      </div>
    </div>
  );
}
