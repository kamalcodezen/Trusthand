import TrustAI from "@/components/ai/TrustAI";

import FaqSection from "@/components/homepage/FaqSection";
import FooterCta from "@/components/homepage/FooterCta";
import Hero from "@/components/homepage/Hero";
import MarketIntelligence from "@/components/homepage/MarketIntelligence";
import Process from "@/components/homepage/Process";
import Service from "@/components/homepage/Service";
import TopArtisans from "@/components/homepage/TopArtisans";
import TrustStandards from "@/components/homepage/TrustStandards";
import WorkerCta from "@/components/homepage/WorkerCta";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Service />
      <Process />
      <TrustStandards />
      <TopArtisans />
      <MarketIntelligence />
      <WorkerCta />
      <FaqSection />
      <FooterCta />

      <TrustAI kind="public" floating />
    </main>
  );
}