import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Приймає будь-які файли від гостей і пересилає їх ботом у весільний Telegram-чат.
// Файли не зберігаються на сервері — існують лише в пам'яті на час запиту
// і йдуть напряму в Telegram, Telegram лишається єдиним місцем зберігання.
// ---------------------------------------------------------------------------

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 МБ — ліміт Telegram Bot API на файл

// Telegram Bot API вміє показувати як фото/відео лише ці формати — усе інше
// (наприклад, HEIC/HEIF з iPhone, .mov чи будь-який інший файл) треба слати
// як звичайний файл через sendDocument, інакше Telegram відповідає помилкою
// (IMAGE_PROCESS_FAILED) і файл просто не доходить.
const TELEGRAM_PHOTO_SAFE = new Set(["image/jpeg", "image/png", "image/webp"]);
const TELEGRAM_VIDEO_SAFE = new Set(["video/mp4"]);

function resolveTelegramTarget(mime: string): { method: string; field: string } {
  if (TELEGRAM_PHOTO_SAFE.has(mime)) return { method: "sendPhoto", field: "photo" };
  if (TELEGRAM_VIDEO_SAFE.has(mime)) return { method: "sendVideo", field: "video" };
  return { method: "sendDocument", field: "document" };
}

function captionFor(mime: string) {
  if (mime.startsWith("image/")) return "Фото з сайту весілля 💌";
  if (mime.startsWith("video/")) return "Відео з сайту весілля 🎥";
  return "Файл з сайту весілля 📎";
}

async function sendToTelegram(file: File, token: string, chatId: string) {
  const { method, field } = resolveTelegramTarget(file.type);

  const tgForm = new FormData();
  tgForm.append("chat_id", chatId);
  tgForm.append("caption", captionFor(file.type));
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
      { error: "Сервер тимчасово не може надсилати файли. Спробуйте пізніше." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const files = formData.getAll("photos").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "Файли не знайдено" }, { status: 400 });
  }

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Файл «${file.name}» більший за ${MAX_FILE_SIZE / (1024 * 1024)} МБ` },
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
  }

  return NextResponse.json({ ok: true, count: files.length });
}
