const Progress = ({
  steps,
  completed,
}: {
  steps: string[];
  completed: number;
}) => {
  return (
    <ul className="steps">
      {steps.map((step, idx) => (
        <li
          className={`step ${idx < completed ? "step-accent" : idx === completed ? "step-warning" : ""}`}
          key={step}
        >
          {step}
        </li>
      ))}
    </ul>
  );
};

export default Progress;
