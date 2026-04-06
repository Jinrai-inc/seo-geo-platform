import { prisma } from "@/lib/prisma";

interface ReportData {
  project: {
    name: string;
    domain: string;
  };
  generatedAt: string;
  reportType: string;
  whiteLabel: boolean;
  customCompanyName?: string | null;
  customLogoUrl?: string | null;
  sections: ReportSection[];
}

interface ReportSection {
  title: string;
  content: string;
}

/**
 * レポートデータを収集して HTML レポートを生成する
 */
export async function generateReport(reportId: string): Promise<string> {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      project: {
        include: {
          keywords: { include: { rankings: { orderBy: { date: "desc" }, take: 30 } } },
          siteAudits: { orderBy: { crawledAt: "desc" }, take: 1, include: { issues: true } },
        },
      },
      org: true,
    },
  });

  if (!report) throw new Error("Report not found");

  const sections: ReportSection[] = [];

  switch (report.reportType) {
    case "MONTHLY":
      sections.push(...await buildMonthlySections(report.project));
      break;
    case "KEYWORD":
      sections.push(...buildKeywordSections(report.project));
      break;
    case "GEO":
      sections.push(...await buildGeoSections(report.project.id));
      break;
    case "TECHNICAL_SEO":
      sections.push(...buildTechnicalSeoSections(report.project));
      break;
  }

  const reportData: ReportData = {
    project: { name: report.project.name, domain: report.project.domain },
    generatedAt: new Date().toISOString().split("T")[0],
    reportType: report.reportType,
    whiteLabel: report.whiteLabel,
    customCompanyName: report.customCompanyName,
    customLogoUrl: report.customLogoUrl,
    sections,
  };

  const html = renderReportHtml(reportData);

  // fileUrl に HTML データ URI を保存（本番では S3 等にアップロードして URL を保存）
  const dataUri = `data:text/html;base64,${Buffer.from(html).toString("base64")}`;
  await prisma.report.update({
    where: { id: reportId },
    data: { fileUrl: dataUri },
  });

  return dataUri;
}

async function buildMonthlySections(project: {
  name: string;
  domain: string;
  keywords: Array<{
    keyword: string;
    currentPosition: number | null;
    bestPosition: number | null;
    searchVolume: number | null;
    rankings: Array<{ date: Date; positionGoogle: number | null }>;
  }>;
  siteAudits: Array<{
    healthScore: unknown;
    pagesCrawled: number;
    errorsCount: number;
    warningsCount: number;
    issues: Array<{ severity: string; description: string }>;
  }>;
}) {
  const sections: ReportSection[] = [];

  // キーワード概要
  const kwSummary = project.keywords.map((kw) => {
    const latest = kw.rankings[0]?.positionGoogle;
    const prev = kw.rankings[1]?.positionGoogle;
    const change = latest && prev ? prev - latest : null;
    return `<tr><td>${kw.keyword}</td><td>${latest ?? "-"}</td><td>${change !== null ? (change > 0 ? `+${change}` : change.toString()) : "-"}</td><td>${kw.searchVolume ?? "-"}</td></tr>`;
  }).join("");

  sections.push({
    title: "キーワード順位サマリー",
    content: `<table><thead><tr><th>キーワード</th><th>現在順位</th><th>変動</th><th>検索Vol</th></tr></thead><tbody>${kwSummary}</tbody></table>`,
  });

  // サイト監査
  const audit = project.siteAudits[0];
  if (audit) {
    sections.push({
      title: "サイト健全性",
      content: `<p>ヘルススコア: <strong>${audit.healthScore}</strong></p>
        <p>クロールページ数: ${audit.pagesCrawled} / エラー: ${audit.errorsCount} / 警告: ${audit.warningsCount}</p>`,
    });
  }

  // GEO サマリー
  sections.push({ title: "GEOモニタリング", content: "<p>詳細は GEO レポートをご確認ください。</p>" });

  return sections;
}

function buildKeywordSections(project: {
  keywords: Array<{
    keyword: string;
    currentPosition: number | null;
    bestPosition: number | null;
    searchVolume: number | null;
    geoScore?: unknown;
    rankings: Array<{ date: Date; positionGoogle: number | null }>;
  }>;
}) {
  const rows = project.keywords.map((kw) => {
    const positions = kw.rankings
      .slice(0, 7)
      .map((r) => r.positionGoogle ?? "-")
      .join(" → ");
    return `<tr><td>${kw.keyword}</td><td>${kw.currentPosition ?? "-"}</td><td>${kw.bestPosition ?? "-"}</td><td>${positions}</td></tr>`;
  }).join("");

  return [{
    title: "キーワード詳細レポート",
    content: `<table><thead><tr><th>キーワード</th><th>現在</th><th>最高</th><th>直近7日推移</th></tr></thead><tbody>${rows}</tbody></table>`,
  }];
}

