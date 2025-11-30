"use client"

import Link from "next/link";


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

      </aside>


      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto custom-scroll">
        <div className="sticky top-0 bg-[#0E1525] z-30 p-2">
          <h1 className="text-3xl font-bold text-[#7AA2F7] tracking-wide mb-6">MISSION CONTROL FEED</h1>
        </div>

        <div className="space-y-28 p-7">

          {/* IMAGE AGENT */}
          <div className="flex items-start gap-4 justify-center">

            {/* ICON */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center self-center 
      border border-lime-400/40 bg-[rgba(123,255,0,0.1)] 
      shadow-[0_0_8px_2px_rgba(163,255,79,0.4)] backdrop-blur-md">
              <span className="text-xs tracking-wide text-lime-300 font-semibold">IMAGE</span>
            </div>

            {/* BOX */}
            <div className="flex-1 relative bg-[#111929] border border-lime-500 rounded-xl p-4 shadow-lg shadow-black/20 backdrop-blur-sm overflow-hidden">

              {/* ACCENT LINE */}
              <div className="absolute left-0 top-0 h-full w-1 bg-lime-400 rounded-l-xl"></div>

              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] opacity-40">14:22:05</p>

                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-lime-300 tracking-wide">IMAGE INTELLIGENCE</h3>
                  <span className="text-[10px] px-2 py-px rounded-full bg-lime-500/20 text-lime-400 tracking-wide">Active</span>
                </div>
              </div>

              <p className="text-sm opacity-80 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum laboriosam maxime sequi veritatis. Neque dignissimos inventore, eveniet nobis ad nesciunt veniam atque officia cumque explicabo nihil culpa minima ipsum, molestiae, numquam eligendi porro. Nihil in, esse optio quis eius sequi magni placeat suscipit obcaecati quos quidem, deserunt iure!
              </p>
            </div>
          </div>




          {/* VIDEO AGENT */}
          <div className="flex items-start gap-4 justify-center">



            {/* BOX */}
            <div className="flex-1 relative bg-[#111929] border border-cyan-500 rounded-xl p-4 shadow-lg shadow-black/20 backdrop-blur-sm overflow-hidden">

              {/* ACCENT LINE */}
              <div className="absolute left-0 top-0 h-full w-1 bg-cyan-400 rounded-l-xl"></div>

              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] opacity-40">14:22:05</p>

                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-cyan-300 tracking-wide">VIDEO INTELLIGENCE</h3>
                  <span className="text-[10px] px-2 py-px rounded-full bg-cyan-500/20 text-cyan-400 tracking-wide">Active</span>
                </div>
              </div>

              <p className="text-sm opacity-80 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore sapiente temporibus quia harum doloribus mollitia architecto sunt pariatur nostrum. Tempora beatae asperiores quidem porro, distinctio eos rem? Harum molestias quam voluptatum esse, nemo commodi nisi reiciendis quo ut corrupti laboriosam! Ipsam dolor impedit itaque non nobis perspiciatis magnam.
              </p>
            </div>
            {/* ICON */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center self-center 
      border border-cyan-400/40 bg-[rgba(0,255,255,0.1)] 
      shadow-[0_0_8px_2px_rgba(0,255,255,0.4)] backdrop-blur-md">
              <span className="text-xs tracking-wide text-cyan-300 font-semibold">VIDEO</span>
            </div>
          </div>


          {/* AUDIO AGENT */}
          <div className="flex items-start gap-4 justify-center">

            {/* ICON */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center self-center 
      border border-purple-400/40 bg-[rgba(179,0,255,0.1)] 
      shadow-[0_0_8px_2px_rgba(200,0,255,0.4)] backdrop-blur-md">
              <span className="text-xs tracking-wide text-purple-300 font-semibold">AUDIO</span>
            </div>

            {/* BOX */}
            <div className="flex-1 relative bg-[#111929] border border-purple-500 rounded-xl p-4 shadow-lg shadow-black/20 backdrop-blur-sm overflow-hidden">

              {/* ACCENT LINE */}
              <div className="absolute left-0 top-0 h-full w-1 bg-purple-400 rounded-l-xl"></div>

              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] opacity-40">14:22:05</p>

                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-purple-300 tracking-wide">AUDIO INTELLIGENCE</h3>
                  <span className="text-[10px] px-2 py-px rounded-full bg-purple-500/20 text-purple-400 tracking-wide">Active</span>
                </div>
              </div>

              <p className="text-sm opacity-80 leading-relaxed">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nulla, deleniti! Deleniti, tempore at culpa optio facilis enim assumenda eaque explicabo possimus sed cupiditate reprehenderit mollitia maiores nihil pariatur ipsam obcaecati aperiam. Cum, accusamus numquam id et commodi, laudantium quae ad enim harum sapiente obcaecati! Vitae expedita aspernatur cupiditate.
              </p>
            </div>
          </div>


          {/* TEXT AGENT */}
          <div className="flex items-start gap-4 justify-center">

          

            {/* BOX */}
            <div className="flex-1 relative bg-[#111929] border border-pink-500 rounded-xl p-4 shadow-lg shadow-black/20 backdrop-blur-sm overflow-hidden">

              {/* ACCENT LINE */}
              <div className="absolute left-0 top-0 h-full w-1 bg-pink-400 rounded-l-xl"></div>

              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] opacity-40">14:22:05</p>

                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-pink-300 tracking-wide">TEXT INTELLIGENCE</h3>
                  <span className="text-[10px] px-2 py-px rounded-full bg-pink-500/20 text-pink-400 tracking-wide">Active</span>
                </div>
              </div>

              <p className="text-sm opacity-80 leading-relaxed">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis quisquam doloribus ea necessitatibus laudantium debitis, facere et eveniet mollitia! Animi exercitationem distinctio quos ut ipsam soluta nihil, sunt voluptatum at illo atque quia reiciendis eos rem magni voluptate ipsa in corrupti sequi inventore assumenda vero tenetur amet natus?
              </p>
            </div>
              {/* ICON */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center self-center 
      border border-pink-400/40 bg-[rgba(255,0,123,0.1)] 
      shadow-[0_0_8px_2px_rgba(255,0,150,0.4)] backdrop-blur-md">
              <span className="text-xs tracking-wide text-pink-300 font-semibold">TEXT</span>
            </div>
          </div>




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

          <Link href ='/dashboard'  className="block mt-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-all shadow text-sm font-medium text-center">OPEN DASHBOARD</Link>

        
          <div className="bg-[#111929] border border-[#1E2A3E] rounded-xl p-4 mt-2 h-40 flex items-center justify-center text-sm opacity-70">
            Chart Component Placeholder
          </div>
        
      </aside>
    </div>
  );
}
