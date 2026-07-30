export interface Guest {
  id: string;
  name: string;
  /** Посилання на акаунт у соцмережі (Instagram, Telegram тощо) */
  social: string;
  /** URL фото. Якщо не вказано — показуються ініціали. */
  avatarUrl?: string;
}

export interface WeddingTable {
  id: string;
  label: string;
  guests: Guest[];
}

export interface GalleryPhoto {
  src: string;
  alt: string;
}

export interface TimelineItem {
  time: string;
  title: string;
  description?: string;
}
