import { whenWhere } from "@/lib/wedding-data";
import { SectionHeading } from "./section-heading";

export function WhenWhereSection() {
  return (
    <section id="when-where" className="mx-auto w-full max-w-2xl px-6 py-10 sm:py-14">
      <SectionHeading eyebrow={whenWhere.eyebrow} title={whenWhere.heading} className="mb-6" />

      <div className="mb-14 flex flex-wrap items-center justify-center gap-3">
        <a
          href={whenWhere.venue.instagram}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-2 rounded-full border border-line bg-white/60 px-5 py-2.5 text-sm text-foreground/80 transition hover:border-accent hover:text-accent"
        >
          📷 Instagram {whenWhere.venue.name}
        </a>
        <a
          href={whenWhere.venue.mapsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-2 rounded-full border border-line bg-white/60 px-5 py-2.5 text-sm text-foreground/80 transition hover:border-accent hover:text-accent"
        >
          📍 Локація на карті
        </a>
      </div>

      <div className="mb-4">
        <h3 className="mb-6 text-center font-serif text-2xl text-foreground">
          {whenWhere.day1.label}
        </h3>
        <ol className="relative border-l border-line pl-8 sm:pl-10">
          {whenWhere.day1.timeline.map((item, i) => (
            <li key={i} className="relative pb-8 last:pb-0">
              <span className="absolute top-1 -left-[calc(2rem+5px)] h-2.5 w-2.5 rounded-full bg-accent sm:-left-[calc(2.5rem+5px)]" />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                <span className="font-serif text-lg text-accent">{item.time}</span>
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  {item.description && (
                    <p className="text-sm text-foreground/60">{item.description}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-12 rounded-3xl border border-line bg-white/50 px-6 py-8 sm:px-10">
        <h4 className="mb-4 font-serif text-xl text-foreground">
          {whenWhere.dressCode.heading}
        </h4>
        <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/75 sm:text-base">
          {whenWhere.dressCode.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="mb-4 text-center font-serif text-2xl text-foreground">
          {whenWhere.day2.label}
        </h3>
        <div className="flex flex-col gap-3 text-center text-sm leading-relaxed text-foreground/75 sm:text-base">
          {whenWhere.day2.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
