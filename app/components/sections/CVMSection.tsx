'use client'

import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

interface CVMSectionProps {
  form: UseFormReturn<any>
  initialBid: number | null
  onNext: () => void
  onPrev: () => void
}

export default function CVMSection({ form, initialBid, onNext, onPrev }: CVMSectionProps) {
  const { register, watch, setValue, formState: { errors } } = form
  const initialResponse = watch('initial_response')
  const followupResponse = watch('followup_response')
  const [showFollowup, setShowFollowup] = useState(false)

  if (!initialBid) {
    return <div>読み込み中...</div>
  }

  const handleInitialResponse = (response: boolean) => {
    setValue('initial_response', response)
    setShowFollowup(true)
    
    if (response) {
      // Yesの場合：上位ビッド（×1.5）
      const followupBid = Math.round(initialBid * 1.5)
      setValue('followup_bid', followupBid)
    } else {
      // Noの場合：下位ビッド（×0.67）
      const followupBid = Math.round(initialBid * 0.67)
      setValue('followup_bid', followupBid)
    }
  }

  const followupBid = watch('followup_bid')

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">支払い意思の確認</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            7. あなたは、上記の対策を実施する条件で、<strong className="text-blue-600">入場料に追加で¥{initialBid.toLocaleString()}の保全協力金</strong>が上乗せされる場合、支払いますか？
          </label>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleInitialResponse(true)}
              className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                initialResponse === true
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              はい
            </button>
            <button
              type="button"
              onClick={() => handleInitialResponse(false)}
              className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                initialResponse === false
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              いいえ
            </button>
          </div>
        </div>

        {showFollowup && followupBid && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              {initialResponse
                ? `8. それでは、¥${followupBid.toLocaleString()}でも支払いますか？`
                : `9. それでは、¥${followupBid.toLocaleString()}なら支払いますか？`}
            </label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setValue('followup_response', true)}
                className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                  followupResponse === true
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                はい
              </button>
              <button
                type="button"
                onClick={() => setValue('followup_response', false)}
                className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                  followupResponse === false
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                いいえ
              </button>
            </div>
          </div>
        )}

        {showFollowup && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                10. 回答の確信度（0=全く自信がない 〜 10=完全に自信がある）
              </label>
              <input
                type="number"
                min="0"
                max="10"
                placeholder="0-10"
                {...register('confidence_level', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {initialResponse === false && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  11. 「いいえ」と答えた理由（複数可）
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'budget_insufficient', label: '収入・予算の不足（負担が重い）' },
                    { value: 'no_visit_planned', label: 'そもそも訪問する予定がない/減らすつもり' },
                    { value: 'should_be_public_funded', label: '行政/運営の資金で賄うべき' },
                    { value: 'untrustworthy', label: '効果を信用できない（情報不十分）' },
                    { value: 'payment_method_opposed', label: '支払い方法が不適切（税・協力金に反対）' },
                    { value: 'other', label: 'その他' },
                  ].map(({ value, label }) => {
                    const reasons = watch('protest_reasons') || []
                    return (
                      <label key={value} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={reasons.includes(value)}
                          onChange={(e) => {
                            const current = reasons as string[]
                            if (e.target.checked) {
                              setValue('protest_reasons', [...current, value])
                            } else {
                              setValue('protest_reasons', current.filter(r => r !== value))
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{label}</span>
                      </label>
                    )
                  })}
                  {(watch('protest_reasons') || []).includes('other') && (
                    <input
                      type="text"
                      placeholder="その他の理由を入力"
                      {...register('protest_reason_other')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                12. 対策がない場合、来訪意向はどう変わりますか？
              </label>
              <div className="space-y-2">
                {[
                  { value: 'increase', label: '増える' },
                  { value: 'same', label: '変わらない' },
                  { value: 'slightly_decrease', label: 'やや減る' },
                  { value: 'greatly_decrease', label: '大きく減る' },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      value={value}
                      {...register('visit_intent_without_measures')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
              {watch('visit_intent_without_measures') !== 'same' && watch('visit_intent_without_measures') !== 'increase' && (
                <input
                  type="text"
                  placeholder="理由を入力"
                  {...register('visit_intent_reason')}
                  className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                13. 対策が導入された場合、滞在時間や消費額はどうなりそうですか？
              </label>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">滞在時間：</p>
                  <div className="space-y-2">
                    {[
                      { value: 'increase', label: '増える' },
                      { value: 'same', label: '変わらない' },
                      { value: 'decrease', label: '減る' },
                    ].map(({ value, label }) => (
                      <label key={value} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          value={value}
                          {...register('stay_duration_change')}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">観光消費（飲食・体験等）：</p>
                  <div className="space-y-2">
                    {[
                      { value: 'increase', label: '増える' },
                      { value: 'same', label: '変わらない' },
                      { value: 'decrease', label: '減る' },
                    ].map(({ value, label }) => (
                      <label key={value} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          value={value}
                          {...register('consumption_change')}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
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
          disabled={!showFollowup || followupResponse === undefined || !watch('confidence_level')}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          次へ
        </button>
      </div>
    </div>
  )
}

