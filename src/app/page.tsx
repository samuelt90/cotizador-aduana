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
import type { QuoteMethod, ScreenState } from "@/types/quote";
import { WelcomeHero } from "@/components/cotizador/WelcomeHero";
import { QuoteMethodSelector } from "@/components/cotizador/QuoteMethodSelector";
import { StickyBottomBar } from "@/components/cotizador/StickyBottomBar";
import { ContextualFaq } from "@/components/faq/ContextualFaq";
import { CustomerNameModal } from "@/components/cotizador/CustomerNameModal";
import { CalculationLoading } from "@/components/cotizador/CalculationLoading";
import { VinQuoteForm } from "@/components/cotizador/VinQuoteForm";
import { SatSearchForm } from "@/components/cotizador/SatSearchForm";
import { QuoteResult } from "@/components/cotizador/QuoteResult";

export default function Home() {
  const [screen, setScreen] = useState<ScreenState>("method");
  const [method, setMethod] = useState<QuoteMethod | null>(null);

  const [vin, setVin] = useState("");
  const [auctionValueUSD, setAuctionValueUSD] = useState("3750");

  const [selectedType, setSelectedType] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  const [activeLoadingStep, setActiveLoadingStep] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const [showFaq, setShowFaq] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [showNameBox, setShowNameBox] = useState(false);
  const [customerName, setCustomerName] = useState("");

  const availableBrands = useMemo(() => {
    if (!selectedType) return [];

    return Array.from(
      new Set(
        demoVehicles
          .filter((vehicle) => vehicle.type === selectedType)
          .map((vehicle) => vehicle.brand)
      )
    );
  }, [selectedType]);

  const availableVehicles = useMemo(() => {
    return demoVehicles.filter((vehicle) => {
      if (!selectedType || !selectedBrand) return false;

      return vehicle.type === selectedType && vehicle.brand === selectedBrand;
    });
  }, [selectedType, selectedBrand]);

  const selectedVehicle = useMemo(() => {
    if (method === "vin") return demoVehicles[0];

    return (
      demoVehicles.find((vehicle) => vehicle.id === selectedVehicleId) ??
      demoVehicles[0]
    );
  }, [method, selectedVehicleId]);

  const parsedAuctionValueUSD = Number(auctionValueUSD) || 0;

  const quote = useMemo(
    () => calculateQuote(selectedVehicle, parsedAuctionValueUSD),
    [selectedVehicle, parsedAuctionValueUSD]
  );

  const lowestEstimate = Math.min(quote.totalAuction, quote.totalSat);

  const canContinueFromMethod = method !== null;

  const canCalculate =
    method === "vin"
      ? vin.trim().length >= 5 && parsedAuctionValueUSD > 0
      : selectedVehicleId !== "" && parsedAuctionValueUSD > 0;

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
    setSelectedType("");
    setSelectedBrand("");
    setSelectedVehicleId("");
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
    selectedVehicle,
    auctionValueUSD: parsedAuctionValueUSD,
    quote,
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
            onChangeVin={setVin}
            onChangeAuctionValueUSD={setAuctionValueUSD}
          />
        )}
        {screen === "form" && method === "sat" && (
          <SatSearchForm
            vehicleTypes={vehicleTypes}
            availableBrands={availableBrands}
            availableVehicles={availableVehicles}
            selectedType={selectedType}
            selectedBrand={selectedBrand}
            selectedVehicleId={selectedVehicleId}
            selectedVehicle={selectedVehicle}
            auctionValueUSD={auctionValueUSD}
            onSelectType={(value) => {
              setSelectedType(value);
              setSelectedBrand("");
              setSelectedVehicleId("");
            }}
            onSelectBrand={(value) => {
              setSelectedBrand(value);
              setSelectedVehicleId("");
            }}
            onSelectVehicle={setSelectedVehicleId}
            onChangeAuctionValueUSD={setAuctionValueUSD}
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
          selectedVehicle={selectedVehicle}
          auctionValueUSD={parsedAuctionValueUSD}
          quote={quote}
          lowestEstimate={lowestEstimate}
        />
      )}
      </section>

      <StickyBottomBar
        screen={screen}
        method={method}
        selectedVehicle={selectedVehicle}
        selectedVehicleId={selectedVehicleId}
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






