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
import { galleryPart1, galleryPart2 } from "@/lib/wedding-data";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <InfoSection />
        <GallerySection id="gallery-1" photos={galleryPart1} />
        <WhenWhereSection />
        <StaySection />
        <SeatingSection />
        <GallerySection id="gallery-2" photos={galleryPart2} />
        <UploadSection />
        <GoodToKnowSection />
        <ThanksSection />
      </main>
      <MobileQuickUpload />
    </div>
  );
}
