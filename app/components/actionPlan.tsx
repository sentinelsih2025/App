"use client";

import { useState } from "react";

export default function DecisionSupportPopup() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Rakshak Decision Support Center
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Key action plans for strategic and operational response
        </p>

        {/* Plans */}
        <ul className="mt-6 space-y-3 text-sm text-gray-700">
          <li className="flex items-start gap-3">
            <span>🚨</span>
            Real-time threat monitoring and alert system
          </li>
          <li className="flex items-start gap-3">
            <span>📊</span>
            Data-driven risk assessment and predictive analysis
          </li>
          <li className="flex items-start gap-3">
            <span>🧭</span>
            Strategic response planning and resource deployment
          </li>
          <li className="flex items-start gap-3">
            <span>📡</span>
            Secure communication and inter-agency coordination
          </li>
          <li className="flex items-start gap-3">
            <span>🛡️</span>
            Incident tracking, reporting, and live situation updates
          </li>
          <li className="flex items-start gap-3">
            <span>📁</span>
            Post-incident review and continuous system improvement
          </li>
        </ul>

        {/* Button */}
        <button
          onClick={() => setOpen(false)}
          className="mt-8 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
}
