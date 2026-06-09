import type { ReactNode } from "react";

type InputPanelProps = {
  label: string;
  helper: string;
  children: ReactNode;
};

export function InputPanel({ label, helper, children }: InputPanelProps) {
  return (
    <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.06] p-5">
      <label className="text-sm font-black text-white">{label}</label>

      <p className="mt-1 text-xs leading-5 text-slate-400">{helper}</p>

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
        {children}
      </div>
    </div>
  );
}
