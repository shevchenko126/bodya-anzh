"use client";

import { useEffect, useState } from "react";
import { couple, nav } from "@/lib/wedding-data";

const HEADER_GAP = 16; // невеликий відступ під хедером, щоб заголовок блоку не впирався в межу

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function animateScrollTo(targetY: number, duration = 550) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  if (Math.abs(diff) < 1) return;
  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + diff * easeInOutQuad(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

export function SiteNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function goTo(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.querySelector("header");
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const targetY = el.getBoundingClientRect().top + window.scrollY - headerHeight - HEADER_GAP;
    setOpen(false);
    animateScrollTo(Math.max(targetY, 0));
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <a
            href="#hero"
            onClick={(e) => goTo(e, "hero")}
            className="font-serif text-lg tracking-wide text-foreground"
          >
            {couple.groomName} <span className="text-accent">&</span> {couple.brideName}
          </a>

          <nav className="hidden gap-6 text-sm text-foreground/70 md:flex">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => goTo(e, item.id)}
                className="transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col gap-1.5 p-2 md:hidden"
            aria-label={open ? "Закрити меню" : "Відкрити меню"}
            aria-expanded={open}
          >
            <span className={`h-px w-6 bg-foreground transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`h-px w-6 bg-foreground transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`h-px w-6 bg-foreground transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </button>
        </div>
      </header>

      {/* Повноекранне мобільне меню — навмисно поза <header>: backdrop-blur на
          хедері створює containing block для position:fixed нащадків, і якби
          цей блок лишився всередині header, він би обмежувався його висотою. */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-background transition-opacity duration-300 ease-out md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-5 py-3">
          <span className="font-serif text-lg tracking-wide text-foreground">
            {couple.groomName} <span className="text-accent">&</span> {couple.brideName}
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Закрити меню"
            className="p-2 text-3xl leading-none text-foreground"
          >
            ×
          </button>
        </div>

        <nav className="flex flex-1 flex-col items-center justify-center gap-7">
          {nav.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => goTo(e, item.id)}
              className={`font-serif text-2xl text-foreground transition-all duration-300 hover:text-accent ${
                open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
