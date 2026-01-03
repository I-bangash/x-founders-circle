import { SpotlightCard } from "./spotlight-card"
import { SectionHeader } from "@/components/global-ui/section-header"

export function ProcessSection() {
  return (
    <SpotlightCard className="sm:mx-6 xl:ml-auto xl:mr-auto max-w-7xl rounded-[40px] mt-4 mr-3 ml-3">
      <div className="sm:p-12 lg:p-16 overflow-hidden bg-card rounded-[40px] pt-8 pr-8 pb-8 pl-8 relative">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

        <div className="absolute top-8 right-8 z-20 pointer-events-none opacity-50">
          <span className="font-mono text-sm font-bold text-gray-400 dark:text-gray-600 tracking-widest font-geist">
            04
          </span>
        </div>

        <div className="grid lg:grid-cols-2 lg:gap-24 z-10 relative gap-x-12 gap-y-12 items-center">

          {/* Left Column: Content */}
          <div className="order-2 lg:order-1">
            <SectionHeader
              title={
                <>
                  The Essence of <span className="text-emerald-600 dark:text-emerald-500 font-geist">Hanoi</span>
                </>
              }
              description="We bring together the four pillars of Vietnamese cuisine: Fresh Greens, Ocean Seafood, Wok Fire, and Family Tradition."
              align="left"
              titleClassName="text-3xl sm:text-4xl lg:text-5xl leading-[1.1]"
              className="mb-8 mx-0 max-w-none"
            />

            <p className="text-gray-500 text-base leading-relaxed max-w-md mb-8 font-geist">
              Our Bánh Mì Chảo sizzles with savory beef and eggs, while our sushi rolls are crafted with delicate
              precision. Every dish is a balance of sweet, sour, salty, and spicy.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button className="px-5 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center gap-2 font-geist">
                Taste It
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
              <div className="text-sm text-gray-500 flex items-center gap-2 font-geist">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Cooked to Order
              </div>
            </div>
          </div>

          {/* Right Column: Visual Diagram */}
          <div className="order-1 lg:order-2 relative w-full flex flex-col items-center select-none pointer-events-none">
            {/* Diagram Header Labels */}
            <div className="w-full flex justify-between text-xs uppercase tracking-widest text-gray-400 dark:text-gray-600 font-bold font-mono mb-2 px-12 opacity-50 max-w-[400px]">
              <span className="font-geist">Ingredients</span>
              <span className="font-geist">The Kitchen</span>
            </div>

            {/* Icons Row (Sources) */}
            <div className="relative z-10 flex justify-center w-full max-w-[400px] mb-8 gap-8">
              {/* Icon 1 - Sprout (Emerald) */}
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#151515] border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)] z-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 20h10" />
                  <path d="M10 20c5.5-2.5.8-6.4 3-10" />
                  <path d="M9.5 9.4c1.1.9 4 2.2 4.9 3" />
                  <path d="M5.5 9.4c1.1.9 4 2.2 4.9 3" />
                </svg>
              </div>
              {/* Icon 2 - Fish (Blue) */}
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#151515] border border-blue-500/30 flex items-center justify-center text-blue-500 dark:text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] z-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6.5 12c.94-2.08 2.55-3 5-3 3.72 0 5.68 1.76 9 2.69 2.57-1.95 3.03-5.04 1.5-7.69-3.25 1.5-5.96 4.45-8 4.45-1.95 0-3.35-1-4.5-2.5C8.03 3.86 6.3 3 4.5 3 2.15 3 1 5 1 8c0 3 1.95 5.5 4 8 1.35 1.65 3.5 2.5 5.5 2.5 3.72 0 6.6-2.5 9-6.5-1.17 3.32-3.13 6.64-5.5 8.16-2.52 1.62-5.71 1.34-8-1.5C3.3 16.5 2.5 13.5 3 10.5" />
                </svg>
              </div>
              {/* Icon 3 - Beef (Red) */}
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#151515] border border-red-500/30 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)] z-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12.5" cy="8.5" r="2.5" />
                  <path d="M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 6.64 3.17 9.17l-.15.46a2 2 0 0 0 3.8 1.25l.44-1.34a6.45 6.45 0 0 0 3.33-1.07c2.97-1.85 3.73-5.54 2.85-8.87A6.5 6.5 0 0 0 12.5 2Z" />
                </svg>
              </div>
              {/* Icon 4 - Flame (Amber) */}
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#151515] border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)] z-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.243-2.143.5-3.5a6 6 0 1 0 6 6Z" />
                </svg>
              </div>
            </div>

            {/* Animated Connection Diagram */}
            <div className="relative w-full max-w-[400px] flex flex-col items-center">
              {/* Vertical Flow Lines SVG */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background Lines connecting sources to main flow */}
                  {/* Line 1 - Sprout */}
                  <path
                    d="M92 0 V40 C92 60 200 60 200 80 V100"
                    stroke="currentColor"
                    strokeOpacity="0.1"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="text-gray-400 dark:text-white"
                  />
                  {/* Line 2 - Fish */}
                  <path
                    d="M164 0 V40 C164 60 200 60 200 80 V100"
                    stroke="currentColor"
                    strokeOpacity="0.1"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="text-gray-400 dark:text-white"
                  />
                  {/* Line 3 - Beef */}
                  <path
                    d="M236 0 V40 C236 60 200 60 200 80 V100"
                    stroke="currentColor"
                    strokeOpacity="0.1"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="text-gray-400 dark:text-white"
                  />
                  {/* Line 4 - Flame */}
                  <path
                    d="M308 0 V40 C308 60 200 60 200 80 V100"
                    stroke="currentColor"
                    strokeOpacity="0.1"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="text-gray-400 dark:text-white"
                  />

                  {/* Animated Pulses */}
                  {/* Line 1 - Sprout (Green) */}
                  <path
                    d="M92 0 V40 C92 60 200 60 200 80 V100"
                    stroke="url(#grad_green)"
                    strokeWidth="2"
                    strokeDasharray="10 100"
                    className="animate-dash"
                  />
                  {/* Line 2 - Fish (Blue) */}
                  <path
                    d="M164 0 V40 C164 60 200 60 200 80 V100"
                    stroke="url(#grad_blue)"
                    strokeWidth="2"
                    strokeDasharray="10 100"
                    className="animate-dash"
                    style={{ animationDelay: "0.5s" }}
                  />
                  {/* Line 3 - Beef (Red) */}
                  <path
                    d="M236 0 V40 C236 60 200 60 200 80 V100"
                    stroke="url(#grad_red)"
                    strokeWidth="2"
                    strokeDasharray="10 100"
                    className="animate-dash"
                    style={{ animationDelay: "1s" }}
                  />
                  {/* Line 4 - Flame (Amber) */}
                  <path
                    d="M308 0 V40 C308 60 200 60 200 80 V100"
                    stroke="url(#grad_amber)"
                    strokeWidth="2"
                    strokeDasharray="10 100"
                    className="animate-dash"
                    style={{ animationDelay: "1.5s" }}
                  />

                  {/* Line from Kitchen to Plate */}
                  <path
                    d="M200 180 V220"
                    stroke="currentColor"
                    strokeOpacity="0.1"
                    strokeWidth="2"
                    className="text-gray-400 dark:text-white"
                  />

                  <defs>
                    <linearGradient id="grad_green" x1="92" y1="0" x2="200" y2="100" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#10b981" stopOpacity="0.8" />
                      <stop offset="1" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="grad_blue" x1="164" y1="0" x2="200" y2="100" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3b82f6" stopOpacity="0.8" />
                      <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="grad_red" x1="236" y1="0" x2="200" y2="100" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ef4444" stopOpacity="0.8" />
                      <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="grad_amber" x1="308" y1="0" x2="200" y2="100" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#f59e0b" stopOpacity="0.8" />
                      <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Node 1: The Kitchen Trigger */}
              <div className="relative z-10 mt-[80px] w-64 bg-gray-100 dark:bg-[#1E1E1E] rounded-2xl p-4 border border-amber-500/50 shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                        <line x1="6" x2="18" y1="17" y2="17" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider font-geist">
                        Preparation
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-geist">Wok &amp; Grill</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                </div>

                {/* Recipe Details Preview */}
                <div className="bg-white dark:bg-[#111] rounded-lg p-3 font-mono text-[10px] text-gray-500 leading-relaxed border border-black/5 dark:border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1">
                    <span className="text-[8px] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1 rounded font-geist">
                      RECIPE
                    </span>
                  </div>
                  <p className="font-geist">
                    <span className="text-purple-600 dark:text-purple-400 font-geist">"dish"</span>:{" "}
                    <span className="text-green-600 dark:text-green-400 font-geist">"Xào Sả Ớt"</span>,
                  </p>
                  <p className="font-geist">
                    <span className="text-purple-600 dark:text-purple-400 font-geist">"spice"</span>:{" "}
                    <span className="text-green-600 dark:text-green-400 font-geist">"High"</span>,
                  </p>
                  <p className="font-geist">
                    <span className="text-purple-600 dark:text-purple-400 font-geist">"serve"</span>:{" "}
                    <span className="text-blue-600 dark:text-blue-400 font-geist">"Hot"</span>
                  </p>
                </div>
              </div>

              {/* Connection Bead */}
              <div className="w-1 h-8 bg-gradient-to-b from-amber-500/50 to-transparent w-px my-0" />

              {/* Node 2: The Plate */}
              <div className="relative z-10 w-64 bg-gray-100 dark:bg-[#1E1E1E] rounded-2xl p-4 border border-black/5 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-emerald-600 dark:bg-emerald-700 flex items-center justify-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
                      <path d="M7 21h10" />
                      <path d="M19.5 12 22 6" />
                      <path d="M16.25 12 14.25 2" />
                      <path d="M5 2 3 6" />
                      <path d="M9.5 2 7.5 12" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-geist">
                      Service
                    </div>
                    <div className="text-sm text-gray-900 dark:text-gray-200 font-geist">Ready to Enjoy</div>
                  </div>
                  <div className="ml-auto opacity-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      className="text-emerald-500"
                    >
                      <path
                        fill="currentColor"
                        d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10"
                        opacity=".5"
                      />
                      <path
                        fill="currentColor"
                        d="M16.03 8.97a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.47l2.235-2.235L14.97 8.97a.75.75 0 0 1 1.06 0"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  )
}
