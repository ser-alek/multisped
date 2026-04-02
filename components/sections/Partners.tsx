"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

const LOGOS = [
  "liberty-steel",
  "mm-militzer",
  "makstil",
  "mbm-port",
  "european-plants",
  "fakom",
  "ats",
  "makpetrol",
  "dith",
  "madame-coco",
  "esm",
  "zeleznici-mk",
];

export function Partners() {
  const t = useTranslations("partners");

  return (
    <section id="partners" style={{ backgroundColor: "#D3D9E0" }}>
      <div className="mx-auto max-w-[1280px] px-[var(--section-x)] py-[var(--section-y)]">
        <div className="mb-12 text-center">
          <h2
            className="font-sans text-[2.4rem] font-semibold leading-[1.2] tracking-tight md:text-[3rem]"
            style={{ color: "#020c1b" }}
          >
            {t("heading")}
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl font-sans text-lg leading-relaxed"
            style={{ color: "#606D7A" }}
          >
            {t("subheading")}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 sm:grid-cols-4 md:grid-cols-6">
          {LOGOS.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center"
            >
              <Image
                src={`https://pub-1175e2eb3d2945a0943894b7ba322652.r2.dev/images/partners/${name}.png`}
                alt={name}
                width={120}
                height={48}
                loading="lazy"
                className="h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
