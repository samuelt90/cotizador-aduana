const API_URL = process.env.NEXT_PUBLIC_API_URL;

function normalizeVehicleType(type?: string) {
  if (!type) return undefined;

  return type
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL no está definida");
}

export type SatVehicleReference = {
  id: string;
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

function buildQuery(params: Record<string, string | number | undefined | null>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
}

async function fetchFromApi<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error consultando API: ${response.status}`);
  }

  return response.json();
}

export async function getSatVehicleYears(params?: { type?: string }) {
  const query = buildQuery({
    type: normalizeVehicleType(params?.type),
  });

  return fetchFromApi<number[]>(
    `/sat-vehicles/years${query ? `?${query}` : ""}`
  );
}

export async function getSatVehicleBrands(params: {
  type?: string;
  year?: number;
}) {
  const query = buildQuery({
    type: normalizeVehicleType(params.type),
    year: params.year,
  });

  return fetchFromApi<string[]>(
    `/sat-vehicles/brands${query ? `?${query}` : ""}`
  );
}

export async function getSatVehicleLines(params: {
  type?: string;
  year?: number;
  brand?: string;
}) {
  const query = buildQuery({
    type: normalizeVehicleType(params.type),
    year: params.year,
    brand: params.brand,
  });

  return fetchFromApi<string[]>(
    `/sat-vehicles/lines${query ? `?${query}` : ""}`
  );
}

export async function searchSatVehicles(params: {
  type?: string;
  year?: number;
  brand?: string;
  q?: string;
}) {
  const query = buildQuery({
    type: normalizeVehicleType(params.type),
    year: params.year,
    brand: params.brand,
    q: params.q,
  });

  return fetchFromApi<SatVehicleReference[]>(
    `/sat-vehicles/search${query ? `?${query}` : ""}`
  );
}
