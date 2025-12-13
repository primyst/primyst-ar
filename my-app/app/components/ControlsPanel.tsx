"use client";

import { useColor } from "@/context/ColorContext";

export default function ControlsPanel() {
  const { setColor } = useColor();
  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"];

  return (
    <div className="absolute bottom-5 left-5 bg-white p-4 rounded-lg shadow-lg flex gap-2">
      {colors.map((c) => (
        <button
          key={c}
          className="px-3 py-1 rounded text-white"
          style={{ backgroundColor: c }}
          onClick={() => setColor(c)}
        >
          {c.toUpperCase()}
        </button>
      ))}
    </div>
  );
}