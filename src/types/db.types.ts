export type Role = "USER" | "ADMIN";
export type DbBlockType = "LINK" | "HEADER" | "SOCIAL" | "EMBED" | "IMAGE" | "DIVIDER" | "TEXT" | "COUNTDOWN" | "FAQ" | "CONTACT" | "PRODUCT" | "BANNER" | "MAP" | "FORM" | "QUOTE";

export type User = {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  emailVerified: Date | null;
  googleId: string | null;
  role: Role;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Profile = {
  id: string;
  userId: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  avatarIcon: string | null;
  website: string | null;
  tags: string[];
  socialLinks: Array<{ label: string; url: string; icon: string; color?: string }>;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithProfile = User & { profile: Profile | null };

export type Page = {
  id: string;
  userId: string;
  title: string;
  bio: string | null;
  slug: string;
  theme: string;
  isPublished: boolean;
  customCss: string | null;
  avatarUrl: string | null;
  viewCount: number;
  uniqueVisitors: number;
  displayName: string | null;
  website: string | null;
  socialLinks: Array<{ label: string; url: string; icon: string; color?: string }> | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Block = {
  id: string;
  pageId: string;
  type: DbBlockType;
  title: string | null;
  url: string | null;
  position: number;
  isEnabled: boolean;
  config: Record<string, unknown>;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PageWithBlocks = Page & { blocks: Block[] };
export type PageWithUserAndBlocks = Page & { blocks: Block[]; user: UserWithProfile };

export type Analytics = {
  id: string;
  pageId: string;
  blockId: string | null;
  event: string;
  referrer: string | null;
  userAgent: string | null;
  country: string | null;
  device: string | null;
  createdAt: Date;
};

export type Session = {
  id: string;
  userId: string;
  tokenHash: string;
  csrfToken: string;
  expiresAt: Date;
  createdAt: Date;
};
