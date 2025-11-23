"use client";

import { Indie_Flower } from "next/font/google";
import Link from "next/link";
import { useState } from "react";

const indieFlower = Indie_Flower({ subsets: ["latin"], weight: "400" });

const armyIcon = (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="18" fill="#304119" />
    <path d="M11 24L25 12" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
    <path d="M25 24L11 12" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
    <circle cx="18" cy="18" r="4" stroke="#FFD700" strokeWidth="2" />
  </svg>
);

const iconBaseClass = "material-symbols-outlined text-[22px]";

export default function Navbar({ setShowUpload }: { setShowUpload: (v: boolean) => void }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`
        h-full bg-indigo-950 border-r border-black/20 flex flex-col justify-between relative 
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-[260px]"}
      `}
    >

      {/* Toggle Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 right-2 bg-yellow-400 text-black rounded-full h-6 w-6 flex items-center justify-center shadow"
      >
        {collapsed ? "»" : "«"}
      </button>

      {/* Top Section */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-emerald-700 p-2">{armyIcon}</div>
          {!collapsed && (
            <h1
              className={`${indieFlower.className} text-3xl font-extrabold text-yellow-300`}
            >
              Rakshak
            </h1>
          )}
        </div>

        {!collapsed && (
          <span className="block text-center text-green-100 text-xs tracking-widest font-mono">
            Made in India Ambush Detection System
          </span>
        )}

        {/* Navigation UI */}
        <ul className={`flex flex-col gap-4 mt-6 ${collapsed && "items-center"}`}>
          <li>
            <Link
              href="/Home"
              className="flex items-center gap-3 px-3 py-2 bg-[#263119] hover:bg-[#FFD700] text-green-100 hover:text-black rounded transition"
            >
              <span className={iconBaseClass}>home</span>
              {!collapsed && <span>Home</span>}
            </Link>
          </li>

          <li>
            <Link
              href="/Agent"
              className="flex items-center gap-3 px-3 py-2 bg-[#263119] hover:bg-[#FFD700] text-green-100 hover:text-black rounded transition"
            >
              <span className={iconBaseClass}>shield_person</span>
              {!collapsed && <span>Agent</span>}
            </Link>
          </li>

          <li>
            <Link
              href="/Resources"
              className="flex items-center gap-3 px-3 py-2 bg-[#263119] hover:bg-[#FFD700] text-green-100 hover:text-black rounded transition"
            >
              <span className={iconBaseClass}>inventory_2</span>
              {!collapsed && <span>Recent Resources</span>}
            </Link>
          </li>

          {/* Upload Button */}
          <li>
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-3 w-full px-3 py-2 bg-[#263119] hover:bg-[#FFD700] text-green-100 hover:text-black rounded transition"
            >
              <span className={iconBaseClass}>upload</span>
              {!collapsed && <span>Upload</span>}
            </button>
          </li>
        </ul>
      </div>

      {/* Bottom Settings */}
      <div className={`px-4 mb-4 ${collapsed && "flex justify-center"}`}>
        <Link
          href="/Setting"
          className="flex items-center gap-3 justify-center px-4 py-2 bg-yellow-700 hover:bg-yellow-400 text-white hover:text-black rounded transition"
        >
          <span className={iconBaseClass}>settings</span>
          {!collapsed && <span>Setting</span>}
        </Link>
      </div>
    </div>
  );
}
