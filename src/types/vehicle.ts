export type VehicleIcon = "car" | "bike";

export type Vehicle = {
  id: string;
  type: string;
  brand: string;
  line: string;
  year: number;
  engineCc: number;
  fuel: string;
  seats: number;
  satDescription: string;
  satValueGTQ: number;
  iprimaRate: number;
  plateFee: number;
  icon: VehicleIcon;
};