"use client";

import { useTranslations } from "next-intl";
import {
  FileCheck,
  Truck,
  Zap,
  Globe,
  Package,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

const items: { key: string; Icon: LucideIcon }[] = [
  { key: "item1", Icon: FileCheck },
  { key: "item2", Icon: Truck },
  { key: "item3", Icon: Zap },
  { key: "item4", Icon: Globe },
  { key: "item5", Icon: Package },
  { key: "item6", Icon: Warehouse },
];

function ServiceCard({
  itemKey,
  Icon,
  t,
  hasShadow,
}: {
  itemKey: string;
  Icon: LucideIcon;
  t: ReturnType<typeof useTranslations>;
  hasShadow: boolean;
}) {
  return (
    <div
      className="flex h-full flex-col gap-6 rounded-[var(--radius-card)] p-8"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        boxShadow: hasShadow
          ? "0 4px 16px rgba(2,12,27,0.08), 0 1px 4px rgba(2,12,27,0.04)"
          : "none",
      }}
    >
      <div
        className="flex shrink-0 items-center justify-center rounded-[var(--radius-button)]"
        style={{
          width: 48,
          height: 48,
          backgroundColor: "rgba(37,41,216,0.10)",
          border: "1px solid var(--icon-brand)",
        }}
      >
        <Icon size={24} style={{ color: "var(--icon-brand)" }} />
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <h3
          className="text-xl leading-[1.4] font-semibold"
          style={{ color: "var(--card-heading)" }}
        >
          {t(`${itemKey}.title`)}
        </h3>
        <p
          className="flex-1 leading-[1.7]"
          style={{ color: "var(--card-body)", fontSize: 14 }}
        >
          {t(`${itemKey}.description`)}
        </p>
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export function ServiceItems() {
  const t = useTranslations("serviceItems");

  return (
    <section
      id="service-items"
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      {/* Dark diagonal top portion */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: "#0A1628",
          clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 55%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-[var(--section-x)] py-[var(--section-y)]">
        {/* Header */}
        <div className="mb-[72px] flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h2
            className="text-[2.5rem] font-bold leading-[1.07] tracking-[-0.02em] md:text-[3.5rem] md:max-w-[760px]"
            style={{ color: "#FAFBFC" }}
          >
            {t("heading")}
          </h2>
          <p
            className="text-xl leading-[1.4] md:max-w-[424px]"
            style={{ color: "rgba(176,186,196,0.80)" }}
          >
            {t("subheading")}
          </p>
        </div>

        {/* Cards */}
        <motion.div
          className="flex flex-col gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Top row — on dark bg, no shadow */}
          <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-3">
            {items.slice(0, 3).map((item) => (
              <motion.div key={item.key} variants={cardVariants} className="flex">
                <ServiceCard
                  itemKey={item.key}
                  Icon={item.Icon}
                  t={t}
                  hasShadow={false}
                />
              </motion.div>
            ))}
          </div>

          {/* Bottom row — on white bg, with shadow */}
          <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-3">
            {items.slice(3, 6).map((item) => (
              <motion.div key={item.key} variants={cardVariants} className="flex">
                <ServiceCard
                  itemKey={item.key}
                  Icon={item.Icon}
                  t={t}
                  hasShadow={true}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
