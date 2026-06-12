export type QuoteMethod = "vin" | "sat";

export type ScreenState =
  | "method"
  | "form"
  | "loading"
  | "result"
  | "whatsapp";

export type SupportingDocumentStatus = "yes" | "no" | null;

export type QuoteResult = {
  auctionValueGTQ: number;
  satBaseGTQ: number;
  auctionBaseGTQ: number;
  ivaAuction: number;
  iprimaAuction: number;
  totalAuction: number;
  ivaSat: number;
  iprimaSat: number;
  totalSat: number;
};