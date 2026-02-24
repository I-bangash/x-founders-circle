import { SectionHeader } from "@/components/shared/section-header";

import { SpotlightCard } from "./spotlight-card";

interface IconProps {
  children: React.ReactNode;
}

function Icon({ children }: IconProps) {
  return (
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
      {children}
    </svg>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: (
        <Icon>
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </Icon>
      ),
      label: "Authentication",
    },
    {
      icon: (
        <Icon>
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </Icon>
      ),
      label: "Stripe Payments",
    },
    {
      icon: (
        <Icon>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-4" />
        </Icon>
      ),
      label: "Convex Database",
    },
    {
      icon: (
        <Icon>
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </Icon>
      ),
      label: "Resend Email",
    },
    {
      icon: (
        <Icon>
          <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
          <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </Icon>
      ),
      label: "Arcjet Security",
    },
  ];

  return (
    <SpotlightCard className="mx-4 mt-4 max-w-7xl rounded-[40px] sm:mx-6 xl:mr-auto xl:ml-auto">
      <div className="flex flex-col items-start justify-between gap-8 gap-x-8 gap-y-8 rounded-[40px] pt-8 pr-8 pb-8 pl-8 sm:p-12 lg:flex-row lg:items-center">
        <div className="pointer-events-none absolute top-6 right-8 z-20">
          <span className="font-geist font-mono text-sm font-bold tracking-widest text-gray-400 dark:text-gray-600">
            02
          </span>
        </div>
        <div className="max-w-md">
          <SectionHeader
            title="The setup tax no one warns you about"
            description="You know exactly what you want to build. But you spend days wrestling with authentication, Stripe webhooks, and email configuration instead of building your vision."
            align="left"
            className="mb-0"
            titleClassName="text-2xl sm:text-3xl mb-2"
            descriptionClassName="text-base"
          />
        </div>

        <div className="flex max-w-2xl flex-wrap justify-start gap-3 lg:justify-end">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group/pill flex cursor-pointer items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-2.5 transition-all hover:bg-emerald-600 hover:text-white dark:border-white/10 dark:bg-white/5"
            >
              {feature.icon}
              <span className="font-geist text-sm font-medium text-gray-800 group-hover/pill:text-white dark:text-gray-200">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SpotlightCard>
  );
}
