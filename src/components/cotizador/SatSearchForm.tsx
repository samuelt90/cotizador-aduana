import { StepHeader } from "@/components/cotizador/StepHeader";
import { ChoiceButton } from "@/components/ui/ChoiceButton";
import { InputPanel } from "@/components/ui/InputPanel";
import { OptionGroup } from "@/components/ui/OptionGroup";
import { formatGTQ } from "@/lib/formatters";
import { EXCHANGE_RATE } from "@/lib/quoteCalculator";
import type { Vehicle } from "@/types/vehicle";

type SatSearchFormProps = {
  vehicleTypes: string[];
  availableBrands: string[];
  availableVehicles: Vehicle[];
  selectedType: string;
  selectedBrand: string;
  selectedVehicleId: string;
  selectedVehicle: Vehicle;
  auctionValueUSD: string;
  onSelectType: (value: string) => void;
  onSelectBrand: (value: string) => void;
  onSelectVehicle: (value: string) => void;
  onChangeAuctionValueUSD: (value: string) => void;
};

export function SatSearchForm({
  vehicleTypes,
  availableBrands,
  availableVehicles,
  selectedType,
  selectedBrand,
  selectedVehicleId,
  selectedVehicle,
  auctionValueUSD,
  onSelectType,
  onSelectBrand,
  onSelectVehicle,
  onChangeAuctionValueUSD,
}: SatSearchFormProps) {
  return (
    <div className="animate-[fadeUp_0.45s_ease-out]">
      <StepHeader
        eyebrow="Búsqueda por tabla SAT"
        title="Selecciona el vehículo y compara escenarios."
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
          <OptionGroup title="2. Marca">
            {availableBrands.map((brand) => (
              <ChoiceButton
                key={brand}
                active={selectedBrand === brand}
                label={brand}
                onClick={() => onSelectBrand(brand)}
              />
            ))}
          </OptionGroup>
        )}

        {selectedBrand && (
          <OptionGroup title="3. Línea / modelo">
            {availableVehicles.map((vehicle) => (
              <ChoiceButton
                key={vehicle.id}
                active={selectedVehicleId === vehicle.id}
                label={`${vehicle.brand} ${vehicle.line} ${vehicle.year}`}
                onClick={() => onSelectVehicle(vehicle.id)}
              />
            ))}
          </OptionGroup>
        )}

        {selectedVehicleId && (
          <>
            <InputPanel
              label="Valor compra / subasta"
              helper="Ingresa el valor documentado en dólares para comparar contra la referencia SAT."
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

            <div className="rounded-[1.7rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
                Referencia SAT seleccionada
              </p>

              <h3 className="mt-3 text-xl font-black">
                {selectedVehicle.brand} {selectedVehicle.line}{" "}
                {selectedVehicle.year}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                {selectedVehicle.satDescription}
              </p>

              <div className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between gap-4 rounded-2xl bg-slate-950/40 px-4 py-3">
                  <span className="text-slate-400">Valor tabla SAT</span>
                  <span className="font-black">
                    {formatGTQ(selectedVehicle.satValueGTQ)}
                  </span>
                </div>

                <div className="flex justify-between gap-4 rounded-2xl bg-slate-950/40 px-4 py-3">
                  <span className="text-slate-400">IPRIMA aplicado</span>
                  <span className="font-black">
                    {(selectedVehicle.iprimaRate * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-slate-400">
              Tipo de cambio demo:{" "}
              <span className="font-black text-white">Q{EXCHANGE_RATE}</span>.
              La validación final debe hacerla Ronaldo con documentos reales.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
