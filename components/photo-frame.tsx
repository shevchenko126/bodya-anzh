import Image from "next/image";

interface PhotoFrameProps {
  src?: string;
  /** Окреме фото для мобільних екранів (до breakpoint sm) — якщо задане, замінює `src` на телефонах. */
  mobileSrc?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Обгортка над next/image: поки в дані не підставлено реальне фото
 * (src порожній), малює акуратну заглушку замість зображення.
 */
export function PhotoFrame({ src, mobileSrc, alt, className = "", sizes, priority }: PhotoFrameProps) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-accent-soft via-[#efe4d6] to-accent/30 ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="px-4 text-center font-serif text-sm text-foreground/50 sm:text-base">
          {alt}
        </span>
      </div>
    );
  }

  if (mobileSrc) {
    return (
      <>
        <Image
          src={mobileSrc}
          alt={alt}
          fill
          sizes={sizes ?? "100vw"}
          priority={priority}
          className={`object-cover sm:hidden ${className}`}
        />
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "100vw"}
          priority={priority}
          className={`hidden object-cover sm:block ${className}`}
        />
      </>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "100vw"}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
