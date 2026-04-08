import type { Metadata } from "next";

export interface MetaOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
}

const APP_NAME = "Kletch";
const APP_DEFAULT_DESCRIPTION = "Empowering the African diaspora to invest in home.";
const APP_BASE_URL = "https://www.usekletch.com";

export function createMetadata({
  title,
  description = APP_DEFAULT_DESCRIPTION,
  image = 'https://rhxbrjeeblfkokellqbb.supabase.co/storage/v1/object/public/media/Kletch%20White.png',
  url = APP_BASE_URL,
  noIndex = false,
}: MetaOptions = {}): Metadata {
  const fullTitle = title ? `${title} | ${APP_NAME}` : APP_NAME;

  return {
    metadataBase: new URL(APP_BASE_URL),
    title: fullTitle,
    description,

    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },

    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: APP_NAME,
      images: [{ url: image, width: 1200, height: 630 }],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },

    alternates: {
      canonical: url,
    },
  };
}