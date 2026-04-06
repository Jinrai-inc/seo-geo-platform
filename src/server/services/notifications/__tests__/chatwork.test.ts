import { describe, it, expect, vi } from "vitest";
import {
  sendChatworkNotification,
  formatRankChangeChatwork,
} from "@/server/services/notifications/chatwork";

describe("chatwork notifications", () => {
  describe("formatRankChangeChatwork", () => {
    it("順位上昇時に正しいメッセージを生成する", () => {
      const msg = formatRankChangeChatwork("SEO対策", 10, 5, "example.com");
      expect(msg).toContain("[info]");
      expect(msg).toContain("[title]順位変動通知[/title]");
      expect(msg).toContain("SEO対策");
      expect(msg).toContain("10位 → 5位");
      expect(msg).toContain("5上昇");
      expect(msg).toContain("[/info]");
    });

    it("順位下降時に下降と表示する", () => {
      const msg = formatRankChangeChatwork("test", 3, 20, "test.jp");
      expect(msg).toContain("17下降");
    });
  });

  describe("sendChatworkNotification", () => {
    it("正しい Content-Type で送信する", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true });
      vi.stubGlobal("fetch", mockFetch);

      await sendChatworkNotification("https://api.chatwork.com/test", "テストメッセージ");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.chatwork.com/test",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
      );
    });

    it("メッセージが URL エンコードされる", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true });
      vi.stubGlobal("fetch", mockFetch);

      await sendChatworkNotification("https://api.chatwork.com/test", "テスト");

      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.body).toContain(encodeURIComponent("テスト"));
    });
  });
});
