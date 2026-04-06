import { describe, it, expect } from "vitest";
import {
  validateCredentials,
  createSessionToken,
  parseSessionToken,
  DEMO_ACCOUNTS,
} from "@/lib/demo-auth";

describe("demo-auth", () => {
  describe("validateCredentials", () => {
    it("正しい認証情報で DemoUser を返す", () => {
      const user = validateCredentials("enterprise@test.sg-platform.jp", "Enterprise2024!");
      expect(user).not.toBeNull();
      expect(user!.email).toBe("enterprise@test.sg-platform.jp");
      expect(user!.plan).toBe("ENTERPRISE");
    });

    it("間違ったパスワードで null を返す", () => {
      const user = validateCredentials("enterprise@test.sg-platform.jp", "wrong");
      expect(user).toBeNull();
    });

    it("存在しないメールで null を返す", () => {
      const user = validateCredentials("nobody@test.com", "password");
      expect(user).toBeNull();
    });
  });

  describe("createSessionToken / parseSessionToken", () => {
    it("トークンを作成して正しくパースできる", () => {
      const demoUser = DEMO_ACCOUNTS["enterprise@test.sg-platform.jp"].user;
      const token = createSessionToken(demoUser);
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);

      const parsed = parseSessionToken(token);
      expect(parsed).not.toBeNull();
      expect(parsed!.id).toBe(demoUser.id);
      expect(parsed!.email).toBe(demoUser.email);
      expect(parsed!.companyName).toBe(demoUser.companyName);
    });

    it("不正なトークンで null を返す", () => {
      expect(parseSessionToken("invalid-token!!!")).toBeNull();
    });

    it("空文字で null を返す", () => {
      expect(parseSessionToken("")).toBeNull();
    });
  });
});
