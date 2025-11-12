'use client'

import { UseFormReturn } from 'react-hook-form'

interface AwarenessSectionProps {
  form: UseFormReturn<any>
  onNext: () => void
  onPrev: () => void
}

export default function AwarenessSection({ form, onNext, onPrev }: AwarenessSectionProps) {
  const { register, formState: { errors } } = form

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">現状の安全とクマ遭遇に関する認識</h2>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-700 leading-relaxed">
          【高尾山】では、近年、クマの出没があり、管理者は注意喚起・巡回等を行っています（※被害件数・出没件数の実データをここに簡潔に記載）。
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            5. この認識は：
          </label>
          <div className="space-y-2">
            {[
              { value: 'first_time', label: '初めて知った' },
              { value: 'somewhat', label: '多少知っていた' },
              { value: 'well', label: 'よく知っていた' },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value={value}
                  {...register('awareness_level')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            6. クマ遭遇に対する不安感（0=全くない 〜 10=非常に高い）
          </label>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="0-10"
            {...register('bear_encounter_anxiety', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">0（全くない）から10（非常に高い）までの数値を入力してください</p>
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

