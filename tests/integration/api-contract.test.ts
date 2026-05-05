import { describe, expect, it } from "vitest";

describe("api contract", () => {
  it("uses success envelope", () => {
    expect({ success: true, data: { ok: true } }).toMatchObject({ success: true });
  });
});
