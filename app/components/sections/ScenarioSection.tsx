'use client'

import { UseFormReturn } from 'react-hook-form'
import { Scenario } from '@/types/survey'

interface ScenarioSectionProps {
  form: UseFormReturn<any>
  scenario: Scenario | null
  riskReductionRate: number | null
  onNext: () => void
  onPrev: () => void
}

const scenarioDescriptions = {
  A: {
    title: '検知・通知システムのみ（D）',
    description: 'AIカメラ・センサーでクマを早期検知し、園内サイレン/アプリ/掲示板で即時通知。',
  },
  B: {
    title: '電気柵のみ（F）',
    description: 'ハイカー導線・休憩所・ゴミ集積周辺を主に電気柵で物理遮断。',
  },
  C: {
    title: '検知・通知＋電気柵（D+F）',
    description: '上記2施策を併用。',
  },
}

export default function ScenarioSection({ form, scenario, riskReductionRate, onNext, onPrev }: ScenarioSectionProps) {
  if (!scenario || !riskReductionRate) {
    return <div>読み込み中...</div>
  }

  const scenarioInfo = scenarioDescriptions[scenario]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">対策シナリオ</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-700 leading-relaxed">
          <strong className="font-semibold">共通前提：</strong>支払いビークルは「入場料に上乗せする保全協力金（義務）」。資金は対策費用・維持管理費のみに充当。第三者監査と毎年の実績公表あり。対策導入により、安全案内の充実や立入管理も改善されます。
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {scenarioInfo.title}
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            {scenarioInfo.description}
          </p>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-700">
              <strong className="font-semibold">リスク低下の期待：</strong>
              出没時の人との接触確率を<strong className="text-blue-600">{riskReductionRate}%低減</strong>。
            </p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-xs text-gray-600">
          ※ この調査は料金の実際の設定検討に使われる可能性があります。実際に訪れた際に自分が本当に支払える金額としてお考えください。過大・過少の回答は、対策の適切な導入判断を誤らせてしまいます。
        </p>
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

