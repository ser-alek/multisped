"use client";

import { useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

const TOTAL_FRAMES = 211;
const FRAME_EXT = "jpg";

export function Hero() {
  const t = useTranslations("hero");
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(-1);
  const rafRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const headingOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0, 0.08], [40, 0]);
  const subOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  const chevronOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (
      !framesRef.current[frameIndex] ||
      !framesRef.current[frameIndex].complete
    ) {
      ctx.fillStyle = "#020c1b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.drawImage(
      framesRef.current[frameIndex],
      0,
      0,
      canvas.width,
      canvas.height,
    );
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(Math.max(0, currentFrameRef.current));
  }, [drawFrame]);

  useEffect(() => {
    resizeCanvas();

    const first = new Image();
    first.src = `/hero-frames/frame-0001.${FRAME_EXT}`;
    first.onload = () => {
      framesRef.current[0] = first;
      currentFrameRef.current = 0;
      drawFrame(0);
    };

    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/hero-frames/frame-${String(i + 1).padStart(4, "0")}.${FRAME_EXT}`;
      framesRef.current[i] = img;
    }
  }, [drawFrame, resizeCanvas]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(resizeCanvas, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, [resizeCanvas]);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollDistance =
        containerRef.current.offsetHeight - window.innerHeight;
      if (scrollDistance <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollDistance));
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 1))),
      );

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative"
      style={{ height: "180vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Canvas — z-0 */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />

        {/* Bottom gradient overlay — z-1 */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(2,12,27,0.50) 0%, rgba(2,12,27,0.10) 40%, rgba(2,12,27,0.75) 100%)",
          }}
        />

        {/* Left-side gradient overlay for text legibility — z-1 */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(2,12,27,0.65) 0%, rgba(2,12,27,0.35) 50%, rgba(2,12,27,0.0) 100%)",
          }}
        />

        {/* Text layer — z-2 */}
        <div className="relative z-[2] flex h-full flex-col items-start justify-center px-[var(--section-x)] text-left max-w-[1280px] mx-auto w-full">
          <motion.h1
            style={{
              opacity: headingOpacity,
              y: headingY,
              fontSize: "clamp(1.75rem, 4.5vw, 3.25rem)",
              color: "var(--text-on-brand)",
              textShadow:
                "0 2px 20px rgba(2,12,27,0.8), 0 1px 4px rgba(2,12,27,0.6)",
            }}
            className="max-w-4xl font-bold leading-[1.2] tracking-tight"
          >
            {t("headingLine1")}
            <br />
            {t("headingLine2")}
          </motion.h1>

          <motion.p
            style={{
              opacity: subOpacity,
              color: "var(--text-on-brand)",
              textShadow:
                "0 2px 20px rgba(2,12,27,0.8), 0 1px 4px rgba(2,12,27,0.6)",
            }}
            className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80"
          >
            {t("subheading")}
          </motion.p>
        </div>

        {/* Scroll indicator — z-2 */}
        <motion.div
          style={{ opacity: chevronOpacity }}
          className="absolute bottom-8 left-1/2 z-[2] -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span
            className="text-xs font-medium"
            style={{ color: "var(--text-on-brand)", opacity: 0.6 }}
          >
            {t("scroll")}
          </span>
          <ChevronDown
            size={24}
            className="animate-bounce"
            style={{ color: "var(--text-on-brand)", opacity: 0.6 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
