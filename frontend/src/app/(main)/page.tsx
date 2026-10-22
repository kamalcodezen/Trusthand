
import Hero from "@/components/homepage/Hero";
import MarketIntelligence from "@/components/homepage/MarketIntelligence";
import Process from "@/components/homepage/Process";
import Service from "@/components/homepage/Service";
import TopArtisans from "@/components/homepage/TopArtisans";

import TrustStandards from "@/components/homepage/TrustStandards";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Service />
      <Process />
      <TrustStandards />
      <TopArtisans />
      <MarketIntelligence />
    </main>
  );
}
