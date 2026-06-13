import { AlertTriangle, Car, FileCheck2, FileQuestion } from "lucide-react";
import { DetailBox } from "@/components/cotizador/DetailBox";
import { formatGTQ } from "@/lib/formatters";
import type {
  QuoteMethod,
  QuoteResult as QuoteResultType,
  SupportingDocumentStatus,
} from "@/types/quote";
import type { Vehicle } from "@/types/vehicle";

type QuoteResultProps = {
  method: QuoteMethod | null;
  vin: string;
  selectedVehicle: Vehicle;
  auctionValueUSD: number;
  quote: QuoteResultType;
  lowestEstimate: number;
  supportingDocument: SupportingDocumentStatus;
};

export function QuoteResult({
  method,
  vin,
  selectedVehicle,
  quote,
  supportingDocument,
}: QuoteResultProps) {
  const hasSupportingDocument = supportingDocument === "yes";

  const activeTitle = hasSupportingDocument
    ? "Estimación con respaldo documental"
    : "Estimación con referencia SAT";

  const activeTotal = hasSupportingDocument
    ? quote.totalAuction
    : quote.totalSat;

  const activeBase = hasSupportingDocument
    ? quote.auctionBaseGTQ
    : quote.satBaseGTQ;

  const activeIva = hasSupportingDocument
    ? quote.ivaAuction
    : quote.ivaSat;

  const activeIprima = hasSupportingDocument
    ? quote.iprimaAuction
    : quote.iprimaSat;

  const activeDetailTitle = hasSupportingDocument
    ? "Desglose con respaldo documental"
    : "Desglose con referencia SAT";

  const activeBaseLabel = hasSupportingDocument
    ? "Base en quetzales"
    : "Base SAT";

  return (
    <div className="animate-[fadeUp_0.45s_ease-out]">
      <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
            <Car size={28} />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
              Resultado preliminar
            </p>

            <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-100/80">
              {activeTitle}
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
              {formatGTQ(activeTotal)}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Estimación generada para{" "}
              <span className="font-black text-white">
                {selectedVehicle.brand} {selectedVehicle.line}{" "}
                {selectedVehicle.year}
              </span>
              . El agente aduanero debe validar documentos, versión exacta y
              referencia SAT antes de confirmar el monto final.
            </p>
          </div>
        </div>
      </div>

      <div
        className={`mt-6 rounded-[1.7rem] border p-5 ${
          hasSupportingDocument
            ? "border-emerald-300/20 bg-emerald-300/10"
            : "border-amber-300/20 bg-amber-300/10"
        }`}
      >
        <div className="flex gap-3">
          <div
            className={`mt-1 shrink-0 ${
              hasSupportingDocument ? "text-emerald-200" : "text-amber-200"
            }`}
          >
            {hasSupportingDocument ? (
              <FileCheck2 size={21} />
            ) : (
              <FileQuestion size={21} />
            )}
          </div>

          <div>
            <p
              className={`font-black ${
                hasSupportingDocument ? "text-emerald-100" : "text-amber-100"
              }`}
            >
              {hasSupportingDocument
                ? "Sí tiene respaldo documental."
                : "No tiene respaldo documental."}
            </p>

            <p
              className={`mt-2 text-sm leading-6 ${
                hasSupportingDocument
                  ? "text-emerald-100/80"
                  : "text-amber-100/80"
              }`}
            >
              {hasSupportingDocument
                ? "El cálculo usa el valor de compra o subasta indicado, sujeto a validación del invoice, documento de subasta o respaldo correspondiente."
                : "El cálculo usa referencia SAT estimada como base principal para este escenario."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <DetailBox
          title={activeDetailTitle}
          rows={[
            [activeBaseLabel, formatGTQ(activeBase)],
            ["IVA 12%", formatGTQ(activeIva)],
            [
              `IPRIMA ${(selectedVehicle.iprimaRate * 100).toFixed(0)}%`,
              formatGTQ(activeIprima),
            ],
            ["Placas", formatGTQ(selectedVehicle.plateFee)],
            ["Total estimado", formatGTQ(activeTotal)],
          ]}
        />
      </div>

      <div className="mt-6 rounded-[1.7rem] border border-amber-300/20 bg-amber-300/10 p-5">
        <div className="flex gap-3">
          <AlertTriangle className="mt-1 shrink-0 text-amber-200" size={20} />

          <div>
            <p className="font-black text-amber-100">
              Esta cotización no es definitiva.
            </p>

            <p className="mt-2 text-sm leading-6 text-amber-100/80">
              {method === "vin" && vin
                ? `Consulta realizada con VIN ${vin}. `
                : ""}
              El cálculo puede cambiar según documentación, valor aceptado,
              versión exacta, criterio de validación y revisión final del caso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
