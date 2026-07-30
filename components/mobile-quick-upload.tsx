"use client";

import { useRef, useState } from "react";
import { Toast } from "./toast";

type Status = "idle" | "uploading" | "success" | "error";

export function MobileQuickUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  function showMessage(text: string, nextStatus: Status) {
    setStatus(nextStatus);
    setMessage(text);
    setTimeout(() => {
      setStatus("idle");
      setMessage(null);
    }, 4000);
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    setStatus("uploading");
    setMessage(null);

    const formData = new FormData();
    Array.from(fileList).forEach((file) => formData.append("photos", file));

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Не вдалося надіслати фото");
      showMessage("Дякуємо! Фото надіслано.", "success");
    } catch (err) {
      showMessage(err instanceof Error ? err.message : "Щось пішло не так", "error");
    }
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={status === "uploading"}
        aria-label="Швидко зробити і надіслати фото"
        className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg transition active:scale-95 disabled:opacity-60"
      >
        {status === "uploading" ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path
              d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l.8-1.6A1.5 1.5 0 0 1 9.66 4.5h4.68a1.5 1.5 0 0 1 1.36.9L16.5 7h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </button>

      {message && <Toast message={message} variant={status === "error" ? "error" : "success"} />}
    </div>
  );
}
