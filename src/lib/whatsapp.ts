import { formatGTQ, formatUSD } from "@/lib/formatters";
import type {
  QuoteMethod,
  QuoteResult,
  SupportingDocumentStatus,
} from "@/types/quote";
import type { Vehicle } from "@/types/vehicle";

const WHATSAPP_NUMBER = "50238093056";

type BuildWhatsappMessageParams = {
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
      baseLabel: "Valor de compra/subasta ingresado por el cliente",
      baseValue: quote.auctionBaseGTQ,
      estimatedTaxesAndFees: quote.totalAuction,
      partialTotal: quote.auctionBaseGTQ + quote.totalAuction,
      observation:
        "Solicito validar si el documento aplica para este caso, confirmar versión exacta del vehículo y monto final correspondiente.",
    };
  }

  return {
    baseLabel: "Referencia de tabla SAT",
    baseValue: quote.satBaseGTQ,
    estimatedTaxesAndFees: quote.totalSat,
    partialTotal: quote.satBaseGTQ + quote.totalSat,
    observation:
      "Solicito validar referencia SAT aplicable, versión exacta del vehículo y monto final correspondiente.",
  };
}

export function buildWhatsappMessage({
  method,
  customerName,
  vin,
  selectedVehicle,
  auctionValueUSD,
  quote,
  supportingDocument,
}: BuildWhatsappMessageParams) {
  const mainCalculation = getMainCalculation({
    quote,
    supportingDocument,
  });

  return (
    `Hola Ronaldo, quiero validar esta cotización aduanera.\n\n` +
    `*DATOS DEL VEHÍCULO*\n` +
    `Nombre: ${customerName.trim()}\n` +
    `Vehículo: ${selectedVehicle.brand} ${selectedVehicle.line} ${selectedVehicle.year}\n` +
    `${method === "vin" ? `VIN: ${vin || "VIN pendiente"}\n` : ""}` +
    `Referencia SAT usada: ${selectedVehicle.line} ${selectedVehicle.engineCc}cc\n\n` +
    `*VALORES INGRESADOS*\n` +
    `Valor compra/subasta: ${formatUSD(auctionValueUSD)}\n` +
    `Respaldo documental indicado por el cliente: ${getSupportingDocumentLabel(
      supportingDocument
    )}\n` +
    `Valor usado para esta estimación: ${mainCalculation.baseLabel}\n\n` +
    `*DESGLOSE PRELIMINAR*\n` +
    `Valor base considerado: ${formatGTQ(mainCalculation.baseValue)}\n` +
    `Impuestos y cargos estimados: ${formatGTQ(
      mainCalculation.estimatedTaxesAndFees
    )}\n` +
    `Total parcial estimado: ${formatGTQ(mainCalculation.partialTotal)}\n\n` +
    `*OBSERVACIÓN*\n` +
    `${mainCalculation.observation}`
  );
}

export function buildWhatsappUrl(params: BuildWhatsappMessageParams) {
  const message = buildWhatsappMessage(params);
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
