import { describe, it, expect } from "vitest";
import { PLANS, COLORS } from "@/lib/constants";

describe("constants", () => {
  describe("PLANS", () => {
    it("3つのプランが定義されている", () => {
      expect(Object.keys(PLANS)).toEqual(["STARTER", "BUSINESS", "AGENCY"]);
    });

    it("STARTER は最小の制限値を持つ", () => {
      expect(PLANS.STARTER.maxProjects).toBe(1);
      expect(PLANS.STARTER.maxKeywords).toBe(100);
      expect(PLANS.STARTER.maxGeoChecks).toBe(50);
    });

    it("BUSINESS は STARTER より大きい制限値を持つ", () => {
      expect(PLANS.BUSINESS.maxProjects).toBeGreaterThan(PLANS.STARTER.maxProjects);
      expect(PLANS.BUSINESS.maxKeywords).toBeGreaterThan(PLANS.STARTER.maxKeywords);
      expect(PLANS.BUSINESS.maxGeoChecks).toBeGreaterThan(PLANS.STARTER.maxGeoChecks);
    });

    it("AGENCY は BUSINESS より大きい制限値を持つ", () => {
      expect(PLANS.AGENCY.maxProjects).toBeGreaterThan(PLANS.BUSINESS.maxProjects);
      expect(PLANS.AGENCY.maxKeywords).toBeGreaterThan(PLANS.BUSINESS.maxKeywords);
      expect(PLANS.AGENCY.maxGeoChecks).toBeGreaterThan(PLANS.BUSINESS.maxGeoChecks);
    });

    it("各プランに日本語名がある", () => {
      expect(PLANS.STARTER.name).toBe("スターター");
      expect(PLANS.BUSINESS.name).toBe("ビジネス");
      expect(PLANS.AGENCY.name).toBe("エージェンシー");
    });
  });

  describe("COLORS", () => {
    it("主要カラーが定義されている", () => {
      expect(COLORS.accent).toBeDefined();
      expect(COLORS.bg).toBeDefined();
      expect(COLORS.text).toBeDefined();
      expect(COLORS.warn).toBeDefined();
    });

    it("カラーコードの形式が正しい", () => {
      expect(COLORS.accent).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(COLORS.bg).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});
