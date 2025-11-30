"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupCard() {
  const [form, setForm] = useState({
    armyId: "",
    armyPos: "",
    militaryEmail: "",
    location: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // VALIDATION
const validate = () => {
  if (!form.armyId.trim()) return "Army ID is required";
  if (!form.militaryEmail.trim()) return "Email is required";

  // ALLOW any normal email temporarily
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.militaryEmail)) return "Enter a valid email";

  if (!form.location) return "Select your military location/base";
  if (!form.password.trim()) return "Password is required";
  if (form.password.length < 6) return "Password must be at least 6 characters";
  if (form.password !== form.confirmPassword) return "Passwords do not match";

  return "";
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  const validationError = validate();
  if (validationError) return setError(validationError);

  try {
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Signup failed");
      return;
    }

    setSuccess("Account created successfully!");

    // Clear form
    setForm({
      armyId: "",
      armyPos: "",
      militaryEmail: "",
      location: "",
      otp: "",
      password: "",
      confirmPassword: "",
    });

    // 🔥 Redirect to login page (after 1 second or immediately)
    setTimeout(() => {
      router.push("/login");
    }, 500);

  } catch (error) {
    setError("Internal Server Error");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="h-screen w-full flex items-center justify-center overflow-hidden bg-fixed bg-[radial-gradient(circle_at_30%_20%,#2e4f2f_0%,#0f1a0f_40%,#0a140a_70%)] -mt-[70px]">
      <div className="bg-[#1b2a1f]/90 border border-green-700 shadow-xl p-8 rounded-2xl w-full max-w-md text-green-100 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-2 text-center tracking-widest text-green-300">
          RAKSHAK HQ SIGNUP
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

          {/* ARMY Position */}
          <select
            value={form.armyPos}
            onChange={handleChange("armyPos")}
            className="w-full p-3 rounded-lg bg-[#132016] border border-green-700 focus:border-green-400 outline-none text-green-100"
          >
            <option value="" disabled>Select Position</option>
            <option value="commander">Commander</option>
            <option value="headquartersHead">Headquarters Head</option>
            <option value="soldier">Soldier</option>
            <option value="assistant">Assistant</option>
            <option value="officer">Officer</option>
          </select>

          {/* LOCATION DROPDOWN */}
          <select
            value={form.location}
            onChange={handleChange("location")}
            className="w-full p-3 rounded-lg bg-[#132016] border border-green-700 text-green-100 focus:border-green-400 outline-none cursor-pointer"
          >
            <option value="" disabled>Select Military Location / Base</option>
            <option value="Eastern Command">Eastern Command</option>
            <option value="Western Command">Western Command</option>
            <option value="Northern Command">Northern Command</option>
            <option value="Southern Command">Southern Command</option>
            <option value="Central Command">Central Command</option>
            <option value="South Western Command">South Western Command</option>
            <option value="Training Command">Training Command</option>
          </select>

          {/* MILITARY EMAIL */}
          <input
            type="email"
            placeholder="Military Email (e.g., abc@gov.in)"
            value={form.militaryEmail}
            onChange={handleChange("militaryEmail")}
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

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              className="w-full p-3 rounded-lg bg-[#132016] border border-green-700 focus:border-green-400 outline-none text-green-100 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-green-300"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* ERROR / SUCCESS */}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {success && <p className="text-green-300 text-sm text-center">{success}</p>}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition py-3 rounded-lg font-semibold tracking-wide disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs mt-4 text-green-400">
          Already registered?{" "}
          <span className="underline cursor-pointer text-green-300">
            <Link href="/login">Login</Link>
          </span>
        </p>
      </div>
    </div>
  );
}
