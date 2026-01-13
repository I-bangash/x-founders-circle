import { SectionHeader } from "@/components/global-ui/section-header";

import { SpotlightCard } from "./spotlight-card";

export function CTASection() {
  return (
    <SpotlightCard className="mt-4 mr-3 ml-3 max-w-7xl rounded-[40px] sm:mx-6 xl:mr-auto xl:ml-auto">
      <div className="bg-card relative flex flex-col overflow-hidden rounded-[40px]">
        {/* CTA Section */}
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-8 py-24 text-center sm:py-32">
          <SectionHeader
            badge={
              <div className="mb-0 inline-block transform rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] transition-transform duration-700 group-hover:-translate-y-2 dark:text-emerald-400">
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
                  <path d="M12 2a8 8 0 0 0-8 7v2.5" />
                  <path d="M4 12v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3" />
                </svg>
              </div>
            }
            title={
              <>
                Stop rebuilding the same foundation.{" "}
                <span className="font-geist text-gray-500 dark:text-gray-400">
                  Start building something people remember.
                </span>
              </>
            }
            description="Join 100+ founders who stopped wasting time on setup and started shipping their vision."
            className="mb-10 max-w-none"
            titleClassName="text-4xl sm:text-6xl"
          />

          <button className="group/btn font-geist relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-black px-8 font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-gray-800 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] dark:bg-white dark:text-black dark:hover:bg-gray-100 dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <span className="font-geist relative z-10 mr-2">
              Get Remarkable — $149
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M17.47 15.53a.75.75 0 0 0 1.28-.53V6a.75.75 0 0 0-.75-.75H9a.75.75 0 0 0-.53 1.28z"
                clipRule="evenodd"
              />
              <path
                fill="currentColor"
                d="M5.47 17.47a.75.75 0 1 0 1.06 1.06l6.97-6.97l-1.06-1.06z"
                opacity=".5"
              />
            </svg>
          </button>
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/5 to-transparent dark:via-white/5" />

        {/* Footer Section */}
        <div
          id="hours"
          className="relative z-10 bg-gray-100/50 px-8 py-16 backdrop-blur-sm sm:px-12 lg:py-20 dark:bg-[#060807]/50"
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Brand Column */}
            <div className="flex flex-col items-start lg:col-span-4">
              <div className="mb-6 flex items-center gap-2">
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
                <span className="text-foreground font-geist text-xl font-semibold tracking-tight uppercase">
                  REMARKABLE
                </span>
              </div>
              <h3 className="text-foreground font-geist mb-8 max-w-xs text-2xl leading-tight tracking-tight">
                The modern Next.js starter kit for founders.
              </h3>
              <div className="font-geist flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
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
                  hello@remarkable.sh
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
                  Twitter
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
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  GitHub
                </p>
              </div>
            </div>

            {/* Navigation Columns */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8 lg:pl-12">
              {/* Product */}
              <div className="flex flex-col gap-4">
                <h4 className="text-foreground font-geist mb-2 text-sm font-semibold">
                  Product
                </h4>
                <a
                  href="#features"
                  className="font-geist text-sm text-gray-600 transition-colors hover:text-emerald-500 dark:text-gray-500"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="font-geist text-sm text-gray-600 transition-colors hover:text-emerald-500 dark:text-gray-500"
                >
                  Pricing
                </a>
                <a
                  href="#docs"
                  className="font-geist text-sm text-gray-600 transition-colors hover:text-emerald-500 dark:text-gray-500"
                >
                  Documentation
                </a>
              </div>
              {/* Legal */}
              <div className="flex flex-col gap-4">
                <h4 className="text-foreground font-geist mb-2 text-sm font-semibold">
                  Legal
                </h4>
                <a
                  href="#"
                  className="font-geist text-sm text-gray-600 transition-colors hover:text-emerald-500 dark:text-gray-500"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="font-geist text-sm text-gray-600 transition-colors hover:text-emerald-500 dark:text-gray-500"
                >
                  Terms
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-black/5 pt-8 sm:flex-row dark:border-white/5">
            <p className="font-geist text-xs text-gray-600">
              © {new Date().getFullYear()} Remarkable. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="font-geist text-xs text-gray-600 italic">
                Ship something people remember.
              </span>
            </div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
