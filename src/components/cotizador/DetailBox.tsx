type DetailBoxProps = {
  title: string;
  rows: [string, string][];
};

export function DetailBox({ title, rows }: DetailBoxProps) {
  return (
    <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.05] p-5">
      <h3 className="font-black">{title}</h3>

      <div className="mt-4 space-y-3">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm"
          >
            <span className="text-slate-400">{label}</span>
            <span className="text-right font-bold text-white">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
