"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  HelpCircle,
} from "lucide-react";

import { demoVehicles, vehicleTypes } from "@/data/demoSatVehicles";
import { faqItems } from "@/data/faqItems";
import { loadingSteps } from "@/data/loadingSteps";
import { calculateQuote} from "@/lib/quoteCalculator";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import type { QuoteMethod, ScreenState, SupportingDocumentStatus } from "@/types/quote";
import { WelcomeHero } from "@/components/cotizador/WelcomeHero";
import { QuoteMethodSelector } from "@/components/cotizador/QuoteMethodSelector";
import { StickyBottomBar } from "@/components/cotizador/StickyBottomBar";
import { ContextualFaq } from "@/components/faq/ContextualFaq";
import { CustomerNameModal } from "@/components/cotizador/CustomerNameModal";
import { CalculationLoading } from "@/components/cotizador/CalculationLoading";
import { VinQuoteForm } from "@/components/cotizador/VinQuoteForm";
import { SatSearchForm } from "@/components/cotizador/SatSearchForm";
import { QuoteResult } from "@/components/cotizador/QuoteResult";
import { getSatVehicleBrands, getSatVehicleLines, getSatVehicleYears,searchSatVehicles, type SatVehicleReference } from "@/lib/satVehiclesApi";
import type { Vehicle } from "@/types/vehicle";

export default function Home() {
  const [screen, setScreen] = useState<ScreenState>("method");
  const [method, setMethod] = useState<QuoteMethod | null>(null);

  const [supportingDocument, setSupportingDocument] =
    useState<SupportingDocumentStatus>(null);

  const [vin, setVin] = useState("");
  const [auctionValueUSD, setAuctionValueUSD] = useState("3750");

  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableLines, setAvailableLines] = useState<string[]>([]);

  const [selectedType, setSelectedType] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedLine, setSelectedLine] = useState("");

  const [selectedVehicle, setSelectedVehicle] =
    useState<SatVehicleReference | null>(null);

  const [loadingYears, setLoadingYears] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingLines, setLoadingLines] = useState(false);
  const [loadingVehicle, setLoadingVehicle] = useState(false);

  const [activeLoadingStep, setActiveLoadingStep] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const [showFaq, setShowFaq] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [showNameBox, setShowNameBox] = useState(false);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    if (!selectedType) return;

    let ignore = false;

    async function loadYears() {
      try {
        setLoadingYears(true);

        const years = await getSatVehicleYears({
          type: selectedType,
        });

        if (!ignore) {
          setAvailableYears(years);
        }
      } catch (error) {
        console.error("Error cargando años SAT:", error);

        if (!ignore) {
          setAvailableYears([]);
        }
      } finally {
        if (!ignore) {
          setLoadingYears(false);
        }
      }
    }

    loadYears();

    return () => {
      ignore = true;
    };
  }, [selectedType]);

  useEffect(() => {
    if (!selectedType || !selectedYear) return;

    let ignore = false;

    async function loadBrands() {
      try {
        setLoadingBrands(true);

        const brands = await getSatVehicleBrands({
          type: selectedType,
          year: selectedYear ?? undefined,
        });

        if (!ignore) {
          setAvailableBrands(brands);
        }
      } catch (error) {
        console.error("Error cargando marcas SAT:", error);

        if (!ignore) {
          setAvailableBrands([]);
        }
      } finally {
        if (!ignore) {
          setLoadingBrands(false);
        }
      }
    }

    loadBrands();

    return () => {
      ignore = true;
    };
  }, [selectedType, selectedYear]);

  useEffect(() => {
    if (!selectedType || !selectedYear || !selectedBrand) return;

    let ignore = false;

    async function loadLines() {
      try {
        setLoadingLines(true);

        const lines = await getSatVehicleLines({
          type: selectedType,
          year: selectedYear?? undefined,
          brand: selectedBrand,
        });

        if (!ignore) {
          setAvailableLines(lines);
        }
      } catch (error) {
        console.error("Error cargando líneas SAT:", error);

        if (!ignore) {
          setAvailableLines([]);
        }
      } finally {
        if (!ignore) {
          setLoadingLines(false);
        }
      }
    }

    loadLines();

    return () => {
      ignore = true;
    };
  }, [selectedType, selectedYear, selectedBrand]);

  useEffect(() => {
    if (!selectedType || !selectedYear || !selectedBrand || !selectedLine) {
      return;
    }

    let ignore = false;

    async function loadVehicleReference() {
      try {
        setLoadingVehicle(true);

        const results = await searchSatVehicles({
          type: selectedType,
          year: selectedYear ?? undefined,
          brand: selectedBrand,
          q: selectedLine,
        });

        if (!ignore) {
          setSelectedVehicle(results[0] ?? null);
        }
      } catch (error) {
        console.error("Error buscando referencia SAT:", error);

        if (!ignore) {
          setSelectedVehicle(null);
        }
      } finally {
        if (!ignore) {
          setLoadingVehicle(false);
        }
      }
    }

    loadVehicleReference();

    return () => {
      ignore = true;
    };
  }, [selectedType, selectedYear, selectedBrand, selectedLine]);

