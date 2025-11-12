'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { SurveyResponse, Scenario, ProtestReason } from '@/types/survey'
import ConsentSection from './sections/ConsentSection'
import VisitStatusSection from './sections/VisitStatusSection'
import AwarenessSection from './sections/AwarenessSection'
import ScenarioSection from './sections/ScenarioSection'
import CVMSection from './sections/CVMSection'
import AttributesSection from './sections/AttributesSection'
import PostQuestionSection from './sections/PostQuestionSection'
import ProgressBar from './ProgressBar'

const surveySchema = z.object({
  consent: z.boolean().refine(val => val === true, '同意が必要です'),
  visited_past_12_months: z.union([z.string(), z.boolean()]).optional(),
  visit_count_past_12_months: z.number().optional(),
  visit_probability_next_12_months: z.number().min(0).max(100).optional(),
  visit_purposes: z.array(z.string()).optional(),
  visit_purpose_other: z.string().optional(),
  companion: z.string().optional(),
  awareness_level: z.string().optional(),
  bear_encounter_anxiety: z.number().min(0).max(10).optional(),
  scenario: z.string().optional(),
  risk_reduction_rate: z.number().optional(),
  initial_bid: z.number().optional(),
  initial_response: z.boolean().optional(),
  followup_bid: z.number().optional(),
  followup_response: z.boolean().optional(),
  confidence_level: z.number().min(0).max(10).optional(),
  protest_reasons: z.array(z.string()).optional(),
  protest_reason_other: z.string().optional(),
  visit_intent_without_measures: z.string().optional(),
  visit_intent_reason: z.string().optional(),
  stay_duration_change: z.string().optional(),
  consumption_change: z.string().optional(),
  age: z.number().optional(),
  gender: z.string().optional(),
  household_income: z.string().optional(),
  has_children: z.union([z.string(), z.boolean()]).optional(),
  risk_aversion: z.number().min(0).max(10).optional(),
  visit_frequency: z.string().optional(),
  residence_prefecture: z.string().optional(),
  zero_wtp_reason: z.string().optional(),
  scenario_sufficient: z.string().optional(),
  scenario_insufficient_info: z.string().optional(),
  similar_initiatives_known: z.union([z.string(), z.boolean()]).optional(),
  similar_initiatives_location: z.string().optional(),
})

type SurveyFormData = z.infer<typeof surveySchema>

const BIDS = [200, 400, 800, 1200, 2000, 3000]
const SCENARIOS: Scenario[] = ['A', 'B', 'C']
const RISK_REDUCTION_RATES = [50, 80]

export default function SurveyForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [riskReductionRate, setRiskReductionRate] = useState<number | null>(null)
  const [initialBid, setInitialBid] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    mode: 'onChange',
    defaultValues: {
      consent: false,
      visited_past_12_months: false,
    },
  })

  const { watch, setValue, handleSubmit, formState: { errors, isValid } } = form

  // ランダム割付の初期化
  useEffect(() => {
    if (currentStep === 3 && !scenario) {
      const randomScenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]
      const randomRiskRate = RISK_REDUCTION_RATES[Math.floor(Math.random() * RISK_REDUCTION_RATES.length)]
      const randomBid = BIDS[Math.floor(Math.random() * BIDS.length)]
      
      setScenario(randomScenario)
      setRiskReductionRate(randomRiskRate)
      setInitialBid(randomBid)
      setValue('scenario', randomScenario)
      setValue('risk_reduction_rate', randomRiskRate)
      setValue('initial_bid', randomBid)
    }
  }, [currentStep, scenario, setValue])

  const totalSteps = 7

  const onSubmit = async (data: SurveyFormData) => {
    console.log('onSubmit called', data)
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response: SurveyResponse = {
        consent: data.consent,
        visited_past_12_months: typeof data.visited_past_12_months === 'boolean' ? data.visited_past_12_months : data.visited_past_12_months === 'true',
        visit_count_past_12_months: data.visit_count_past_12_months,
        visit_probability_next_12_months: data.visit_probability_next_12_months,
        visit_purposes: data.visit_purposes as any,
        visit_purpose_other: data.visit_purpose_other,
        companion: data.companion as any,
        awareness_level: data.awareness_level as any,
        bear_encounter_anxiety: data.bear_encounter_anxiety,
        scenario: data.scenario as Scenario,
        risk_reduction_rate: data.risk_reduction_rate,
        initial_bid: data.initial_bid,
        initial_response: data.initial_response,
        followup_bid: data.followup_bid,
        followup_response: data.followup_response,
        confidence_level: data.confidence_level,
        protest_reasons: data.protest_reasons as ProtestReason[],
        protest_reason_other: data.protest_reason_other,
        visit_intent_without_measures: data.visit_intent_without_measures as any,
        visit_intent_reason: data.visit_intent_reason,
        stay_duration_change: data.stay_duration_change as any,
        consumption_change: data.consumption_change as any,
        age: data.age,
        gender: data.gender as any,
        household_income: data.household_income as any,
        has_children: typeof data.has_children === 'boolean' ? data.has_children : data.has_children === 'true',
        risk_aversion: data.risk_aversion,
        visit_frequency: data.visit_frequency as any,
        residence_prefecture: data.residence_prefecture,
        zero_wtp_reason: data.zero_wtp_reason,
        scenario_sufficient: data.scenario_sufficient as any,
        scenario_insufficient_info: data.scenario_insufficient_info,
        similar_initiatives_known: typeof data.similar_initiatives_known === 'boolean' ? data.similar_initiatives_known : data.similar_initiatives_known === 'true',
        similar_initiatives_location: data.similar_initiatives_location,
      }

      const { error } = await supabase
        .from('survey_responses')
        .insert([response])

      if (error) throw error

      setSubmitSuccess(true)
    } catch (error: any) {
      setSubmitError(error.message || '送信に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">送信完了</h2>
          <p className="text-gray-600">ご協力ありがとうございました。</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          {currentStep === 0 && (
            <ConsentSection form={form} onNext={nextStep} />
          )}
          {currentStep === 1 && (
            <VisitStatusSection form={form} onNext={nextStep} onPrev={prevStep} />
          )}
          {currentStep === 2 && (
            <AwarenessSection form={form} onNext={nextStep} onPrev={prevStep} />
          )}
          {currentStep === 3 && (
            <ScenarioSection 
              form={form} 
              scenario={scenario} 
              riskReductionRate={riskReductionRate}
              onNext={nextStep} 
              onPrev={prevStep} 
            />
          )}
          {currentStep === 4 && (
            <CVMSection 
              form={form} 
              initialBid={initialBid}
              onNext={nextStep} 
              onPrev={prevStep} 
            />
          )}
          {currentStep === 5 && (
            <AttributesSection form={form} onNext={nextStep} onPrev={prevStep} />
          )}
          {currentStep === 6 && (
            <>
              {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <p className="text-sm font-medium text-red-800 mb-2">バリデーションエラー:</p>
                  <pre className="text-xs text-red-600 overflow-auto">
                    {JSON.stringify(errors, null, 2)}
                  </pre>
                </div>
              )}
              <PostQuestionSection 
                form={form} 
                onPrev={prevStep}
                onSubmit={handleSubmit(onSubmit)}
                isSubmitting={isSubmitting}
                submitError={submitError}
              />
            </>
          )}
        </form>
      </div>
    </div>
  )
}

