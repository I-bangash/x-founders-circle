import { SpotlightCard } from "./spotlight-card"
import { SectionHeader } from "@/components/global-ui/section-header"

export function FeaturesSection() {
  const features = [
    {
      icon: (
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
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      ),
      label: "Fresh Ingredients",
    },
    {
      icon: (
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
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.243-2.143.5-3.5a6 6 0 1 0 6 6Z" />
        </svg>
      ),
      label: "Wok Fire",
    },
    {
      icon: (
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
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.15-.49 2.87 2.87 0 0 1 1.48 2.65v3.12c0 .69.28 1.35.78 1.85l.75.75" />
          <path d="M6 18c-.45 0-.85.2-1.1.53-.35.45-.4 1.07-.1 1.6L6 22h2" />
        </svg>
      ),
      label: "Family Recipes",
    },
    {
      icon: (
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
          <path d="M6.5 12c.94-2.08 2.55-3 5-3 3.72 0 5.68 1.76 9 2.69 2.57-1.95 3.03-5.04 1.5-7.69-3.25 1.5-5.96 4.45-8 4.45-1.95 0-3.35-1-4.5-2.5C8.03 3.86 6.3 3 4.5 3 2.15 3 1 5 1 8c0 3 1.95 5.5 4 8 1.35 1.65 3.5 2.5 5.5 2.5 3.72 0 6.6-2.5 9-6.5-1.17 3.32-3.13 6.64-5.5 8.16-2.52 1.62-5.71 1.34-8-1.5C3.3 16.5 2.5 13.5 3 10.5" />
        </svg>
      ),
      label: "Sushi Artistry",
    },
    {
      icon: (
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
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      label: "Slow Cooked",
    },
  ]

  return (
    <SpotlightCard className="mx-4 sm:mx-6 xl:ml-auto xl:mr-auto max-w-7xl rounded-[40px] mt-4">
      <div className="sm:p-12 flex flex-col lg:flex-row lg:items-center gap-8 rounded-[40px] pt-8 pr-8 pb-8 pl-8 gap-x-8 gap-y-8 items-start justify-between">
        <div className="absolute top-6 right-8 z-20 pointer-events-none">
          <span className="font-mono text-sm font-bold text-gray-400 dark:text-gray-600 tracking-widest font-geist">
            02
          </span>
        </div>
        <div className="max-w-md">
          <SectionHeader
            title="Our Kitchen Secrets"
            description="From basic ingredients to advanced flavor profiles."
            align="left"
            className="mb-0"
            titleClassName="text-2xl sm:text-3xl mb-2"
            descriptionClassName="text-base"
          />
        </div>

        <div className="flex flex-wrap gap-3 max-w-2xl justify-start lg:justify-end">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group/pill flex items-center gap-2 px-4 py-2.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
            >
              {feature.icon}
              <span className="text-sm font-medium font-geist text-gray-800 dark:text-gray-200 group-hover/pill:text-white">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SpotlightCard>
  )
}
