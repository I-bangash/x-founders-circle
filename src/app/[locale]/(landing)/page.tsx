"use client";

import { CTASection } from "@/components/cta-section";
import { FeaturesSection } from "@/components/features-section";
import { HeroSection } from "@/components/hero-section";
import { MenuSection } from "@/components/menu-section";
import { Navigation } from "@/components/navigation";
import { ProcessSection } from "@/components/process-section";
import { ReviewsSection } from "@/components/reviews-section";

export default function Home() {
  return (
    <>
      {/* Background texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/cubes.png')",
          mixBlendMode: "overlay",
        }}
      />

      {/* Vertical Lines Container */}
      <div className="pointer-events-none fixed inset-0 z-0 mx-auto flex w-full max-w-7xl justify-center px-6">
        <div className="relative flex h-full w-full justify-center border-x border-dashed border-black/5 dark:border-white/5">
          <div className="bg-dashed absolute left-1/4 h-full w-px bg-black/5 dark:bg-white/5" />
          <div className="h-full w-px bg-black/5 dark:bg-white/5" />
          <div className="bg-dashed absolute right-1/4 h-full w-px bg-black/5 dark:bg-white/5" />
        </div>
      </div>

      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <MenuSection />
      <ProcessSection />
      <ReviewsSection />
      <CTASection />
    </>
  );
}
