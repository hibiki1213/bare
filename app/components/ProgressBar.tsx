'use client'

export default function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">進捗</span>
        <span className="text-sm font-medium text-gray-700">{currentStep + 1} / {totalSteps}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

