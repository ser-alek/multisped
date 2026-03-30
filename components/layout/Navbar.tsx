"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";

const NAV_LINKS = [
  { key: "about", href: "#about" },
  { key: "services", href: "#services" },
  { key: "sectors", href: "#sectors" },
  { key: "contact", href: "#contact" },
] as const;

const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1));

export function Navbar() {
  const t = useTranslations("nav");
  const tTheme = useTranslations("theme");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ms-theme");
    if (saved === "dark") setTheme("dark");
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    observerRef.current?.disconnect();

    const visibleRatios = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleRatios.set(entry.target.id, entry.intersectionRatio);
        });

        let best: string | null = null;
        let bestRatio = 0;
        visibleRatios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });

        if (bestRatio > 0) {
          setActiveSection(best);
        }
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 1] },
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleTheme = useCallback(() => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("ms-theme", next);
  }, [theme]);

  const switchLocale = useCallback(() => {
    const nextLocale = locale === "mk" ? "en" : "mk";
    router.replace(pathname, { locale: nextLocale });
  }, [locale, pathname, router]);

  const scrollToSection = useCallback(
    (href: string) => {
      setMobileOpen(false);
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
    [],
  );

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 px-[var(--section-x)] pt-4 md:pt-6"
      >
        <nav
          className="mx-auto flex max-w-[1280px] items-center justify-between rounded-[var(--radius-pill)] px-6 transition-all duration-300"
          style={{
            height: "var(--nav-height)",
            backgroundColor: "var(--nav-bg)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: scrolled
              ? "0 4px 24px rgba(2,12,27,0.08)"
              : "0 0px 48px rgba(6,28,61,0.05)",
            borderBottom: scrolled
              ? "1px solid var(--nav-border)"
              : "1px solid transparent",
          }}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1 shrink-0"
            aria-label="MultiSped"
          >
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--btn-primary-bg)" }}
            >
              Multi
            </span>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--text-heading)" }}
            >
              Sped
            </span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.slice(1);
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={link.key}
                  onClick={() => scrollToSection(link.href)}
                  className="text-base font-medium"
                  style={{
                    color: isActive
                      ? "var(--nav-link-active)"
                      : "var(--nav-link)",
                    transition: "color 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.color = "var(--nav-link-hover)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.color = "var(--nav-link)";
                  }}
                >
                  {t(link.key)}
                </button>
              );
            })}
          </div>

          {/* Desktop right group */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={switchLocale}
              className="flex items-center rounded-[var(--radius-pill)] border px-3 py-1.5 text-sm font-semibold transition-colors duration-200"
              style={{
                borderColor: "var(--border-default)",
                color: "var(--text-secondary)",
              }}
              aria-label={t("menu")}
            >
              <span
                className="transition-colors duration-200"
                style={{
                  color:
                    locale === "mk"
                      ? "var(--text-brand)"
                      : "var(--text-secondary)",
                }}
              >
                MK
              </span>
              <span className="mx-1.5" style={{ color: "var(--border-default)" }}>
                |
              </span>
              <span
                className="transition-colors duration-200"
                style={{
                  color:
                    locale === "en"
                      ? "var(--text-brand)"
                      : "var(--text-secondary)",
                }}
              >
                EN
              </span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-button)] transition-colors duration-200 hover:bg-[var(--bg-subtle)]"
              aria-label={tTheme("toggle")}
            >
              {theme === "light" ? (
                <Moon size={18} style={{ color: "var(--icon-default)" }} />
              ) : (
                <Sun size={18} style={{ color: "var(--icon-default)" }} />
              )}
            </button>

            {/* CTA */}
            <Button
              onClick={() => scrollToSection("#contact")}
              className="font-bold"
              style={{
                backgroundColor: "var(--btn-primary-bg)",
                color: "var(--btn-primary-text)",
                borderRadius: "var(--radius-button)",
                boxShadow: "var(--btn-primary-shadow)",
              }}
            >
              {t("cta")}
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex lg:hidden h-10 w-10 items-center justify-center rounded-[var(--radius-button)]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t("close") : t("menu")}
          >
            {mobileOpen ? (
              <X size={24} style={{ color: "var(--icon-default)" }} />
            ) : (
              <Menu size={24} style={{ color: "var(--icon-default)" }} />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col lg:hidden"
          style={{ backgroundColor: "var(--bg-page)" }}
        >
          <div
            className="pt-28 px-[var(--section-x)] flex flex-1 flex-col gap-2"
          >
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.slice(1);
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={link.key}
                  onClick={() => scrollToSection(link.href)}
                  className="w-full rounded-[var(--radius-card)] px-4 py-4 text-left text-lg font-semibold"
                  style={{
                    color: isActive
                      ? "var(--nav-link-active)"
                      : "var(--text-heading)",
                    transition: "color 150ms ease",
                  }}
                >
                  {t(link.key)}
                </button>
              );
            })}

            <div className="mt-6 flex items-center gap-3">
              {/* Language toggle mobile */}
              <button
                onClick={switchLocale}
                className="flex items-center rounded-[var(--radius-pill)] border px-4 py-2 text-sm font-semibold"
                style={{
                  borderColor: "var(--border-default)",
                  color: "var(--text-secondary)",
                }}
              >
                <span
                  style={{
                    color:
                      locale === "mk"
                        ? "var(--text-brand)"
                        : "var(--text-secondary)",
                  }}
                >
                  MK
                </span>
                <span
                  className="mx-2"
                  style={{ color: "var(--border-default)" }}
                >
                  |
                </span>
                <span
                  style={{
                    color:
                      locale === "en"
                        ? "var(--text-brand)"
                        : "var(--text-secondary)",
                  }}
                >
                  EN
                </span>
              </button>

              {/* Theme toggle mobile */}
              <button
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-button)] border"
                style={{ borderColor: "var(--border-default)" }}
                aria-label={tTheme("toggle")}
              >
                {theme === "light" ? (
                  <Moon size={18} style={{ color: "var(--icon-default)" }} />
                ) : (
                  <Sun size={18} style={{ color: "var(--icon-default)" }} />
                )}
              </button>
            </div>

            <div className="mt-4">
              <Button
                onClick={() => scrollToSection("#contact")}
                className="w-full font-bold"
                style={{
                  backgroundColor: "var(--btn-primary-bg)",
                  color: "var(--btn-primary-text)",
                  borderRadius: "var(--radius-button)",
                  boxShadow: "var(--btn-primary-shadow)",
                }}
              >
                {t("cta")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
