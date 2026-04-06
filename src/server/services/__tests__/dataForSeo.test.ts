import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getSearchVolume,
  getSerpResults,
  getDomainRating,
  getKeywordDifficulty,
} from "@/server/services/dataForSeo";

describe("dataForSeo", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  describe("API 未設定時", () => {
    it("getSearchVolume は null を返す", async () => {
      vi.stubEnv("DATAFORSEO_LOGIN", "");
      vi.stubEnv("DATAFORSEO_PASSWORD", "");
      const result = await getSearchVolume(["SEO対策"]);
      expect(result).toBeNull();
    });

    it("getSerpResults は null を返す", async () => {
      vi.stubEnv("DATAFORSEO_LOGIN", "");
      vi.stubEnv("DATAFORSEO_PASSWORD", "");
      const result = await getSerpResults("SEO対策");
      expect(result).toBeNull();
    });

    it("getDomainRating は null を返す", async () => {
      vi.stubEnv("DATAFORSEO_LOGIN", "");
      vi.stubEnv("DATAFORSEO_PASSWORD", "");
      const result = await getDomainRating("example.com");
      expect(result).toBeNull();
    });

    it("getKeywordDifficulty は null を返す", async () => {
      vi.stubEnv("DATAFORSEO_LOGIN", "");
      vi.stubEnv("DATAFORSEO_PASSWORD", "");
      const result = await getKeywordDifficulty("SEO対策");
      expect(result).toBeNull();
    });
  });

  describe("API 設定時（モック）", () => {
    beforeEach(() => {
      vi.stubEnv("DATAFORSEO_LOGIN", "test@test.com");
      vi.stubEnv("DATAFORSEO_PASSWORD", "testpass");
    });

    it("getSerpResults が API を呼び出す", async () => {
      const mockResponse = {
        tasks: [{
          result: [{
            items: [
              { rank_absolute: 1, url: "https://example.com", title: "Test" },
            ],
          }],
        }],
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }));

      const result = await getSerpResults("SEO対策");
      expect(result).toBeDefined();
      expect(result.items).toHaveLength(1);
      expect(result.items[0].rank_absolute).toBe(1);
    });

    it("getDomainRating が API レスポンスを正しくマッピングする", async () => {
      const mockResponse = {
        tasks: [{
          result: [{
            rank: 45,
            backlinks: 1200,
            referring_domains: 350,
          }],
        }],
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }));

      const result = await getDomainRating("example.com");
      expect(result).toEqual({
        domainRating: 45,
        backlinkCount: 1200,
        referringDomains: 350,
      });
    });

    it("API エラー時に例外をスローする", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }));

      await expect(getSerpResults("test")).rejects.toThrow("DataForSEO API error: 500");
    });
  });
});
