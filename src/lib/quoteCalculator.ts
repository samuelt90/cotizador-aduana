import type { QuoteResult } from "@/types/quote";
import type { Vehicle } from "@/types/vehicle";

export const EXCHANGE_RATE = 7.61774;

export function calculateQuote(
  vehicle: Vehicle,
  auctionValueUSD: number
): QuoteResult {
  const auctionValueGTQ = auctionValueUSD * EXCHANGE_RATE;

  const ivaAuction = auctionValueGTQ * 0.12;
  const iprimaAuction = auctionValueGTQ * vehicle.iprimaRate;
  const totalAuction = ivaAuction + iprimaAuction + vehicle.plateFee;

  const ivaSat = vehicle.satValueGTQ * 0.12;
  const iprimaSat = vehicle.satValueGTQ * vehicle.iprimaRate;
  const totalSat = ivaSat + iprimaSat + vehicle.plateFee;

  return {
    auctionValueGTQ,
    satBaseGTQ: vehicle.satValueGTQ,
    auctionBaseGTQ: auctionValueGTQ,
    ivaAuction,
    iprimaAuction,
    totalAuction,
    ivaSat,
    iprimaSat,
    totalSat,
  };
}
