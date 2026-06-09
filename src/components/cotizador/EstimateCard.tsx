type EstimateCardProps = {
  title: string;
  subtitle: string;
  total: string;
  base: string;
};

export function EstimateCard({
  title,
  subtitle,
  total,
  base,
}: EstimateCardProps) {
  return (
    <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.06] p-5">
      <p className="text-sm font-black">{title}</p>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      <p className="mt-5 text-3xl font-black">{total}</p>
      <p className="mt-2 text-xs font-semibold text-slate-500">
        Base usada: {base}
      </p>
    </div>
  );
}
