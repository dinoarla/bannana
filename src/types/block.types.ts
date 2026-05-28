export type BlockType =
  | "LINK" | "HEADER" | "SOCIAL" | "EMBED" | "IMAGE" | "DIVIDER"
  | "TEXT" | "COUNTDOWN" | "FAQ" | "CONTACT" | "PRODUCT" | "BANNER" | "MAP" | "FORM";

export type FaqItem = { q: string; a: string };
export type ContactPlatform = "whatsapp" | "telegram" | "line" | "email";

export type BlockConfig = {
  subtitle?: string;
  icon?: string;
  color?: string;
  bg?: string;
  align?: "left" | "center" | "right";
  imageUrl?: string;
  socials?: Array<{ label: string; url: string; icon: string; color?: string }>;
  content?: string;
  targetDate?: string;
  items?: FaqItem[];
  platform?: ContactPlatform;
  handle?: string;
  message?: string;
  price?: string;
  buttonText?: string;
  embedUrl?: string;
  height?: number;
};

export type PublicBlock = {
  id: string;
  pageId: string;
  type: BlockType;
  title: string | null;
  url: string | null;
  position: number;
  isEnabled: boolean;
  config: BlockConfig;
  clickCount: number;
};
