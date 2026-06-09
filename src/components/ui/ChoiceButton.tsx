import { Check, ChevronRight } from "lucide-react";

type ChoiceButtonProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

export function ChoiceButton({ active, label, onClick }: ChoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between rounded-[1.5rem] border px-5 py-5 text-left transition active:scale-[0.99] ${
        active
          ? "border-cyan-300/70 bg-cyan-300/10 shadow-[0_0_35px_rgba(34,211,238,0.12)]"
          : "border-white/10 bg-white/[0.06]"
      }`}
    >
      <span className="font-black">{label}</span>

      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full ${
          active ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-slate-500"
        }`}
      >
        {active ? <Check size={16} /> : <ChevronRight size={16} />}
      </span>
    </button>
  );
}
