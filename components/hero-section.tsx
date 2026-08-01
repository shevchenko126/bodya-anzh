import { couple } from "@/lib/wedding-data";
import { PhotoFrame } from "./photo-frame";

export function HeroSection() {
  return (
    <section id="hero" className="relative flex h-[92svh] min-h-[520px] w-full items-end overflow-hidden">
      <div className="absolute inset-0">
        <PhotoFrame
          src={couple.heroImage}
          mobileSrc={couple.heroImageMobile}
          alt="Фото пари"
          className="h-full w-full"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-5 px-6 pb-16 text-center text-white sm:pb-24">
        <span className="text-xs font-semibold tracking-[0.4em] uppercase text-white/80">
          Запрошуємо на весілля
        </span>
        <h1 className="font-serif text-5xl leading-tight sm:text-7xl">
          {couple.groomName} <span className="text-white/70">&</span> {couple.brideName}
        </h1>
        <p className="text-lg text-white/90 sm:text-xl">{couple.dateLabel}</p>
        <p className="text-sm text-white/75 sm:text-base">
          {couple.venueAddress ? `${couple.venueName} · ${couple.venueAddress}` : couple.venueName}
        </p>
      </div>
    </section>
  );
}
