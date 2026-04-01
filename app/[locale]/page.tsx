import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { ServiceItems } from "@/components/sections/ServiceItems";
import { Sectors } from "@/components/sections/Sectors";
import { Partners } from "@/components/sections/Partners";
import { MapLoader } from "@/components/sections/MapLoader";
import { Contact } from "@/components/sections/Contact";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <ServiceItems />
        <Sectors />
        <Partners />
        <MapLoader />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
