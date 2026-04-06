import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY || "");
  }
  return resendClient;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@seogeo.jp";

export async function sendEmailNotification(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log("RESEND_API_KEY not set, skipping email notification");
    return;
  }

  const resend = getResend();
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });
}

export function formatRankChangeEmail(
  keyword: string,
  previousPosition: number,
  currentPosition: number,
  domain: string
): { subject: string; html: string } {
  const diff = previousPosition - currentPosition;
  const direction = diff > 0 ? "上昇" : "下降";
  const emoji = diff > 0 ? "📈" : "📉";

  return {
    subject: `[SEO×GEO] ${emoji} ${keyword} の順位が${Math.abs(diff)}位${direction}しました`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a2738;">順位変動アラート</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; color: #5c6f82;">ドメイン</td><td style="padding: 8px; font-weight: bold;">${domain}</td></tr>
          <tr><td style="padding: 8px; color: #5c6f82;">キーワード</td><td style="padding: 8px; font-weight: bold;">${keyword}</td></tr>
          <tr><td style="padding: 8px; color: #5c6f82;">前回順位</td><td style="padding: 8px;">${previousPosition}位</td></tr>
          <tr><td style="padding: 8px; color: #5c6f82;">現在順位</td><td style="padding: 8px; font-weight: bold; color: ${diff > 0 ? "#00E4B8" : "#FF5C5C"};">${currentPosition}位 (${diff > 0 ? "+" : ""}${diff})</td></tr>
        </table>
      </div>
    `,
  };
}

export function formatGeoChangeEmail(
  keyword: string,
  engine: string,
  isMentioned: boolean,
  domain: string
): { subject: string; html: string } {
  const status = isMentioned ? "言及あり" : "言及なし";
  return {
    subject: `[SEO×GEO] GEO変動通知 - ${keyword} (${engine})`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a2738;">GEO変動通知</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; color: #5c6f82;">ドメイン</td><td style="padding: 8px; font-weight: bold;">${domain}</td></tr>
          <tr><td style="padding: 8px; color: #5c6f82;">キーワード</td><td style="padding: 8px; font-weight: bold;">${keyword}</td></tr>
          <tr><td style="padding: 8px; color: #5c6f82;">AIエンジン</td><td style="padding: 8px;">${engine}</td></tr>
          <tr><td style="padding: 8px; color: #5c6f82;">ステータス</td><td style="padding: 8px; font-weight: bold;">${status}</td></tr>
        </table>
      </div>
    `,
  };
}

export function formatErrorEmail(
  message: string,
  domain: string
): { subject: string; html: string } {
  return {
    subject: `[SEO×GEO] ⚠️ エラー通知 - ${domain}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5C5C;">エラー通知</h2>
        <p><strong>ドメイン:</strong> ${domain}</p>
        <p><strong>内容:</strong> ${message}</p>
      </div>
    `,
  };
}
