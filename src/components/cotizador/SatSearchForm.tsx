import { StepHeader } from "@/components/cotizador/StepHeader";
import { ChoiceButton } from "@/components/ui/ChoiceButton";
import { InputPanel } from "@/components/ui/InputPanel";
import { OptionGroup } from "@/components/ui/OptionGroup";
import { formatGTQ } from "@/lib/formatters";
import { EXCHANGE_RATE } from "@/lib/quoteCalculator";
import type { SatVehicleReference } from "@/lib/satVehiclesApi";
import type { SupportingDocumentStatus } from "@/types/quote";

type SatSearchFormProps = {
  vehicleTypes: string[];

  availableYears: number[];
  availableBrands: string[];
  availableLines: string[];

  selectedType: string;
  selectedYear: number | null;
  selectedBrand: string;
  selectedLine: string;
  selectedVehicle: SatVehicleReference | null;

  auctionValueUSD: string;
  supportingDocument: SupportingDocumentStatus;

  loadingYears?: boolean;
  loadingBrands?: boolean;
  loadingLines?: boolean;
  loadingVehicle?: boolean;

  onSelectType: (value: string) => void;
  onSelectYear: (value: number) => void;
  onSelectBrand: (value: string) => void;
  onSelectLine: (value: string) => void;
  onChangeAuctionValueUSD: (value: string) => void;
  onChangeSupportingDocument: (value: SupportingDocumentStatus) => void;
};

export function SatSearchForm({
  vehicleTypes,
  availableYears,
  availableBrands,
  availableLines,
  selectedType,
  selectedYear,
  selectedBrand,
  selectedLine,
  selectedVehicle,
  auctionValueUSD,
  supportingDocument,
  loadingYears = false,
  loadingBrands = false,
  loadingLines = false,
  loadingVehicle = false,
  onSelectType,
  onSelectYear,
  onSelectBrand,
  onSelectLine,
  onChangeAuctionValueUSD,
  onChangeSupportingDocument,
}: SatSearchFormProps) {
  return (
    <div className="animate-[fadeUp_0.45s_ease-out]">
      <StepHeader
        eyebrow="Búsqueda por tabla SAT"
        title="Selecciona el vehículo y revisa una referencia preliminar."
        text="Ideal si todavía estás evaluando qué vehículo traer o si necesitas una referencia rápida antes de comprar."
      />

      <div className="mt-8 grid gap-6">
        <OptionGroup title="1. Tipo de vehículo">
          {vehicleTypes.map((type) => (
            <ChoiceButton
              key={type}
              active={selectedType === type}
              label={type}
              onClick={() => onSelectType(type)}
            />
          ))}
        </OptionGroup>

        {selectedType && (
          <OptionGroup title="2. Año">
            {loadingYears ? (
              <p className="text-sm text-slate-400">
                Cargando años disponibles...
              </p>
            ) : (
              availableYears.map((year) => (
                <ChoiceButton
                  key={year}
                  active={selectedYear === year}
                  label={String(year)}
                  onClick={() => onSelectYear(year)}
                />
              ))
            )}
          </OptionGroup>
        )}

        {selectedType && selectedYear && (
          <OptionGroup title="3. Marca">
            {loadingBrands ? (
              <p className="text-sm text-slate-400">
                Cargando marcas disponibles...
              </p>
            ) : (
              availableBrands.map((brand) => (
                <ChoiceButton
                  key={brand}
                  active={selectedBrand === brand}
                  label={brand}
                  onClick={() => onSelectBrand(brand)}
                />
              ))
            )}
          </OptionGroup>
        )}

        {selectedType && selectedYear && selectedBrand && (
          <OptionGroup title="4. Línea / modelo">
            {loadingLines ? (
              <p className="text-sm text-slate-400">
                Cargando líneas disponibles...
              </p>
            ) : (
              availableLines.map((line) => (
                <ChoiceButton
                  key={line}
                  active={selectedLine === line}
                  label={line}
                  onClick={() => onSelectLine(line)}
                />
              ))
            )}
          </OptionGroup>
        )}

        {loadingVehicle && (
          <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.06] p-5 text-sm text-slate-400">
            Buscando referencia SAT...
          </div>
        )}

        {selectedVehicle && (
          <>
            <div className="rounded-[1.7rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
                Referencia SAT seleccionada
              </p>

              <h3 className="mt-3 text-xl font-black">
                {selectedVehicle.referenceLabel}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                {selectedVehicle.technicalLabel}
              </p>

              <div className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between gap-4 rounded-2xl bg-slate-950/40 px-4 py-3">
                  <span className="text-slate-400">Valor tabla SAT</span>
                  <span className="font-black">
                    {formatGTQ(Number(selectedVehicle.satValueGtq))}
                  </span>
                </div>

                <div className="flex justify-between gap-4 rounded-2xl bg-slate-950/40 px-4 py-3">
                  <span className="text-slate-400">Tipo</span>
                  <span className="font-black">
                    {selectedVehicle.vehicleType}
                  </span>
                </div>
              </div>
            </div>

            <InputPanel
              label="Valor compra / subasta"
              helper="Ingresa el valor documentado en dólares para comparar contra la referencia de tabla SAT."
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
              La validación final debe hacerla Ronaldo con documentos reales,
              versión exacta y criterio aplicable.
            </div>
          </>
        )}
      </div>
    </div>
  );
}