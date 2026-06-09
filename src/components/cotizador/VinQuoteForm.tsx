import { StepHeader } from "@/components/cotizador/StepHeader";
import { InputPanel } from "@/components/ui/InputPanel";
import { EXCHANGE_RATE } from "@/lib/quoteCalculator";
import type { SupportingDocumentStatus } from "@/types/quote";

type VinQuoteFormProps = {
  vin: string;
  auctionValueUSD: string;
  supportingDocument: SupportingDocumentStatus;
  onChangeVin: (value: string) => void;
  onChangeAuctionValueUSD: (value: string) => void;
  onChangeSupportingDocument: (value: SupportingDocumentStatus) => void;
};

export function VinQuoteForm({
  vin,
  auctionValueUSD,
  supportingDocument,
  onChangeVin,
  onChangeAuctionValueUSD,
  onChangeSupportingDocument,
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

        <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.06] p-5">
          <p className="text-sm font-black text-white">
            ¿Tienes documento que respalde ese valor?
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Puede ser invoice, documento de subasta u otro respaldo que Ronaldo
            pueda revisar.
          </p>

          <div className="mt-4 grid gap-3">
            <button
              onClick={() => onChangeSupportingDocument("yes")}
              className={`rounded-[1.4rem] border px-5 py-4 text-left text-sm font-black transition ${
                supportingDocument === "yes"
                  ? "border-cyan-300/70 bg-cyan-300/10 text-white"
                  : "border-white/10 bg-slate-950/40 text-slate-300"
              }`}
            >
              Sí, tengo documento de respaldo
            </button>

            <button
              onClick={() => onChangeSupportingDocument("no")}
              className={`rounded-[1.4rem] border px-5 py-4 text-left text-sm font-black transition ${
                supportingDocument === "no"
                  ? "border-cyan-300/70 bg-cyan-300/10 text-white"
                  : "border-white/10 bg-slate-950/40 text-slate-300"
              }`}
            >
              No, solo quiero una estimación
            </button>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-slate-400">
          Tipo de cambio demo:{" "}
          <span className="font-black text-white">Q{EXCHANGE_RATE}</span>. La
          validación final debe hacerla Ronaldo con documentos reales.
        </div>
      </div>
    </div>
  );
}
