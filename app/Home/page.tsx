"use client"

import Link from "next/link";
import ImageAgent from "../components/imageAgent";
import VideoAgent from "../components/videoAgent"
import AudioAgent from "../components/audioAgent";
import TextAgent from "../components/textAgent";



export default function Home() {

  return (
    <div className="w-full h-full flex bg-[#0B0F19] text-white">
      {/* LEFT SIDEBAR */}
      <aside className="w-72 bg-[#0E1525] border-r border-[#1E2A3E] p-4 
  flex flex-col gap-8 overflow-y-scroll custom-scroll">

        <h2 className="text-xl font-semibold tracking-wide text-[#7AA2F7]">
          DATA SOURCES
        </h2>

        <div className="bg-[#111929] rounded-xl p-4 border border-[#1E2A3E] 
    h-56 shrink-0 flex flex-col justify-center items-center">
          <p className="text-sm opacity-60">Surveillance Feed</p>
          <div className="mt-2 w-full h-full bg-black/40 text-center flex items-center 
      justify-center rounded-lg border border-[#1E2A3E] text-xs opacity-40">
            No Signal
          </div>
        </div>

        <div className="bg-[#111929] rounded-xl p-4 border border-[#1E2A3E] 
    h-56 shrink-0 flex flex-col justify-center items-center">
          <p className="text-sm opacity-60">Drone Link</p>
          <div className="mt-2 w-full h-full bg-black/40 text-center flex items-center 
      justify-center rounded-lg border border-[#1E2A3E] text-xs opacity-40">
            Link Active
          </div>
        </div>

        <div className="bg-[#111929] rounded-xl p-4 border border-[#1E2A3E]
    h-56 shrink-0 flex flex-col justify-center items-center">
          <p className="text-sm opacity-60">Drone Link</p>
          <div className="mt-2 w-full h-full bg-black/40 text-center flex items-center 
      justify-center rounded-lg border border-[#1E2A3E] text-xs opacity-40">
            Link Active
          </div>
        </div>

        <div className="bg-[#111929] rounded-xl p-4 border border-[#1E2A3E]
    h-56 shrink-0 flex flex-col justify-center items-center">
          <p className="text-sm opacity-60">Drone Link</p>
          <div className="mt-2 w-full h-full bg-black/40 text-center flex items-center 
      justify-center rounded-lg border border-[#1E2A3E] text-xs opacity-40">
            Link Active
          </div>
        </div>

        <div className="bg-[#111929] rounded-xl p-4 border border-[#1E2A3E]
    h-56 shrink-0 flex flex-col justify-center items-center">
          <p className="text-sm opacity-60">Drone Link</p>
          <div className="mt-2 w-full h-full bg-black/40 text-center flex items-center 
      justify-center rounded-lg border border-[#1E2A3E] text-xs opacity-40">
            Link Active
          </div>
        </div>


        <div className="bg-[#111929] p-4 rounded-xl mt-5">
          <p className="text-sm opacity-70 mb-2">UPLOAD TO AWS (TEMP TEST)</p>

          <input
            type="file"
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
              alert("Uploaded to AWS:\n" + data.url);
            }}

            className="text-white"
          />
        </div>


      </aside>


      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto custom-scroll">
        <div className="sticky top-0 bg-[#0E1525] z-30 p-2">
          <h1 className="text-3xl font-bold text-[#7AA2F7] tracking-wide mb-6">MISSION CONTROL FEED</h1>
        </div>

        <div className="space-y-28 p-7">

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
      <aside className="w-80 bg-[#0E1525] border-l border-[#1E2A3E] p-4 flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-wide text-[#7AA2F7]">INTELLIGENCE SUMMARY</h2>

        <div className="bg-[#111929] border border-[#1E2A3E] rounded-xl p-4 h-32">
          <p className="text-sm opacity-60">SITUATION ANALYSIS</p>
          <p className="text-xs mt-2 opacity-40">Waiting for aggregator analysis...</p>
        </div>

        <div className="bg-[#111929] border border-[#1E2A3E] rounded-xl p-4">
          <p className="text-sm opacity-60 mb-2">THREAT CONFIDENCE</p>
          <div className="w-full h-2 bg-[#1A2538] rounded-full relative">
            <div className="absolute left-0 top-0 h-2 bg-yellow-400 rounded-full" style={{ width: "72%" }}></div>
          </div>
          <p className="text-right text-xs mt-1 opacity-70">72%</p>
        </div>

        <Link href='/dashboard' className="block mt-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-all shadow text-sm font-medium text-center">OPEN DASHBOARD</Link>


        <div className="bg-[#111929] border border-[#1E2A3E] rounded-xl p-4 mt-2 h-40 flex items-center justify-center text-sm opacity-70">
          Chart Component Placeholder
        </div>

      </aside>
    </div>
  );
}
