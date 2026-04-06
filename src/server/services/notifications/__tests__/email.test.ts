import { describe, it, expect } from "vitest";
import {
  formatRankChangeEmail,
  formatGeoChangeEmail,
  formatErrorEmail,
} from "@/server/services/notifications/email";

describe("email notifications", () => {
  describe("formatRankChangeEmail", () => {
    it("順位上昇時に正しい件名と本文を生成する", () => {
      const { subject, html } = formatRankChangeEmail("SEO対策", 10, 5, "example.com");
      expect(subject).toContain("SEO対策");
      expect(subject).toContain("上昇");
      expect(html).toContain("example.com");
      expect(html).toContain("10位");
      expect(html).toContain("5位");
    });

    it("順位下降時に下降と表示する", () => {
      const { subject } = formatRankChangeEmail("test", 3, 15, "test.jp");
      expect(subject).toContain("下降");
      expect(subject).toContain("12位");
    });
  });

  describe("formatGeoChangeEmail", () => {
    it("言及ありの場合に正しい内容を生成する", () => {
      const { subject, html } = formatGeoChangeEmail("AI検索", "ChatGPT", true, "example.com");
      expect(subject).toContain("AI検索");
      expect(subject).toContain("ChatGPT");
      expect(html).toContain("言及あり");
    });

    it("言及なしの場合に正しい内容を生成する", () => {
      const { html } = formatGeoChangeEmail("SEO", "Gemini", false, "test.jp");
      expect(html).toContain("言及なし");
    });
  });

  describe("formatErrorEmail", () => {
    it("エラーメッセージを含む件名と本文を生成する", () => {
      const { subject, html } = formatErrorEmail("API接続エラー", "example.com");
      expect(subject).toContain("エラー通知");
      expect(subject).toContain("example.com");
      expect(html).toContain("API接続エラー");
    });
  });
});
