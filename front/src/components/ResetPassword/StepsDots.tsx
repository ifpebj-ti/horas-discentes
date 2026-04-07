interface StepsDotsProps {
  active: number;
}

export const StepsDots = ({ active }: StepsDotsProps) => (
  <div className="flex items-center justify-center gap-3 my-4">
    {[1, 2, 3].map((i) => (
      <span
        key={i}
        className={`h-2 w-6 rounded-full transition-all ${active === i ? 'bg-primary' : 'bg-slate-300'}`}
      />
    ))}
  </div>
);
