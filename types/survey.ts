export type Scenario = 'A' | 'B' | 'C'

export type VisitPurpose = 'nature' | 'hiking' | 'onsen' | 'dining' | 'other'

export type Companion = 'alone' | 'family_with_children' | 'family_without_children' | 'friends' | 'group'

export type ProtestReason = 
  | 'budget_insufficient'
  | 'no_visit_planned'
  | 'should_be_public_funded'
  | 'untrustworthy'
  | 'payment_method_opposed'
  | 'other'

export interface SurveyResponse {
  // 基本情報
  id?: string
  created_at?: string
  
  // 同意
  consent: boolean
  
  // 来訪状況
  visited_past_12_months: boolean
  visit_count_past_12_months?: number
  visit_probability_next_12_months?: number
  visit_purposes?: VisitPurpose[]
  visit_purpose_other?: string
  companion?: Companion
  
  // 現状認識
  awareness_level?: 'first_time' | 'somewhat' | 'well'
  bear_encounter_anxiety?: number // 0-10
  
  // シナリオ
  scenario?: Scenario
  risk_reduction_rate?: number // 50 or 80
  
  // CVM
  initial_bid?: number
  initial_response?: boolean // Yes/No
  followup_bid?: number
  followup_response?: boolean
  confidence_level?: number // 0-10
  protest_reasons?: ProtestReason[]
  protest_reason_other?: string
  
  // 対策なしの場合の来訪意向
  visit_intent_without_measures?: 'increase' | 'same' | 'slightly_decrease' | 'greatly_decrease'
  visit_intent_reason?: string
  
  // 対策導入時の影響
  stay_duration_change?: 'increase' | 'same' | 'decrease'
  consumption_change?: 'increase' | 'same' | 'decrease'
  
  // 属性
  age?: number
  gender?: 'male' | 'female' | 'prefer_not_to_answer' | 'other'
  household_income?: 'under_3m' | '3m_6m' | '6m_10m' | 'over_10m' | 'prefer_not_to_answer'
  has_children?: boolean
  risk_aversion?: number // 0-10
  visit_frequency?: 'first_time' | '1_2_times' | '3_or_more'
  residence_prefecture?: string
  
  // 後質問
  zero_wtp_reason?: string
  scenario_sufficient?: 'sufficient' | 'neutral' | 'insufficient'
  scenario_insufficient_info?: string
  similar_initiatives_known?: boolean
  similar_initiatives_location?: string
}

