"use client";

import { createContext, useContext, useState } from "react";

type CarConfigContextType = {
  color: string;
  setColor: (color: string) => void;
};

const CarConfigContext = createContext<CarConfigContextType | null>(null);

export function CarConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [color, setColor] = useState("#f5f5f5");

  return (
    <CarConfigContext.Provider value={{ color, setColor }}>
      {children}
    </CarConfigContext.Provider>
  );
}

export function useCarConfig() {
  const ctx = useContext(CarConfigContext);
  if (!ctx) {
    throw new Error("useCarConfig must be used inside CarConfigProvider");
  }
  return ctx;
}