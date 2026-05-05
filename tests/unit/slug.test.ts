import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/utils/slug";

describe("slugify", () => {
  it("normalizes page slugs", () => {
    expect(slugify("Halo Bannana ID!")).toBe("halo-bannana-id");
  });
});
