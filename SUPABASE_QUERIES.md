# Supabaseで実行するクエリ

## 1. テーブル作成（初回のみ）

`supabase_schema.sql`の内容をSupabaseのSQL Editorで実行してください。

## 2. データ分析クエリ

### 基本統計（シナリオ別、ビッド別のYes率）

```sql
SELECT 
  scenario,
  risk_reduction_rate,
  initial_bid,
  COUNT(*) as total_responses,
  COUNT(*) FILTER (WHERE initial_response = true) as yes_count,
  COUNT(*) FILTER (WHERE initial_response = false) as no_count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE initial_response = true) / COUNT(*), 2) as yes_rate_percent,
  AVG(confidence_level) as avg_confidence,
  AVG(bear_encounter_anxiety) as avg_anxiety
FROM survey_responses
WHERE consent = true AND initial_response IS NOT NULL
GROUP BY scenario, risk_reduction_rate, initial_bid
ORDER BY scenario, risk_reduction_rate, initial_bid;
```

### シナリオ間比較

```sql
SELECT 
  scenario,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE initial_response = true) as yes_count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE initial_response = true) / COUNT(*), 2) as yes_rate_percent,
  AVG(initial_bid) FILTER (WHERE initial_response = true) as avg_wtp_yes,
  AVG(confidence_level) as avg_confidence
FROM survey_responses
WHERE consent = true AND initial_response IS NOT NULL
GROUP BY scenario
ORDER BY scenario;
```

### リスク低減率の効果（スコープテスト）

```sql
SELECT 
  risk_reduction_rate,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE initial_response = true) as yes_count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE initial_response = true) / COUNT(*), 2) as yes_rate_percent,
  AVG(initial_bid) FILTER (WHERE initial_response = true) as avg_wtp_yes
FROM survey_responses
WHERE consent = true AND initial_response IS NOT NULL
GROUP BY risk_reduction_rate
ORDER BY risk_reduction_rate;
```

### プロテスト回答の分析

```sql
SELECT 
  unnest(protest_reasons) as protest_reason,
  COUNT(*) as count
FROM survey_responses
WHERE consent = true 
  AND initial_response = false 
  AND protest_reasons IS NOT NULL
GROUP BY protest_reason
ORDER BY count DESC;
```

### 属性別分析

```sql
SELECT 
  visit_frequency,
  household_income,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE initial_response = true) as yes_count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE initial_response = true) / COUNT(*), 2) as yes_rate_percent
FROM survey_responses
WHERE consent = true AND initial_response IS NOT NULL
GROUP BY visit_frequency, household_income
ORDER BY visit_frequency, household_income;
```

### ダブルバウンデッド分析

```sql
SELECT 
  initial_bid,
  initial_response,
  followup_bid,
  followup_response,
  COUNT(*) as count
FROM survey_responses
WHERE consent = true 
  AND initial_response IS NOT NULL
  AND followup_response IS NOT NULL
GROUP BY initial_bid, initial_response, followup_bid, followup_response
ORDER BY initial_bid, initial_response, followup_bid;
```

### 回答の確信度分析

```sql
SELECT 
  CASE 
    WHEN confidence_level >= 7 THEN '高（7-10）'
    WHEN confidence_level >= 4 THEN '中（4-6）'
    ELSE '低（0-3）'
  END as confidence_category,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE initial_response = true) as yes_count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE initial_response = true) / COUNT(*), 2) as yes_rate_percent
FROM survey_responses
WHERE consent = true AND confidence_level IS NOT NULL
GROUP BY confidence_category
ORDER BY confidence_category;
```

### 日別回答数

```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as responses
FROM survey_responses
WHERE consent = true
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### データエクスポート（CSV用）

```sql
SELECT 
  id,
  created_at,
  scenario,
  risk_reduction_rate,
  initial_bid,
  initial_response,
  followup_bid,
  followup_response,
  confidence_level,
  bear_encounter_anxiety,
  risk_aversion,
  age,
  gender,
  household_income,
  visit_frequency,
  residence_prefecture
FROM survey_responses
WHERE consent = true
ORDER BY created_at DESC;
```

