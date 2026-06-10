import { formatGTQ, formatUSD } from "@/lib/formatters";
import type {
  QuoteMethod,
  QuoteResult,
  SupportingDocumentStatus,
} from "@/types/quote";
import type { Vehicle } from "@/types/vehicle";

const WHATSAPP_NUMBER = "50238093056";

type BuildWhatsappUrlParams = {
  method: QuoteMethod | null;
  customerName: string;
  vin: string;
  selectedVehicle: Vehicle;
  auctionValueUSD: number;
  quote: QuoteResult;
  supportingDocument: SupportingDocumentStatus;
};

function getSupportingDocumentLabel(
  supportingDocument: SupportingDocumentStatus
) {
  if (supportingDocument === "yes") return "Sí";
  if (supportingDocument === "no") return "No";
  return "No indicado";
}

function getMainCalculation({
  quote,
  supportingDocument,
}: {
  quote: QuoteResult;
  supportingDocument: SupportingDocumentStatus;
}) {
  if (supportingDocument === "yes") {
    return {
      baseLabel: "Valor compra/subasta documentado",
      baseValue: quote.auctionBaseGTQ,
      estimatedTaxesAndFees: quote.totalAuction,
      partialTotal: quote.auctionBaseGTQ + quote.totalAuction,
      observation: "Quiero confirmar si el documento aplica para este caso.",
    };
  }

  return {
    baseLabel: "Tabla SAT",
    baseValue: quote.satBaseGTQ,
    estimatedTaxesAndFees: quote.totalSat,
    partialTotal: quote.satBaseGTQ + quote.totalSat,
    observation: "Quiero confirmar el monto para este caso.",
  };
}

export function buildWhatsappUrl({
  method,
  customerName,
  vin,
  selectedVehicle,
  auctionValueUSD,
  quote,
  supportingDocument,
}: BuildWhatsappUrlParams) {
  const mainCalculation = getMainCalculation({
    quote,
    supportingDocument,
  });

  const compactMessage = encodeURIComponent(
    `Hola Ronaldo, quiero validar esta cotización aduanera.\n\n` +
      `Nombre: ${customerName.trim()}\n` +
      `Vehículo: ${selectedVehicle.brand} ${selectedVehicle.line} ${selectedVehicle.year}\n` +
      `${method === "vin" ? `VIN: ${vin || "VIN pendiente"}\n` : ""}` +
      `Referencia: ${selectedVehicle.line} ${selectedVehicle.engineCc}cc\n\n` +
      `Valor ingresado: ${formatUSD(auctionValueUSD)}\n` +
      `Respaldo documental: ${getSupportingDocumentLabel(
        supportingDocument
      )}\n` +
      `Base considerada: ${mainCalculation.baseLabel}\n\n` +
      `Valor base considerado:\n` +
      `${formatGTQ(mainCalculation.baseValue)}\n\n` +
      `Impuestos y cargos estimados:\n` +
      `${formatGTQ(mainCalculation.estimatedTaxesAndFees)}\n\n` +
      `Total parcial estimado:\n` +
      `${formatGTQ(mainCalculation.partialTotal)}\n\n` +
      `Observación:\n` +
      `${mainCalculation.observation}`
  );

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${compactMessage}`;
}