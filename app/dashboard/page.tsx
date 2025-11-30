"use client";

import Chart from "../components/chart";
import Map from "../components/Map";

export default function Dashboard() {
  return (
    <div className="flex w-screen">

      {/* CHART */}
      <div className="w-[50vw]">
        <Chart />
      </div>

      {/* MAP */}
      <main className="w-[50vw]">
        <div className="h-[45vh] w-full relative">
          {/* <Map /> */}
        </div>
      </main>

    </div>
  );
}
