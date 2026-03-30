"use client";

import { useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const TOTAL_FRAMES = 0;

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

  const headingOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0, 0.15], [40, 0]);
  const subOpacity = useTransform(scrollYProgress, [0.08, 0.25], [0, 1]);
  const ctaOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);
  const chevronOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (
      TOTAL_FRAMES === 0 ||
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

    if (TOTAL_FRAMES === 0) return;

    const first = new Image();
    first.src = "/hero-frames/frame-0001.jpg";
    first.onload = () => {
      framesRef.current[0] = first;
      currentFrameRef.current = 0;
      drawFrame(0);
    };

    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/hero-frames/frame-${String(i + 1).padStart(4, "0")}.jpg`;
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
    if (TOTAL_FRAMES === 0) return;

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

  const scrollToContact = useCallback(() => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative"
      style={{ height: "250vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Canvas — z-0 */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />

        {/* Gradient overlay — z-1 */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(2,12,27,0.50) 0%, rgba(2,12,27,0.10) 40%, rgba(2,12,27,0.75) 100%)",
          }}
        />

        {/* Text layer — z-2 */}
        <div className="relative z-[2] flex h-full flex-col items-start justify-center px-[var(--section-x)] text-left max-w-[1280px] mx-auto w-full">
          <motion.p
            style={{ opacity: headingOpacity }}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.1em]"
          >
            <span style={{ color: "var(--text-on-brand)" }}>
              {t("overline")}
            </span>
          </motion.p>

          <motion.h1
            style={{
              opacity: headingOpacity,
              y: headingY,
              fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
              color: "var(--text-on-brand)",
              textShadow: "4px 4px 10px rgba(0,0,0,0.5)",
            }}
            className="max-w-4xl font-bold leading-[1.2] tracking-tight"
          >
            {t("heading")}
          </motion.h1>

          <motion.p
            style={{ opacity: subOpacity, color: "var(--text-on-brand)" }}
            className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80"
          >
            {t("subheading")}
          </motion.p>

          <motion.div style={{ opacity: ctaOpacity }} className="mt-8">
            <Button
              onClick={scrollToContact}
              className="h-auto px-8 py-3 text-base font-bold"
              style={{
                backgroundColor: "var(--btn-primary-bg)",
                color: "var(--btn-primary-text)",
                borderRadius: "var(--radius-button)",
                boxShadow: "var(--btn-primary-shadow)",
              }}
            >
              {t("cta")}
            </Button>
          </motion.div>
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
