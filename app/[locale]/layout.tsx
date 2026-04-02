import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { MotionProvider } from "@/components/layout/MotionProvider";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "MultiSped — Freight Forwarding & Logistics",
  description:
    "MultiSped is a North Macedonian logistics company providing international freight forwarding, customs brokerage, and supply chain solutions across Europe.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "MultiSped — Freight Forwarding & Logistics",
    description: "Логистика што го движи вашиот бизнис напред.",
    url: "https://multisped.fly.dev",
    siteName: "MultiSped",
    images: [
      {
        url: "https://multisped.fly.dev/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MultiSped International Forwarder",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020c1b",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "mk" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("ms-theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <MotionProvider>
            {children}
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
