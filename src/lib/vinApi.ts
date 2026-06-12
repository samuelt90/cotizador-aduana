const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL no está definida");
}

export type VinDecodedVehicle = {
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
};

export type VinSatReference = {
  id: string;
  matchType: "probable";
  score: number;
  vehicleType: string;
  brand: string;
  line: string;
  modelYear: number;
  engineCc: number | null;
  cylinders: number | null;
  doors: number | null;
  fuelCode: string | null;
  fuelLabel: string | null;
  seats: number | null;
  satValueGtq: string;
  referenceLabel: string;
  technicalLabel: string;
};

export type VinDecodeResponse =
  | {
      ok: true;
      vin: string;
      vehicle: VinDecodedVehicle;
      satReference: VinSatReference | null;
      raw: {
        errorCode: string | null;
        errorText: string | null;
      };
    }
  | {
      ok: false;
      message: string;
    };

export async function decodeVin(vin: string): Promise<VinDecodeResponse> {
  const cleanVin = vin.trim().toUpperCase();

  if (!cleanVin) {
    return {
      ok: false,
      message: "Ingresa un VIN para consultar.",
    };
  }

  const response = await fetch(
    `${API_URL}/vin/decode/${encodeURIComponent(cleanVin)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Error consultando VIN: ${response.status}`);
  }

  return response.json();
}
