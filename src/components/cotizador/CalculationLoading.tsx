import { Loader2 } from "lucide-react";

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
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
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
        {loadingSteps.map((step, index) => (
          <div
            key={step}
            className={`rounded-2xl border px-4 py-4 text-sm font-bold transition ${
              index <= activeStep
                ? "border-cyan-300/40 bg-cyan-300/10 text-white"
                : "border-white/10 bg-white/[0.04] text-slate-500"
            }`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
