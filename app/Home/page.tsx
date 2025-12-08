"use client"

import Link from "next/link";

import { useState } from "react";

import ImageAgent from "../components/imageAgent";
import VideoAgent from "../components/videoAgent"
import AudioAgent from "../components/audioAgent";
import TextAgent from "../components/textAgent";
import ThreatBarChart from "../components/LineChart";

import ImageData from "../components/imageData";
import VideoData from "../components/videoData";
import TextData from "../components/textData";
import AudioData from "../components/audioData";

import bgImg from "../../public/bgImg.jpg"

import Aggrigator from "../components/aggregator";



export default function Home() {

  const [threadScore, settreadScore] = useState(76);

  return (
    <div className="w-full h-full flex text-white">
      {/* LEFT SIDEBAR */}
      <aside
        style={{
          backgroundImage: `url(${bgImg.src})`,
          backgroundSize: "auto",            // prevents zooming
          backgroundRepeat: "repeat",        // repeats the pattern
          backgroundPosition: "center",
        }}

        className="w-80 border-r border-[#1E2A3E] p-2 
  flex flex-col gap-4 overflow-y-scroll custom-scroll">

        <h2 className="text-xl font-semibold tracking-wide">
          DATA SOURCES
        </h2>

          <div className="bg-[#111413] p-4 rounded-xl mt-5">
          <p className="text-sm opacity-70 mb-2">UPLOAD TO DATABASE</p>

          <label
            htmlFor="fileUpload"
            className="
      inline-flex items-center gap-2
      bg-[#1A2333] hover:bg-[#1F2A3D]
      text-white px-4 py-2 
      rounded-lg cursor-pointer
      border border-[#2A3A55]
      transition-all duration-200
      shadow-[0_0_10px_rgba(0,0,0,0.3)]
    "
          >
            <span className="material-symbols-outlined"></span>
            Upload File
          </label>

          <input
            id="fileUpload"
            type="file"
            className="hidden"
            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const form = new FormData();
              form.append("file", file);

              const res = await fetch("/api/upload", {
                method: "POST",
                body: form,
              });

              const data = await res.json();
              console.log("AWS URL:", data.url);
              console.log("S3 Key:", data.key);

              try {
                const processRes = await fetch("http://localhost:8000/process", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ key: data.key }),
                });

                const processData = await processRes.json();
                console.log("Backend processing result:", processData);

                if (typeof window !== "undefined") {
                  try {
                    window.dispatchEvent(
                      new CustomEvent("images-updated", { detail: { key: data.key } })
                    );
                  } catch (e) {
                    console.warn("Unable to dispatch images-updated event", e);
                  }
                }
              } catch (error) {
                console.error("Failed to trigger backend processing:", error);
              }
            }}
          />
        </div>

        <ImageData />
        <VideoData />
        <TextData />
        <AudioData />






      </aside>


      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto custom-scroll bg-[#202222]">
        <div
          style={{
            backgroundImage: `url(${bgImg.src})`,
            backgroundSize: "auto",            // prevents zooming
            backgroundRepeat: "repeat",        // repeats the pattern
            backgroundPosition: "center",
          }}
          className="pt-3 pb-0.5 text-center">
          <h1 className="text-3xl font-bold tracking-wide mb-6">TACTICAL ANALYSIS STREAM</h1>
        </div>

        <div className="space-y-8 p-7">

          {/* IMAGE AGENT */}

          <ImageAgent />



          {/* VIDEO AGENT */}
          <VideoAgent />


          {/* AUDIO AGENT */}
          <AudioAgent />


          {/* TEXT AGENT */}
          <TextAgent />




        </div>
      </main>

      {/* RIGHT PANEL */}
      <aside
        style={{
          backgroundImage: `url(${bgImg.src})`,
          backgroundSize: "auto",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}

        className="w-80 border-l border-[#1E2A3E] p-4 flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-wide ">INTELLIGENCE SUMMARY</h2>

        <Aggrigator/>




      </aside>

    </div>
  );
}
