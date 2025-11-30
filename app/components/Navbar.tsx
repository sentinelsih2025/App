"use client";

import { Indie_Flower } from "next/font/google";
import Link from "next/link";

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
  return (
    <div
      className="
        fixed top-0 left-0 w-full h-[70px] bg-[#000d2b] border-b border-white/20 
        flex items-center justify-between px-6 z-50
      "
    >
      {/* LEFT SECTION */}
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-emerald-700 p-2">{armyIcon}</div>

        <h1 className={`${indieFlower.className} text-3xl font-extrabold text-yellow-300`}>
          Rakshak
        </h1>
      </div>

      {/* CENTER NAVIGATION */}
      <ul className="flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
        <li>
          <Link
            href="/Home"
            className="flex items-center gap-2 px-3 py-2 bg-[#263119] hover:bg-[#FFD700] text-green-100 hover:text-black rounded transition"
          >
            <span className={iconBaseClass}>home</span>
            <span>Home</span>
          </Link>
        </li>


        <li>
          <Link
            href="/Resources"
            className="flex items-center gap-2 px-3 py-2 bg-[#263119] hover:bg-[#FFD700] text-green-100 hover:text-black rounded transition"
          >
            <span className={iconBaseClass}>inventory_2</span>
            <span>Recent Resources</span>
          </Link>
        </li>
      </ul>

      {/* RIGHT SECTION */}
      {/* <div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-700 hover:bg-yellow-400 text-white hover:text-black rounded transition"
        >
          <span className={iconBaseClass}>upload</span>
          <span>Upload</span>
        </button>
      </div> */}
    </div>
  );
}
