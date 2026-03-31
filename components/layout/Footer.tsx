"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

const CONTACT_EMAIL = "multisped2001@multisped.com.mk";
const CONTACT_ADDRESS = "Ул. 34 бр. 12 Илинден 1000 Скопје, Р.Македонија";
const FB_URL = "https://www.facebook.com/multisped.dispatch.5/";
const LI_URL =
  "https://www.linkedin.com/in/multi-sped-l-t-d-international-forwarder-b7845b10b/";

const NAV_LINKS = [
  { key: "home", href: "#" },
  { key: "about", href: "#about" },
  { key: "services", href: "#services" },
  { key: "serviceItems", href: "#service-items" },
  { key: "contact", href: "#contact" },
] as const;

function FacebookIcon() {
  return (
    <svg viewBox="0 0 320 512" fill="currentColor" width={20} height={20}>
      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 448 512" fill="currentColor" width={20} height={20}>
      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 01107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.83-48.3 93.97 0 111.31 61.9 111.31 142.3V448z" />
    </svg>
  );
}

function scrollTo(href: string) {
  if (href === "#") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer id="footer" style={{ backgroundColor: "#0a1628" }}>
      <div className="mx-auto max-w-[1280px] px-[var(--section-x)] py-[var(--section-y)]">
        {/* Top row — 3 columns */}
        <div className="flex flex-col gap-12 md:flex-row">
          {/* Left — logo + tagline (30%) */}
          <div className="flex shrink-0 flex-col gap-8 md:w-[30%]">
            <div className="relative" style={{ width: 120, height: 28 }}>
              <Image
                src="/images/logo.png"
                alt="MultiSped"
                fill
                sizes="120px"
                className="object-contain object-left"
              />
            </div>
            <p
              className="text-base leading-[1.5]"
              style={{ color: "rgba(176,186,196,0.65)" }}
            >
              {t("tagline")}
            </p>
          </div>

          {/* Middle — nav links (35%) */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 md:w-[35%]">
            {NAV_LINKS.map((link) => (
              <button
                key={link.key}
                onClick={() => scrollTo(link.href)}
                className="text-left text-base font-medium leading-[36px]"
                style={{
                  color: "rgba(176,186,196,0.65)",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#7FA8FF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(176,186,196,0.65)";
                }}
              >
                {t(`nav.${link.key}`)}
              </button>
            ))}
          </div>

          {/* Right — contact info (35%) */}
          <div className="flex flex-col gap-6 md:w-[35%] md:items-end md:text-right">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-lg font-medium leading-[1.8]"
              style={{
                color: "#FAFBFC",
                transition: "color 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#7FA8FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#FAFBFC";
              }}
            >
              {CONTACT_EMAIL}
            </a>
            <p
              className="text-base leading-[1.6]"
              style={{ color: "rgba(176,186,196,0.65)" }}
            >
              {CONTACT_ADDRESS}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="my-8"
          style={{ borderTop: "1px solid #1e3a6a" }}
        />

        {/* Bottom row — social left, copyright right */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Social icons */}
          <div className="flex gap-2">
            <a
              href={FB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ms-social-btn ms-social-fb flex items-center justify-center rounded-[5px]"
              style={{ width: 44, height: 44 }}
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>
            <a
              href={LI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ms-social-btn ms-social-li flex items-center justify-center rounded-[5px]"
              style={{ width: 44, height: 44 }}
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
          </div>

          {/* Copyright */}
          <p
            className="text-base leading-[1.5]"
            style={{ color: "rgba(176,186,196,0.45)" }}
          >
            {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
