import { stay } from "@/lib/wedding-data";
import { SectionHeading } from "./section-heading";

export function StaySection() {
  return (
    <section id="stay" className="mx-auto w-full max-w-2xl px-6 py-10 sm:py-14">
      <SectionHeading eyebrow="Організація" title={stay.eyebrow} className="mb-14" />

      <div className="mb-14">
        <h3 className="mb-4 font-serif text-2xl text-foreground">
          {stay.accommodation.heading}
        </h3>
        <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/75 sm:text-base">
          {stay.accommodation.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-serif text-2xl text-foreground">{stay.transfer.heading}</h3>
        <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/75 sm:text-base">
          {stay.transfer.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <ul className="mt-4 flex flex-col gap-2 text-sm text-foreground/75 sm:text-base">
          {stay.transfer.checklist.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm leading-relaxed text-foreground/75 sm:text-base">
          {stay.transfer.plan.intro}
        </p>

        <ul className="mt-4 flex flex-col gap-3">
          {stay.transfer.plan.items.map((item, i) => (
            <li key={i} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
              <span className="font-serif text-accent">{item.date}</span>
              <span className="text-sm text-foreground/75 sm:text-base">{item.text}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-foreground/50 italic">{stay.transfer.plan.note}</p>
      </div>
    </section>
  );
}
