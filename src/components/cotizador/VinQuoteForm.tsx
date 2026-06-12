import { StepHeader } from "@/components/cotizador/StepHeader";
import { InputPanel } from "@/components/ui/InputPanel";
import { EXCHANGE_RATE } from "@/lib/quoteCalculator";
import type { VinDecodeResponse } from "@/lib/vinApi";
import type { SupportingDocumentStatus } from "@/types/quote";

type VinQuoteFormProps = {
  vin: string;
  auctionValueUSD: string;
  supportingDocument: SupportingDocumentStatus;
  vinResult: VinDecodeResponse | null;
  loadingVin: boolean;
  onChangeVin: (value: string) => void;
  onDecodeVin: () => void;
  onChangeAuctionValueUSD: (value: string) => void;
  onChangeSupportingDocument: (value: SupportingDocumentStatus) => void;
};

export function VinQuoteForm({
  vin,
  auctionValueUSD,
  supportingDocument,
  vinResult,
  loadingVin,
  onChangeVin,
  onDecodeVin,
  onChangeAuctionValueUSD,
  onChangeSupportingDocument,
}: VinQuoteFormProps) {
  const decodedVehicle = vinResult?.ok ? vinResult.vehicle : null;
  const satReference = vinResult?.ok ? vinResult.satReference : null;
  const errorMessage = vinResult && !vinResult.ok ? vinResult.message : null;

  return (
    <div className="animate-[fadeUp_0.45s_ease-out]">
      <StepHeader
        eyebrow="Cotización por VIN"
        title="Ingresa el VIN y revisa la referencia encontrada."
        text="El VIN ayuda a identificar el vehículo. Luego el sistema busca una referencia SAT probable para estimar el caso."
      />

      <div className="mt-8 grid gap-5">
        <InputPanel
          label="VIN del vehículo"
          helper="Código de 17 caracteres. Se usará para identificar año, marca, modelo y una referencia SAT probable."
        >
          <div className="grid gap-4">
            <input
              value={vin}
              onChange={(event) => onChangeVin(event.target.value.toUpperCase())}
              placeholder="Ej. 1HGCM82633A004352"
              className="w-full bg-transparent text-lg font-black uppercase tracking-[0.08em] text-white outline-none placeholder:text-slate-600"
            />

            <button
              type="button"
              onClick={onDecodeVin}
              disabled={loadingVin || vin.trim().length < 11}
              className="rounded-[1.2rem] border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.04] disabled:text-slate-500"
            >
              {loadingVin ? "Consultando VIN..." : "Consultar VIN"}
            </button>
          </div>
        </InputPanel>

        {errorMessage && (
          <div className="rounded-[1.5rem] border border-red-400/20 bg-red-400/10 p-5 text-sm leading-6 text-red-100">
            {errorMessage}
          </div>
        )}

        {decodedVehicle && (
          <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.06] p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
              Vehículo detectado por VIN
            </p>

            <h3 className="mt-3 text-xl font-black text-white">
              {decodedVehicle.make} {decodedVehicle.model}{" "}
              {decodedVehicle.year}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              {[
                decodedVehicle.trim,
                decodedVehicle.bodyClass,
                decodedVehicle.engineCc
                  ? `${Math.round(decodedVehicle.engineCc)}cc`
                  : null,
                decodedVehicle.cylinders
                  ? `${decodedVehicle.cylinders} cilindros`
                  : null,
                decodedVehicle.doors ? `${decodedVehicle.doors} puertas` : null,
                decodedVehicle.fuelType,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        )}

        {satReference && (
          <div className="rounded-[1.7rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
              Referencia SAT probable
            </p>

            <h3 className="mt-3 text-xl font-black text-white">
              {satReference.referenceLabel}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              {satReference.technicalLabel}
            </p>

            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-4 rounded-2xl bg-slate-950/40 px-4 py-3">
                <span className="text-slate-400">Valor tabla SAT</span>
                <span className="font-black text-white">
                  Q{Number(satReference.satValueGtq).toLocaleString("es-GT", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex justify-between gap-4 rounded-2xl bg-slate-950/40 px-4 py-3">
                <span className="text-slate-400">Coincidencia</span>
                <span className="font-black text-white">Probable</span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-400">
              Esta referencia debe ser validada por Ronaldo contra documentos
              reales, versión exacta y criterio aplicable.
            </p>
          </div>
        )}

        {vinResult?.ok && !satReference && (
          <div className="rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-6 text-amber-100">
            El VIN fue identificado, pero no se encontró una referencia SAT
            probable en la tabla cargada. Ronaldo deberá validar el caso
            manualmente.
          </div>
        )}

        {vinResult?.ok && (
          <>
            <InputPanel
              label="Valor compra / subasta"
              helper="Ingresa el valor documentado en dólares para comparar escenarios."
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-cyan-300">$</span>
                <input
                  value={auctionValueUSD}
                  onChange={(event) =>
                    onChangeAuctionValueUSD(event.target.value)
                  }
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
                Puede ser invoice, documento de subasta u otro respaldo que
                Ronaldo pueda revisar.
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
              Tipo de cambio referencial:{" "}
              <span className="font-black text-white">Q{EXCHANGE_RATE}</span>.
              La validación final debe hacerla Ronaldo con documentos reales.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
