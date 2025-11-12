'use client'

import { UseFormReturn } from 'react-hook-form'

interface VisitStatusSectionProps {
  form: UseFormReturn<any>
  onNext: () => void
  onPrev: () => void
}

export default function VisitStatusSection({ form, onNext, onPrev }: VisitStatusSectionProps) {
  const { register, watch, setValue, formState: { errors } } = form
  const visited = watch('visited_past_12_months')
  const purposes = watch('visit_purposes') || []

  const togglePurpose = (purpose: string) => {
    const current = purposes as string[]
    if (current.includes(purpose)) {
      setValue('visit_purposes', current.filter(p => p !== purpose))
    } else {
      setValue('visit_purposes', [...current, purpose])
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">最近の来訪状況と計画</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            1. あなたは過去12か月に【高尾山】を訪れましたか？
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                value="true"
                {...register('visited_past_12_months')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">はい</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                value="false"
                {...register('visited_past_12_months')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">いいえ</span>
            </label>
          </div>
          {(visited === true || visited === 'true') && (
            <div className="mt-3">
              <input
                type="number"
                placeholder="回数"
                min="1"
                {...register('visit_count_past_12_months', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            2. 今後12か月に訪れる可能性は？（0-100%）
          </label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="0-100"
            {...register('visit_probability_next_12_months', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            3. 主な目的（複数可）
          </label>
          <div className="space-y-2">
            {[
              { value: 'nature', label: '自然観光' },
              { value: 'hiking', label: 'ハイキング' },
              { value: 'onsen', label: '温泉' },
              { value: 'dining', label: '食事' },
              { value: 'other', label: 'その他' },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={purposes.includes(value)}
                  onChange={() => togglePurpose(value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">{label}</span>
              </label>
            ))}
            {purposes.includes('other') && (
              <input
                type="text"
                placeholder="その他の目的を入力"
                {...register('visit_purpose_other')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            4. 同行者
          </label>
          <div className="space-y-2">
            {[
              { value: 'alone', label: '1人' },
              { value: 'family_with_children', label: '家族（子どもあり）' },
              { value: 'family_without_children', label: '家族（子どもなし）' },
              { value: 'friends', label: '友人' },
              { value: 'group', label: '団体' },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value={value}
                  {...register('companion')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
        >
          戻る
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          次へ
        </button>
      </div>
    </div>
  )
}

