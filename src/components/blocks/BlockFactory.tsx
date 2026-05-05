import type { PublicBlock } from "@/types";
import { DividerBlock, EmbedBlock, HeaderBlock, ImageBlock, LinkBlock, SocialBlock } from "./renderers";

export function BlockFactory({ block, index = 0 }: { block: PublicBlock; index?: number }) {
  const style = { animationDelay: `${0.1 + index * 0.07}s` };
  if (block.type === "HEADER") return <HeaderBlock block={block} style={style} />;
  if (block.type === "DIVIDER") return <DividerBlock style={style} />;
  if (block.type === "SOCIAL") return <SocialBlock block={block} style={style} />;
  if (block.type === "EMBED") return <EmbedBlock block={block} style={style} />;
  if (block.type === "IMAGE") return <ImageBlock block={block} style={style} />;
  return <LinkBlock block={block} style={style} />;
}
