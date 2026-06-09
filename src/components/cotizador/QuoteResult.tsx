import { AlertTriangle, Car, FileCheck2, FileQuestion } from "lucide-react";

import { DetailBox } from "@/components/cotizador/DetailBox";
import { EstimateCard } from "@/components/cotizador/EstimateCard";
import { formatGTQ, formatUSD } from "@/lib/formatters";
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
  auctionValueUSD,
  quote,
  lowestEstimate,
  supportingDocument,
}: QuoteResultProps) {
  const hasSupportingDocument = supportingDocument === "yes";

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

            <h2 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
              Desde {formatGTQ(lowestEstimate)}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Estimación generada para{" "}
              <span className="font-black text-white">
                {selectedVehicle.brand} {selectedVehicle.line}{" "}
                {selectedVehicle.year}
              </span>
              . Ronaldo debe validar documentos, versión exacta y referencia SAT
              antes de confirmar el monto final.
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
                ? "El cliente indica que sí tiene respaldo documental."
                : "El cliente indica que no tiene respaldo documental."}
            </p>

            <p
              className={`mt-2 text-sm leading-6 ${
                hasSupportingDocument
                  ? "text-emerald-100/80"
                  : "text-amber-100/80"
              }`}
            >
              {hasSupportingDocument
                ? "El escenario con valor de compra o subasta puede aplicar si Ronaldo valida el invoice, documento de subasta o respaldo correspondiente."
                : "El valor de compra ingresado queda como referencia informativa. Ronaldo deberá validar si corresponde usar la referencia de tabla SAT para el caso real."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <EstimateCard
          title="Escenario con valor compra/subasta"
          subtitle={
            hasSupportingDocument
              ? `Valor respaldado por validar: ${formatUSD(auctionValueUSD)}`
              : `Valor informativo ingresado: ${formatUSD(auctionValueUSD)}`
          }
          total={formatGTQ(quote.totalAuction)}
          base={formatGTQ(quote.auctionBaseGTQ)}
        />

        <EstimateCard
          title="Escenario con referencia SAT"
          subtitle={
            hasSupportingDocument
              ? "Comparación contra referencia fiscal"
              : "Referencia principal si no hay respaldo documental"
          }
          total={formatGTQ(quote.totalSat)}
          base={formatGTQ(quote.satBaseGTQ)}
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <DetailBox
          title="Desglose con compra/subasta"
          rows={[
            ["Base en quetzales", formatGTQ(quote.auctionBaseGTQ)],
            ["IVA 12%", formatGTQ(quote.ivaAuction)],
            [
              `IPRIMA ${(selectedVehicle.iprimaRate * 100).toFixed(0)}%`,
              formatGTQ(quote.iprimaAuction),
            ],
            ["Placas", formatGTQ(selectedVehicle.plateFee)],
          ]}
        />

        <DetailBox
          title="Desglose con tabla SAT"
          rows={[
            ["Base SAT", formatGTQ(quote.satBaseGTQ)],
            ["IVA 12%", formatGTQ(quote.ivaSat)],
            [
              `IPRIMA ${(selectedVehicle.iprimaRate * 100).toFixed(0)}%`,
              formatGTQ(quote.iprimaSat),
            ],
            ["Placas", formatGTQ(selectedVehicle.plateFee)],
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
