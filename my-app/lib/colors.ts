export interface CarColor {
  name: string;
  hex: string;
  priceDelta?: number;
}

export const CAR_COLORS: CarColor[] = [
  { name: "Obsidian Black", hex: "#0a0a0a" },
  { name: "Polar White", hex: "#f5f5f5" },
  { name: "Selenite Grey", hex: "#8b8d8f", priceDelta: 450000 },
  { name: "Patagonia Red", hex: "#8c1c1c", priceDelta: 650000 },
  { name: "Denim Blue", hex: "#1e3a5f", priceDelta: 450000 },
];
