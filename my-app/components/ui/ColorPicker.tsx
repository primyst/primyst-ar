"use client";

import { CAR_COLORS } from "@/lib/colors";
import { useCarConfig } from "@/context/CarConfigContext";

export default function ColorPicker() {
  const { color, setColor } = useCarConfig();

  return (
    <div>
      <p className="text-sm text-neutral-400 mb-2">Exterior Color</p>
      <div className="flex gap-3">
        {CAR_COLORS.map((c) => (
          <button
            key={c.name}
            onClick={() => setColor(c)}
            className={`h-9 w-9 rounded-full border transition-transform ${
              color.hex === c.hex ? "border-white scale-110" : "border-neutral-700"
            }`}
            style={{ backgroundColor: c.hex }}
            title={c.name}
            aria-label={c.name}
          />
        ))}
      </div>
    </div>
  );
}