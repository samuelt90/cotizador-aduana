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

type VinReviewCaseType = "auction" | "personal";

type VinReviewWhatsappParams = {
  customerName: string;
  vin: string;
  caseType: VinReviewCaseType;
  hasSupportingDocument: boolean | null;
  invoiceValueUSD: number | null;
  detectedVehicle: {
    year: number | null;
    make: string | null;
    model: string | null;
    trim: string | null;
    bodyClass: string | null;
    vehicleType: string | null;
    engineCc: number | null;
    cylinders: number | null;
    fuelType: string | null;
    doors: number | null;
    seats: number | null;
  } | null;
  manualVehicle: {
    year: string;
    brand: string;
    line: string;
    version: string;
  };
};

function formatNullable(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "No indicado";
  }

  return String(value);
}

function formatDetectedVehicle(
  vehicle: VinReviewWhatsappParams["detectedVehicle"]
) {
  if (!vehicle) {
    return "No identificado";
  }

  const mainLabel = [vehicle.make, vehicle.model, vehicle.trim, vehicle.year]
    .filter(Boolean)
    .join(" ");

  return mainLabel || "Vehículo detectado por VIN";
}

export function buildVinReviewWhatsappMessage({
  customerName,
  vin,
  caseType,
  hasSupportingDocument,
  invoiceValueUSD,
  detectedVehicle,
  manualVehicle,
}: VinReviewWhatsappParams) {
  const caseTypeLabel =
    caseType === "auction" ? "Compra / subasta" : "Uso personal";

  const detectedVehicleLabel = formatDetectedVehicle(detectedVehicle);

  const lines: string[] = [
    "Hola Ronaldo, quiero revisar este caso por VIN.",
    "",
  ];

  if (customerName.trim().length > 0) {
    lines.push(`*Cliente:* ${customerName}`);
  }

  lines.push(`*VIN:* ${vin || "No indicado"}`);
  lines.push(`*Vehículo detectado por VIN:* ${detectedVehicleLabel}`);
  lines.push("");

  lines.push(
    "El cotizador identificó el vehículo, pero no encontró una referencia SAT probable cargada en la base actual."
  );

  lines.push("");
  lines.push(`*Tipo de caso:* ${caseTypeLabel}`);

  if (hasSupportingDocument === true) {
    lines.push("*Tiene factura o respaldo:* Sí");

    if (invoiceValueUSD && invoiceValueUSD > 0) {
      lines.push(`*Valor indicado:* ${formatUSD(invoiceValueUSD)}`);
    }
  }

  if (hasSupportingDocument === false) {
    lines.push("*Tiene factura o respaldo:* No");
  }

  const manualData: string[] = [];

  if (manualVehicle.year.trim().length > 0) {
    manualData.push(`Año: ${manualVehicle.year}`);
  }

  if (manualVehicle.brand.trim().length > 0) {
    manualData.push(`Marca: ${manualVehicle.brand}`);
  }

  if (manualVehicle.line.trim().length > 0) {
    manualData.push(`Línea/modelo: ${manualVehicle.line}`);
  }

  if (manualVehicle.version.trim().length > 0) {
    manualData.push(`Versión: ${manualVehicle.version}`);
  }

  if (manualData.length > 0) {
    lines.push("");
    lines.push("*Datos ingresados por el cliente:*");
    lines.push(...manualData);
  }

  lines.push("");
  lines.push(
    "Por favor revisar manualmente el VIN y confirmar qué referencia SAT corresponde antes de preparar una estimación."
  );

  return lines.join("\n");
}

export function buildVinReviewWhatsappUrl(params: VinReviewWhatsappParams) {
  const message = buildVinReviewWhatsappMessage(params);
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
