import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Приймає фото та відео від гостей і пересилає їх ботом у весільний Telegram-чат.
// Додатково зберігає копію в /public/uploads (best-effort — на serverless-
// платформах файлова система лише для читання, тому запис туди може не
// спрацювати, і це не повинно ламати основну відправку в Telegram).
// ---------------------------------------------------------------------------

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15 МБ
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 МБ — ліміт Telegram Bot API на файл
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
};

async function saveLocalCopy(file: File, ext: string) {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  } catch {
    // Файлова система лише для читання (serverless) — це нормально, Telegram лишається основним каналом.
  }
}

async function sendToTelegram(file: File, token: string, chatId: string) {
  const isVideo = file.type.startsWith("video/");
  const method = isVideo ? "sendVideo" : "sendPhoto";
  const field = isVideo ? "video" : "photo";
  const caption = isVideo ? "Відео з сайту весілля 🎥" : "Фото з сайту весілля 💌";

  const tgForm = new FormData();
  tgForm.append("chat_id", chatId);
  tgForm.append("caption", caption);
  tgForm.append(field, file, file.name);

  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    body: tgForm,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.description ?? `Telegram відповів помилкою (${res.status})`);
  }
}

export async function POST(request: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не задані в .env.local");
    return NextResponse.json(
      { error: "Сервер тимчасово не може надсилати фото. Спробуйте пізніше." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const files = formData.getAll("photos").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "Файли не знайдено" }, { status: 400 });
  }

  for (const file of files) {
    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json(
        { error: `Файл «${file.name}» має непідтримуваний формат` },
        { status: 400 },
      );
    }
    const isVideo = file.type.startsWith("video/");
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Файл «${file.name}» більший за ${maxSize / (1024 * 1024)} МБ` },
        { status: 400 },
      );
    }
  }

  for (const file of files) {
    try {
      await sendToTelegram(file, token, chatId);
    } catch (err) {
      return NextResponse.json(
        {
          error: `Не вдалося надіслати «${file.name}»: ${
            err instanceof Error ? err.message : "невідома помилка"
          }`,
        },
        { status: 502 },
      );
    }
    await saveLocalCopy(file, ALLOWED_TYPES[file.type]);
  }

  return NextResponse.json({ ok: true, count: files.length });
}
