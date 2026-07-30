"use client";

import { useState } from "react";
import { seatingComingSoonText, seatingPlanReady, tables } from "@/lib/wedding-data";
import type { Guest } from "@/lib/types";
import { SectionHeading } from "./section-heading";

// Позиции центров столов в сетке 2x2, в долях (0..1) от контейнера.
const TABLE_POSITIONS = [
  { fx: 0.25, fy: 0.25 },
  { fx: 0.75, fy: 0.25 },
  { fx: 0.25, fy: 0.75 },
  { fx: 0.75, fy: 0.75 },
];

const ZOOM_SCALE = 2.15;
const SEAT_RADIUS_PERCENT = 38;

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function GuestAvatar({ guest, angleDeg }: { guest: Guest; angleDeg: number }) {
  const rad = (angleDeg * Math.PI) / 180;
  const x = 50 + SEAT_RADIUS_PERCENT * Math.cos(rad);
  const y = 50 + SEAT_RADIUS_PERCENT * Math.sin(rad);

  return (
    <a
      href={guest.social}
      target="_blank"
      rel="noreferrer noopener"
      onClick={(e) => e.stopPropagation()}
      title={guest.name}
      className="group absolute flex w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white text-xs font-semibold text-accent ring-2 ring-accent-soft transition group-hover:ring-accent sm:h-12 sm:w-12 sm:text-sm">
        {initialsOf(guest.name)}
      </span>
      <span className="w-full truncate text-[10px] text-foreground/75 transition group-hover:text-accent sm:text-xs">
        {guest.name}
      </span>
    </a>
  );
}

export function SeatingSection() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedIndex = tables.findIndex((t) => t.id === selected);
  const pos = selectedIndex >= 0 ? TABLE_POSITIONS[selectedIndex] : null;

  const canvasStyle = pos
    ? {
        transformOrigin: `${pos.fx * 100}% ${pos.fy * 100}%`,
        transform: `translate(${(0.5 - pos.fx) * 100}%, ${(0.5 - pos.fy) * 100}%) scale(${ZOOM_SCALE})`,
      }
    : { transformOrigin: "50% 50%", transform: "translate(0%, 0%) scale(1)" };

  return (
    <section id="seating" className="mx-auto w-full max-w-4xl px-6 py-10 sm:py-14">
      <SectionHeading eyebrow="Розсадка" title="Знайдіть своє місце" className="mb-3" />

      {!seatingPlanReady ? (
        <div className="mx-auto flex aspect-square w-full max-w-2xl items-center justify-center rounded-[2rem] border border-line bg-white/50 px-8 text-center shadow-sm">
          <p className="font-serif text-xl text-foreground/70 sm:text-2xl">
            {seatingComingSoonText}
          </p>
        </div>
      ) : (
        <>
          <p className="mx-auto mb-10 max-w-md text-center text-sm text-foreground/60 sm:text-base">
            Натисніть на стіл, щоб наблизити його. Аватар і ім&apos;я гостя ведуть на його
            сторінку в соцмережі.
          </p>

          <div className="relative mx-auto aspect-square w-full max-w-2xl overflow-hidden rounded-[2rem] border border-line bg-white/50 shadow-sm">
            {selected && (
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 z-20 rounded-full border border-line bg-background/90 px-4 py-2 text-xs font-medium text-foreground/80 shadow-sm backdrop-blur transition hover:border-accent hover:text-accent sm:text-sm"
              >
                ← Усі столи
              </button>
            )}

            <div
              className="grid h-full w-full grid-cols-2 grid-rows-2 transition-transform duration-700 ease-in-out"
              style={canvasStyle}
            >
              {tables.map((table) => {
                const isSelected = table.id === selected;
                const isDimmed = selected !== null && !isSelected;

                return (
                  <div
                    key={table.id}
                    className={`relative flex items-center justify-center transition-opacity duration-500 ${
                      isDimmed ? "pointer-events-none opacity-20" : "opacity-100"
                    }`}
                  >
                    {table.guests.map((guest, i) => (
                      <GuestAvatar key={guest.id} guest={guest} angleDeg={-90 + i * 45} />
                    ))}

                    <button
                      type="button"
                      onClick={() => setSelected(isSelected ? null : table.id)}
                      className="relative z-10 flex aspect-square w-[26%] flex-col items-center justify-center rounded-full border-2 border-accent/60 bg-accent-soft/40 font-serif text-foreground shadow-inner transition-all duration-300 hover:border-accent hover:bg-accent-soft/70"
                    >
                      <span className="text-sm sm:text-base">{table.label}</span>
                      <span className="text-[10px] font-sans text-foreground/50 sm:text-xs">
                        {table.guests.length} гостей
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
