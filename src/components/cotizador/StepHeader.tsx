type StepHeaderProps = {
  eyebrow: string;
  title: string;
  text: string;
};

export function StepHeader({ eyebrow, title, text }: StepHeaderProps) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
        {title}
      </h2>

      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
        {text}
      </p>
    </div>
  );
}
