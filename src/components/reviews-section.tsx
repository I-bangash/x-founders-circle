import { SpotlightCard } from "./spotlight-card";
import { SectionHeader } from "@/components/global-ui/section-header";
import { SectionBadge } from "@/components/global-ui/section-badge";
import { ReviewCard } from "@/components/global-ui/review-card";
import { FeatureImageCard } from "@/components/global-ui/feature-image-card";

export function ReviewsSection() {
  return (
    <SpotlightCard className="sm:mx-6 xl:ml-auto xl:mr-auto max-w-7xl rounded-[40px] mt-4 mr-3 ml-3">
      <div className="sm:p-16 lg:p-24 overflow-hidden flex flex-col bg-card rounded-[40px] pt-8 pr-8 pb-8 pl-8 relative items-center">
        <div className="absolute top-8 right-8 z-20 pointer-events-none opacity-30">
          <span className="text-sm font-semibold text-gray-400 dark:text-gray-600 tracking-widest font-geist">
            05
          </span>
        </div>

        {/* Header */}
        <SectionHeader
          badge={
            <SectionBadge className="text-emerald-600 dark:text-emerald-400">
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
              Loved by Locals
            </SectionBadge>
          }
          title={
            <>
              Craft, Flavor,{" "}
              <span className="text-gray-500 dark:text-gray-400 font-geist">
                Tradition.
              </span>
            </>
          }
          description="We believe food is memories. At HA NOI QUAN, we create dishes that bring you straight to the bustling streets of Vietnam."
          className="mb-20"
        />

        {/* Masonry Grid */}
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {/* Card 1: Review */}
          <ReviewCard
            accentColor="emerald"
            initial="S"
            author="Sarah M."
            role="Local Guide"
            quote={
              <>
                "The{" "}
                <span className="text-foreground font-medium font-geist">
                  Bánh Mì Chảo
                </span>{" "}
                is absolutely incredible. It sizzling hot, savory, and reminds
                me of my trip to Hanoi."
              </>
            }
            icon={
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
            }
          />

          {/* Card 2: Visual (Sushi) */}
          <FeatureImageCard
            backgroundImage="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop"
            label="Premium Sushi"
            gradientColor="emerald"
          />

          {/* Card 3: Quote (Wok) */}
          <ReviewCard
            accentColor="amber"
            initial="D"
            author="Daniel K."
            role="Regular Guest"
            quote={
              <>
                "Authentic vibes and the{" "}
                <span className="text-foreground font-medium font-geist">
                  Wok dishes
                </span>{" "}
                are full of 'Wok Hei'. Best fusion spot in Dortmund."
              </>
            }
            icon={
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
            }
          />

          {/* Card 4: Visual (Pho/Soup) */}
          <FeatureImageCard
            backgroundImage="https://images.unsplash.com/photo-1582878826618-c05326eff935?q=80&w=800&auto=format&fit=crop"
            label="Traditional Phở"
            gradientColor="amber"
          />

          {/* Card 5: Quote (Interior) */}
          <ReviewCard
            accentColor="blue"
            initial="L"
            author="Lisa W."
            role="Foodie"
            quote={
              <>
                "A beautiful, colorful space perfect for dinner with friends.
                The{" "}
                <span className="text-foreground font-medium font-geist">
                  Curry
                </span>{" "}
                was rich and perfectly spiced."
              </>
            }
            icon={
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
            }
          />

          {/* Card 6: Visual (Interior) */}
          <FeatureImageCard
            backgroundImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop"
            label="Cozy Atmosphere"
            gradientColor="purple"
            className="bg-center"
          />
        </div>
      </div>
    </SpotlightCard>
  );
}
