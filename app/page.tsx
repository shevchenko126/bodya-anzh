import { GallerySection } from "@/components/gallery-section";
import { GoodToKnowSection } from "@/components/good-to-know-section";
import { HeroSection } from "@/components/hero-section";
import { InfoSection } from "@/components/info-section";
import { MobileQuickUpload } from "@/components/mobile-quick-upload";
import { SeatingSection } from "@/components/seating-section";
import { SiteNav } from "@/components/site-nav";
import { StaySection } from "@/components/stay-section";
import { ThanksSection } from "@/components/thanks-section";
import { UploadSection } from "@/components/upload-section";
import { WhenWhereSection } from "@/components/when-where-section";
import { gallery } from "@/lib/wedding-data";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <InfoSection />
        <WhenWhereSection />
        <StaySection />

        <GoodToKnowSection />
        <SeatingSection />
        <GallerySection id="gallery" photos={gallery} />
        <UploadSection />
        <ThanksSection />
      </main>
      <MobileQuickUpload />
    </div>
  );
}
