"use client";

import { useMemo, useState } from "react";
import {
  Bike,
  Calculator,
  Car,
  ChevronRight,
  FileCheck2,
  MessageCircle,
  ShieldCheck,
  Ship,
} from "lucide-react";

type CalculationMode = "sat" | "auction";

type Vehicle = {
  id: string;
  name: string;
  satDescription: string;
  type: string;
  category: string;
  year: number;
  satValueGTQ: number;
  iprimaRate: number;
  plateFee: number;
  portFees: number;
  serviceFee: number;
  icon: "car" | "bike";
};

const EXCHANGE_RATE = 7.61774;

const vehicles: Vehicle[] = [
  {
    id: "mazda-3-2020",
    name: "Mazda 3 2020",
    satDescription: "AUTOMOVIL MAZDA MAZDA3 2500 · GA · 5 asientos",
    type: "Automóvil",
    category: "Automóvil turismo",
    year: 2020,
    satValueGTQ: 97678.08,
    iprimaRate: 0.2,
    plateFee: 75,
    portFees: 0,
    serviceFee: 0,
    icon: "car",
  },
  {
    id: "toyota-highlander-2017",
    name: "Toyota Highlander 2017",
    satDescription:
      "CAMIONETA TOYOTA HIGHLANDER XLE AWD 3500 · GA · 7 asientos",
    type: "SUV / Camioneta",
    category: "Vehículo de 6 a 9 pasajeros",
    year: 2017,
    satValueGTQ: 140280.33,
    iprimaRate: 0.15,
    plateFee: 75,
    portFees: 0,
    serviceFee: 0,
    icon: "car",
  },
  {
    id: "chevrolet-camaro-2015",
    name: "Chevrolet Camaro 2015",
    satDescription: "AUTOMOVIL CHEVROLET CAMARO LT 3600 · GA · 4 asientos",
    type: "Automóvil deportivo",
    category: "Automóvil turismo",
    year: 2015,
    satValueGTQ: 57210.02,
    iprimaRate: 0.2,
    plateFee: 75,
    portFees: 0,
    serviceFee: 0,
    icon: "car",
  },
  {
    id: "honda-navi-2020",
    name: "Honda Navi 2020",
    satDescription: "MOTO HONDA NAVI 109 · GA",
    type: "Motocicleta",
    category: "Motocicleta",
    year: 2020,
    satValueGTQ: 6225.95,
    iprimaRate: 0.1,
    plateFee: 30,
    portFees: 0,
    serviceFee: 0,
    icon: "bike",
  },
];

