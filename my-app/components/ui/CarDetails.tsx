export default function CarDetails() {
  return (
    <div className="p-5 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">
          2026 Mercedes-Benz CLA EV
        </h1>
        <p className="text-neutral-400">
          Electric Sedan
        </p>
      </header>

      <div>
        <p className="text-2xl font-bold">₦78,500,000</p>
      </div>

      {/* Color picker goes here */}

      <div className="space-y-2 text-sm text-neutral-300">
        <p>Range: 750km</p>
        <p>0–100 km/h: 4.9s</p>
        <p>Top Speed: 210 km/h</p>
        <p>Transmission: Automatic</p>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <button className="rounded-xl bg-white text-black py-3 font-medium">
          Schedule Test Drive
        </button>
        <button className="rounded-xl border border-neutral-700 py-3">
          Contact Dealer
        </button>
      </div>
    </div>
  );
}