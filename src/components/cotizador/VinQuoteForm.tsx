import { EXCHANGE_RATE } from "@/lib/quoteCalculator";
import { StepHeader } from "@/components/cotizador/StepHeader";
import { InputPanel } from "@/components/ui/InputPanel";

type VinQuoteFormProps = {
  vin: string;
  auctionValueUSD: string;
  onChangeVin: (value: string) => void;
  onChangeAuctionValueUSD: (value: string) => void;
};

export function VinQuoteForm({
  vin,
  auctionValueUSD,
  onChangeVin,
  onChangeAuctionValueUSD,
}: VinQuoteFormProps) {
  return (
    <div className="animate-[fadeUp_0.45s_ease-out]">
      <StepHeader
        eyebrow="Cotización por VIN"
        title="Ingresa el VIN y el valor de compra."
        text="El VIN ayuda a identificar el vehículo. Luego se compara contra la referencia SAT y el valor de compra o subasta."
      />

      <div className="mt-8 grid gap-5">
        <InputPanel
          label="VIN del vehículo"
          helper="Código de 17 caracteres. En el demo se usa como referencia visual."
        >
          <input
            value={vin}
            onChange={(event) => onChangeVin(event.target.value.toUpperCase())}
            placeholder="Ej. 1G1FB1RX5F0123456"
            className="w-full bg-transparent text-lg font-black uppercase tracking-[0.08em] text-white outline-none placeholder:text-slate-600"
          />
        </InputPanel>

        <InputPanel
          label="Valor compra / subasta"
          helper="Ingresa el valor documentado en dólares para comparar escenarios."
        >
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-cyan-300">$</span>

            <input
              value={auctionValueUSD}
              onChange={(event) => onChangeAuctionValueUSD(event.target.value)}
              inputMode="decimal"
              placeholder="3750"
              className="w-full bg-transparent text-lg font-black text-white outline-none placeholder:text-slate-600"
            />

            <span className="text-xs font-bold text-slate-500">USD</span>
          </div>
        </InputPanel>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-slate-400">
          Tipo de cambio demo:{" "}
          <span className="font-black text-white">Q{EXCHANGE_RATE}</span>. La
          validación final debe hacerla Ronaldo con documentos reales.
        </div>
      </div>
    </div>
  );
}
