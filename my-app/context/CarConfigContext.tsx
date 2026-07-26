"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CAR_COLORS, CarColor } from "@/lib/colors";

interface CarConfigContextValue {
  color: CarColor;
  setColor: (color: CarColor) => void;
}

const CarConfigContext = createContext<CarConfigContextValue | undefined>(undefined);

export function CarConfigProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState<CarColor>(CAR_COLORS[0]);

  return (
    <CarConfigContext.Provider value={{ color, setColor }}>
      {children}
    </CarConfigContext.Provider>
  );
}

export function useCarConfig() {
  const ctx = useContext(CarConfigContext);
  if (!ctx) {
    throw new Error("useCarConfig must be used within a CarConfigProvider");
  }
  return ctx;
}
