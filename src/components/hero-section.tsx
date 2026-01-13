"use client";

import { SectionBadge } from "@/components/global-ui/section-badge";

import { SpotlightCard } from "./spotlight-card";

export function HeroSection() {
  return (
    <SpotlightCard className="z-10 mx-4 mt-32 max-w-7xl rounded-[40px] sm:mx-6 lg:mt-32 xl:mr-auto xl:ml-auto">
      <div className="bg-card text-card-foreground z-10 flex min-h-[850px] flex-col justify-center overflow-hidden rounded-[40px]">
        {/* Number Detail */}
        <div className="pointer-events-none absolute top-8 right-8 z-20">
          <span className="font-geist font-mono text-sm font-bold tracking-widest text-gray-400 dark:text-gray-600">
            BUILT IN 2025
          </span>
        </div>

        {/* Inner Background Grid */}
        <div className="bg-grid-pattern pointer-events-none absolute inset-0 z-0 opacity-20" />

        {/* Main Hero Content */}
        <main className="relative z-10 container mr-auto ml-auto grid items-center gap-16 gap-x-16 gap-y-16 pt-20 pr-6 pb-20 pl-6 lg:grid-cols-2 lg:px-12">
          {/* Left Column: Text */}
          <div className="relative max-w-2xl">
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
              Built by a founder who got tired of the setup grind
            </SectionBadge>
            <h1 className="text-foreground font-geist mb-8 text-5xl leading-[1.05] tracking-tighter lg:text-7xl">
              From idea to first $ in a{" "}
              <span className="font-geist text-gray-500 dark:text-gray-400">
                weekend
              </span>
            </h1>

            <p className="font-geist mb-10 max-w-lg text-lg leading-relaxed font-light text-gray-600 dark:text-gray-400">
              Build and launch apps that look like you hired a designer. Not
              another AI template that screams "I used AI." Ship something
              people actually remember.
            </p>

            <div className="flex flex-col gap-4 gap-x-4 gap-y-4 sm:flex-row">
              {/* Main Button */}
              <button className="group font-geist relative flex items-center justify-center overflow-hidden rounded-full px-10 py-4 text-sm font-bold tracking-widest text-white uppercase transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] focus:outline-none">
                <div className="absolute inset-0 -z-20 overflow-hidden rounded-full p-[1px]">
                  <div
                    className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#10b981_360deg)]"
                    style={{ animation: "beam-spin 3s linear infinite" }}
                  />
                  <div className="absolute inset-[1px] rounded-full bg-[#151515]" />
                </div>

                <div className="absolute top-[2px] right-[2px] bottom-[2px] left-[2px] -z-10 overflow-hidden rounded-full bg-[#151515]">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
                  <div
                    className="absolute top-0 right-0 bottom-0 left-0 opacity-30 mix-blend-overlay"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px)",
                      backgroundSize: "12px 12px",
                      animation: "dots-move 8s linear infinite",
                    }}
                  />
                  <div className="pointer-events-none absolute bottom-0 left-1/2 h-1/2 w-2/3 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-2xl transition-colors duration-500 group-hover:bg-emerald-500/30" />
                </div>

                <span className="font-geist relative z-10 text-white/90 transition-colors group-hover:text-white">
                  Get Remarkable — $149
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
              <button className="font-geist group/btn relative flex items-center justify-center overflow-hidden rounded-full border border-black/10 bg-black/5 px-8 py-4 text-base font-medium text-gray-700 transition-all hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/5">
                <span className="font-geist relative z-10 text-base font-medium tracking-tight text-gray-800 dark:text-gray-200">
                  See what's included
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
                  className="relative z-10 ml-2 h-4 w-4 opacity-70 transition-transform group-hover/btn:scale-110"
                >
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              </button>
            </div>

            {/* Avatar Group */}
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                <img
                  className="h-10 w-10 rounded-full border-2 border-white object-cover dark:border-[#151515]"
                  src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg"
                  alt="Dish"
                />
                <img
                  className="h-10 w-10 rounded-full border-2 border-white object-cover dark:border-[#151515]"
                  src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg"
                  alt="Dish"
                />
                <img
                  className="h-10 w-10 rounded-full border-2 border-white object-cover dark:border-[#151515]"
                  src="https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=150&auto=format&fit=crop"
                  alt="Dish"
                />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-geist font-medium text-gray-900 dark:text-white">
                  One-time payment • Instant access • Build unlimited projects
                </p>
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
          <div className="relative flex w-full items-center justify-center lg:justify-end">
            <div className="grid w-full max-w-[520px] grid-cols-1 gap-4 gap-x-4 gap-y-4 sm:grid-cols-2">
              {/* Main Menu Card */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-gray-100 bg-[url(https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop)] bg-cover bg-center pt-6 pr-6 pb-6 pl-6 shadow-xl transition-all duration-500 hover:border-emerald-500/30 sm:row-span-2 dark:bg-[#1E1E1E]">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50/90 via-gray-50/40 to-transparent dark:from-black/90 dark:via-black/40" />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="font-geist mb-8 inline-flex items-center gap-x-2 gap-y-2 self-start rounded-lg border border-amber-500/20 bg-amber-500/10 pt-1.5 pr-3 pb-1.5 pl-3 text-xs font-bold text-amber-500 backdrop-blur-lg dark:text-amber-400">
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
                    Tech Stack
                  </div>

                  <div className="mt-auto mb-auto flex flex-col items-center gap-6 gap-x-6 gap-y-6">
                    <div className="relative w-full">
                      <div className="relative flex items-center gap-x-3 gap-y-3 rounded-xl border border-black/10 bg-gradient-to-br from-white/80 to-white/50 pt-3 pr-4 pb-3 pl-4 shadow-lg backdrop-blur-xl dark:border-white/10 dark:from-white/10 dark:to-white/0">
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
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
                          <div className="font-geist text-xs text-gray-600 dark:text-gray-400">
                            Latest Release
                          </div>
                          <div className="font-geist text-sm font-semibold text-gray-900 dark:text-white">
                            Next.js 16 Starter
                          </div>
                        </div>
                        <div className="ml-auto text-sm font-bold text-amber-500 dark:text-amber-400">
                          v1.2
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-geist mb-2 text-lg font-medium tracking-tight text-gray-900 dark:text-white">
                      The Codebase
                    </h3>
                    <p className="font-geist text-sm leading-relaxed font-light text-gray-600 dark:text-gray-400">
                      Built with Next.js 16, Tailwind 4, TypeScript, and
                      pre-configured integrations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Reservations Card */}
              <div className="group relative flex flex-col items-center overflow-hidden rounded-[32px] bg-gray-100 bg-[url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop)] bg-cover bg-center pt-6 pr-6 pb-6 pl-6 text-center shadow-xl transition-all duration-500 hover:border-emerald-500/30 dark:bg-[#1E1E1E]">
                <div className="absolute inset-0 bg-white/60 dark:bg-black/60" />
                <h3 className="font-geist relative z-10 mb-6 text-base font-medium text-gray-800 dark:text-gray-200">
                  Documentation
                </h3>
                <div className="relative z-10 mt-auto flex h-24 w-full items-end justify-center">
                  <div className="relative flex h-full w-full max-w-[140px] items-center justify-center">
                    <div className="absolute top-1/2 left-1/2 h-px w-20 -translate-x-1/2 bg-black/10 dark:bg-white/10" />
                    <div className="absolute z-10 flex h-10 w-10 -translate-x-12 items-center justify-center rounded-lg border border-black/10 bg-gradient-to-br from-white/80 to-white/50 text-gray-600 shadow-lg backdrop-blur-lg dark:border-white/10 dark:from-white/10 dark:to-white/0 dark:text-gray-400">
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
                    <div className="absolute z-10 flex h-10 w-10 translate-x-12 items-center justify-center rounded-lg border border-black/10 bg-gradient-to-br from-white/80 to-white/50 text-gray-600 shadow-lg backdrop-blur-lg dark:border-white/10 dark:from-white/10 dark:to-white/0 dark:text-gray-400">
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
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="4"
                          rx="2"
                          ry="2"
                        />
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
                    <div className="absolute z-20 h-3 w-3 animate-[ping_2s_linear_infinite] rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Our Space Card */}
              <div className="group relative flex flex-col items-center overflow-hidden rounded-[32px] border border-black/10 bg-gradient-to-br from-white/80 to-white/50 pt-6 pr-6 pb-6 pl-6 text-center shadow-xl transition-all duration-500 hover:border-emerald-500/30 dark:border-white/10 dark:from-white/10 dark:to-white/0">
                <div className="absolute inset-0 bg-[url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop)] bg-cover bg-center opacity-40" />
                <h3 className="font-geist relative z-10 mb-4 text-base font-medium text-gray-800 dark:text-gray-200">
                  Our Space
                </h3>
                <div className="relative z-10 mt-auto flex w-full justify-center">
                  <div className="flex w-full max-w-[200px] items-center gap-x-3 gap-y-3 rounded-2xl border border-black/10 bg-gradient-to-br from-white/90 to-white/70 pt-2 pr-5 pb-2 pl-2 transition-colors dark:border-white/10 dark:from-black/80 dark:to-black/60">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-gray-200 dark:border-white/10 dark:bg-[#303030]">
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
                    <div className="flex-1 text-left">
                      <div className="flex w-full items-center justify-between">
                        <p className="font-geist text-sm font-semibold text-gray-900 dark:text-white">
                          Build Anything
                        </p>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between">
                        <p className="font-geist text-xs text-gray-600 dark:text-gray-400">
                          Unlimited Projects
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Ticker integrated inside the Card at bottom */}
        <div className="mt-auto border-t border-black/5 bg-gray-50 dark:border-white/5 dark:bg-[#080c0a]">
          <div
            className="relative w-full overflow-hidden py-8"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            }}
          >
            <div className="ticker-track flex items-center gap-12">
              {[...Array(2)].map((_, setIndex) => (
                <div
                  key={setIndex}
                  className="flex shrink-0 items-center gap-12 text-emerald-700/60 opacity-40 transition-all duration-500 hover:opacity-100 dark:text-emerald-200/60"
                >
                  {[
                    "Next.js 16",
                    "Tailwind 4",
                    "Clerk Auth",
                    "Stripe Payments",
                    "Convex Database",
                    "Resend Email",
                    "Arcjet Security",
                    "PostHog Analytics",
                  ].map((text, i) => (
                    <span
                      key={i}
                      className="font-geist mx-6 text-xl font-bold tracking-tight"
                    >
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
  );
}