const selectedVehicleForQuote = useMemo<Vehicle>(() => {
  if (method === "vin") {
    return demoVehicles[0];
  }

  if (!selectedVehicle) {
    return demoVehicles[0];
  }

  return {
    id: selectedVehicle.id,
    type: selectedVehicle.vehicleType,
    brand: selectedVehicle.brand,
    line: selectedVehicle.line,
    year: selectedVehicle.modelYear,
    satDescription: selectedVehicle.technicalLabel,
    satValueGTQ: Number(selectedVehicle.satValueGtq),
    iprimaRate: 0.2,
    plateFee: 75,
    engineCc: selectedVehicle.engineCc ?? 0,
    fuel: selectedVehicle.fuelLabel ?? "Gasolina",
    seats: selectedVehicle.seats ?? 0,
    icon: "car",
  };
}, [method, selectedVehicle]);


  const parsedAuctionValueUSD = Number(auctionValueUSD) || 0;

  const quote = useMemo(
    () => calculateQuote(selectedVehicleForQuote, parsedAuctionValueUSD),
    [selectedVehicleForQuote, parsedAuctionValueUSD]
  );

  const lowestEstimate = Math.min(quote.totalAuction, quote.totalSat);
  const canContinueFromMethod = method !== null;

const canCalculate =
    parsedAuctionValueUSD > 0 &&
    supportingDocument !== null &&
    (method === "vin"
      ? vin.trim().length > 0
      : selectedVehicleForQuote !== null && selectedLine.length > 0);

  useEffect(() => {
    if (screen !== "loading") return;

    setActiveLoadingStep(0);

    const interval = window.setInterval(() => {
      setActiveLoadingStep((current) => {
        if (current >= loadingSteps.length - 1) return current;
        return current + 1;
      });
    }, 420);

    const timeout = window.setTimeout(() => {
      window.clearInterval(interval);
      setScreen("result");
    }, 2600);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [screen]);

  function selectMethod(selectedMethod: QuoteMethod) {
    setMethod(selectedMethod);
    setSupportingDocument(null);
  }

  function continueToForm() {
    if (!canContinueFromMethod) return;
    setScreen("form");
  }

  function resetFlow() {
    setScreen("method");
    setMethod(null);
    setVin("");
    setAuctionValueUSD("3750");

    setAvailableYears([]);
    setAvailableBrands([]);
    setAvailableLines([]);

    setSelectedType("");
    setSelectedYear(null);
    setSelectedBrand("");
    setSelectedLine("");
    setSelectedVehicle(null);

    setSupportingDocument(null);
    setShowDetails(false);
    setShowNameBox(false);
  }

  function handleCalculate() {
    if (!canCalculate) return;
    setScreen("loading");
  }

  const whatsappUrl = buildWhatsappUrl({
    method,
    customerName,
    vin,
    selectedVehicle: selectedVehicleForQuote,
    auctionValueUSD: parsedAuctionValueUSD,
    quote,
    supportingDocument,
  });


  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050b14] text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-180px] h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-20 right-[-160px] h-[360px] w-[360px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050b14]/75 px-5 py-4 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            onClick={screen === "method" ? undefined : resetFlow}
            className="flex items-center gap-3 text-left"
          >
            {screen !== "method" && (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <ArrowLeft size={18} />
              </span>
            )}

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300">
                Cotizador aduanero
              </p>
              <h1 className="text-base font-black tracking-tight">
                Aduana Express GT
              </h1>
            </div>
          </button>

          <button
            onClick={() => setShowFaq(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-cyan-200 backdrop-blur-xl"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </header>

              <section className="mx-auto max-w-5xl px-5 pb-36 pt-8">
                {screen === "method" && (
          <div className="animate-[fadeUp_0.45s_ease-out]">
            <WelcomeHero />

            <QuoteMethodSelector
              method={method}
              onSelect={selectMethod}
            />
          </div>
        )}

        {screen === "form" && method === "vin" && (
          <VinQuoteForm
            vin={vin}
            auctionValueUSD={auctionValueUSD}
            supportingDocument={supportingDocument}
            onChangeVin={setVin}
            onChangeAuctionValueUSD={setAuctionValueUSD}
            onChangeSupportingDocument={setSupportingDocument}
          />
        )}
        {screen === "form" && method === "sat" && (
       <SatSearchForm
          vehicleTypes={vehicleTypes}
          availableYears={availableYears}
          availableBrands={availableBrands}
          availableLines={availableLines}
          selectedType={selectedType}
          selectedYear={selectedYear}
          selectedBrand={selectedBrand}
          selectedLine={selectedLine}
          selectedVehicle={selectedVehicle}
          auctionValueUSD={auctionValueUSD}
          supportingDocument={supportingDocument}
          loadingYears={loadingYears}
          loadingBrands={loadingBrands}
          loadingLines={loadingLines}
          loadingVehicle={loadingVehicle}
          onSelectType={(value) => {
            setSelectedType(value);
            setSelectedYear(null);
            setSelectedBrand("");
            setSelectedLine("");
            setSelectedVehicle(null);
            setAvailableYears([]);
            setAvailableBrands([]);
            setAvailableLines([]);
          }}
          onSelectYear={(value) => {
            setSelectedYear(value);
            setSelectedBrand("");
            setSelectedLine("");
            setSelectedVehicle(null);
            setAvailableBrands([]);
            setAvailableLines([]);
          }}
          onSelectBrand={(value) => {
            setSelectedBrand(value);
            setSelectedLine("");
            setSelectedVehicle(null);
            setAvailableLines([]);
          }}
          onSelectLine={(value) => {
            setSelectedLine(value);
          }}
          onChangeAuctionValueUSD={setAuctionValueUSD}
          onChangeSupportingDocument={setSupportingDocument}
        />

        )}

        {screen === "loading" && (
          <CalculationLoading
            loadingSteps={loadingSteps}
            activeStep={activeLoadingStep}
          />
        )}

     {screen === "result" && quote && (
        <QuoteResult
          method={method}
          vin={vin}
          selectedVehicle={selectedVehicleForQuote}
          auctionValueUSD={parsedAuctionValueUSD}
          quote={quote}
          lowestEstimate={lowestEstimate}
          supportingDocument={supportingDocument}
        />
      )}
      </section>

      <StickyBottomBar
        screen={screen}
        method={method}
        selectedVehicle={selectedVehicleForQuote}
        selectedVehicleId={selectedVehicle?.id?? ""}
        auctionValueUSD={parsedAuctionValueUSD}
        lowestEstimate={lowestEstimate}
        canContinueFromMethod={canContinueFromMethod}
        canCalculate={canCalculate}
        onContinue={continueToForm}
        onCalculate={handleCalculate}
        onSend={() => setShowNameBox(true)}
      />

        <ContextualFaq
          isOpen={showFaq}
          items={faqItems}
          openFaq={openFaq}
          onToggleFaq={(index) => setOpenFaq(openFaq === index ? null : index)}
          onClose={() => setShowFaq(false)}
        />

          <CustomerNameModal
        isOpen={showNameBox}
        customerName={customerName}
        whatsappUrl={whatsappUrl}
        onChangeName={setCustomerName}
        onClose={() => setShowNameBox(false)}
          />


    </main>
  );
}






