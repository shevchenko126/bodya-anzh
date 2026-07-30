import { info } from "@/lib/wedding-data";
import { SectionHeading } from "./section-heading";

export function InfoSection() {
  return (
    <section id="info" className="mx-auto w-full max-w-3xl px-6 py-10 sm:py-14">
      <SectionHeading eyebrow="Вітаємо" title={info.heading} className="mb-10" />
      <div className="flex flex-col gap-5 text-center text-base leading-relaxed text-foreground/80 sm:text-lg">
        {info.paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
