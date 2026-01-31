import { FeatureImageCard } from "@/components/global-ui/feature-image-card";
import { ReviewCard } from "@/components/global-ui/review-card";
import { SectionBadge } from "@/components/global-ui/section-badge";
import { SectionHeader } from "@/components/global-ui/section-header";

import { SpotlightCard } from "./spotlight-card";

const REVIEW_ITEMS = [
  {
    type: "review",
    props: {
      accentColor: "emerald",
      initial: "S",
      author: "Sarah M.",
      role: "AI Startup Founder",
      quote: (
        <>
          &quot;I used to spend 3 days setting up Auth and Stripe. With{" "}
          <span className="text-foreground font-geist font-medium">
            Remarkable
          </span>
          , I had my first customer paying in 4 hours. The DX is
          incredible.&quot;
        </>
      ),
      icon: (
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
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1Z" />
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1Z" />
        </svg>
      ),
    },
  },
  {
    type: "image",
    props: {
      backgroundImage:
        "https://images.unsplash.com/photo-1582878826618-c05326eff935?q=80&w=800&auto=format&fit=crop",
      label: "Pixel Perfect",
      gradientColor: "emerald",
    },
  },
  {
    type: "review",
    props: {
      accentColor: "amber",
      initial: "D",
      author: "Daniel K.",
      role: "Serial Entrepreneur",
      quote: (
        <>
          &quot;The design system is so coherent. I didn&apos;t have to touch a
          single CSS file to make it look{" "}
          <span className="text-foreground font-geist font-medium">
            premium
          </span>
          . It just works.&quot;
        </>
      ),
      icon: (
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
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.243-2.143.5-3.5a6 6 0 1 0 6 6Z" />
        </svg>
      ),
    },
  },
  {
    type: "image",
    props: {
      backgroundImage:
        "https://images.unsplash.com/photo-1582878826618-c05326eff935?q=80&w=800&auto=format&fit=crop",
      label: "Mobile Ready",
      gradientColor: "amber",
    },
  },
  {
    type: "review",
    props: {
      accentColor: "blue",
      initial: "L",
      author: "Lisa W.",
      role: "Indie Hacker",
      quote: (
        <>
          &quot;I&apos;ve tried every boilerplate.{" "}
          <span className="text-foreground font-geist font-medium">
            Remarkable
          </span>{" "}
          is the first one that actually feels like it was built for the modern
          web.&quot;
        </>
      ),
      icon: (
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
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  },
  {
    type: "image",
    props: {
      backgroundImage:
        "https://images.unsplash.com/photo-1582878826618-c05326eff935?q=80&w=800&auto=format&fit=crop",
      label: "Modern UX",
      gradientColor: "purple",
      className: "bg-center",
    },
  },
];

function BadgeIcon() {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export function ReviewsSection() {
  return (
    <SpotlightCard className="mt-4 mr-3 ml-3 max-w-7xl rounded-[40px] sm:mx-6 xl:mr-auto xl:ml-auto">
      <div className="bg-card relative flex flex-col items-center overflow-hidden rounded-[40px] pt-8 pr-8 pb-8 pl-8 sm:p-16 lg:p-24">
        <div className="pointer-events-none absolute top-8 right-8 z-20 opacity-30">
          <span className="font-geist text-sm font-semibold tracking-widest text-gray-400 dark:text-gray-600">
            05
          </span>
        </div>

        <SectionHeader
          badge={
            <SectionBadge className="text-emerald-600 dark:text-emerald-400">
              <BadgeIcon />
              Loved by Founders
            </SectionBadge>
          }
          title={
            <>
              Craft, Design,{" "}
              <span className="font-geist text-gray-500 dark:text-gray-400">
                Speed.
              </span>
            </>
          }
          description="Built by founders, for founders. We know the setup grind. We fixed it."
          className="mb-20"
        />

        <div className="relative z-10 grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REVIEW_ITEMS.map((item, index) =>
            item.type === "review" ? (
              // @ts-expect-error - dynamic props
              <ReviewCard key={index} {...item.props} />
            ) : (
              // @ts-expect-error - dynamic props
              <FeatureImageCard key={index} {...item.props} />
            )
          )}
        </div>
      </div>
    </SpotlightCard>
  );
}
