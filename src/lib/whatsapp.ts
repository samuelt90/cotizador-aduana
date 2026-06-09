import { formatGTQ, formatUSD } from "@/lib/formatters";
import type { QuoteMethod, QuoteResult } from "@/types/quote";
import type { Vehicle } from "@/types/vehicle";

const WHATSAPP_NUMBER = "50238093056";

type BuildWhatsappUrlParams = {
  method: QuoteMethod | null;
  customerName: string;
  vin: string;
  selectedVehicle: Vehicle;
  auctionValueUSD: number;
  quote: QuoteResult;
};

export function buildWhatsappUrl({
  method,
  customerName,
  vin,
  selectedVehicle,
  auctionValueUSD,
  quote,
}: BuildWhatsappUrlParams) {
  const methodLabel =
    method === "vin" ? "Cotización por VIN" : "Cotización por tabla SAT";

  const compactMessage = encodeURIComponent(
    `Hola Ronaldo, quiero confirmar esta cotización aduanera.\n\n` +
      `Nombre: ${customerName || "Sin nombre"}\n` +
      `Tipo de consulta: ${methodLabel}\n` +
      `${method === "vin" ? `VIN: ${vin || "VIN pendiente"}\n` : ""}` +
      `Vehículo: ${selectedVehicle.brand} ${selectedVehicle.line} ${selectedVehicle.year}\n` +
      `Referencia SAT: ${selectedVehicle.line} ${selectedVehicle.engineCc}cc\n` +
      `Valor compra/subasta: ${formatUSD(auctionValueUSD)}\n` +
      `Valor tabla SAT: ${formatGTQ(selectedVehicle.satValueGTQ)}\n\n` +
      `Estimado con subasta: ${formatGTQ(quote.totalAuction)}\n` +
      `Estimado con tabla SAT: ${formatGTQ(quote.totalSat)}\n\n` +
      `Quiero confirmar cuál aplica para mi caso.`
  );

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${compactMessage}`;
}
