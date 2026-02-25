import Link from "next/link";

import { IconArrowRight } from "@tabler/icons-react";

import SplashCursor from "@/components/shared/splash-cursor";

export default function NotFoundPage() {
  return (
    <section className="flex h-screen w-screen flex-col items-center justify-center bg-black">
      <h1 className="text-center text-6xl font-black tracking-tight text-white">
        Page not found
      </h1>
      <Link href="/">
        <div className="mt-16 flex items-center justify-center rounded-full bg-white px-6 py-3 text-xl font-medium text-black">
          <span>Home</span>
          <IconArrowRight className="ml-2" />
        </div>
      </Link>
      <SplashCursor />
    </section>
  );
}
