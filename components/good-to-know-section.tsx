import { generateQrSvg } from "@/lib/qr";
import { goodToKnow } from "@/lib/wedding-data";
import { SectionHeading } from "./section-heading";

export async function GoodToKnowSection() {
  const { packing, flowers, contacts, rsvpReminder } = goodToKnow;
  const qrText = flowers.donationLink || "Посилання з'явиться пізніше";
  const qrSvg = await generateQrSvg(qrText);

  return (
    <section id="good-to-know" className="mx-auto w-full max-w-2xl px-6 py-10 sm:py-14">
      <SectionHeading eyebrow={goodToKnow.eyebrow} title="Корисно знати" className="mb-14" />

      <div className="mb-12">
        <h3 className="mb-4 font-serif text-2xl text-foreground">{packing.heading}</h3>
        <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/75 sm:text-base">
          {packing.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="mb-12 rounded-3xl bg-white px-6 py-8 shadow-sm sm:px-10">
        <h3 className="mb-4 font-serif text-2xl text-foreground">{flowers.heading}</h3>
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/75 sm:text-base">
            {flowers.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="flex flex-none flex-col items-center gap-2">
            <div
              className="h-36 w-36 [&>svg]:h-full [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            {!flowers.donationLink && (
              <span className="text-center text-xs text-foreground/45">
                тимчасовий QR — посилання оновимо пізніше
              </span>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-serif text-2xl text-foreground">{contacts.heading}</h3>
        <p className="mb-6 text-sm leading-relaxed text-foreground/75 sm:text-base">
          {contacts.intro}
        </p>

        <div className="mb-8 rounded-2xl border border-line bg-white/50 px-6 py-6">
          <p className="mb-3 text-sm leading-relaxed text-foreground/75">{contacts.host.note}</p>
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-lg text-foreground">{contacts.host.name}</span>
            <span className="text-xs tracking-widest text-accent uppercase">
              {contacts.host.role}
            </span>
          </div>
          <a href={`tel:${contacts.host.phone.replace(/\s+/g, "")}`} className="text-accent hover:underline">
            {contacts.host.phone}
          </a>
        </div>

        <h4 className="mb-3 font-serif text-lg text-foreground">
          {contacts.unavailable.heading}
        </h4>
        <div className="mb-5 flex flex-col gap-2 text-sm leading-relaxed text-foreground/75 sm:text-base">
          {contacts.unavailable.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          {contacts.friends.map((friend) => (
            <div
              key={friend.name}
              className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-white/50 px-4 py-5 text-center"
            >
              <span className="font-serif text-foreground">{friend.name}</span>
              <a
                href={`tel:${friend.phone.replace(/\s+/g, "")}`}
                className="text-sm text-accent hover:underline"
              >
                {friend.phone}
              </a>
            </div>
          ))}
        </div>

        <p className="mb-3 text-sm leading-relaxed text-foreground/75 sm:text-base">
          {contacts.gateNote}
        </p>
        <div className="mb-10 flex flex-wrap justify-center gap-x-6 gap-y-1">
          {contacts.administrators.map((phone) => (
            <a
              key={phone}
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="text-sm text-accent hover:underline"
            >
              {phone}
            </a>
          ))}
        </div>

        <p className="rounded-2xl bg-accent-soft/30 px-6 py-5 text-center text-base font-medium text-foreground">
          {rsvpReminder}
        </p>
      </div>
    </section>
  );
}
