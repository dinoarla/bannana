import type { PublicBlock } from "@/types";
import {
  BannerBlock, ContactBlock, CountdownBlock, DividerBlock, EmbedBlock,
  FaqBlock, FormBlock, HeaderBlock, ImageBlock, LinkBlock, MapBlock,
  ProductBlock, SocialBlock, TextBlock,
} from "./renderers";

export function BlockFactory({ block, index = 0 }: { block: PublicBlock; index?: number }) {
  const style = { animationDelay: `${0.1 + index * 0.07}s` };
  if (block.type === "HEADER")    return <HeaderBlock block={block} style={style} />;
  if (block.type === "DIVIDER")   return <DividerBlock style={style} />;
  if (block.type === "SOCIAL")    return <SocialBlock block={block} style={style} />;
  if (block.type === "EMBED")     return <EmbedBlock block={block} style={style} />;
  if (block.type === "IMAGE")     return <ImageBlock block={block} style={style} />;
  if (block.type === "TEXT")      return <TextBlock block={block} style={style} />;
  if (block.type === "BANNER")    return <BannerBlock block={block} style={style} />;
  if (block.type === "CONTACT")   return <ContactBlock block={block} style={style} />;
  if (block.type === "PRODUCT")   return <ProductBlock block={block} style={style} />;
  if (block.type === "FAQ")       return <FaqBlock block={block} style={style} />;
  if (block.type === "COUNTDOWN") return <CountdownBlock block={block} style={style} />;
  if (block.type === "MAP")       return <MapBlock block={block} style={style} />;
  if (block.type === "FORM")      return <FormBlock block={block} style={style} />;
  return <LinkBlock block={block} style={style} />;
}
