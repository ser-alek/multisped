"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  type ContactFormData,
} from "@/lib/validations/contact";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CONTACT_EMAIL = "multisped2001@multisped.com.mk";
const CONTACT_PHONE = "+389 2 2447441 | +389 2 2447442";
const CONTACT_ADDRESS = "Ул. 34 бр. 12 Илинден 1000 Скопје, Р.Македонија";
const FB_URL = "https://www.facebook.com/multisped.dispatch.5/";
const LI_URL =
  "https://www.linkedin.com/in/multi-sped-l-t-d-international-forwarder-b7845b10b/";

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

export function Contact() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  function onSubmit(data: ContactFormData) {
    const subject = data.title;
    const body = [
      `${t("name")}: ${data.name}`,
      `${t("email")}: ${data.email}`,
      `${t("company")}: ${data.company}`,
      "",
      data.message,
    ].join("\n");
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, "_self");
    setSubmitted(true);
  }

  return (
    <section id="contact" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="mx-auto max-w-[1280px] px-[var(--section-x)] py-[var(--section-y)]">
        {/* Header */}
        <motion.div
          className="mb-[72px] text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
        >
          <h2
            className="mx-auto max-w-[872px] text-[2.5rem] font-bold leading-[1.07] tracking-[-0.02em] md:text-[3.5rem]"
            style={{ color: "var(--text-heading)" }}
          >
            {t("heading")}
          </h2>
          <p
            className="mx-auto mt-8 max-w-[692px] text-xl leading-[1.4]"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("subheading")}
          </p>
        </motion.div>

        {/* Two-column layout */}
        <motion.div
          className="flex flex-col gap-0 overflow-hidden rounded-[var(--radius-card)] md:flex-row"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.5,
            delay: 0.15,
            ease: [0.4, 0, 0.2, 1] as const,
          }}
        >
          {/* Left — dark info card */}
          <div
            className="flex flex-col justify-between p-10 md:w-[42%] md:min-w-[400px]"
            style={{
              backgroundColor: "#0e1c34",
              borderRadius: "var(--radius-card)",
            }}
          >
            <div>
              <h3
                className="text-[2rem] font-bold leading-[1.22] tracking-[-0.02em] md:text-[2.25rem]"
                style={{ color: "#FAFBFC" }}
              >
                {t("cardTitle")}
              </h3>

              <div className="mt-10 flex flex-col gap-6">
                {/* Email */}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-4"
                >
                  <span
                    className="flex shrink-0 items-center justify-center rounded-full"
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: "#2529D8",
                    }}
                  >
                    <Mail size={22} color="#fff" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <span
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "rgba(176,186,196,0.55)" }}
                    >
                      {t("emailLabel")}
                    </span>
                    <span
                      className="break-all text-sm leading-[1.4] md:text-base"
                      style={{ color: "#FAFBFC" }}
                    >
                      {CONTACT_EMAIL}
                    </span>
                  </div>
                </a>

                {/* Phone */}
                <div className="flex items-center gap-4">
                  <span
                    className="flex shrink-0 items-center justify-center rounded-full"
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: "#2529D8",
                    }}
                  >
                    <Phone size={22} color="#fff" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <span
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "rgba(176,186,196,0.55)" }}
                    >
                      {t("phoneLabel")}
                    </span>
                    <span
                      className="text-sm leading-[1.4] md:text-base"
                      style={{ color: "#FAFBFC" }}
                    >
                      {CONTACT_PHONE}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-4">
                  <span
                    className="flex shrink-0 items-center justify-center rounded-full"
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: "#2529D8",
                    }}
                  >
                    <MapPin size={22} color="#fff" />
                  </span>
                  <span
                    className="text-sm leading-[1.4] md:text-base"
                    style={{ color: "#FAFBFC" }}
                  >
                    {CONTACT_ADDRESS}
                  </span>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="mt-10">
              <p
                className="text-base font-medium leading-[1.5]"
                style={{ color: "rgba(176,186,196,0.65)" }}
              >
                {t("followUs")}
              </p>
              <div className="mt-4 flex gap-2">
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
            </div>
          </div>

          {/* Right — form card */}
          <div
            className="flex-1 p-10"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: "var(--radius-card)",
            }}
          >
            {submitted ? (
              <div className="flex h-full items-center justify-center">
                <p
                  className="text-lg font-semibold"
                  style={{ color: "var(--status-success-text)" }}
                >
                  {t("successMsg")}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
                noValidate
              >
                {/* Row: Name + Email */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="contact-name"
                      className="text-sm"
                      style={{ color: "var(--text-heading)" }}
                    >
                      {t("name")}
                    </Label>
                    <Input
                      id="contact-name"
                      placeholder={t("namePlaceholder")}
                      style={{
                        borderRadius: "var(--radius-input)",
                        backgroundColor: "var(--bg-surface)",
                      }}
                      {...register("name")}
                    />
                    {errors.name && (
                      <span
                        className="text-xs"
                        style={{ color: "var(--status-error-text)" }}
                      >
                        {t("validation.required")}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="contact-email"
                      className="text-sm"
                      style={{ color: "var(--text-heading)" }}
                    >
                      {t("email")}
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      style={{
                        borderRadius: "var(--radius-input)",
                        backgroundColor: "var(--bg-surface)",
                      }}
                      {...register("email")}
                    />
                    {errors.email && (
                      <span
                        className="text-xs"
                        style={{ color: "var(--status-error-text)" }}
                      >
                        {errors.email.type === "email"
                          ? t("validation.email")
                          : t("validation.required")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="contact-title"
                    className="text-sm"
                    style={{ color: "var(--text-heading)" }}
                  >
                    {t("title")}
                  </Label>
                  <Input
                    id="contact-title"
                    placeholder={t("titlePlaceholder")}
                    style={{
                      borderRadius: "var(--radius-input)",
                      backgroundColor: "var(--bg-surface)",
                    }}
                    {...register("title")}
                  />
                  {errors.title && (
                    <span
                      className="text-xs"
                      style={{ color: "var(--status-error-text)" }}
                    >
                      {t("validation.required")}
                    </span>
                  )}
                </div>

                {/* Company */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="contact-company"
                    className="text-sm"
                    style={{ color: "var(--text-heading)" }}
                  >
                    {t("company")}
                  </Label>
                  <Input
                    id="contact-company"
                    placeholder={t("companyPlaceholder")}
                    style={{
                      borderRadius: "var(--radius-input)",
                      backgroundColor: "var(--bg-surface)",
                    }}
                    {...register("company")}
                  />
                  {errors.company && (
                    <span
                      className="text-xs"
                      style={{ color: "var(--status-error-text)" }}
                    >
                      {t("validation.required")}
                    </span>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="contact-message"
                    className="text-sm"
                    style={{ color: "var(--text-heading)" }}
                  >
                    {t("message")}
                  </Label>
                  <Textarea
                    id="contact-message"
                    placeholder={t("messagePlaceholder")}
                    style={{
                      minHeight: 120,
                      borderRadius: "var(--radius-input)",
                      backgroundColor: "var(--bg-surface)",
                    }}
                    {...register("message")}
                  />
                  {errors.message && (
                    <span
                      className="text-xs"
                      style={{ color: "var(--status-error-text)" }}
                    >
                      {t("validation.required")}
                    </span>
                  )}
                </div>

                {/* Submit */}
                <div className="mt-2">
                  <Button
                    type="submit"
                    className="ms-btn-primary w-full gap-3 font-bold md:w-auto"
                    style={{
                      color: "var(--btn-primary-text)",
                      borderRadius: "var(--radius-button)",
                      boxShadow: "var(--btn-primary-shadow)",
                      paddingLeft: 32,
                      paddingRight: 32,
                      height: 48,
                    }}
                  >
                    {t("submit")}
                    <ArrowRight size={20} />
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
