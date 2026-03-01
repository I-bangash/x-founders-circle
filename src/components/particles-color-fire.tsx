"use client";

import React, { useEffect, useRef } from "react";

import useMousePosition from "@/lib/utils";

interface ParticlesProps {
  /** Custom className for the container div */
  className?: string;

  /** Number of particles to render
   * @min 1
   * @max 200
   * @default 30
   * Higher values create denser effects but impact performance
   */
  quantity?: number;

  /** Controls how strongly particles react to mouse movement
   * @min 1
   * @max 100
   * @default 50
   * Higher values = less reactive to mouse
   * Lower values = more reactive to mouse
   */
  staticity?: number;

  /** Controls the smoothness of particle movement
   * @min 1
   * @max 100
   * @default 50
   * Higher values = smoother but slower movement
   * Lower values = more immediate movement
   */
  ease?: number;

  /** Trigger to refresh/reset the particle system
   * @default false
   */
  refresh?: boolean;

  /** Color of particles in hex format
   * @default "#ffffff"
   * @example "#ff4d4d" for red particles
   */
  color?: string;

  /** Base horizontal velocity for all particles
   * @default 0
   * Positive = move right
   * Negative = move left
   * Useful for wind effects
   */
  vx?: number;

  /** Base vertical velocity for all particles
   * @default 0
   * Positive = move down
   * Negative = move up
   * Useful for rising/falling effects
   */
  vy?: number;

  /** Enable fire effect animation
   * @default false
   * When true, particles behave like a flame
   */
  isFireEffect?: boolean;

  /** Controls the intensity/speed of the fire effect
   * @min 0.1
   * @max 2.0
   * @default 0.5
   * Higher values = more energetic flame
   * Lower values = calmer flame
   */
  fireIntensity?: number;

  /** Rate at which particles fade out
   * @min 0.001
   * @max 0.1
   * @default 0.02
   * Higher values = faster fade out
   * Lower values = longer-lasting particles
   */
  particleDecay?: number;

  /** Vertical offset for the fire spawn position in pixels
   * @default 0
   * Negative values = move spawn point up
   * Positive values = move spawn point down
   */
  yOffset?: number;

  /** Horizontal offset for the fire spawn position in pixels
   * @default 0
   * Negative values = move spawn point left
   * Positive values = move spawn point right
   */
  xOffset?: number;

  /** Controls the size/spread of the fire effect
   * @min 0.1
   * @max 5.0
   * @default 1
   * Values > 1 = larger flame
   * Values < 1 = smaller flame
   */
  radius?: number;

  /** Overall speed multiplier for all particle movement
   * @min 0.1
   * @max 3.0
   * @default 1
   * Values > 1 = faster movement
   * Values < 1 = slower movement
   * Affects all motion including fire movement and mouse interaction
   */
  baseSpeed?: number;
}
function hexToRgb(hex: string): number[] {
  // Remove the "#" character from the beginning of the hex color code
  hex = hex.replace("#", "");

  // Convert the hex color code to an integer
  const hexInt = parseInt(hex, 16);

  // Extract the red, green, and blue components from the hex color code
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;

  // Return an array of the RGB values
  return [red, green, blue];
}

