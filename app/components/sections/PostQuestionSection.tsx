'use client'

import { UseFormReturn } from 'react-hook-form'

interface PostQuestionSectionProps {
  form: UseFormReturn<any>
  onPrev: () => void
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  isSubmitting: boolean
  submitError: string | null
}

export default function PostQuestionSection({ form, onPrev, onSubmit, isSubmitting, submitError }: PostQuestionSectionProps) {
  const { register, watch, formState: { errors } } = form
  const scenarioSufficient = watch('scenario_sufficient')
  const similarInitiativesKnown = watch('similar_initiatives_known')

  const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log('Submit button clicked')
    console.log('Form errors:', errors)
    console.log('Form values:', watch())
    onSubmit(e)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">後質問</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            20. もし「0円でも支払わない」場合、その主な理由は？（自由記述）
          </label>
          <textarea
            rows={4}
            placeholder="理由を入力してください"
            {...register('zero_wtp_reason')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            21. 本シナリオの説明は十分でしたか？
          </label>
          <div className="space-y-2">
            {[
              { value: 'sufficient', label: '十分' },
              { value: 'neutral', label: 'どちらともいえない' },
              { value: 'insufficient', label: '不十分' },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value={value}
                  {...register('scenario_sufficient')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">{label}</span>
              </label>
            ))}
          </div>
          {scenarioSufficient === 'insufficient' && (
            <input
              type="text"
              placeholder="不足している情報を入力"
              {...register('scenario_insufficient_info')}
              className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            22. 似た観光地での同様の取組を知っている/利用したことはありますか？
          </label>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                value="true"
                {...register('similar_initiatives_known')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">ある</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                value="false"
                {...register('similar_initiatives_known')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">ない</span>
            </label>
          </div>
          {(similarInitiativesKnown === true || similarInitiativesKnown === 'true') && (
            <input
              type="text"
              placeholder="地名・施設名を入力"
              {...register('similar_initiatives_location')}
              className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
        </div>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          戻る
        </button>
        <button
          type="submit"
          onClick={handleSubmitClick}
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isSubmitting ? '送信中...' : '送信する'}
        </button>
      </div>
    </div>
  )
}

