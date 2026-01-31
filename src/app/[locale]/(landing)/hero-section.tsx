import Image from "next/image";
import Link from "next/link";

import { Sparkle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { HeroHeader } from "./header";

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main>
        <section>
          <div className="py-20 md:py-36">
            <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
              <div>
                <AnnouncementBadge />
                <HeroTitle />
                <HeroActions />
              </div>
            </div>
            <HeroVisuals />
          </div>
        </section>
      </main>
    </>
  );
}

function AnnouncementBadge() {
  return (
    <Link
      href="#"
      className="hover:bg-foreground/5 mx-auto flex w-fit items-center justify-center gap-2 rounded-md py-0.5 pr-3 pl-1 transition-colors duration-150"
    >
      <div
        aria-hidden
        className="border-background to-foreground from-primary relative flex size-5 items-center justify-center rounded border bg-linear-to-b shadow-md ring-1 shadow-black/20 ring-black/10 dark:inset-shadow-2xs"
      >
        <div className="absolute inset-x-0 inset-y-1.5 border-y border-dotted border-white/25"></div>
        <div className="absolute inset-x-1.5 inset-y-0 border-x border-dotted border-white/25"></div>
        <Sparkle className="fill-background stroke-background size-3 drop-shadow" />
      </div>
      <span className="font-medium">Introducing AI Agents</span>
    </Link>
  );
}

function HeroTitle() {
  return (
    <>
      <h1 className="mx-auto mt-8 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
        Build 10x Faster with Launch Day
      </h1>
      <p className="text-muted-foreground mx-auto my-6 max-w-xl text-xl text-balance">
        Craft. Build. Ship Modern Websites With AI Support.
      </p>
    </>
  );
}

function HeroActions() {
  return (
    <div className="flex items-center justify-center gap-3">
      <Button asChild size="lg">
        <Link href="#link">
          <span className="text-nowrap">Start Building</span>
        </Link>
      </Button>
      <Button asChild size="lg" variant="outline">
        <Link href="#link">
          <span className="text-nowrap">Watch Video</span>
        </Link>
      </Button>
    </div>
  );
}

function HeroVisuals() {
  return (
    <div className="relative">
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <div className="mt-12 md:mt-16">
          <div className="bg-background relative mx-auto overflow-hidden rounded-(--radius) border border-transparent shadow-lg ring-1 shadow-black/10 ring-black/10">
            <Image
              src="/hero-section-main-app-dark.png"
              alt="App screen demonstrating the dashboard interface"
              width={2880}
              height={1842}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
