interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  className?: string;
}

export function SectionHeading({ eyebrow, title, className = "" }: SectionHeadingProps) {
  return (
    <div className={`flex flex-col items-center gap-3 text-center ${className}`}>
      {eyebrow && (
        <span className="text-xs font-semibold tracking-[0.3em] text-accent uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif text-3xl text-foreground sm:text-4xl">{title}</h2>
      <div className="h-px w-16 bg-accent/50" />
    </div>
  );
}
