import { CategoryHeader } from "@/components/shared/category-header";
import { SectionBadge } from "@/components/shared/section-badge";
import { SectionHeader } from "@/components/shared/section-header";

import { SpotlightCard } from "./spotlight-card";

export function MenuSection() {
  return (
    <SpotlightCard className="z-10 mx-4 max-w-7xl rounded-[40px] sm:mx-6 lg:mt-4 xl:mr-auto xl:ml-auto">
      <div className="relative flex flex-col overflow-hidden rounded-[40px]">
        {/* Floating Nav (Sticky) */}
        <div className="bg-card/80 sticky top-0 z-40 w-full border-b border-black/5 px-6 pt-4 pb-4 backdrop-blur-xl sm:px-12 dark:border-white/5">
          <div className="hide-scrollbar flex snap-x items-center gap-3 overflow-x-auto">
            <a
              href="#get-started"
              className="font-geist shrink-0 snap-start rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600 transition-all hover:bg-emerald-500/20 dark:text-emerald-400"
            >
              Get Started
            </a>
            <a
              href="#get-paid"
              className="font-geist shrink-0 snap-start rounded-full border border-black/5 bg-black/5 px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:border-amber-500/30 hover:text-amber-500 dark:border-white/5 dark:bg-white/5 dark:text-gray-400 dark:hover:text-amber-400"
            >
              Get Paid
            </a>
            <a
              href="#get-growing"
              className="font-geist shrink-0 snap-start rounded-full border border-black/5 bg-black/5 px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:border-blue-500/30 hover:text-blue-500 dark:border-white/5 dark:bg-white/5 dark:text-gray-400 dark:hover:text-blue-400"
            >
              Get Growing
            </a>
            <a
              href="#make-it-yours"
              className="font-geist shrink-0 snap-start rounded-full border border-black/5 bg-black/5 px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:border-orange-500/30 hover:text-orange-500 dark:border-white/5 dark:bg-white/5 dark:text-gray-400 dark:hover:text-orange-400"
            >
              Make It Yours
            </a>
            <a
              href="#production-ready"
              className="font-geist shrink-0 snap-start rounded-full border border-black/5 bg-black/5 px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:border-black/20 hover:text-gray-900 dark:border-white/5 dark:bg-white/5 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-white"
            >
              Production Ready
            </a>
          </div>
        </div>

        {/* Header Banner */}
        <div className="relative border-b border-black/5 px-6 py-16 text-center sm:px-12 sm:py-24 dark:border-white/5">
          <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          <SectionHeader
            className="mb-0"
            badge={
              <SectionBadge
                variant="orange"
                className="shadow-[0_0_20px_-5px_rgba(249,115,22,0.3)]"
              >
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                The complete stack for shipping fast
              </SectionBadge>
            }
            title={
              <>
                Everything you need to{" "}
                <span className="font-geist text-gray-500">ship fast.</span>
              </>
            }
            description="Remarable handles the boring stuff so you can focus on what makes your app different."
          />
        </div>

        <div className="space-y-24 p-6 sm:p-12">
          {/* Category 1: Get Started */}
          <div id="get-started" className="scroll-mt-32">
            <CategoryHeader
              title="Get Started"
              subtitle="Authentication & Users"
              titleClassName="text-emerald-600 dark:text-emerald-400"
              gradientClassName="from-emerald-100/30 dark:from-emerald-900/10"
              iconClassName="text-emerald-500/50"
              icon={
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
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              }
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                {
                  name: "Clerk Integration",
                  price: "Included",
                  description:
                    "OAuth, magic links, 2FA, and user management pre-configured.",
                  badge: "Auth",
                  badgeColor: "emerald",
                },
                {
                  name: "Role-Based Access",
                  price: "Included",
                  description:
                    "Define user roles and restrict access to specific routes and API endpoints.",
                  badge: "Security",
                  badgeColor: "blue",
                },
                {
                  name: "User Profiles",
                  price: "Included",
                  description:
                    "Custom metadata, avatar handling, and profile sync across services.",
                  badge: "Feature",
                  badgeColor: "gray",
                },
                {
                  name: "Onboarding Flows",
                  price: "Included",
                  description:
                    "Guide new users through setup with pre-built multi-step forms.",
                  badge: "UX",
                  badgeColor: "gray",
                },
              ].map((dish, index) => (
                <div
                  key={index}
                  className="group relative rounded-2xl border border-black/5 bg-black/[0.02] p-6 transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/[0.05] dark:border-white/5 dark:bg-white/[0.02] dark:hover:bg-emerald-500/[0.02]"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="font-geist text-lg font-medium text-gray-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-300">
                      {dish.name}
                    </h4>
                    <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      {dish.price}
                    </span>
                  </div>
                  <p className="mb-4 text-sm font-light text-gray-600 dark:text-gray-400">
                    {dish.description}
                  </p>
                  <div className="flex gap-2">
                    <span
                      className={`rounded border px-2 py-0.5 text-[10px] tracking-wider uppercase ${
                        dish.badgeColor === "emerald"
                          ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                          : dish.badgeColor === "blue"
                            ? "border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400"
                            : "border-black/10 text-gray-600 dark:border-white/10 dark:text-gray-400"
                      } flex items-center gap-1`}
                    >
                      {dish.badgeColor === "emerald" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      )}
                      {dish.badgeColor === "blue" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6.5 12c.94-2.08 2.55-3 5-3 3.72 0 5.68 1.76 9 2.69 2.57-1.95 3.03-5.04 1.5-7.69-3.25 1.5-5.96 4.45-8 4.45-1.95 0-3.35-1-4.5-2.5C8.03 3.86 6.3 3 4.5 3 2.15 3 1 5 1 8c0 3 1.95 5.5 4 8 1.35 1.65 3.5 2.5 5.5 2.5 3.72 0 6.6-2.5 9-6.5-1.17 3.32-3.13 6.64-5.5 8.16-2.52 1.62-5.71 1.34-8-1.5C3.3 16.5 2.5 13.5 3 10.5" />
                        </svg>
                      )}
                      {dish.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category 2: Get Paid */}
          <div id="get-paid" className="scroll-mt-32">
            <div className="group relative w-full overflow-hidden rounded-3xl border border-amber-500/20">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30 transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent dark:from-black dark:via-[#0a0f0c]/90" />

              <div className="relative z-10 flex flex-col items-center gap-12 p-8 sm:p-12 md:flex-row">
                <div className="flex-1">
                  <div className="font-geist mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1 text-xs font-bold tracking-widest text-amber-500 uppercase dark:text-amber-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                    Stripe Integration
                  </div>
                  <h3 className="font-geist mb-4 text-3xl tracking-tighter text-white sm:text-5xl">
                    Get Paid on Day One
                  </h3>
                  <p className="mb-8 max-w-md text-lg font-light text-gray-300">
                    Pre-configured for both one-time payments and subscriptions.
                    Tested webhooks and ready-to-use checkout flows.
                  </p>

                  <div className="space-y-4">
                    {[
                      { name: "Subscription Logic", price: "Ready" },
                      { name: "One-Time Purchases", price: "Ready" },
                      { name: "Customer Portal", price: "Ready" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b border-white/10 pb-2"
                      >
                        <span className="font-geist font-medium text-white">
                          {item.name}
                        </span>
                        <span className="font-mono text-lg text-amber-400">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Element */}
                <div className="flex justify-center md:w-1/3">
                  <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-amber-500/20 bg-black/50 backdrop-blur-sm transition-colors group-hover:border-amber-500/50">
                    <span className="text-center">
                      <span className="mb-1 block text-4xl">💰</span>
                      <span className="text-xs font-bold tracking-widest text-amber-500 uppercase">
                        Revenue Ready
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category 3: Get Growing */}
          <div id="get-growing" className="scroll-mt-32">
            <CategoryHeader
              title="Get Growing"
              subtitle="Database & Real-time"
              titleClassName="text-blue-600 dark:text-blue-400"
              gradientClassName="from-blue-100/30 dark:from-blue-900/10"
              iconClassName="text-blue-500/50"
              icon={
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
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              }
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                {
                  name: "Convex Database",
                  price: "Included",
                  description:
                    "Real-time updates, serverless functions, and type-safe queries.",
                  badge: "Real-time",
                  badgeColor: "blue",
                },
                {
                  name: "Resend Integration",
                  price: "Included",
                  description:
                    "Transactional emails, welcome sequences, and notification templates.",
                  badge: "Email",
                  badgeColor: "red",
                },
                {
                  name: "SEO Optimization",
                  price: "Included",
                  description:
                    "Proper metadata, sitemaps, and robots.txt pre-configured.",
                  badge: "Growing",
                  badgeColor: "gray",
                },
                {
                  name: "Background Jobs",
                  price: "Included",
                  description:
                    "Handle long-running tasks asynchronously with Convex functions.",
                  badge: "Core",
                  badgeColor: "blue",
                },
              ].map((dish, index) => (
                <div
                  key={index}
                  className="group relative rounded-2xl border border-black/5 bg-black/[0.02] p-6 transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-500/[0.05] dark:border-white/5 dark:bg-white/[0.02] dark:hover:bg-blue-500/[0.02]"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="font-geist text-lg font-medium text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-300">
                      {dish.name}
                    </h4>
                    <span className="font-mono font-medium text-blue-600 dark:text-blue-400">
                      {dish.price}
                    </span>
                  </div>
                  <p className="mb-4 text-sm font-light text-gray-600 dark:text-gray-400">
                    {dish.description}
                  </p>
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] tracking-wider uppercase ${
                      dish.badgeColor === "blue"
                        ? "border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400"
                        : dish.badgeColor === "red"
                          ? "border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400"
                          : "border-black/10 text-gray-600 dark:border-white/10 dark:text-gray-400"
                    }`}
                  >
                    {dish.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category 4: Make It Yours */}
          <div id="make-it-yours" className="scroll-mt-32">
            <CategoryHeader
              title="Make It Yours"
              subtitle="Design & UI"
              titleClassName="text-orange-600 dark:text-orange-400"
              gradientClassName="from-orange-100/30 dark:from-orange-900/10"
              iconClassName="text-orange-500/50"
              icon={
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
                >
                  <path d="M12 19l7-7 3 3-7 7-3-3z" />
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                  <path d="m2 2 5 5" />
                  <path d="m11 11 5 5" />
                </svg>
              }
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  name: "shadcn/ui",
                  price: "600+",
                  description:
                    "High-quality, customizable components ready for use.",
                  badge: "Components",
                  badgeColor: "red",
                },
                {
                  name: "Tailwind 4",
                  price: "Latest",
                  description:
                    "Modern, utility-first CSS pre-configured with a coherent design system.",
                  badge: "Styling",
                  badgeColor: "green",
                },
                {
                  name: "Framer Motion",
                  price: "Included",
                  description:
                    "Subtle and sophisticated animations for a premium feel.",
                  badge: "Animations",
                  badgeColor: "gray",
                },
              ].map((dish, index) => (
                <div
                  key={index}
                  className="group relative rounded-2xl border border-black/5 bg-black/[0.02] p-6 transition-all duration-300 hover:border-orange-500/30 hover:bg-orange-500/[0.05] dark:border-white/5 dark:bg-white/[0.02] dark:hover:bg-orange-500/[0.02]"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <h4 className="font-geist text-lg font-medium text-gray-900 transition-colors group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-300">
                      {dish.name}
                    </h4>
                    <span className="font-mono font-medium text-orange-600 dark:text-orange-400">
                      {dish.price}
                    </span>
                  </div>
                  <p className="mb-4 text-sm font-light text-gray-600 dark:text-gray-400">
                    {dish.description}
                  </p>
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] tracking-wider uppercase ${
                      dish.badgeColor === "red"
                        ? "border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400"
                        : dish.badgeColor === "green"
                          ? "border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400"
                          : "border-black/10 text-gray-600 dark:border-white/10 dark:text-gray-400"
                    }`}
                  >
                    {dish.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category 5: Production Ready */}
          <div id="production-ready" className="scroll-mt-32">
            <CategoryHeader
              title="Production Ready"
              subtitle="Security & Analytics"
              titleClassName="text-gray-900 dark:text-gray-200"
            />

            <div className="flex flex-col gap-3">
              {[
                {
                  name: "Arcjet Security",
                  description:
                    "Rate limiting, bot protection, and security headers built in.",
                  price: "Included",
                },
                {
                  name: "PostHog Analytics",
                  description:
                    "Session replays, feature flags, and product usage tracking.",
                  price: "Included",
                },
                {
                  name: "Error Tracking",
                  description:
                    "Real-time error monitoring and reporting pre-configured.",
                  price: "Included",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between rounded-xl border border-transparent p-4 transition-colors hover:border-black/10 hover:bg-black/5 dark:hover:border-white/10 dark:hover:bg-white/5"
                >
                  <div>
                    <h4 className="font-geist text-base font-medium text-gray-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-300">
                      {item.name}
                    </h4>
                    <p className="mt-1 text-xs text-gray-500">
                      {item.description}
                    </p>
                  </div>
                  <span className="font-mono text-gray-600 dark:text-gray-300">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
