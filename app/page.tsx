"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Chart from "./components/chart";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#070812] via-[#0B0F19] to-[#071025] text-white relative overflow-hidden -mt-[70px]">

      {/* ===================== NAVBAR ===================== */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-700/40 border border-green-400/20 flex items-center justify-center">
            <span className="text-sm font-extrabold text-green-300">RK</span>
          </div>

          <span className="font-semibold tracking-wide text-sm text-white/90">
            Rakshak • Ambush Detection AI
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm px-4 py-2 rounded-md bg-green-700 hover:bg-green-600 transition shadow">
            Login
          </Link>

          <Link href="/signup" className="text-sm px-4 py-2 rounded-md border border-white/10 hover:bg-white/5 transition">
            Sign Up
          </Link>
        </div>
      </nav>


      {/* ===================== HERO SECTION ===================== */}
      <header className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-14 items-center">

          {/* LEFT HERO SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-green-300">
              Rakshak — AI-Powered  
              <span className="block text-white mt-2">Ambush Detection System</span>
            </h1>

            <p className="mt-6 text-lg text-white/70 max-w-xl">
              A next-generation multi-sensor intelligence platform for Indian Armed Forces.
              Powered by Geo-AI, real-time analysis, drone feeds, and predictive threat modelling.
            </p>

            <div className="mt-10 flex gap-4">
              <Link href="/login" className="px-6 py-3 rounded-md bg-green-700 hover:bg-green-600 shadow text-white">
                Start Now
              </Link>

              <a
                href="#features"
                className="px-6 py-3 rounded-md border border-white/10 hover:bg-white/5"
              >
                Explore Features
              </a>
            </div>
          </motion.div>


          {/* RIGHT SIDE - ARMY IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-lg border border-white/10"
          >
            <img
              src="/images/army_soldiers.jpg"
              className="w-full h-[420px] object-cover opacity-90"
              alt="Army Operation"
            />
          </motion.div>
        </div>
      </header>



      {/* ===================== LIVE PREVIEW SECTION ===================== */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-10">

          {/* Video Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-[#0F1724]/50 border border-white/10 rounded-xl p-5"
          >
            <p className="text-sm font-semibold text-white/80 mb-3">
              Real Mission Drone Footage
            </p>

            <div className="h-64 rounded-xl overflow-hidden border border-white/10">
              <video
                src="/videos/ambush_demo.mp4"
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
              />
            </div>
          </motion.div>


          {/* Detection Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-[#0F1724]/50 border border-white/10 rounded-xl p-5"
          >
            <p className="text-sm font-semibold text-white/80 mb-3">AI Target Detection</p>

            <div className="h-64 rounded-xl overflow-hidden border border-white/10">
              <img
                src="/images/detection_preview.jpg"
                className="w-full h-full object-cover"
                alt="AI Detection"
              />
            </div>
          </motion.div>

        </div>
      </section>



      {/* ===================== FEATURES SECTION ===================== */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-semibold text-green-300 mb-12 text-center"
        >
          Core Capabilities
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10">

          {[
            {
              title: "Real-Time Ambush Detection",
              desc: "Processes video, audio, and drone feeds instantly to identify threats."
            },
            {
              title: "Predictive Risk Mapping",
              desc: "AI models forecast ambush zones using terrain, history, and movement patterns."
            },
            {
              title: "Geo-Spatial Threat Overlays",
              desc: "Heatmaps, polygons, confidence zones overlayed on tactical maps."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-[#0E1A13] border border-white/10 rounded-xl p-8 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-white/60 mt-3">{item.desc}</p>
            </motion.div>
          ))}

        </div>
      </section>



      {/* ===================== TIMELINE / PIPELINE ===================== */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.h3
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-semibold text-green-300 mb-6"
        >
          Intelligence Pipeline
        </motion.h3>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-[#0E1525] border border-white/10 rounded-xl p-8"
        >
          <div className="h-72 flex items-center justify-center">
            <img
              src="/images/pipeline_flow.png"
              className="h-64 opacity-90"
              alt="Pipeline Flow"
            />
          </div>
        </motion.div>
      </section>



      {/* ===================== CALL TO ACTION ===================== */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-3xl font-bold text-white">Ready to deploy Rakshak?</h3>
          <p className="text-sm text-white/60 mt-2 max-w-md">
            Begin secure login to access mission data, live feeds, and AI threat analysis.
          </p>
        </div>

        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-3 rounded-md bg-green-700 hover:bg-green-600">
            Login
          </Link>

          <Link href="/signup" className="px-6 py-3 rounded-md border border-white/10 hover:bg-white/5">
            Sign Up
          </Link>
        </div>
      </section>



      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-white/10 py-6 mt-14">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-white/60">
          <span>© {new Date().getFullYear()} Rakshak • Govt of India</span>
          <span className="flex gap-4">Privacy • Terms</span>
        </div>
      </footer>

     

    </div>
  );
}
