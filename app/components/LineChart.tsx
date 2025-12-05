"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { time: "12:00", score: 30 },
  { time: "12:05", score: 45 },
  { time: "12:10", score: 70 },
  { time: "12:15", score: 55 },
  { time: "12:20", score: 90 },
  { time: "12:30", score: 30 },
  { time: "12:35", score: 45 },
  { time: "01:10", score: 70 },
  { time: "02:15", score: 55 },
  { time: "03:20", score: 90 },
]

export default function ThreatLineChart() {
  return (
    <div className="w-full h-50 p-2 ">
      
      <h2 className="text-[#7cc3c7] font-semibold mb-3 text-sm tracking-wide">
        Threatening Score Over Time
      </h2>

      <ResponsiveContainer width="100%" height="98%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#40c6ce" />

          <XAxis
            dataKey="time"
            stroke="#1df2ff80"
            tick={{ fill: "#b8d8ff" }}
          />

          <YAxis
            stroke="#1df2ff80"
            tick={{ fill: "#b8d8ff" }}
          />

          <Tooltip
            contentStyle={{ background: "#0e1a2b", border: "1px solid #1df2ff60" }}
            labelStyle={{ color: "#1df2ff" }}
          />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#40c6ce"
            strokeWidth={2}
            dot={{ fill: "#40c6ce", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  )
}