export const ParticlesColorFire: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 30,
  staticity = 50,
  ease = 50,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  isFireEffect = false,
  fireIntensity = 0.5,
  particleDecay = 0.02,
  yOffset = 0,
  xOffset = 0,
  radius = 1,
  baseSpeed = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, []);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  type Circle = {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = (): Circle => {
    // Calculate spawn position in a wider arc at the bottom
    const angle = isFireEffect
      ? Math.random() * Math.PI * 0.8 + Math.PI * 1.1
      : 0;

    const baseRadius = canvasSize.current.h * 0.15;
    const scaledRadius = isFireEffect ? baseRadius * radius : 0;

    const baseX = canvasSize.current.w / 2 + xOffset;
    const normalizedY = canvasSize.current.h * 0.65;
    const baseY = normalizedY + yOffset;

    // Add slight randomness to spawn position for natural look
    const spawnVariation = Math.random() * 10 - 5;
    const x = isFireEffect
      ? baseX + Math.cos(angle) * scaledRadius + spawnVariation
      : Math.floor(Math.random() * canvasSize.current.w);
    const y = isFireEffect
      ? baseY + Math.sin(angle) * scaledRadius
      : Math.floor(Math.random() * canvasSize.current.h);

    const translateX = 0;
    const translateY = 0;

    // Larger particles near the center
    const distanceFromCenter =
      Math.abs(x - baseX) / (canvasSize.current.w * 0.2);
    const sizeVariation = isFireEffect
      ? Math.max(0.6, 1 - distanceFromCenter) * radius
      : 1;

    const size = isFireEffect
      ? (Math.random() * 2.5 + 2) * sizeVariation
      : Math.floor(Math.random() * 2) + 1;

    // Initialize with lower alpha for consistency
    const initialAlpha = isFireEffect ? 0.2 : 0;
    const maxTargetAlpha = isFireEffect ? 0.4 : 0.6;
    const alpha = initialAlpha;
    const targetAlpha = parseFloat(
      (Math.random() * 0.2 + maxTargetAlpha * 0.5).toFixed(2)
    );

    // Calculate particle movement for more natural flame shape
    const particleAngle = isFireEffect
      ? -Math.PI / 2 + (Math.random() - 0.5) * 1.2
      : 0;

    const speed = isFireEffect
      ? fireIntensity * (0.3 + Math.random() * 0.4) * baseSpeed
      : 0;

    // Add slight horizontal drift for more natural movement
    const drift = (Math.random() - 0.5) * 0.3 * baseSpeed;
    const dx = isFireEffect
      ? Math.cos(particleAngle) * speed + drift + vx
      : (Math.random() - 0.5) * 0.2;
    const dy = isFireEffect
      ? Math.sin(particleAngle) * speed * 1.2 + vy
      : (Math.random() - 0.5) * 0.2;

    const magnetism = isFireEffect ? 0.1 : 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const rgb = hexToRgb(color);

  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h
      );
    }
  };

  const drawParticles = () => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle: Circle, i: number) => {
      if (isFireEffect) {
        const centerX = canvasSize.current.w / 2;
        const heightRatio =
          1 - (canvasSize.current.h - circle.y) / canvasSize.current.h;

        // Handle edge-based alpha with softer top fade
        const edge = [
          circle.x + circle.translateX - circle.size,
          canvasSize.current.w - circle.x - circle.translateX - circle.size,
          circle.y + circle.translateY - circle.size,
          // Increase top boundary for smoother fade
          canvasSize.current.h * 1.5 -
            circle.y -
            circle.translateY -
            circle.size,
        ];
        const closestEdge = edge.reduce((a, b) => Math.min(a, b));
        const remapClosestEdge = parseFloat(
          remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
        );

        // Natural flame shape movement
        const distanceFromCenter = Math.abs(circle.x - centerX);
        const heightFactor = Math.pow(heightRatio, 1.2); // Reduced power for gentler height-based fade

        // Calculate mouse influence based on height
        const mouseInfluence = 1 - heightRatio * 0.8;

        // Apply mouse movement first
        const targetX = mouse.current.x / (staticity / circle.magnetism);
        const targetY = mouse.current.y / (staticity / circle.magnetism);

        circle.translateX += (targetX - circle.translateX) / ease;
        circle.translateY += (targetY - circle.translateY) / ease;

        // Then apply fire movement
        const curveForce = Math.sin(heightRatio * Math.PI) * 0.5 * baseSpeed;
        const sideForce = (circle.x - centerX) * 0.002 * baseSpeed;
        const wobble =
          Math.sin(Date.now() / 1500 + circle.y / 50) * 0.3 * baseSpeed;

        // Combine all movements
        circle.x += (circle.dx + curveForce - sideForce + wobble) * baseSpeed;
        circle.y += circle.dy * baseSpeed;

        // Smoother alpha transition
        const baseAlpha = circle.targetAlpha * (1 - heightFactor * 0.5);
        const distanceAlpha =
          1 - distanceFromCenter / (canvasSize.current.w * 0.25);
        circle.alpha =
          baseAlpha * Math.max(0.1, distanceAlpha) * remapClosestEdge;

        // Gentler deceleration for higher particles
        const heightBasedDeceleration = 0.992 + heightRatio * 0.004;
        circle.dy *= Math.pow(heightBasedDeceleration, baseSpeed);
        circle.dx *= Math.pow(heightBasedDeceleration, baseSpeed);
      } else {
        const edge = [
          circle.x + circle.translateX - circle.size,
          canvasSize.current.w - circle.x - circle.translateX - circle.size,
          circle.y + circle.translateY - circle.size,
          canvasSize.current.h - circle.y - circle.translateY - circle.size,
        ];
        const closestEdge = edge.reduce((a, b) => Math.min(a, b));
        const remapClosestEdge = parseFloat(
          remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
        );

        if (remapClosestEdge > 1) {
          circle.alpha += 0.02;
          if (circle.alpha > circle.targetAlpha) {
            circle.alpha = circle.targetAlpha;
          }
        } else {
          circle.alpha = circle.targetAlpha * remapClosestEdge;
        }
      }

      // Modify out-of-bounds check to allow more vertical space
      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size * 2 || // Allow particles to go higher
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1);
        const newCircle = circleParams();
        drawCircle(newCircle);
      } else {
        drawCircle(
          {
            ...circle,
            x: circle.x + circle.translateX,
            y: circle.y + circle.translateY,
            translateX: 0,
            translateY: 0,
            alpha: circle.alpha,
          },
          true
        );
      }
    });
    window.requestAnimationFrame(animate);
  };

  return (
    <div className={className} ref={canvasContainerRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
};
