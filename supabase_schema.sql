-- CVMアンケート調査用テーブル作成
-- SupabaseのSQL Editorで実行してください

CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 同意
  consent BOOLEAN NOT NULL,
  
  -- 来訪状況
  visited_past_12_months BOOLEAN,
  visit_count_past_12_months INTEGER,
  visit_probability_next_12_months INTEGER CHECK (visit_probability_next_12_months >= 0 AND visit_probability_next_12_months <= 100),
  visit_purposes TEXT[], -- ['nature', 'hiking', 'onsen', 'dining', 'other']
  visit_purpose_other TEXT,
  companion TEXT, -- 'alone', 'family_with_children', 'family_without_children', 'friends', 'group'
  
  -- 現状認識
  awareness_level TEXT, -- 'first_time', 'somewhat', 'well'
  bear_encounter_anxiety INTEGER CHECK (bear_encounter_anxiety >= 0 AND bear_encounter_anxiety <= 10),
  
  -- シナリオ
  scenario TEXT CHECK (scenario IN ('A', 'B', 'C')),
  risk_reduction_rate INTEGER CHECK (risk_reduction_rate IN (50, 80)),
  
  -- CVM
  initial_bid INTEGER,
  initial_response BOOLEAN,
  followup_bid INTEGER,
  followup_response BOOLEAN,
  confidence_level INTEGER CHECK (confidence_level >= 0 AND confidence_level <= 10),
  protest_reasons TEXT[], -- ['budget_insufficient', 'no_visit_planned', 'should_be_public_funded', 'untrustworthy', 'payment_method_opposed', 'other']
  protest_reason_other TEXT,
  
  -- 対策なしの場合の来訪意向
  visit_intent_without_measures TEXT, -- 'increase', 'same', 'slightly_decrease', 'greatly_decrease'
  visit_intent_reason TEXT,
  
  -- 対策導入時の影響
  stay_duration_change TEXT, -- 'increase', 'same', 'decrease'
  consumption_change TEXT, -- 'increase', 'same', 'decrease'
  
  -- 属性
  age INTEGER CHECK (age >= 16),
  gender TEXT, -- 'male', 'female', 'prefer_not_to_answer', 'other'
  household_income TEXT, -- 'under_3m', '3m_6m', '6m_10m', 'over_10m', 'prefer_not_to_answer'
  has_children BOOLEAN,
  risk_aversion INTEGER CHECK (risk_aversion >= 0 AND risk_aversion <= 10),
  visit_frequency TEXT, -- 'first_time', '1_2_times', '3_or_more'
  residence_prefecture TEXT,
  
  -- 後質問
  zero_wtp_reason TEXT,
  scenario_sufficient TEXT, -- 'sufficient', 'neutral', 'insufficient'
  scenario_insufficient_info TEXT,
  similar_initiatives_known BOOLEAN,
  similar_initiatives_location TEXT
);

-- インデックス作成（分析用）
CREATE INDEX IF NOT EXISTS idx_survey_scenario ON survey_responses(scenario);
CREATE INDEX IF NOT EXISTS idx_survey_risk_reduction ON survey_responses(risk_reduction_rate);
CREATE INDEX IF NOT EXISTS idx_survey_initial_bid ON survey_responses(initial_bid);
CREATE INDEX IF NOT EXISTS idx_survey_created_at ON survey_responses(created_at);

-- Row Level Security (RLS) の設定
-- 全ユーザーがINSERT可能、SELECTは管理者のみ（必要に応じて調整）
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- 全ユーザーがINSERT可能
CREATE POLICY "Allow public insert" ON survey_responses
  FOR INSERT
  TO public
  WITH CHECK (true);

-- SELECTは認証済みユーザーのみ（必要に応じて変更）
-- 匿名アクセスを許可する場合は以下のコメントを外してください
-- CREATE POLICY "Allow public select" ON survey_responses
--   FOR SELECT
--   TO public
--   USING (true);

-- 分析用ビュー（オプション）
CREATE OR REPLACE VIEW survey_summary AS
SELECT 
  scenario,
  risk_reduction_rate,
  initial_bid,
  COUNT(*) as total_responses,
  COUNT(*) FILTER (WHERE initial_response = true) as yes_count,
  COUNT(*) FILTER (WHERE initial_response = false) as no_count,
  AVG(confidence_level) as avg_confidence,
  AVG(bear_encounter_anxiety) as avg_anxiety,
  AVG(risk_aversion) as avg_risk_aversion
FROM survey_responses
WHERE consent = true
GROUP BY scenario, risk_reduction_rate, initial_bid;

