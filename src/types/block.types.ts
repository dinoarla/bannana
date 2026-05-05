export type BlockType = "LINK" | "HEADER" | "SOCIAL" | "EMBED" | "IMAGE" | "DIVIDER";

export type BlockConfig = {
  subtitle?: string;
  icon?: string;
  color?: string;
  bg?: string;
  align?: "left" | "center" | "right";
  imageUrl?: string;
  socials?: Array<{ label: string; url: string; icon: string; color?: string }>;
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
