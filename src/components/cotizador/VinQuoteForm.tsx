import { useState } from "react";
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
  onSendVinReview: (payload: VinReviewPayload) => void;
};

type VehicleOrigin = "auction" | "personal" | null;

type VinReviewPayload = {
  caseType: "auction" | "personal";
  hasSupportingDocument: boolean | null;
  invoiceValueUSD: number | null;
  manualVehicle: {
    year: string;
    brand: string;
    line: string;
    version: string;
  };
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
  onSendVinReview,
}: VinQuoteFormProps) {
  const [vehicleOrigin, setVehicleOrigin] = useState<VehicleOrigin>(null);

  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleLine, setVehicleLine] = useState("");
  const [vehicleVersion, setVehicleVersion] = useState("");

  const decodedVehicle = vinResult?.ok ? vinResult.vehicle : null;
  const satReference = vinResult?.ok ? vinResult.satReference : null;
  const errorMessage = vinResult && !vinResult.ok ? vinResult.message : null;

  const showOriginQuestion = vinResult?.ok;
  const isAuctionCase = vehicleOrigin === "auction";
  const isPersonalCase = vehicleOrigin === "personal";
  const hasSupportingDocument = supportingDocument === "yes";
  const doesNotHaveSupportingDocument = supportingDocument === "no";

  const shouldAskVehicleData =
    isPersonalCase || (isAuctionCase && doesNotHaveSupportingDocument);

  const shouldAskAuctionValue = isAuctionCase && hasSupportingDocument;

  function handleSelectAuctionCase() {
    setVehicleOrigin("auction");
    onChangeSupportingDocument(null);
  }

  function handleSelectPersonalCase() {
    setVehicleOrigin("personal");
    onChangeSupportingDocument("no");
    onChangeAuctionValueUSD("");
  }

  function handleSupportingDocumentYes() {
    onChangeSupportingDocument("yes");
  }

  function handleSupportingDocumentNo() {
    onChangeSupportingDocument("no");
    onChangeAuctionValueUSD("");
  }

 function handleSendVinReview() {
  if (!vehicleOrigin) return;

  onSendVinReview({
    caseType: vehicleOrigin,
    hasSupportingDocument:
      supportingDocument === "yes"
        ? true
        : supportingDocument === "no"
          ? false
          : null,
    invoiceValueUSD:
      auctionValueUSD.trim().length > 0 ? Number(auctionValueUSD) : null,
    manualVehicle: {
      year: vehicleYear,
      brand: vehicleMake,
      line: vehicleLine,
      version: vehicleVersion,
    },
  });
}



  return (
    <div className="animate-[fadeUp_0.45s_ease-out]">
      <StepHeader
        eyebrow="Búsqueda por VIN"
        title="Ingresa el VIN para iniciar la revisión del vehículo."
        text="Luego define si el caso corresponde a compra/subasta o uso personal. El sistema mostrará solo los datos necesarios para ese caso."
      />

      <div className="mt-8 grid gap-5">
        <InputPanel
          label="VIN del vehículo"
          helper="Código de 17 caracteres. Se usa para iniciar la revisión del vehículo."
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
              Datos detectados por VIN
            </p>

            <h3 className="mt-3 text-xl font-black text-white">
              {decodedVehicle.make} {decodedVehicle.model} {decodedVehicle.year}
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

            <p className="mt-4 text-xs leading-5 text-slate-400">
              Estos datos son una referencia inicial. Ronaldo puede validar la
              versión exacta contra documentos reales y tabla SAT.
            </p>
          </div>
        )}

        {showOriginQuestion && (
          <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.06] p-5">
            <p className="text-sm font-black text-white">
              ¿Este vehículo es compra/subasta o uso personal?
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Esta respuesta define qué datos se piden y qué base se usa para la
              estimación.
            </p>

            <div className="mt-4 grid gap-3">
              <button
                type="button"
                onClick={handleSelectAuctionCase}
                className={`rounded-[1.4rem] border px-5 py-4 text-left text-sm font-black transition ${
                  isAuctionCase
                    ? "border-cyan-300/70 bg-cyan-300/10 text-white"
                    : "border-white/10 bg-slate-950/40 text-slate-300"
                }`}
              >
                Compra / subasta
                <span className="mt-1 block text-xs font-medium leading-5 text-slate-400">
                  Aplica cuando existe invoice, factura, documento de subasta o
                  valor de compra para revisión.
                </span>
              </button>

              <button
                type="button"
                onClick={handleSelectPersonalCase}
                className={`rounded-[1.4rem] border px-5 py-4 text-left text-sm font-black transition ${
                  isPersonalCase
                    ? "border-cyan-300/70 bg-cyan-300/10 text-white"
                    : "border-white/10 bg-slate-950/40 text-slate-300"
                }`}
              >
                Uso personal
                <span className="mt-1 block text-xs font-medium leading-5 text-slate-400">
                  Aplica cuando no se usará valor de subasta como base principal
                  y se revisa contra referencia SAT.
                </span>
              </button>
            </div>
          </div>
        )}

        {isAuctionCase && (
          <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.06] p-5">
            <p className="text-sm font-black text-white">
              ¿Tiene factura, invoice o documento de subasta?
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Si existe documento, se puede ingresar el valor para compararlo
              contra la referencia SAT. La validación final la hace Ronaldo.
            </p>

            <div className="mt-4 grid gap-3">
              <button
                type="button"
                onClick={handleSupportingDocumentYes}
                className={`rounded-[1.4rem] border px-5 py-4 text-left text-sm font-black transition ${
                  hasSupportingDocument
                    ? "border-cyan-300/70 bg-cyan-300/10 text-white"
                    : "border-white/10 bg-slate-950/40 text-slate-300"
                }`}
              >
                Sí, tengo documento de respaldo
              </button>

              <button
                type="button"
                onClick={handleSupportingDocumentNo}
                className={`rounded-[1.4rem] border px-5 py-4 text-left text-sm font-black transition ${
                  doesNotHaveSupportingDocument
                    ? "border-cyan-300/70 bg-cyan-300/10 text-white"
                    : "border-white/10 bg-slate-950/40 text-slate-300"
                }`}
              >
                No, revisar con referencia SAT
              </button>
            </div>
          </div>
        )}

        {shouldAskAuctionValue && (
          <InputPanel
            label="Valor de factura / subasta"
            helper="Ingresa el valor documentado en dólares. El sistema lo compara contra la referencia SAT como apoyo."
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
        )}

        {shouldAskVehicleData && (
          <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.06] p-5">
            <p className="text-sm font-black text-white">
              Datos del vehículo para referencia SAT
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Completa los datos en orden. Primero año, luego marca, después
              línea/modelo y versión si aplica.
            </p>

            <div className="mt-5 grid gap-4">
              <InputPanel
                label="Año"
                helper="Año modelo del vehículo."
              >
                <input
                  value={vehicleYear}
                  onChange={(event) => setVehicleYear(event.target.value)}
                  inputMode="numeric"
                  placeholder="2018"
                  className="w-full bg-transparent text-lg font-black text-white outline-none placeholder:text-slate-600"
                />
              </InputPanel>

              {vehicleYear.trim().length >= 4 && (
                <InputPanel
                  label="Marca"
                  helper="Ejemplo: Toyota, Honda, Chevrolet, Ford."
                >
                  <input
                    value={vehicleMake}
                    onChange={(event) => setVehicleMake(event.target.value)}
                    placeholder="Toyota"
                    className="w-full bg-transparent text-lg font-black text-white outline-none placeholder:text-slate-600"
                  />
                </InputPanel>
              )}

              {vehicleMake.trim().length > 1 && (
                <InputPanel
                  label="Línea / modelo"
                  helper="Ejemplo: Corolla, Civic, Tacoma, Camaro."
                >
                  <input
                    value={vehicleLine}
                    onChange={(event) => setVehicleLine(event.target.value)}
                    placeholder="Corolla"
                    className="w-full bg-transparent text-lg font-black text-white outline-none placeholder:text-slate-600"
                  />
                </InputPanel>
              )}

              {vehicleLine.trim().length > 1 && (
                <InputPanel
                  label="Versión"
                  helper="Opcional. Ejemplo: LE, LT, EX, Sport."
                >
                  <input
                    value={vehicleVersion}
                    onChange={(event) => setVehicleVersion(event.target.value)}
                    placeholder="LE"
                    className="w-full bg-transparent text-lg font-black text-white outline-none placeholder:text-slate-600"
                  />
                </InputPanel>
              )}
            </div>
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
                  Q
                  {Number(satReference.satValueGtq).toLocaleString("es-GT", {
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
    <p className="font-semibold">Vehículo detectado por VIN.</p>

    <p className="mt-2">
      En este momento no tenemos una referencia SAT probable cargada para este
      vehículo en la base del cotizador.
    </p>

    <p className="mt-2">
      Ronaldo puede revisar el caso manualmente con el VIN, y confirmar qué
      referencia corresponde antes de preparar una estimación.
    </p>

    {vehicleOrigin && (
      <button
        type="button"
        onClick={handleSendVinReview}
        className="mt-5 w-full rounded-[1.2rem] border border-amber-200/40 bg-amber-200/15 px-5 py-3 text-sm font-black text-amber-50 transition hover:bg-amber-200/25"
      >
        Enviar a Ronaldo para revisión
      </button>
    )}
  </div>
)}

        {vinResult?.ok && vehicleOrigin && (
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-slate-400">
            Tipo de cambio referencial:{" "}
            <span className="font-black text-white">Q{EXCHANGE_RATE}</span>. La
            validación final debe hacerla Ronaldo con documentos reales y tabla
            SAT aplicable.
          </div>
        )}
      </div>
    </div>
  );
}
