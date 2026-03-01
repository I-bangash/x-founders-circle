import { useEffect, useState } from "react";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MousePosition {
  x: number;
  y: number;
}

export default function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePosition;
}

export const interpolateFlameConfig = (
  growthPercentage: number,
  particleFlames: Record<string, any>
) => {
  // Define the breakpoints from the particleFlames object
  const breakpoints = Object.keys(particleFlames)
    .map(Number)
    .sort((a, b) => a - b);

  // Find the two breakpoints to interpolate between
  let lowerBreakpoint = breakpoints[0];
  let upperBreakpoint = breakpoints[breakpoints.length - 1];

  for (let i = 0; i < breakpoints.length - 1; i++) {
    if (
      growthPercentage >= breakpoints[i] &&
      growthPercentage < breakpoints[i + 1]
    ) {
      lowerBreakpoint = breakpoints[i];
      upperBreakpoint = breakpoints[i + 1];
      break;
    }
  }

  // If growth is higher than the highest breakpoint, use the highest config
  if (growthPercentage >= upperBreakpoint) {
    return { ...particleFlames[upperBreakpoint] };
  }

  // Calculate interpolation factor
  const factor =
    (growthPercentage - lowerBreakpoint) / (upperBreakpoint - lowerBreakpoint);

  // Interpolate between the two configurations
  const lowerConfig = particleFlames[lowerBreakpoint];
  const upperConfig = particleFlames[upperBreakpoint];

  const result: Record<string, any> = {};

  // Interpolate each property
  for (const key in lowerConfig) {
    if (typeof lowerConfig[key] === "number") {
      result[key] =
        lowerConfig[key] + factor * (upperConfig[key] - lowerConfig[key]);
    } else {
      result[key] = lowerConfig[key];
    }
  }

  return result;
};

export const particleFlames = {
  0: {
    quantity: 15,
    vx: 0,
    vy: -0.2,
    staticity: 1,
    ease: 100,
    fireIntensity: 0.3,
    particleDecay: 0.01,
    yOffset: -30,
    xOffset: 0,
    radius: 1,
    baseSpeed: 0.4,
  },
  50: {
    quantity: 35,
    vx: 0,
    vy: -0.4,
    staticity: 1,
    ease: 40,
    fireIntensity: 2,
    particleDecay: 0.01,
    yOffset: -10,
    xOffset: 0,
    radius: 1.2,
    baseSpeed: 0.4,
  },
  100: {
    quantity: 50,
    vx: 0,
    vy: -0.4,
    staticity: 1,
    ease: 40,
    fireIntensity: 2,
    particleDecay: 0.01,
    yOffset: -10,
    xOffset: 0,
    radius: 1.2,
    baseSpeed: 0.4,
  },
  200: {
    quantity: 70,
    vx: 0,
    vy: -0.4,
    staticity: 1,
    ease: 40,
    fireIntensity: 2,
    particleDecay: 0.01,
    yOffset: -10,
    xOffset: 0,
    radius: 1.2,
    baseSpeed: 0.4,
  },
  500: {
    quantity: 200,
    vx: 0,
    vy: -1,
    staticity: 1,
    ease: 40,
    fireIntensity: 2,
    particleDecay: 0.001,
    yOffset: 10,
    xOffset: 0,
    radius: 2,
    baseSpeed: 0.4,
  },
  1000: {
    quantity: 300,
    vx: 0,
    vy: -1.5,
    staticity: 1,
    ease: 30,
    fireIntensity: 3,
    particleDecay: 0.0005,
    yOffset: 10,
    xOffset: 0,
    radius: 2.5,
    baseSpeed: 0.6,
  },
};
