import { MessageCircle } from "lucide-react";

import { formatGTQ, formatUSD } from "@/lib/formatters";
import type { QuoteMethod, ScreenState } from "@/types/quote";
import type { Vehicle } from "@/types/vehicle";

type StickyBottomBarProps = {
  screen: ScreenState;
  method: QuoteMethod | null;
  selectedVehicle: Vehicle | null;
  selectedVehicleId: string;
  auctionValueUSD: number;
  lowestEstimate: number;
  canContinueFromMethod: boolean;
  canCalculate: boolean;
  onContinue: () => void;
  onCalculate: () => void;
  onSend: () => void;
};

export function StickyBottomBar({
  screen,
  method,
  selectedVehicle,
  selectedVehicleId,
  auctionValueUSD,
  lowestEstimate,
  canContinueFromMethod,
  canCalculate,
  onContinue,
  onCalculate,
  onSend,
}: StickyBottomBarProps) {
  if (screen === "loading") return null;

  const methodLabel =
    method === "vin"
      ? "VIN seleccionado"
      : method === "sat"
      ? "Tabla SAT seleccionada"
      : "Elige cómo cotizar";

const formLabel =
  method === "vin"
    ? `Subasta: ${formatUSD(auctionValueUSD)}`
    : selectedVehicleId && selectedVehicle
      ? `${selectedVehicle.brand} ${selectedVehicle.line}`
      : "Completa los datos";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#050b14]/85 px-4 pb-4 pt-3 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-5xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-slate-400">
            {screen === "method" && methodLabel}
            {screen === "form" && formLabel}
            {screen === "result" && "Estimación preliminar"}
          </p>

          <p className="mt-1 truncate text-base font-black text-white">
            {screen === "method" && "Configura tu cotización"}
            {screen === "form" && `Valor: ${formatUSD(auctionValueUSD)}`}
            {screen === "result" && `Desde ${formatGTQ(lowestEstimate)}`}
          </p>
        </div>

        {screen === "method" && (
          <button
            onClick={onContinue}
            disabled={!canContinueFromMethod}
            className="rounded-full bg-cyan-300 px-6 py-4 text-sm font-black text-slate-950 transition disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500"
          >
            Continuar
          </button>
        )}

        {screen === "form" && (
          <button
            onClick={onCalculate}
            disabled={!canCalculate}
            className="rounded-full bg-cyan-300 px-6 py-4 text-sm font-black text-slate-950 transition disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500"
          >
            Cotizar
          </button>
        )}

        {screen === "result" && (
          <button
            onClick={onSend}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
          >
            <MessageCircle size={18} />
            Enviar
          </button>
        )}
      </div>
    </div>
  );
}
