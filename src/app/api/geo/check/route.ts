import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { callClaude } from "@/server/services/anthropicAi";

/**
 * POST /api/geo/check
 * Runs GEO monitoring for keywords in a project.
 * Queries each AI engine and checks for domain mentions.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, keywordIds } = body;

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { keywords: keywordIds ? { where: { id: { in: keywordIds } } } : true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const results = [];

    for (const kw of project.keywords) {
      const engineResults = await checkAllEngines(kw.keyword, project.domain);

      for (const er of engineResults) {
        await prisma.keywordGeoCheck.create({
          data: {
            keywordId: kw.id,
            engine: er.engine,
            isMentioned: er.isMentioned,
            mentionType: er.mentionType,
            sentiment: er.sentiment,
            shareOfVoice: er.shareOfVoice,
            aiResponseText: er.responseText,
            competitorsMentioned: er.competitors,
          },
        });
      }

      // Calculate GEO score for this keyword
      const mentionedCount = engineResults.filter((r) => r.isMentioned).length;
      const directCount = engineResults.filter((r) => r.mentionType === "DIRECT").length;
      const avgSov = engineResults.reduce((s, r) => s + (r.shareOfVoice || 0), 0) / engineResults.length;
      const geoScore = Math.round(
        (mentionedCount / engineResults.length) * 40 +
        (directCount / engineResults.length) * 30 +
        avgSov * 0.3
      );

      await prisma.keyword.update({
        where: { id: kw.id },
        data: { geoScore },
      });

      results.push({
        keyword: kw.keyword,
        geoScore,
        engines: engineResults.map((r) => ({
          engine: r.engine,
          isMentioned: r.isMentioned,
          mentionType: r.mentionType,
        })),
      });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("GEO check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

type EngineType = "CHATGPT" | "GEMINI" | "PERPLEXITY" | "COPILOT" | "CLAUDE";
type MentionType = "DIRECT" | "INDIRECT" | "NOT_MENTIONED";
type SentimentType = "POSITIVE" | "NEUTRAL" | "NEGATIVE" | "NONE";

interface EngineResult {
  engine: EngineType;
  isMentioned: boolean;
  mentionType: MentionType;
  sentiment: SentimentType;
  shareOfVoice: number;
  responseText: string;
  competitors: string[];
}

async function checkAllEngines(keyword: string, domain: string): Promise<EngineResult[]> {
  const engines: EngineType[] = ["CHATGPT", "GEMINI", "PERPLEXITY", "COPILOT", "CLAUDE"];
  const results: EngineResult[] = [];

  for (const engine of engines) {
    try {
      const result = await checkSingleEngine(engine, keyword, domain);
      results.push(result);
    } catch (error) {
      console.error(`GEO check failed for ${engine}:`, error);
      results.push({
        engine,
        isMentioned: false,
        mentionType: "NOT_MENTIONED",
        sentiment: "NONE",
        shareOfVoice: 0,
        responseText: "",
        competitors: [],
      });
    }
  }

  return results;
}

/**
 * 各 AI エンジンの実 API を呼び出してレスポンスを取得する。
 * API キーが未設定のエンジンは Claude によるシミュレーションにフォールバック。
 */
async function queryEngine(engine: EngineType, keyword: string): Promise<string> {
  switch (engine) {
    case "CHATGPT": {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) return "";
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ role: "user", content: keyword }],
          max_tokens: 2048,
        }),
      });
      if (!res.ok) return "";
      const data = await res.json();
      return data.choices?.[0]?.message?.content ?? "";
    }
    case "GEMINI": {
      const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
      if (!apiKey) return "";
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: keyword }] }] }),
        }
      );
      if (!res.ok) return "";
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    }
    case "PERPLEXITY": {
      const apiKey = process.env.PERPLEXITY_API_KEY;
      if (!apiKey) return "";
      const res = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "sonar",
          messages: [{ role: "user", content: keyword }],
        }),
      });
      if (!res.ok) return "";
      const data = await res.json();
      return data.choices?.[0]?.message?.content ?? "";
    }
    case "CLAUDE": {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) return "";
      return callClaude(keyword);
    }
    case "COPILOT":
      // Microsoft Copilot には公開 API がないため常にフォールバック
      return "";
  }
}

async function checkSingleEngine(
  engine: EngineType,
  keyword: string,
  domain: string
): Promise<EngineResult> {
  // まず実 API からレスポンスを取得
  let responseText = await queryEngine(engine, keyword);

  // 実 API が利用できない場合、Claude で分析用レスポンスを生成
  if (!responseText) {
    const fallbackPrompt = `「${keyword}」というキーワードで${engine}のAI検索エンジンに質問した場合、どのような回答が返されるか推定してください。実際のウェブ情報に基づいた回答を400文字程度で生成してください。`;
    responseText = await callClaude(fallbackPrompt);
  }

  // Claude でレスポンスを分析して構造化データを抽出
  const analysisPrompt = `以下はAI検索エンジン「${engine}」が「${keyword}」に対して返した回答です。この回答を分析してください。

回答テキスト:
${responseText.slice(0, 3000)}

分析対象ドメイン: ${domain}

以下のJSONのみを返してください:
{
  "is_domain_mentioned": true/false,
  "mention_type": "DIRECT" | "INDIRECT" | "NOT_MENTIONED",
  "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
  "share_of_voice": 0-100,
  "mentioned_domains": ["example.com"]
}`;

  const analysisText = await callClaude(analysisPrompt);

  try {
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      engine,
      isMentioned: parsed.is_domain_mentioned ?? false,
      mentionType: parsed.mention_type ?? "NOT_MENTIONED",
      sentiment: parsed.sentiment ?? "NONE",
      shareOfVoice: parsed.share_of_voice ?? 0,
      responseText,
      competitors: (parsed.mentioned_domains ?? []).filter((d: string) => !d.includes(domain)),
    };
  } catch {
    // JSON パース失敗時はテキスト分析にフォールバック
    const mentioned = responseText.toLowerCase().includes(domain.toLowerCase());
    return {
      engine,
      isMentioned: mentioned,
      mentionType: mentioned ? "INDIRECT" : "NOT_MENTIONED",
      sentiment: mentioned ? "NEUTRAL" : "NONE",
      shareOfVoice: mentioned ? 10 : 0,
      responseText,
      competitors: [],
    };
  }
}
