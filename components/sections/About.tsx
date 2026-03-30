"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

interface StatBlockProps {
  target: number;
  suffix: string;
  label: string;
}

function StatBlock({ target, suffix, label }: StatBlockProps) {
  const { count, ref } = useCountUp(target);

  return (
    <div ref={ref} className="text-center lg:text-left">
      <p
        className="text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-tight tracking-tight"
        style={{ color: "#FAFBFC" }}
      >
        {count.toLocaleString()}
        {suffix}
      </p>
      <p
        className="mt-1 text-sm leading-relaxed"
        style={{ color: "rgba(176,186,196,0.55)" }}
      >
        {label}
      </p>
    </div>
  );
}

export function About() {
  const t = useTranslations("about");

  return (
    <section
      id="about"
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/about-team.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(2,12,27,0.75) 0%, rgba(2,12,27,0.60) 50%, rgba(2,12,27,0.75) 100%)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-[1280px] px-[var(--section-x)] py-[var(--section-y)]"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr] lg:gap-16">
          {/* Left column — text */}
          <div>
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-[0.1em]"
              style={{ color: "#7FA8FF" }}
            >
              {t("overline")}
            </p>

            <h2
              className="text-[2.5rem] font-bold leading-[1.2] tracking-tight md:text-[3.5rem]"
              style={{ color: "#FAFBFC" }}
            >
              {t("heading")}
            </h2>

            <p
              className="mt-8 max-w-[650px] text-lg font-semibold leading-[1.6]"
              style={{ color: "rgba(176,186,196,0.80)" }}
            >
              {t("body")}
            </p>

            <p
              className="mt-6 text-base"
              style={{ color: "rgba(176,186,196,0.55)" }}
            >
              {t("director")}
            </p>
          </div>

          {/* Right column — stats */}
          <div className="flex flex-col justify-between gap-10 lg:gap-0">
            <StatBlock
              target={250000}
              suffix="+"
              label={t("stats.tonsLabel")}
            />
            <StatBlock
              target={24}
              suffix="ч"
              label={t("stats.surveillanceLabel")}
            />
            <StatBlock
              target={18}
              suffix=""
              label={t("stats.licensesLabel")}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
