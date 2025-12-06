"use client"

import Link from "next/link";
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



export default function Home() {

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
        <ImageData />
        <VideoData/>
        <TextData/>
        <AudioData/>



       <div className="bg-[#111413] p-4 rounded-xl mt-5">
  <p className="text-sm opacity-70 mb-2">UPLOAD TO AWS (TEMP TEST)</p>

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
    <span className="material-symbols-outlined">cloud_upload</span>
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

        <div className="bg-[linear-gradient(90deg,rgba(255,255,255,0.12),rgba(255,255,255,0.35),rgba(255,255,255,0.12))] border border-[#ffffff] rounded-xl p-4 h-32">
          <p className="text-sm opacity-60">SITUATION ANALYSIS</p>
          <p className="text-xs mt-2 opacity-40">Waiting for aggregator analysis...</p>
        </div>

        <div className="bg-[linear-gradient(90deg,rgba(255,255,255,0.12),rgba(255,255,255,0.35),rgba(255,255,255,0.12))] border border-[#ffffff] rounded-xl p-4">
          <p className="text-sm opacity-60 mb-2">THREAT CONFIDENCE</p>
          <div className="w-full h-2 bg-[#1A2538] rounded-full relative">
            <div className="absolute left-0 top-0 h-2 bg-lime-400 rounded-full" style={{ width: "48%" }}></div>
          </div>
          <p className="text-right text-xs mt-1 opacity-70">48%</p>
        </div>

        <div className="bg-[linear-gradient(90deg,rgba(255,255,255,0.12),rgba(255,255,255,0.35),rgba(255,255,255,0.12))] border border-[#ffffff] rounded-xl p-4">
          <p className="text-sm opacity-60 mb-2">AUTHENTIC SCORE</p>
          <div className="w-full h-2 bg-[#1A2538] rounded-full relative">
            <div className="absolute left-0 top-0 h-2 bg-lime-400 rounded-full" style={{ width: "92%" }}></div>
          </div>
          <p className="text-right text-xs mt-1 opacity-70">92%</p>
        </div>

        <Link href='/dashboard' className="block mt-4 py-2 rounded-lg bg-[#1df2ff80] hover:bg-[#00f2ffbf] transition-all shadow text-sm font-medium text-center">DECISSION SUPPORT CENTER</Link>




      </aside>
      
    </div>
  );
}
