"use client"
import { SpotlightCard } from "./spotlight-card"
import { SectionBadge } from "@/components/global-ui/section-badge"

export function HeroSection() {
  return (
    <SpotlightCard className="mx-4 sm:mx-6 lg:mt-32 xl:ml-auto xl:mr-auto max-w-7xl z-10 rounded-[40px] mt-32">
      <div className="overflow-hidden flex flex-col min-h-[850px] z-10 rounded-[40px] justify-center bg-card text-card-foreground">
        {/* Number Detail */}
        <div className="absolute top-8 right-8 z-20 pointer-events-none">
          <span className="font-mono text-sm font-bold text-gray-400 dark:text-gray-600 tracking-widest font-geist">
            EST. 2024
          </span>
        </div>

        {/* Inner Background Grid */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-grid-pattern" />

        {/* Main Hero Content */}
        <main className="z-10 container lg:px-12 grid lg:grid-cols-2 gap-16 mr-auto ml-auto pt-20 pr-6 pb-20 pl-6 relative gap-x-16 gap-y-16 items-center">
          {/* Left Column: Text */}
          <div className="max-w-2xl relative">
            <SectionBadge variant="emerald" className="mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
              Fresh Handmade Daily
            </SectionBadge>
            <h1 className="lg:text-7xl leading-[1.05] text-5xl mb-8 tracking-tighter text-foreground font-geist">
              Vietnamese Fusion &amp; <span className="text-gray-500 dark:text-gray-400 font-geist">Fresh Sushi</span>{" "}
              Experience
            </h1>

            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-10 max-w-lg font-light font-geist">
              Authentic Vietnamese flavors, vibrant wok dishes, and freshly crafted sushi — all made with heart,
              tradition, and the finest ingredients right here in Dortmund.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 gap-x-4 gap-y-4">
              {/* Main Button */}
              <button className="group flex overflow-hidden uppercase transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] focus:outline-none text-sm font-bold text-white tracking-widest font-geist rounded-full py-4 px-10 relative items-center justify-center">
                <div className="absolute inset-0 -z-20 rounded-full overflow-hidden p-[1px]">
                  <div
                    className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#10b981_360deg)]"
                    style={{ animation: "beam-spin 3s linear infinite" }}
                  />
                  <div className="absolute inset-[1px] rounded-full bg-[#151515]" />
                </div>

                <div className="-z-10 overflow-hidden bg-[#151515] rounded-full absolute top-[2px] right-[2px] bottom-[2px] left-[2px]">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
                  <div
                    className="opacity-30 mix-blend-overlay absolute top-0 right-0 bottom-0 left-0"
                    style={{
                      backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px)",
                      backgroundSize: "12px 12px",
                      animation: "dots-move 8s linear infinite",
                    }}
                  />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none transition-colors duration-500 group-hover:bg-emerald-500/30" />
                </div>

                <span className="relative z-10 text-white/90 transition-colors group-hover:text-white font-geist">
                  Reserve Now
                </span>
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
                  className="relative z-10 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M3 10h18" />
                  <path d="m9 16 2 2 4-4" />
                </svg>
              </button>

              {/* Secondary Button */}
              <button className="hover:bg-black/5 dark:hover:bg-white/5 transition-all flex text-base font-medium text-gray-700 dark:text-gray-300 bg-black/5 dark:bg-white/5 rounded-full py-4 px-8 items-center justify-center font-geist relative overflow-hidden group/btn border border-black/10 dark:border-white/10">
                <span className="text-base font-medium text-gray-800 dark:text-gray-200 tracking-tight relative z-10 font-geist">
                  View Menu
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 ml-2 opacity-70 relative z-10 group-hover/btn:scale-110 transition-transform"
                >
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              </button>
            </div>

            {/* Avatar Group */}
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                <img
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-[#151515] object-cover"
                  src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg"
                  alt="Dish"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-[#151515] object-cover"
                  src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg"
                  alt="Dish"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-[#151515] object-cover"
                  src="https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=150&auto=format&fit=crop"
                  alt="Dish"
                />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="text-gray-900 dark:text-white font-medium font-geist">Favorite in Dortmund</p>
                <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Menu Grid */}
          <div className="relative w-full flex items-center justify-center lg:justify-end">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[520px] gap-x-4 gap-y-4">
              {/* Main Menu Card */}
              <div className="sm:row-span-2 flex flex-col overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 bg-center bg-gray-100 dark:bg-[#1E1E1E] bg-[url(https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop)] bg-cover rounded-[32px] pt-6 pr-6 pb-6 pl-6 relative shadow-xl justify-between">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50/90 dark:from-black/90 via-gray-50/40 dark:via-black/40 to-transparent" />
                <div className="z-10 flex flex-col h-full relative">
                  <div className="self-start inline-flex text-xs font-bold text-amber-500 dark:text-amber-400 font-geist bg-amber-500/10 border-amber-500/20 border rounded-lg mb-8 pt-1.5 pr-3 pb-1.5 pl-3 backdrop-blur-lg gap-x-2 gap-y-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
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
                    Specialties
                  </div>

                  <div className="flex flex-col gap-6 mt-auto mb-auto gap-x-6 gap-y-6 items-center">
                    <div className="relative w-full">
                      <div className="flex bg-gradient-to-br from-white/80 dark:from-white/10 to-white/50 dark:to-white/0 rounded-xl pt-3 pr-4 pb-3 pl-4 relative shadow-lg backdrop-blur-xl gap-x-3 gap-y-3 items-center border border-black/10 dark:border-white/10">
                        <div className="w-10 h-10 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
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
                            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                            <path d="M7 2v20" />
                            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-geist">Signature Dish</div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white font-geist">
                            Bún Nem Special
                          </div>
                        </div>
                        <div className="ml-auto text-amber-500 dark:text-amber-400 font-bold text-sm">€14.50</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white tracking-tight mb-2 font-geist">
                      The Menu
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-light font-geist">
                      Discover sushi, Vietnamese noodles, wok creations, and house specials.
                    </p>
                  </div>
                </div>
              </div>

              {/* Reservations Card */}
              <div className="flex flex-col overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 bg-center text-center bg-gray-100 dark:bg-[#1E1E1E] bg-[url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop)] bg-cover rounded-[32px] pt-6 pr-6 pb-6 pl-6 relative shadow-xl items-center">
                <div className="absolute inset-0 bg-white/60 dark:bg-black/60" />
                <h3 className="relative z-10 text-base font-medium text-gray-800 dark:text-gray-200 mb-6 font-geist">
                  Reservations
                </h3>
                <div className="relative z-10 w-full flex justify-center mt-auto h-24 items-end">
                  <div className="relative w-full max-w-[140px] h-full flex items-center justify-center">
                    <div className="absolute w-20 h-px bg-black/10 dark:bg-white/10 top-1/2 left-1/2 -translate-x-1/2" />
                    <div className="flex -translate-x-12 z-10 text-gray-600 dark:text-gray-400 bg-gradient-to-br from-white/80 dark:from-white/10 to-white/50 dark:to-white/0 w-10 h-10 rounded-lg absolute shadow-lg backdrop-blur-lg items-center justify-center border border-black/10 dark:border-white/10">
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
                        className="text-gray-900 dark:text-white"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.03 12.03 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div className="flex z-10 text-gray-600 dark:text-gray-400 bg-gradient-to-br from-white/80 dark:from-white/10 to-white/50 dark:to-white/0 w-10 h-10 rounded-lg absolute shadow-lg backdrop-blur-lg translate-x-12 items-center justify-center border border-black/10 dark:border-white/10">
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
                        className="text-gray-900 dark:text-white"
                      >
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                        <path d="M8 14h.01" />
                        <path d="M12 14h.01" />
                        <path d="M16 14h.01" />
                        <path d="M8 18h.01" />
                        <path d="M12 18h.01" />
                        <path d="M16 18h.01" />
                      </svg>
                    </div>
                    <div className="absolute w-3 h-3 bg-emerald-500 rounded-full z-20 animate-[ping_2s_linear_infinite]" />
                  </div>
                </div>
              </div>

              {/* Our Space Card */}
              <div className="flex flex-col overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 text-center bg-gradient-to-br from-white/80 dark:from-white/10 to-white/50 dark:to-white/0 rounded-[32px] pt-6 pr-6 pb-6 pl-6 relative shadow-xl items-center border border-black/10 dark:border-white/10">
                <div className="absolute inset-0 bg-[url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop)] bg-cover bg-center opacity-40" />
                <h3 className="relative z-10 text-base font-medium text-gray-800 dark:text-gray-200 mb-4 font-geist">
                  Our Space
                </h3>
                <div className="z-10 flex w-full mt-auto relative justify-center">
                  <div className="flex transition-colors bg-gradient-to-br from-white/90 dark:from-black/80 to-white/70 dark:to-black/60 w-full max-w-[200px] rounded-2xl pt-2 pr-5 pb-2 pl-2 gap-x-3 gap-y-3 items-center border border-black/10 dark:border-white/10">
                    <div className="flex shrink-0 bg-gray-200 dark:bg-[#303030] w-10 h-10 border-black/10 dark:border-white/10 border rounded-lg items-center justify-center">
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
                        className="text-emerald-500"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className="text-left flex-1">
                      <div className="flex justify-between items-center w-full">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white font-geist">Burgwall 6</p>
                      </div>
                      <div className="flex justify-between items-center mt-0.5">
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-geist">Dortmund</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Ticker integrated inside the Card at bottom */}
        <div className="border-t border-black/5 dark:border-white/5 bg-gray-50 dark:bg-[#080c0a] mt-auto">
          <div
            className="overflow-hidden relative w-full py-8"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            }}
          >
            <div className="ticker-track flex gap-12 items-center">
              {[...Array(2)].map((_, setIndex) => (
                <div
                  key={setIndex}
                  className="flex gap-12 shrink-0 items-center opacity-40 hover:opacity-100 transition-all duration-500 text-emerald-700/60 dark:text-emerald-200/60"
                >
                  {[
                    "Fresh Herbs",
                    "Lemongrass",
                    "Wok-Seared",
                    "Hand-Rolled Sushi",
                    "Vietnamese Coffee",
                    "Thai Basil",
                    "Sashimi Quality",
                    "Homemade Broth",
                  ].map((text, i) => (
                    <span key={i} className="text-xl font-bold tracking-tight mx-6 font-geist">
                      {text}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  )
}
