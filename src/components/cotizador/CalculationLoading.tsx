import { CheckCircle2, Loader2 } from "lucide-react";

type CalculationLoadingProps = {
  loadingSteps: string[];
  activeStep: number;
};

export function CalculationLoading({
  loadingSteps,
  activeStep,
}: CalculationLoadingProps) {
  return (
    <div className="animate-[fadeUp_0.45s_ease-out] rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-7">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-950/30">
          <Loader2 className="animate-spin" size={28} />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
            Calculando
          </p>

          <h2 className="mt-1 text-2xl font-black">
            Preparando estimación aduanera
          </h2>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {loadingSteps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;

          return (
            <div
              key={step}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-sm font-bold transition ${
                isCompleted
                  ? "border-emerald-300/40 bg-emerald-300/10 text-white"
                  : isActive
                    ? "border-cyan-300/50 bg-cyan-300/10 text-white shadow-lg shadow-cyan-950/20"
                    : "border-white/10 bg-white/[0.04] text-slate-500"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                  isCompleted
                    ? "border-emerald-300/60 bg-emerald-300 text-slate-950"
                    : isActive
                      ? "border-cyan-300/60 bg-cyan-300/15 text-cyan-100"
                      : "border-white/10 bg-slate-950/40 text-slate-600"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={18} strokeWidth={2.7} />
                ) : isActive ? (
                  <Loader2 className="animate-spin" size={17} strokeWidth={2.7} />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-current" />
                )}
              </div>

              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
