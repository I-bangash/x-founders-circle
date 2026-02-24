"use client";

import Image from "next/image";
import Link from "next/link";

import { ClerkLoaded, ClerkLoading, SignIn, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";

import { APP_ROOT_DOMAIN } from "@/utils/constants";
import { cn } from "@/utils/utils";

import BackdropGradient from "../shared/backdrop-gradient";
import GlassCard from "../shared/glass-card";
import LogoComponent from "../shared/logo-component";
import { Button } from "../ui/button";

export function SignInForm() {
  const { theme } = useTheme();
  const { user } = useUser();

  return (
    <div className="grid max-h-screen min-h-screen w-full grid-cols-1 md:grid-cols-2">
      <div className="flex w-full items-center justify-center">
        <div className="mx-auto w-full max-w-md">
          <div className="flex w-full max-w-md items-center justify-between px-4">
            <ClerkLoading>
              <AnimatePresence mode="wait">
                <motion.div
                  key="loading-state"
                  className="flex w-full items-center justify-center"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  <div className="flex w-full max-w-md items-center justify-between">
                    <div className="w-9" />
                    <LogoComponent isLoading={true} />
                    <div className="w-9" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </ClerkLoading>
            <ClerkLoaded>
              <AnimatePresence mode="wait">
                {!user ? (
                  <motion.div
                    key="loaded-state"
                    className="flex w-full items-center justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <Link
                      href={APP_ROOT_DOMAIN || "https://remarkable.sh"}
                      className="block w-9 opacity-60 transition-opacity duration-300 hover:opacity-100"
                    >
                      <Button variant="link" className="px-0">
                        <ChevronLeft
                          className="opacity-60"
                          size={24}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </Button>
                    </Link>
                    <LogoComponent />
                    <div className="w-9" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="loaded-state"
                    className="flex w-full animate-pulse items-center justify-between transition-all duration-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <Link
                      href={APP_ROOT_DOMAIN || "https://remarkable.sh"}
                      className="block w-9 opacity-60 transition-opacity duration-300 hover:opacity-100"
                    >
                      <Button variant="link" className="px-0">
                        <ChevronLeft
                          className="opacity-60"
                          size={24}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </Button>
                    </Link>
                    <LogoComponent />
                    <div className="w-9" />
                  </motion.div>
                )}
              </AnimatePresence>
            </ClerkLoaded>
          </div>

          <ClerkLoaded>
            <AnimatePresence mode="wait">
              <motion.div
                key={"signup-form"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                {!user ? (
                  <div className="mt-5 dark:bg-black/95">
                    <BackdropGradient
                      className="h-2/6 w-4/12 opacity-50"
                      container="flex flex-col items-center"
                    >
                      <GlassCard className="xs:w-full mt-0 bg-white/80 p-7 backdrop-blur-lg dark:bg-black/80">
                        {/* <ClerkLoading>
                  <Spinner />
                </ClerkLoading> */}

                        {/* <ClerkLoaded>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={"signup-form"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    > */}
                        <SignIn
                          appearance={{
                            baseTheme: theme === "dark" ? dark : undefined,
                            elements: {
                              formButtonPrimary:
                                "bg-black hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-100",
                              card: "bg-transparent shadow-none",
                              headerTitle: "text-2xl font-bold",
                              headerSubtitle:
                                "text-neutral-600 dark:text-neutral-400",
                              dividerLine: "bg-neutral-300 dark:bg-neutral-700",
                              dividerText:
                                "bg-gray-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400",
                              formFieldLabel:
                                "text-neutral-700 dark:text-neutral-400",
                              formFieldInput:
                                "rounded-md border-0 bg-white dark:bg-neutral-900 text-black dark:text-white shadow-input focus:ring-2 focus:ring-neutral-400",
                              footerActionLink:
                                "text-black dark:text-white hover:text-neutral-800 dark:hover:text-neutral-200",
                              socialButtonsBlockButton:
                                "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800",
                              socialButtonsBlockButtonText:
                                "text-neutral-600 dark:text-neutral-400",
                            },
                          }}
                          // redirect to app subdomain
                          forceRedirectUrl={APP_ROOT_DOMAIN + "/"}
                          signInUrl={`${APP_ROOT_DOMAIN}/sign-in`}
                        />
                        {/* </motion.div>
                  </AnimatePresence>
                  </ClerkLoaded> */}
                      </GlassCard>
                    </BackdropGradient>
                  </div>
                ) : (
                  <SignIn />
                )}
              </motion.div>
            </AnimatePresence>
          </ClerkLoaded>
        </div>
      </div>

      <div className="relative z-20 hidden w-full items-center justify-center overflow-hidden border-l border-neutral-100 bg-white md:flex dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto max-w-sm">
          <FeaturedTestimonials />
          <p className="text-center text-xl font-semibold text-neutral-600 dark:text-neutral-400">
            Welcome back!
          </p>
          {/* <p className="mt-8 text-center text-base font-normal text-neutral-500 dark:text-neutral-400">
            Sign in to continue your journey with ViralLaunch and access your
            personalized dashboard.
          </p> */}
        </div>

        <GridLineHorizontal
          className="top-4 left-1/2 -translate-x-1/2"
          offset="-10px"
        />
        <GridLineHorizontal
          className="top-auto bottom-4 left-1/2 -translate-x-1/2"
          offset="-10px"
        />
        <GridLineVertical
          className="top-1/2 left-10 -translate-y-1/2"
          offset="-10px"
        />
        <GridLineVertical
          className="top-1/2 right-10 left-auto -translate-y-1/2"
          offset="-10px"
        />
      </div>
    </div>
  );
}

export const FeaturedTestimonials = ({
  className,
  containerClassName,
}: {
  textClassName?: string;
  className?: string;
  showStars?: boolean;
  containerClassName?: string;
}) => {
  const images = [
    {
      name: "John Doe",
      src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
    },
    {
      name: "Robert Johnson",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
      name: "Jane Smith",
      src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
      name: "Emily Davis",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    {
      name: "Tyler Durden",
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
    },
    {
      name: "Dora",
      src: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
    },
  ];
  return (
    <div className={cn("flex flex-col items-center", containerClassName)}>
      <div
        className={cn(
          "mb-2 flex flex-col items-center justify-center sm:flex-row",
          className
        )}
      >
        <div className="mb-4 flex flex-row items-center sm:mb-0">
          {images.map((image, idx) => (
            <div className="group relative -mr-4" key={image.name}>
              <div>
                <motion.div
                  whileHover={{ scale: 1.05, zIndex: 30 }}
                  transition={{ duration: 0.2 }}
                  className="relative overflow-hidden rounded-full border-2 border-neutral-200"
                >
                  <Image
                    height={100}
                    width={100}
                    src={image.src}
                    alt={image.name}
                    className="h-8 w-8 object-cover object-top md:h-14 md:w-14"
                  />
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const GridLineHorizontal = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "200px",
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className
      )}
    ></div>
  );
};

const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className
      )}
    ></div>
  );
};
