"use client";

import { useEffect, useRef, useState } from "react";
import { photoShare } from "@/lib/wedding-data";
import { SectionHeading } from "./section-heading";
import { Toast } from "./toast";

type FileKind = "image" | "video" | "other";

interface PendingFile {
  file: File;
  previewUrl: string;
  kind: FileKind;
}

type Status = "idle" | "uploading" | "success" | "error";

function kindOf(file: File): FileKind {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "other";
}

export function UploadSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const next = Array.from(fileList).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      kind: kindOf(file),
    }));
    setStatus("idle");
    setMessage(null);
    setPending((prev) => [...prev, ...next]);
  }

  function removeAt(index: number) {
    setPending((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return copy;
    });
  }

  function showMessage(text: string, nextStatus: Status) {
    setStatus(nextStatus);
    setMessage(text);
    setTimeout(() => {
      setStatus("idle");
      setMessage(null);
    }, 4000);
  }

  async function handleSubmit() {
    if (pending.length === 0) return;
    setStatus("uploading");
    setMessage(null);

    const formData = new FormData();
    pending.forEach((p) => formData.append("photos", p.file));

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Не вдалося надіслати файли");

      pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      setPending([]);
      showMessage("Дякуємо! Надіслано.", "success");
    } catch (err) {
      showMessage(err instanceof Error ? err.message : "Щось пішло не так", "error");
    }
  }

  return (
    <section id="upload" className="mx-auto w-full max-w-3xl px-6 py-10 sm:py-14">
      <SectionHeading eyebrow={photoShare.eyebrow} title={photoShare.heading} className="mb-6" />
      <div className="mx-auto mb-10 flex max-w-md flex-col gap-3 text-center text-sm leading-relaxed text-foreground/70 sm:text-base">
        {photoShare.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed px-6 py-12 text-center transition-colors sm:min-h-[280px] ${
          isDragging
            ? "border-accent bg-accent-soft/30"
            : "border-line bg-white/40 hover:border-accent/60 hover:bg-accent-soft/10"
        }`}
      >
        <span className="text-4xl">📎</span>
        <p className="font-serif text-lg text-foreground sm:text-xl">Перетягніть файли сюди</p>
        <p className="text-sm text-foreground/60">
          фото, відео чи будь-що інше — або натисніть, щоб вибрати
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="*/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {pending.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {pending.map((p, i) => (
            <div key={p.previewUrl} className="group relative aspect-square overflow-hidden rounded-xl bg-black/5">
              {p.kind === "video" ? (
                <video src={p.previewUrl} className="h-full w-full object-cover" muted playsInline />
              ) : p.kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.previewUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center">
                  <span className="text-2xl">📄</span>
                  <span className="w-full truncate text-[11px] text-foreground/70">
                    {p.file.name}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAt(i);
                }}
                aria-label="Прибрати файл"
                className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={pending.length === 0 || status === "uploading"}
          className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "uploading"
            ? "Надсилання…"
            : `Надіслати${pending.length ? ` (${pending.length})` : ""}`}
        </button>
      </div>

      {message && <Toast message={message} variant={status === "error" ? "error" : "success"} />}
    </section>
  );
}
