"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";

const sectors = [
  { key: "logistics", image: "https://pub-1175e2eb3d2945a0943894b7ba322652.r2.dev/images/logistics.jpg", imageLeft: true },
  { key: "commercial", image: "https://pub-1175e2eb3d2945a0943894b7ba322652.r2.dev/images/commercial.jpg", imageLeft: false },
  { key: "finance", image: "https://pub-1175e2eb3d2945a0943894b7ba322652.r2.dev/images/finance.jpg", imageLeft: true },
] as const;

function SectorImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className="h-[400px] w-full rounded-[var(--radius-card)]"
        style={{ backgroundColor: "var(--bg-subtle)" }}
      />
    );
  }

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-[var(--radius-card)]">
      <Image
        src={src}
        alt={alt}
        fill
        loading="lazy"
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
}

export function Sectors() {
  const t = useTranslations("sectors");

  return (
    <section id="sectors" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="mx-auto max-w-[1280px] px-[var(--section-x)] py-[var(--section-y)]">
        {/* Header */}
        <div className="mb-[72px] flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="shrink-0 md:max-w-[424px]">
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-[0.1em]"
              style={{ color: "var(--text-overline)" }}
            >
              {t("overline")}
            </p>
            <h2
              className="text-[2.5rem] font-bold leading-[1.07] tracking-[-0.02em] md:text-[3.5rem]"
              style={{ color: "var(--text-heading)" }}
            >
              {t("heading")}
            </h2>
          </div>
          <p
            className="text-lg leading-[1.6] md:max-w-[536px]"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("subheading")}
          </p>
        </div>

        {/* Sector rows */}
        <div className="flex flex-col gap-[96px]">
          {sectors.map((sector, i) => (
            <motion.div
              key={sector.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: i * 0.15,
                ease: [0.4, 0, 0.2, 1] as const,
              }}
              className={`flex flex-col gap-8 md:flex-row md:items-center md:gap-[60px] ${
                sector.imageLeft ? "" : "md:flex-row-reverse"
              }`}
            >
              {/* Image */}
              <div className="md:w-1/2">
                <SectorImage
                  src={sector.image}
                  alt={t(`${sector.key}.heading`)}
                />
              </div>

              {/* Text */}
              <div className="flex flex-col gap-8 md:w-1/2">
                <div className="flex flex-col gap-3">
                  <p
                    className="text-sm font-normal leading-[1.4]"
                    style={{ color: "var(--text-overline)" }}
                  >
                    {t(`${sector.key}.label`)}
                  </p>
                  <h3
                    className="text-[2rem] font-bold leading-[1.25] tracking-[-0.02em]"
                    style={{ color: "var(--text-heading)" }}
                  >
                    {t(`${sector.key}.heading`)}
                  </h3>
                </div>
                <p
                  className="text-lg leading-[1.6]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t(`${sector.key}.body`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
