import Link from "next/link";

import PixelCard from "@/components/react-bits/pixel-card";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl rounded-3xl px-6 py-12 md:py-20 lg:py-32">
        <PixelCard
          variant="blue"
          className="aspect-[16/9] h-auto w-full max-w-5xl"
        >
          <div className="absolute text-center">
            <h2 className="text-4xl font-semibold text-balance lg:text-5xl">
              Start Building
            </h2>
            <p className="mt-4">
              Libero sapiente aliquam quibusdam aspernatur.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/">
                  <span>Get Started</span>
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline">
                <Link href="/">
                  <span>Book Demo</span>
                </Link>
              </Button>
            </div>
          </div>
        </PixelCard>
      </div>
    </section>
  );
}
