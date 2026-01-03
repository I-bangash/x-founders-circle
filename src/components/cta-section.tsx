import { SpotlightCard } from "./spotlight-card"
import { SectionHeader } from "@/components/global-ui/section-header"

export function CTASection() {
  return (
    <SpotlightCard className="sm:mx-6 xl:ml-auto xl:mr-auto max-w-7xl rounded-[40px] mt-4 mr-3 ml-3">
      <div className="overflow-hidden flex flex-col bg-card rounded-[40px] relative">
        {/* CTA Section */}
        <div className="relative z-10 px-8 py-24 sm:py-32 flex flex-col items-center text-center max-w-4xl mx-auto">
          <SectionHeader
            badge={
              <div className="mb-0 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] transform group-hover:-translate-y-2 transition-transform duration-700 inline-block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
                  <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" />
                  <path d="m2.1 21.8 6.4-6.3" />
                  <path d="m19 5-7 7" />
                </svg>
              </div>
            }
            title={
              <>
                Experience authentic{" "}
                <span className="text-gray-500 dark:text-gray-400 font-geist">Vietnamese hospitality.</span>
              </>
            }
            description="Visit us in the heart of Dortmund. Warm dishes, cold drinks, and good vibes await you at HA NOI QUAN."
            className="mb-10 max-w-none"
            titleClassName="text-4xl sm:text-6xl"
          />

          <button className="group/btn relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-black dark:bg-white px-8 font-geist font-medium text-white dark:text-black transition-all duration-300 hover:bg-gray-800 dark:hover:bg-gray-100 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <span className="mr-2 relative z-10 font-geist">Book a Table</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M17.47 15.53a.75.75 0 0 0 1.28-.53V6a.75.75 0 0 0-.75-.75H9a.75.75 0 0 0-.53 1.28z"
                clipRule="evenodd"
              />
              <path fill="currentColor" d="M5.47 17.47a.75.75 0 1 0 1.06 1.06l6.97-6.97l-1.06-1.06z" opacity=".5" />
            </svg>
          </button>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-black/5 dark:via-white/5 to-transparent" />

        {/* Footer Section */}
        <div
          id="hours"
          className="relative z-10 bg-gray-100/50 dark:bg-[#060807]/50 px-8 sm:px-12 py-16 lg:py-20 backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-4 flex flex-col items-start">
              <div className="flex items-center gap-2 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-500"
                >
                  <path d="M12 10a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h.5a2.5 2.5 0 0 1 2.5 2.5V19a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2v-4.5" />
                  <path d="M12 2a8 8 0 0 1 8 7v2.5" />
                  <path d="M12 2a8 8 0 0 0-8 7v2.5" />
                </svg>
                <span className="text-xl font-semibold tracking-tight text-foreground font-geist uppercase">
                  HA NOI QUAN
                </span>
              </div>
              <h3 className="text-2xl tracking-tight text-foreground mb-8 max-w-xs leading-tight font-geist">
                Authentic Vietnamese &amp; Sushi Fusion in Dortmund.
              </h3>
              <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400 font-geist">
                <p className="flex items-center gap-2">
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
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Burgwall 6, 44135 Dortmund
                </p>
                <p className="flex items-center gap-2">
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
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.03 12.03 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  +49 171 247 413 72
                </p>
              </div>
            </div>

            {/* Navigation Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 lg:pl-12">
              {/* Opening Hours */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-foreground mb-2 font-geist">Opening Hours</h4>
                <span className="text-sm text-gray-600 dark:text-gray-500 font-geist">Tue - Sat: 12:00 - 22:00</span>
                <span className="text-sm text-gray-600 dark:text-gray-500 font-geist">
                  Sun &amp; Holidays: 12:00 - 21:30
                </span>
                <span className="text-sm text-red-500 dark:text-red-400 font-geist">Monday: Closed</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-xs text-gray-600 font-geist">© 2025 HA NOI QUAN. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-gray-600 font-geist">Authentic Vietnamese Cuisine</span>
            </div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  )
}