function formatGTQ(value: number) {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatUSD(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function calculateQuote(
  vehicle: Vehicle,
  calculationMode: CalculationMode,
  auctionValueUSD: number
) {
  const auctionValueGTQ = auctionValueUSD * EXCHANGE_RATE;

  const baseGTQ =
    calculationMode === "sat" ? vehicle.satValueGTQ : auctionValueGTQ;

  const baseUSD = baseGTQ / EXCHANGE_RATE;
  const iva = baseGTQ * 0.12;
  const iprima = baseGTQ * vehicle.iprimaRate;

  const total =
    iva + iprima + vehicle.plateFee + vehicle.portFees + vehicle.serviceFee;

  return {
    auctionValueGTQ,
    baseGTQ,
    baseUSD,
    iva,
    iprima,
    total,
  };
}

export default function Home() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(vehicles[0]);
  const [calculationMode, setCalculationMode] =
    useState<CalculationMode>("sat");

  const [auctionValueUSD, setAuctionValueUSD] = useState("3750");

  const parsedAuctionValueUSD = Number(auctionValueUSD) || 0;

  const quote = useMemo(
    () =>
      calculateQuote(
        selectedVehicle,
        calculationMode,
        parsedAuctionValueUSD
      ),
    [selectedVehicle, calculationMode, parsedAuctionValueUSD]
  );

  const whatsappNumber = "50238093056";

  const whatsappMessage = encodeURIComponent(
    `Hola, quiero confirmar esta estimación aduanera.\n\nVehículo: ${
      selectedVehicle.name
    }\nRegistro de referencia: ${
      selectedVehicle.satDescription
    }\n\nModo de cálculo seleccionado: ${
      calculationMode === "sat"
        ? "Valor de referencia SAT"
        : "Valor de compra/subasta"
    }\nValor compra/subasta: ${formatUSD(
      parsedAuctionValueUSD
    )}\nValor compra/subasta GTQ: ${formatGTQ(
      quote.auctionValueGTQ
    )}\nValor referencia SAT: ${formatGTQ(
      selectedVehicle.satValueGTQ
    )}\nBase usada para cálculo: ${formatGTQ(
      quote.baseGTQ
    )}\nIVA estimado: ${formatGTQ(quote.iva)}\nIPRIMA estimado: ${formatGTQ(
      quote.iprima
    )}\nPlacas: ${formatGTQ(
      selectedVehicle.plateFee
    )}\nTotal preliminar: ${formatGTQ(
      quote.total
    )}\n\nQuiero confirmar el monto real con un agente aduanero.`
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="relative overflow-hidden px-5 py-6 md:px-10">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-0 top-36 h-[280px] w-[280px] rounded-full bg-cyan-400/10 blur-3xl" />

        <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Agencia tramitadora
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight">
              Aduana Express GT
            </h1>
          </div>

          <a
            href="#vehiculos"
            className="hidden rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white/85 backdrop-blur transition hover:bg-white hover:text-slate-950 md:inline-flex"
          >
            Ver cotizador
          </a>
        </header>

        <div className="relative z-10 mx-auto grid max-w-6xl gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
              <Calculator size={16} />
              Cotizador aduanero vehicular
            </div>

            <h2 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
              Calcula una estimación antes de importar tu vehículo.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Selecciona un vehículo de referencia, compara cálculo con valor
              de subasta o tabla SAT, y confirma el monto final con un agente
              aduanero por WhatsApp.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#vehiculos"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
              >
                Iniciar estimación
                <ChevronRight size={18} />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-4 text-sm font-bold text-white/90 backdrop-blur transition hover:bg-white hover:text-slate-950"
              >
                <MessageCircle size={18} />
                Consultar agente
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="rounded-[1.5rem] bg-slate-950/70 p-5">
              <p className="text-sm font-semibold text-slate-400">
                Estimación preliminar
              </p>

              <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
                <p className="text-sm text-cyan-100">
                  {selectedVehicle.name}
                </p>
                <p className="mt-2 text-4xl font-black text-white">
                  {formatGTQ(quote.total)}
                </p>
                <p className="mt-2 text-xs leading-5 text-cyan-100/80">
                  Total preliminar calculado con{" "}
                  {calculationMode === "sat"
                    ? "valor de referencia SAT"
                    : "valor de compra/subasta"}
                  , IVA, IPRIMA y placas.
                </p>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-400">Base usada</span>
                  <span className="font-semibold">
                    {calculationMode === "sat" ? "Tabla SAT" : "Subasta"}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-400">IVA 12%</span>
                  <span className="font-semibold">{formatGTQ(quote.iva)}</span>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-400">
                    IPRIMA {selectedVehicle.iprimaRate * 100}%
                  </span>
                  <span className="font-semibold">
                    {formatGTQ(quote.iprima)}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-400">Placas</span>
                  <span className="font-semibold">
                    {formatGTQ(selectedVehicle.plateFee)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Confirmación final</span>
                  <span className="font-semibold text-cyan-200">
                    Por agente
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03] px-5 py-8 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
            <ShieldCheck className="text-cyan-300" size={28} />
            <h3 className="mt-4 font-bold">Estimación controlada</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              El demo usa vehículos cerrados para evitar consultas abiertas o
              datos incompletos.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
            <FileCheck2 className="text-cyan-300" size={28} />
            <h3 className="mt-4 font-bold">Dos bases de cálculo</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Permite comparar una estimación usando valor de subasta o valor
              de referencia SAT.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
            <Ship className="text-cyan-300" size={28} />
            <h3 className="mt-4 font-bold">Validación humana</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              El monto final se confirma con documentos, versión exacta y
              revisión del agente.
            </p>
          </div>
        </div>
      </section>

      <section id="vehiculos" className="px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Vehículos disponibles
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              Selecciona un vehículo para estimar
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
              Esta demo usa 3 carros y 1 moto con registros de referencia SAT.
              El resultado es preliminar y debe validarse con el agente.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {vehicles.map((vehicle) => {
              const Icon = vehicle.icon === "bike" ? Bike : Car;
              const isSelected = selectedVehicle.id === vehicle.id;

              const itemQuote = calculateQuote(
                vehicle,
                calculationMode,
                parsedAuctionValueUSD
              );

              return (
                <button
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className={`group rounded-[1.7rem] border p-5 text-left transition hover:-translate-y-1 ${
                    isSelected
                      ? "border-cyan-300/70 bg-cyan-300/10"
                      : "border-white/10 bg-white/[0.05] hover:border-cyan-300/40 hover:bg-white/[0.08]"
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                    <Icon size={26} />
                  </div>

                  <p className="mt-5 text-lg font-black">{vehicle.name}</p>
                  <p className="mt-1 text-sm font-semibold text-cyan-200">
                    {vehicle.type}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {vehicle.satDescription}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-cyan-300">
                      {formatGTQ(itemQuote.total)}
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-cyan-300 transition group-hover:translate-x-1"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                  Resultado seleccionado
                </p>
                <h3 className="mt-3 text-2xl font-black">
                  {selectedVehicle.name}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  {selectedVehicle.satDescription}
                </p>
              </div>

              <div className="rounded-2xl bg-cyan-300 px-5 py-4 text-slate-950">
                <p className="text-xs font-bold uppercase tracking-[0.18em]">
                  Total preliminar
                </p>
                <p className="mt-1 text-2xl font-black">
                  {formatGTQ(quote.total)}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-slate-950/40 p-4 md:grid-cols-2">
              <button
                onClick={() => setCalculationMode("sat")}
                className={`rounded-2xl px-5 py-4 text-left transition ${
                  calculationMode === "sat"
                    ? "bg-cyan-300 text-slate-950"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <p className="text-sm font-black">Calcular con tabla SAT</p>
                <p className="mt-1 text-xs opacity-80">
                  Usa el valor de referencia SAT del vehículo.
                </p>
              </button>

              <button
                onClick={() => setCalculationMode("auction")}
                className={`rounded-2xl px-5 py-4 text-left transition ${
                  calculationMode === "auction"
                    ? "bg-cyan-300 text-slate-950"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <p className="text-sm font-black">
                  Calcular con valor de subasta
                </p>
                <p className="mt-1 text-xs opacity-80">
                  Usa el precio de compra, invoice o subasta como referencia.
                </p>
              </button>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/40 p-5">
              <label
                htmlFor="auctionValue"
                className="text-sm font-bold text-white"
              >
                Valor de compra / subasta en USD
              </label>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Este valor puede venir de factura, invoice o documento de
                subasta. Cambiarlo afecta el cálculo cuando eliges “valor de
                subasta”.
              </p>

              <div className="mt-4 flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="mr-2 text-sm font-bold text-cyan-300">$</span>
                <input
                  id="auctionValue"
                  value={auctionValueUSD}
                  onChange={(event) => setAuctionValueUSD(event.target.value)}
                  inputMode="decimal"
                  className="w-full bg-transparent text-lg font-black text-white outline-none placeholder:text-slate-600"
                  placeholder="3750"
                />
              </div>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-2">
              <QuoteRow
                label="Valor compra/subasta USD"
                value={formatUSD(parsedAuctionValueUSD)}
              />

              <QuoteRow
                label="Valor compra/subasta GTQ"
                value={formatGTQ(quote.auctionValueGTQ)}
              />

              <QuoteRow
                label="Valor referencia SAT"
                value={formatGTQ(selectedVehicle.satValueGTQ)}
              />

              <QuoteRow
                label="Base usada para cálculo"
                value={
                  calculationMode === "sat"
                    ? "Valor referencia SAT"
                    : "Valor compra/subasta"
                }
              />

              <QuoteRow
                label="Base calculada en GTQ"
                value={formatGTQ(quote.baseGTQ)}
              />

              <QuoteRow
                label="Base calculada en USD"
                value={formatUSD(quote.baseUSD)}
              />

              <QuoteRow
                label="Tipo de cambio"
                value={`Q${EXCHANGE_RATE.toFixed(5)}`}
              />

              <QuoteRow
                label="Tipo de vehículo"
                value={selectedVehicle.type}
              />

              <QuoteRow
                label="Categoría IPRIMA"
                value={selectedVehicle.category}
              />

              <QuoteRow label="IVA 12%" value={formatGTQ(quote.iva)} />

              <QuoteRow
                label={`IPRIMA ${selectedVehicle.iprimaRate * 100}%`}
                value={formatGTQ(quote.iprima)}
              />

              <QuoteRow
                label="Placas"
                value={formatGTQ(selectedVehicle.plateFee)}
              />

              <QuoteRow
                label="Gastos portuarios"
                value={formatGTQ(selectedVehicle.portFees)}
              />

              <QuoteRow
                label="Honorarios"
                value={formatGTQ(selectedVehicle.serviceFee)}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-6 text-amber-100">
              Esta cotización es una estimación preliminar. El cálculo puede
              variar si se toma como base el valor de compra/subasta o el valor
              de referencia SAT. El monto final debe ser confirmado por el
              agente aduanero según documentos, versión exacta, tabla vigente y
              validación del caso.
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
              >
                <MessageCircle size={18} />
                Confirmar monto con agente
              </a>

              <a
                href="#vehiculos"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-4 text-sm font-bold text-white/90 transition hover:bg-white hover:text-slate-950"
              >
                Cotizar otro vehículo
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function QuoteRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-bold text-white">{value}</span>
    </div>
  );
}
