import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | S&G Platform",
};

export default function CommercePage() {
  return (
    <article className="prose-legal">
      <h1>特定商取引法に基づく表記</h1>
      <p className="meta">最終更新日: 2026年4月6日</p>

      <table>
        <tbody>
          <tr>
            <th>販売事業者名</th>
            <td>株式会社Jinrai</td>
          </tr>
          <tr>
            <th>所在地</th>
            <td>お問い合わせいただきましたら遅滞なく開示いたします。</td>
          </tr>
          <tr>
            <th>代表者</th>
            <td>お問い合わせいただきましたら遅滞なく開示いたします。</td>
          </tr>
          <tr>
            <th>電話番号</th>
            <td>お問い合わせいただきましたら遅滞なく開示いたします。</td>
          </tr>
          <tr>
            <th>メールアドレス</th>
            <td>support@sg-platform.jp</td>
          </tr>
          <tr>
            <th>販売URL</th>
            <td>https://sg-platform.jp</td>
          </tr>
          <tr>
            <th>販売価格</th>
            <td>
              各プランの料金はサービス内の設定画面に表示された金額とします。<br />
              ・スターター: 月額 ¥12,800（税込）<br />
              ・ビジネス: 月額 ¥29,800（税込）<br />
              ・エージェンシー: 月額 ¥59,800（税込）
            </td>
          </tr>
          <tr>
            <th>販売価格以外の必要料金</th>
            <td>インターネット接続に必要な通信費等はお客様のご負担となります。</td>
          </tr>
          <tr>
            <th>支払い方法</th>
            <td>クレジットカード（Pay.jp 経由）<br />対応カード: VISA、Mastercard、JCB、American Express、Diners Club</td>
          </tr>
          <tr>
            <th>支払い時期</th>
            <td>サブスクリプション登録時に初回課金が行われ、以降は毎月同日に自動課金されます。</td>
          </tr>
          <tr>
            <th>商品の引き渡し時期</th>
            <td>お申し込み手続き完了後、即時ご利用いただけます。</td>
          </tr>
          <tr>
            <th>返品・キャンセルについて</th>
            <td>
              デジタルサービスの性質上、お支払い済みの利用料金の返金はいたしかねます。<br />
              サブスクリプションの解約は設定画面からいつでも可能です。解約後は次回更新日まで引き続きサービスをご利用いただけます。
            </td>
          </tr>
          <tr>
            <th>無料トライアル</th>
            <td>初回登録時に7日間の無料トライアルを提供する場合があります。トライアル期間中にキャンセルしない場合、自動的に有料プランに移行します。</td>
          </tr>
          <tr>
            <th>動作環境</th>
            <td>
              ・Google Chrome（最新版）<br />
              ・Mozilla Firefox（最新版）<br />
              ・Safari（最新版）<br />
              ・Microsoft Edge（最新版）<br />
              ・インターネット接続環境
            </td>
          </tr>
        </tbody>
      </table>

      <style>{`
        .prose-legal { color: #CBD5E1; line-height: 1.8; }
        .prose-legal h1 { font-size: 1.75rem; font-weight: 700; color: #F1F5F9; margin-bottom: 0.5rem; }
        .prose-legal .meta { color: #64748B; font-size: 0.8125rem; margin-bottom: 2rem; }
        .prose-legal table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
        .prose-legal th, .prose-legal td { padding: 1rem; font-size: 0.9375rem; border-bottom: 1px solid rgba(255,255,255,0.06); vertical-align: top; }
        .prose-legal th { color: #94A3B8; font-weight: 500; width: 200px; background: rgba(255,255,255,0.02); white-space: nowrap; }
        .prose-legal td { color: #CBD5E1; }
      `}</style>
    </article>
  );
}
