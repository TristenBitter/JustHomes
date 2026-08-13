import "./StepIndicator.css";

interface StepIndicatorProps {
  steps: string[];
  currentIndex: number;
}

function StepIndicator({ steps, currentIndex }: StepIndicatorProps) {
  return (
    <ol className="step-indicator">
      {steps.map((label, index) => {
        const status = index === currentIndex ? "current" : index < currentIndex ? "done" : "upcoming";
        return (
          <li key={label} className={`step-indicator__item step-indicator__item--${status}`}>
            <span className="step-indicator__marker">{index < currentIndex ? "✓" : index + 1}</span>
            <span className="step-indicator__label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default StepIndicator;
