'use client'

import { UseFormReturn } from 'react-hook-form'

interface ConsentSectionProps {
  form: UseFormReturn<any>
  onNext: () => void
}

export default function ConsentSection({ form, onNext }: ConsentSectionProps) {
  const { register, watch, formState: { errors } } = form
  const consent = watch('consent')

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">調査へのご協力のお願い</h2>
        <p className="text-gray-600 leading-relaxed">
          本調査は、観光地におけるクマ対策の実施方針検討に活用され、結果次第で料金設定等に実際に反映される可能性があります（個人は特定されません）。
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          <strong className="font-semibold">所要時間：</strong>約5-8分<br />
          <strong className="font-semibold">対象：</strong>16歳以上の来訪者/来訪予定者<br />
          <strong className="font-semibold">重要：</strong>回答は架空ではなく、実際に支払う気持ちでお答えください。
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex items-start space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            {...register('consent')}
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-700 group-hover:text-gray-900">
            参加への同意：上記の内容を理解し、調査に参加することに同意します
          </span>
        </label>
        {errors.consent && (
          <p className="text-red-600 text-sm">{errors.consent.message as string}</p>
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!consent}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
      >
        次へ進む
      </button>
    </div>
  )
}

