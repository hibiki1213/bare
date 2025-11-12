'use client'

import { UseFormReturn } from 'react-hook-form'

interface AttributesSectionProps {
  form: UseFormReturn<any>
  onNext: () => void
  onPrev: () => void
}

export default function AttributesSection({ form, onNext, onPrev }: AttributesSectionProps) {
  const { register, formState: { errors } } = form

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">属性と旅行関連</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              14. 年齢
            </label>
            <input
              type="number"
              min="16"
              placeholder="歳"
              {...register('age', { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              性別
            </label>
            <select
              {...register('gender')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">選択してください</option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="prefer_not_to_answer">回答しない</option>
              <option value="other">その他</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            15. 世帯年収（税引前）
          </label>
          <div className="space-y-2">
            {[
              { value: 'under_3m', label: '〜299万' },
              { value: '3m_6m', label: '300–599万' },
              { value: '6m_10m', label: '600–999万' },
              { value: 'over_10m', label: '1000万以上' },
              { value: 'prefer_not_to_answer', label: '回答しない' },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value={value}
                  {...register('household_income')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            16. 子ども同伴の有無
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                value="true"
                {...register('has_children', {
                  setValueAs: (v) => v === 'true'
                })}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">あり</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                value="false"
                {...register('has_children', {
                  setValueAs: (v) => v === 'false' ? false : v === 'true'
                })}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">なし</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            17. 自然リスクに対する一般的リスク回避度（0–10）
          </label>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="0-10"
            {...register('risk_aversion', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            18. 来訪頻度（年あたり）
          </label>
          <div className="space-y-2">
            {[
              { value: 'first_time', label: '初めて' },
              { value: '1_2_times', label: '1–2回' },
              { value: '3_or_more', label: '3回以上' },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value={value}
                  {...register('visit_frequency')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            19. 居住地：都道府県
          </label>
          <input
            type="text"
            placeholder="都道府県名を入力"
            {...register('residence_prefecture')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
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

