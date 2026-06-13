export default function ProgressSteps({ current, total, labels = [] }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === current;
        const isComplete = stepNum < current;

        return (
          <div key={stepNum} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${
                  isComplete
                    ? 'bg-sage-600 text-white'
                    : isActive
                      ? 'bg-sage-100 text-sage-800 ring-2 ring-sage-400'
                      : 'bg-sage-100 text-sage-400'
                }`}
              >
                {isComplete ? '✓' : stepNum}
              </div>
              {labels[i] && (
                <span className={`text-xs ${isActive ? 'font-medium text-sage-800' : 'text-sage-500'}`}>
                  {labels[i]}
                </span>
              )}
            </div>
            {stepNum < total && (
              <div className={`mb-5 h-0.5 w-8 sm:w-16 ${isComplete ? 'bg-sage-400' : 'bg-sage-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
