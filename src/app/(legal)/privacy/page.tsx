import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | S&G Platform",
};

export default function PrivacyPage() {
  return (
    <article className="prose-legal">
      <h1>プライバシーポリシー</h1>
      <p className="meta">最終更新日: 2026年4月6日</p>

      <p>S&G Platform（以下「当サービス」）は、ユーザーの個人情報の保護を重要と考え、以下のとおりプライバシーポリシーを定めます。</p>

      <h2>1. 収集する情報</h2>
      <h3>1.1 アカウント情報</h3>
      <p>当サービスの利用にあたり、以下の情報を収集します。</p>
      <ul>
        <li>氏名、会社名</li>
        <li>メールアドレス</li>
        <li>電話番号</li>
        <li>パスワード（ハッシュ化して保存）</li>
      </ul>

      <h3>1.2 サービス利用データ</h3>
      <ul>
        <li>登録したキーワード、ドメイン情報</li>
        <li>順位トラッキングデータ</li>
        <li>サイト監査の結果</li>
        <li>作成した記事・レポートのデータ</li>
        <li>GEO モニタリングの結果</li>
      </ul>

      <h3>1.3 外部サービス連携データ</h3>
      <ul>
        <li>Google Search Console のアクセストークン・パフォーマンスデータ</li>
        <li>Google Analytics 4 のデータ</li>
      </ul>
      <p>これらのトークンは AES-256-GCM で暗号化して保存されます。</p>

      <h3>1.4 決済情報</h3>
      <p>クレジットカード情報は Pay.jp により処理され、当サービスのサーバーにはカード番号を保存しません。Pay.jp の顧客IDのみを保持します。</p>

      <h3>1.5 自動収集情報</h3>
      <ul>
        <li>IPアドレス</li>
        <li>ブラウザの種類・バージョン</li>
        <li>アクセス日時</li>
        <li>Cookie情報</li>
      </ul>

      <h2>2. 情報の利用目的</h2>
      <p>収集した情報は以下の目的で利用します。</p>
      <ol>
        <li>当サービスの提供・運営・改善</li>
        <li>ユーザーサポートの提供</li>
        <li>利用状況の分析・統計データの作成</li>
        <li>課金処理・請求関連の処理</li>
        <li>サービスに関する通知（順位変動アラート、GEO変動通知、エラー通知等）</li>
        <li>不正利用の検知・防止</li>
        <li>サービスの新機能やアップデートのご案内</li>
      </ol>

      <h2>3. 第三者への提供</h2>
      <p>当サービスは、以下の場合を除き、個人情報を第三者に提供しません。</p>
      <ol>
        <li>ユーザーの同意がある場合</li>
        <li>法令に基づく場合</li>
        <li>人の生命、身体または財産の保護のために必要な場合</li>
        <li>サービス提供に必要な業務委託先（以下に記載）に対して必要な範囲で提供する場合</li>
      </ol>

      <h2>4. 外部サービスとの連携</h2>
      <p>当サービスは以下の外部サービスと連携しています。各サービスのプライバシーポリシーもご確認ください。</p>
      <table>
        <thead>
          <tr><th>サービス</th><th>用途</th><th>提供元</th></tr>
        </thead>
        <tbody>
          <tr><td>Supabase</td><td>認証・データベース</td><td>Supabase Inc.</td></tr>
          <tr><td>Pay.jp</td><td>決済処理</td><td>PAY株式会社</td></tr>
          <tr><td>DataForSEO</td><td>検索順位・キーワードデータ</td><td>DataForSEO</td></tr>
          <tr><td>Google Search Console API</td><td>検索パフォーマンスデータ</td><td>Google LLC</td></tr>
          <tr><td>Google Analytics 4</td><td>トラフィックデータ</td><td>Google LLC</td></tr>
          <tr><td>Anthropic Claude API</td><td>AI分析・記事生成</td><td>Anthropic PBC</td></tr>
          <tr><td>OpenAI API</td><td>GEOモニタリング</td><td>OpenAI, Inc.</td></tr>
          <tr><td>Google Gemini API</td><td>GEOモニタリング</td><td>Google LLC</td></tr>
          <tr><td>Perplexity API</td><td>GEOモニタリング</td><td>Perplexity AI</td></tr>
          <tr><td>Resend</td><td>メール通知</td><td>Resend Inc.</td></tr>
          <tr><td>Vercel</td><td>ホスティング</td><td>Vercel Inc.</td></tr>
        </tbody>
      </table>

      <h2>5. データの保存・セキュリティ</h2>
      <ol>
        <li>データは Supabase（PostgreSQL）上に保存され、通信は TLS で暗号化されます。</li>
        <li>外部サービスの認証トークンは AES-256-GCM で暗号化して保存します。</li>
        <li>パスワードはハッシュ化して保存し、平文での保存は行いません。</li>
        <li>定期的なセキュリティレビューを実施します。</li>
      </ol>

      <h2>6. データの保持期間</h2>
      <ol>
        <li>アカウント情報: アカウント削除後30日で完全削除</li>
        <li>順位履歴データ: アカウント存続中は無期限保持</li>
        <li>監査データ: 最新5回分を保持</li>
        <li>ログデータ: 90日間保持</li>
      </ol>

      <h2>7. ユーザーの権利</h2>
      <p>ユーザーは以下の権利を有します。</p>
      <ol>
        <li><strong>アクセス権:</strong> 当サービスが保持する個人情報の開示を請求できます。</li>
        <li><strong>訂正権:</strong> 不正確な個人情報の訂正を請求できます。</li>
        <li><strong>削除権:</strong> 個人情報の削除を請求できます。</li>
        <li><strong>データポータビリティ:</strong> 保持データのエクスポートを請求できます。</li>
        <li><strong>同意の撤回:</strong> データ処理への同意をいつでも撤回できます。</li>
      </ol>
      <p>上記の請求は、設定画面またはサポート窓口を通じて行うことができます。</p>

      <h2>8. Cookie の使用</h2>
      <p>当サービスは以下の目的で Cookie を使用します。</p>
      <ol>
        <li>認証セッションの維持</li>
        <li>ユーザー設定の保存</li>
        <li>サービス利用状況の分析</li>
      </ol>
      <p>ブラウザの設定により Cookie を無効にできますが、一部の機能が利用できなくなる場合があります。</p>

      <h2>9. 未成年者の利用</h2>
      <p>当サービスは16歳未満の方の利用を想定していません。16歳未満の方の個人情報を意図的に収集することはありません。</p>

      <h2>10. ポリシーの変更</h2>
      <p>本ポリシーを変更する場合は、当サービス上での掲載をもって通知とします。重要な変更については、登録メールアドレスへの通知も行います。</p>

      <h2>11. お問い合わせ</h2>
      <p>個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください。</p>
      <p>メール: privacy@sg-platform.jp</p>

      <style>{`
        .prose-legal { color: #CBD5E1; line-height: 1.8; }
        .prose-legal h1 { font-size: 1.75rem; font-weight: 700; color: #F1F5F9; margin-bottom: 0.5rem; }
        .prose-legal h2 { font-size: 1.125rem; font-weight: 600; color: #F1F5F9; margin-top: 2.5rem; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .prose-legal h3 { font-size: 1rem; font-weight: 600; color: #E2E8F0; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .prose-legal p { margin-bottom: 1rem; font-size: 0.9375rem; }
        .prose-legal .meta { color: #64748B; font-size: 0.8125rem; margin-bottom: 2rem; }
        .prose-legal ol, .prose-legal ul { padding-left: 1.5rem; margin-bottom: 1rem; }
        .prose-legal ol { list-style: decimal; }
        .prose-legal ul { list-style: disc; }
        .prose-legal ol li, .prose-legal ul li { margin-bottom: 0.5rem; font-size: 0.9375rem; }
        .prose-legal strong { color: #F1F5F9; }
        .prose-legal table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.875rem; }
        .prose-legal th, .prose-legal td { padding: 0.625rem 0.75rem; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .prose-legal th { color: #94A3B8; font-weight: 500; background: rgba(255,255,255,0.03); }
      `}</style>
    </article>
  );
}
