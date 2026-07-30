import { closing } from "@/lib/wedding-data";

export function ThanksSection() {
  return (
    <section
      id="thanks"
      className="flex w-full items-center justify-center bg-accent-soft/20 px-6 py-24 sm:py-32"
    >
      <p className="font-serif text-3xl text-foreground sm:text-5xl">{closing.text}</p>
    </section>
  );
}
