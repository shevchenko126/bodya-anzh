"use client";

import { useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "@/lib/types";
import { PhotoFrame } from "./photo-frame";
import { SectionHeading } from "./section-heading";

const AUTOPLAY_INTERVAL_MS = 2000;

interface GallerySectionProps {
  id: string;
  photos: GalleryPhoto[];
  eyebrow?: string;
}

export function GallerySection({ id, photos, eyebrow = "Наші миті" }: GallerySectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Прокручуємо лише сам трек каруселі (track.scrollTo), а не scrollIntoView —
  // останній зачіпає й вертикальний скрол сторінки, через що вона "стрибала"
  // між блоками щоразу, як спрацьовував автоплей.
  function scrollToIndex(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const wrapped = (index + photos.length) % photos.length;
    const child = track.children[wrapped] as HTMLElement | undefined;
    if (child) {
      const target = child.offsetLeft - (track.clientWidth - child.clientWidth) / 2;
      track.scrollTo({ left: target, behavior: "smooth" });
    }
    setActive(wrapped);
  }

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let closestDist = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const center = el.offsetLeft + el.clientWidth / 2;
      const dist = Math.abs(center - trackCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActive(closest);
  }

  // Автоплей працює, тільки поки блок реально видно на екрані.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      scrollToIndex(active + 1);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, isVisible]);

  return (
    <section id={id} className="w-full py-10 sm:py-14">
      <SectionHeading eyebrow={eyebrow} className="mb-10 px-6" />

      <div className="relative mx-auto max-w-5xl px-6">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
        >
          {photos.map((photo, i) => (
            <div
              key={i}
              className="relative aspect-[4/5] w-[75%] flex-none snap-center overflow-hidden rounded-2xl sm:w-[45%] lg:w-[32%]"
            >
              <PhotoFrame
                src={photo.src}
                alt={photo.alt}
                className="h-full w-full"
                sizes="(max-width: 640px) 75vw, (max-width: 1024px) 45vw, 32vw"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToIndex(active - 1)}
          aria-label="Попереднє фото"
          className="absolute top-1/2 left-0 hidden -translate-y-1/2 rounded-full border border-line bg-background/90 p-3 shadow-sm transition hover:border-accent hover:text-accent sm:flex"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scrollToIndex(active + 1)}
          aria-label="Наступне фото"
          className="absolute top-1/2 right-0 hidden -translate-y-1/2 rounded-full border border-line bg-background/90 p-3 shadow-sm transition hover:border-accent hover:text-accent sm:flex"
        >
          ›
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {photos.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Перейти до фото ${i + 1}`}
            onClick={() => scrollToIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === active ? "w-6 bg-accent" : "w-2 bg-accent-soft"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
