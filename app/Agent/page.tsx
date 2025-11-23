
"use client"
import { useState } from "react";

import Chart from "../components/chart"
export default function Agent() {


  const [chartDisplay, setchartDisplay] = useState("none");
  const [chartText, setchartText] = useState("Open");

  return (
    <div className="flex">
      <main className="p-6 flex-1">
        <h1 className="text-4xl mb-6 font-bold text-indigo-700 tracking-wide">Agent Dashboard</h1>

        <div className="space-y-6">

          {/* Agent 1 */}
          <div className="flex gap-6 items-center bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow duration-300 relative">

            {/* Left Block: Avatar + Button */}
            <div className="flex flex-col items-center relative">
              <div className="rounded-2xl bg-indigo-600 h-[120px] w-[120px] flex items-center justify-center text-white font-semibold text-lg tracking-wide shadow-md">
                Agent 1
              </div>

              <button
                className="absolute -bottom-5 bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-1.5 rounded-lg text-xs font-medium shadow transition-all duration-300"
              >
                View Data
              </button>
            </div>

            {/* Right Block: Summary Box */}
            <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 text-sm leading-relaxed shadow-inner">

              <h1 className="text-lg font-semibold text-indigo-300 mb-2">
                Image Agent
              </h1>

              <p className="font-semibold text-indigo-400">Latest Insights</p>
              Output summary and latest insights will appear here.
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet fugit nobis molestias!
            </div>
          </div>




          {/* Agent 2 */}
          <div className="flex gap-6 items-center bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow duration-300 relative">



            {/* Right Block: Summary Box */}
            <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 text-sm leading-relaxed shadow-inner">

              <h1 className="text-lg font-semibold text-indigo-300 mb-2">
                Vid Agent
              </h1>

              <p className="font-semibold text-indigo-400">Latest Insights</p>
              Output summary and latest insights will appear here.
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet fugit nobis molestias!
            </div>


            {/* Left Block: Avatar + Button */}
            <div className="flex flex-col items-center relative">
              <div className="rounded-2xl bg-indigo-600 h-[120px] w-[120px] flex items-center justify-center text-white font-semibold text-lg tracking-wide shadow-md">
                Agent 2
              </div>

              <button
                className="absolute -bottom-5 bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-1.5 rounded-lg text-xs font-medium shadow transition-all duration-300"
              >
                View Data
              </button>
            </div>
          </div>

          {/* Agent 3 */}
          <div className="flex gap-6 items-center bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow duration-300 relative">

            {/* Left Block: Avatar + Button */}
            <div className="flex flex-col items-center relative">
              <div className="rounded-2xl bg-indigo-600 h-[120px] w-[120px] flex items-center justify-center text-white font-semibold text-lg tracking-wide shadow-md">
                Agent 3
              </div>

              <button
                className="absolute -bottom-5 bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-1.5 rounded-lg text-xs font-medium shadow transition-all duration-300"
              >
                View Data
              </button>
            </div>

            {/* Right Block: Summary Box */}
            <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 text-sm leading-relaxed shadow-inner">

              <h1 className="text-lg font-semibold text-indigo-300 mb-2">
                Audio Agent
              </h1>

              <p className="font-semibold text-indigo-400">Latest Insights</p>
              Output summary and latest insights will appear here.
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet fugit nobis molestias!
            </div>
          </div>
          {/* Agent 4 */}
          <div className="flex flex-col h-64 bg-slate-800 border border-indigo-800 rounded-2xl p-4 shadow-md">
            <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 text-sm leading-relaxed shadow-inner">

              <h1 className="text-lg font-semibold text-indigo-300 mb-2">
                Image Agent
              </h1>

              <p className="font-semibold text-indigo-400">Latest Insights</p>
              Output summary and latest insights will appear here.
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet fugit nobis molestias!
            </div>
            {/* Button at bottom */}
            <button
              className="mt-2 w-full py-2 rounded-lg
               bg-indigo-500 text-white font-medium
               hover:bg-indigo-800 active:bg-indigo-900
               transition-colors duration-200 shadow-md"
              onClick={() => {
                if (chartDisplay == "none") {
                  setchartDisplay("block");
                }else{
                  setchartDisplay("none");
                }
                
                if(chartText == "Close"){
                  setchartText("Open");
                }
                else{
                  setchartText("Close")
                }
              }}
            >
              {chartText} Chart
            </button>
          </div>

        </div>
      </main>

      {/* Chart panel */}
      <div style={{ display: chartDisplay }}>
        <Chart />
      </div>
    </div>
  );
}
