"use client";

import { useState } from "react";
import Model from "./Model";

export default function ControlsPanel() {
  const [color, setColor] = useState("#ffffff");

  return (
    <div className="absolute bottom-5 left-5 bg-white p-4 rounded-lg shadow-lg flex gap-2">
      {["#ff0000", "#00ff00", "#0000ff", "#ffff00"].map((c) => (
        <button
          key={c}
          className="px-3 py-1 rounded text-white"
          style={{ backgroundColor: c }}
          onClick={() => setColor(c)}
        >
          {c.toUpperCase()}
        </button>
      ))}
      <div className="hidden">
        {/* Hidden rendering of Model with dynamic color */}
        <Model color={color} />
      </div>
    </div>
  );
}