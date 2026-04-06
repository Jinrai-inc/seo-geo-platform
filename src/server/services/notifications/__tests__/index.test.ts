import { describe, it, expect, vi, beforeEach } from "vitest";

// prisma をモック
vi.mock("@/lib/prisma", () => ({
  prisma: {
    notificationSetting: {
      findMany: vi.fn(),
    },
  },
}));

// Slack/Chatwork/Email をモック
vi.mock("@/server/services/notifications/slack", () => ({
  sendSlackNotification: vi.fn().mockResolvedValue(true),
  formatRankChangeMessage: vi.fn().mockReturnValue({ text: "rank change" }),
  formatGeoChangeMessage: vi.fn().mockReturnValue({ text: "geo change" }),
}));

vi.mock("@/server/services/notifications/chatwork", () => ({
  sendChatworkNotification: vi.fn().mockResolvedValue(true),
  formatRankChangeChatwork: vi.fn().mockReturnValue("chatwork msg"),
}));

vi.mock("@/server/services/notifications/email", () => ({
  sendEmailNotification: vi.fn().mockResolvedValue(undefined),
  formatRankChangeEmail: vi.fn().mockReturnValue({ subject: "sub", html: "<p>hi</p>" }),
  formatGeoChangeEmail: vi.fn().mockReturnValue({ subject: "geo", html: "<p>geo</p>" }),
  formatErrorEmail: vi.fn().mockReturnValue({ subject: "err", html: "<p>err</p>" }),
}));

import { sendNotifications } from "@/server/services/notifications";
import { prisma } from "@/lib/prisma";
import { sendSlackNotification } from "@/server/services/notifications/slack";
import { sendChatworkNotification } from "@/server/services/notifications/chatwork";
import { sendEmailNotification } from "@/server/services/notifications/email";

describe("sendNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Slack 通知を送信する", async () => {
    vi.mocked(prisma.notificationSetting.findMany).mockResolvedValue([
      {
        id: "1",
        orgId: "org1",
        channel: "SLACK",
        webhookUrl: "https://hooks.slack.com/test",
        notifyRankChange: true,
        rankChangeThreshold: 3,
        notifyErrors: true,
        notifyGeoChange: true,
        notifyArticleComplete: false,
      },
    ]);

    await sendNotifications("org1", {
      type: "rank_change",
      keyword: "SEO",
      previousPosition: 10,
      currentPosition: 5,
      domain: "example.com",
    });

    expect(sendSlackNotification).toHaveBeenCalled();
  });

  it("しきい値未満の順位変動では通知しない", async () => {
    vi.mocked(prisma.notificationSetting.findMany).mockResolvedValue([
      {
        id: "1",
        orgId: "org1",
        channel: "SLACK",
        webhookUrl: "https://hooks.slack.com/test",
        notifyRankChange: true,
        rankChangeThreshold: 10,
        notifyErrors: true,
        notifyGeoChange: true,
        notifyArticleComplete: false,
      },
    ]);

    await sendNotifications("org1", {
      type: "rank_change",
      keyword: "SEO",
      previousPosition: 5,
      currentPosition: 3,
      domain: "example.com",
    });

    expect(sendSlackNotification).not.toHaveBeenCalled();
  });

  it("Chatwork にエラー通知を送信する", async () => {
    vi.mocked(prisma.notificationSetting.findMany).mockResolvedValue([
      {
        id: "2",
        orgId: "org1",
        channel: "CHATWORK",
        webhookUrl: "https://api.chatwork.com/test",
        notifyRankChange: true,
        rankChangeThreshold: 5,
        notifyErrors: true,
        notifyGeoChange: true,
        notifyArticleComplete: false,
      },
    ]);

    await sendNotifications("org1", {
      type: "error",
      message: "API 接続エラー",
      domain: "example.com",
    });

    expect(sendChatworkNotification).toHaveBeenCalled();
  });

  it("Email に GEO 変動通知を送信する", async () => {
    vi.mocked(prisma.notificationSetting.findMany).mockResolvedValue([
      {
        id: "3",
        orgId: "org1",
        channel: "EMAIL",
        webhookUrl: "admin@example.com",
        notifyRankChange: true,
        rankChangeThreshold: 5,
        notifyErrors: true,
        notifyGeoChange: true,
        notifyArticleComplete: false,
      },
    ]);

    await sendNotifications("org1", {
      type: "geo_change",
      keyword: "AI検索",
      engine: "ChatGPT",
      isMentioned: true,
      domain: "example.com",
    });

    expect(sendEmailNotification).toHaveBeenCalled();
  });

  it("webhookUrl が未設定の場合は通知しない", async () => {
    vi.mocked(prisma.notificationSetting.findMany).mockResolvedValue([
      {
        id: "4",
        orgId: "org1",
        channel: "SLACK",
        webhookUrl: null,
        notifyRankChange: true,
        rankChangeThreshold: 3,
        notifyErrors: true,
        notifyGeoChange: true,
        notifyArticleComplete: false,
      },
    ]);

    await sendNotifications("org1", {
      type: "rank_change",
      keyword: "SEO",
      previousPosition: 10,
      currentPosition: 3,
      domain: "example.com",
    });

    expect(sendSlackNotification).not.toHaveBeenCalled();
  });
});