async function buildGeoSections(projectId: string) {
  const keywords = await prisma.keyword.findMany({
    where: { projectId },
    include: {
      geoChecks: { orderBy: { checkedAt: "desc" }, take: 5 },
    },
  });

  const rows = keywords.map((kw) => {
    const engines = kw.geoChecks
      .map((c) => `${c.engine}: ${c.isMentioned ? "言及あり" : "未言及"}`)
      .join(", ");
    return `<tr><td>${kw.keyword}</td><td>${kw.geoScore ?? "-"}</td><td>${engines || "-"}</td></tr>`;
  }).join("");

  return [{
    title: "GEOモニタリングレポート",
    content: `<table><thead><tr><th>キーワード</th><th>GEOスコア</th><th>エンジン別状況</th></tr></thead><tbody>${rows}</tbody></table>`,
  }];
}

function buildTechnicalSeoSections(project: {
  siteAudits: Array<{
    healthScore: unknown;
    pagesCrawled: number;
    errorsCount: number;
    warningsCount: number;
    noticesCount: number;
    cwvLcp?: unknown;
    cwvInp?: unknown;
    cwvCls?: unknown;
    mobileScore?: number | null;
    desktopScore?: number | null;
    issues: Array<{ severity: string; description: string; pageUrl: string }>;
  }>;
}) {
  const audit = project.siteAudits[0];
  if (!audit) {
    return [{ title: "テクニカルSEO", content: "<p>監査データがありません。サイト監査を実行してください。</p>" }];
  }

  const issueRows = audit.issues
    .filter((i) => i.severity === "ERROR")
    .slice(0, 20)
    .map((i) => `<tr><td>${i.severity}</td><td>${i.description}</td><td>${i.pageUrl}</td></tr>`)
    .join("");

  return [
    {
      title: "サイト健全性スコア",
      content: `<p>ヘルススコア: <strong>${audit.healthScore}</strong></p>
        <p>クロール: ${audit.pagesCrawled}ページ / エラー: ${audit.errorsCount} / 警告: ${audit.warningsCount} / 情報: ${audit.noticesCount}</p>`,
    },
    {
      title: "Core Web Vitals",
      content: `<table><thead><tr><th>指標</th><th>値</th><th>基準</th></tr></thead><tbody>
        <tr><td>LCP</td><td>${audit.cwvLcp ?? "-"}s</td><td>2.5s以下</td></tr>
        <tr><td>INP</td><td>${audit.cwvInp ?? "-"}ms</td><td>200ms以下</td></tr>
        <tr><td>CLS</td><td>${audit.cwvCls ?? "-"}</td><td>0.1以下</td></tr>
      </tbody></table>
      <p>モバイルスコア: ${audit.mobileScore ?? "-"} / デスクトップスコア: ${audit.desktopScore ?? "-"}</p>`,
    },
    {
      title: "主要エラー一覧",
      content: issueRows
        ? `<table><thead><tr><th>重要度</th><th>内容</th><th>ページ</th></tr></thead><tbody>${issueRows}</tbody></table>`
        : "<p>エラーはありません。</p>",
    },
  ];
}

function renderReportHtml(data: ReportData): string {
  const reportTypeLabels: Record<string, string> = {
    MONTHLY: "月次レポート",
    KEYWORD: "キーワードレポート",
    GEO: "GEOレポート",
    TECHNICAL_SEO: "テクニカルSEOレポート",
  };

  const brandName = data.whiteLabel && data.customCompanyName ? data.customCompanyName : "S&G Platform";
  const logoHtml = data.whiteLabel && data.customLogoUrl
    ? `<img src="${data.customLogoUrl}" alt="${brandName}" style="max-height: 40px; margin-bottom: 16px;" />`
    : "";

  const sectionsHtml = data.sections.map((s) => `
    <div style="margin-bottom: 32px;">
      <h2 style="font-size: 18px; color: #1a2738; border-bottom: 2px solid #6366F1; padding-bottom: 8px; margin-bottom: 16px;">${s.title}</h2>
      ${s.content}
    </div>
  `).join("");

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>${reportTypeLabels[data.reportType] ?? data.reportType} - ${data.project.name}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a2738; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 14px; }
    th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background: #f7fafc; font-weight: 600; color: #5c6f82; }
    h1 { font-size: 24px; margin-bottom: 4px; }
    p { font-size: 14px; line-height: 1.6; }
    strong { color: #6366F1; }
    .header { border-bottom: 3px solid #6366F1; padding-bottom: 16px; margin-bottom: 32px; }
    .meta { font-size: 12px; color: #5c6f82; }
    .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #9baabb; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    ${logoHtml}
    <h1>${reportTypeLabels[data.reportType] ?? data.reportType}</h1>
    <p class="meta">${data.project.name} (${data.project.domain}) | ${data.generatedAt}</p>
  </div>
  ${sectionsHtml}
  <div class="footer">${brandName} | Generated on ${data.generatedAt}</div>
</body>
</html>`;
}
