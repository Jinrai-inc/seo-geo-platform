import { describe, it, expect, vi } from "vitest";
import {
  sendSlackNotification,
  formatRankChangeMessage,
  formatGeoChangeMessage,
} from "@/server/services/notifications/slack";

describe("slack notifications", () => {
  describe("formatRankChangeMessage", () => {
    it("順位上昇時に正しいメッセージを生成する", () => {
      const msg = formatRankChangeMessage("SEO対策", 10, 5, "example.com");
      expect(msg.text).toContain("SEO対策");
      expect(msg.text).toContain("10位 → 5位");
      expect(msg.text).toContain("5上昇");
      expect(msg.text).toContain("example.com");
    });

    it("順位下降時に正しいメッセージを生成する", () => {
      const msg = formatRankChangeMessage("GEO対策", 3, 15, "test.jp");
      expect(msg.text).toContain("3位 → 15位");
      expect(msg.text).toContain("12下降");
    });

    it("blocks が正しい構造を持つ", () => {
      const msg = formatRankChangeMessage("test", 5, 3, "example.com");
      expect(msg.blocks).toBeDefined();
      expect(msg.blocks!.length).toBe(2);
      expect(msg.blocks![0].type).toBe("section");
    });
  });

  describe("formatGeoChangeMessage", () => {
    it("言及ありの場合に正しいメッセージを生成する", () => {
      const msg = formatGeoChangeMessage("AI検索", "ChatGPT", true, "example.com");
      expect(msg.text).toContain("AI検索");
      expect(msg.text).toContain("ChatGPT");
      expect(msg.text).toContain("言及あり");
    });

    it("言及なしの場合に正しいメッセージを生成する", () => {
      const msg = formatGeoChangeMessage("SEO", "Gemini", false, "test.jp");
      expect(msg.text).toContain("言及なし");
    });
  });

  describe("sendSlackNotification", () => {
    it("成功時に true を返す", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
      const result = await sendSlackNotification("https://hooks.slack.com/test", { text: "test" });
      expect(result).toBe(true);
    });

    it("失敗時に false を返す", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
      const result = await sendSlackNotification("https://hooks.slack.com/test", { text: "test" });
      expect(result).toBe(false);
    });

    it("ネットワークエラー時に false を返す", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));
      const result = await sendSlackNotification("https://hooks.slack.com/test", { text: "test" });
      expect(result).toBe(false);
    });
  });
});
