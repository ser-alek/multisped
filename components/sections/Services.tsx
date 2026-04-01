"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ChevronRight, X } from "lucide-react";

const CARDS = [
  { key: "truck", image: "/images/truck.jpg" },
  { key: "maritime", image: "/images/maritime.jpg" },
  { key: "rail", image: "/images/rail.jpg" },
] as const;

const TRANSITION = "background 280ms cubic-bezier(0.4,0,0.2,1), border-color 280ms cubic-bezier(0.4,0,0.2,1), box-shadow 280ms cubic-bezier(0.4,0,0.2,1), color 280ms cubic-bezier(0.4,0,0.2,1)";

export function Services() {
  const t = useTranslations("services");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = useCallback(
    (index: number) => {
      setActiveIndex(activeIndex === index ? null : index);
    },
    [activeIndex],
  );

  return (
    <section id="services" style={{ backgroundColor: "#0A1628" }}>
      <div className="mx-auto max-w-[1280px] px-[var(--section-x)] py-[var(--section-y)]">
        {/* Header */}
        <div className="mb-12 text-center">
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-[0.1em]"
            style={{ color: "#7FA8FF" }}
          >
            {t("overline")}
          </p>
          <h2
            className="text-[2.5rem] font-bold leading-[1.07] tracking-[-0.02em] md:text-[3.5rem]"
            style={{ color: "#FAFBFC" }}
          >
            {t("heading")}
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-[var(--grid-gap)] md:grid-cols-3">
          {CARDS.map((card, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={card.key}
                role="button"
                tabIndex={0}
                onClick={() => toggle(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") toggle(index);
                }}
                className="flex cursor-pointer flex-col overflow-hidden md:h-[420px]"
                style={{
                  backgroundColor: isActive ? "#FAFBFC" : "#0A1628",
                  border: isActive
                    ? "1px solid #FAFBFC"
                    : "1px solid #E6EEFF",
                  borderRadius: "var(--radius-card)",
                  boxShadow: isActive
                    ? "0 8px 40px rgba(37,41,216,0.22), 0 2px 8px rgba(2,12,27,0.15)"
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
                  transition: TRANSITION,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#0E1C34";
                    e.currentTarget.style.borderColor = "#E6EEFF";
                    e.currentTarget.style.boxShadow =
                      "0 4px 20px rgba(37,41,216,0.18)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#0A1628";
                    e.currentTarget.style.borderColor = "#E6EEFF";
                    e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.04)";
                  }
                }}
              >
                {/* Card image */}
                <div
                  className="relative h-[180px] w-full shrink-0 overflow-hidden"
                  style={{
                    borderTopLeftRadius: "var(--radius-card)",
                    borderTopRightRadius: "var(--radius-card)",
                  }}
                >
                  <Image
                    src={card.image}
                    alt={t(`${card.key}.title`)}
                    fill
                    loading="lazy"
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Card content */}
                <div className="flex min-h-0 flex-1 flex-col p-[var(--card-inner)]">
                  <h3
                    className="text-xl font-semibold leading-snug"
                    style={{
                      color: isActive ? "#2529D8" : "#FAFBFC",
                      transition: TRANSITION,
                    }}
                  >
                    {t(`${card.key}.title`)}
                  </h3>

                  <p
                    className={`mt-3 min-h-0 flex-1 text-base leading-relaxed ${isActive ? "" : "line-clamp-3"}`}
                    style={{
                      color: isActive
                        ? "#8A96A3"
                        : "rgba(176,186,196,0.65)",
                      transition: TRANSITION,
                      overflow: isActive ? "auto" : undefined,
                    }}
                  >
                    {isActive
                      ? `${t(`${card.key}.body`)} ${t(`${card.key}.detail`)}`
                      : t(`${card.key}.body`)}
                  </p>

                  {/* Toggle link */}
                  <button
                    className="mt-3 flex shrink-0 items-center gap-1.5 text-base font-medium"
                    style={{
                      color: isActive ? "#2529D8" : "#7FA8FF",
                      transition: TRANSITION,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(index);
                    }}
                  >
                    {isActive ? (
                      <>
                        {t("collapse")}
                        <X size={16} />
                      </>
                    ) : (
                      <>
                        {t("expand")}
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
