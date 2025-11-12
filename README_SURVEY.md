# CVMアンケートWebサイト

## セットアップ

### 1. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabaseデータベースのセットアップ

SupabaseのSQL Editorで`supabase_schema.sql`の内容を実行してください。

1. Supabaseダッシュボードにログイン
2. SQL Editorを開く
3. `supabase_schema.sql`の内容をコピー＆ペースト
4. 実行ボタンをクリック

これにより、`survey_responses`テーブルと必要なインデックス、RLSポリシーが作成されます。

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

## 機能

- マルチステップフォーム（7ステップ）
- ランダム割付（シナリオA/B/C、リスク低減率50%/80%、ビッド金額）
- 二項選択＋ダブルバウンデッドCVM
- Apple Human Interface Guidelinesに基づいたデザイン
- Supabaseへの自動データ保存

## データ分析

SupabaseのSQL Editorで以下のクエリを実行してデータを分析できます：

```sql
-- 基本統計
SELECT 
  scenario,
  risk_reduction_rate,
  initial_bid,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE initial_response = true) as yes_count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE initial_response = true) / COUNT(*), 2) as yes_rate
FROM survey_responses
WHERE consent = true
GROUP BY scenario, risk_reduction_rate, initial_bid
ORDER BY scenario, risk_reduction_rate, initial_bid;

-- 平均WTP（簡易版）
SELECT 
  scenario,
  AVG(initial_bid) FILTER (WHERE initial_response = true) as avg_wtp_yes,
  AVG(initial_bid) FILTER (WHERE initial_response = false) as avg_wtp_no
FROM survey_responses
WHERE consent = true AND initial_response IS NOT NULL
GROUP BY scenario;
```

