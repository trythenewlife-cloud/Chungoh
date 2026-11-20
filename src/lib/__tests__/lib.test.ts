import { describe, it, expect, beforeAll } from "vitest";
import { randomBytes } from "node:crypto";
import { encrypt, decrypt, maskPhone, maskName } from "../crypto";
import { calcTotals, orderName, makeOrderNo, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "../pricing";

beforeAll(() => {
  process.env.ENCRYPTION_KEY = randomBytes(32).toString("base64");
});

describe("crypto", () => {
  it("round-trips Korean text", () => {
    const plain = "대전광역시 대덕구 대화로32번길 60-9";
    const enc = encrypt(plain);
    expect(enc.startsWith("v1.")).toBe(true);
    expect(enc).not.toContain("대전");
    expect(decrypt(enc)).toBe(plain);
  });

  it("uses a fresh IV each time", () => {
    expect(encrypt("010-1234-5678")).not.toBe(encrypt("010-1234-5678"));
  });

  it("rejects tampered ciphertext", () => {
    const enc = encrypt("secret");
    const parts = enc.split(".");
    parts[3] = Buffer.from("tampered").toString("base64url");
    expect(() => decrypt(parts.join("."))).toThrow();
  });

  it("returns empty string for null", () => {
    expect(decrypt(null)).toBe("");
  });

  it("masks phone and name", () => {
    expect(maskPhone("010-1234-5678")).toBe("010-****-5678");
    expect(maskName("권오숙")).toBe("권*숙");
    expect(maskName("홍길")).toBe("홍*");
  });
});

describe("pricing", () => {
  it("charges shipping under the threshold", () => {
    expect(calcTotals([{ price: 10_000, qty: 2 }])).toEqual({
      itemsTotal: 20_000,
      shippingFee: SHIPPING_FEE,
      total: 20_000 + SHIPPING_FEE,
    });
  });

  it("ships free at the threshold", () => {
    expect(calcTotals([{ price: FREE_SHIPPING_THRESHOLD, qty: 1 }]).shippingFee).toBe(0);
  });

  it("charges nothing for an empty cart", () => {
    expect(calcTotals([]).total).toBe(0);
  });

  it("builds order names", () => {
    expect(orderName(["개폐기"])).toBe("개폐기");
    expect(orderName(["개폐기", "센서", "케이블"])).toBe("개폐기 외 2건");
  });

  it("builds Toss-compatible order numbers", () => {
    const no = makeOrderNo("CO", new Date(2026, 10, 20), "ab12cd");
    expect(no).toBe("CO20261120-AB12CD");
    expect(no).toMatch(/^[A-Za-z0-9_-]{6,64}$/);
  });
});
