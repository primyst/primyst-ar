import TopBar from "./components/TopBar";
import CarCanvas from "./components/CarCanvas";
import ConfigPanel from "./components/ConfigPanel";
import SpecsBar from "./components/SpecsBar";

export default function Page() {
  return (
    <main className="h-screen flex flex-col bg-black text-white">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <CarCanvas />
        </div>

        <div className="w-[320px] border-l border-white/10">
          <ConfigPanel />
        </div>
      </div>

      <SpecsBar />
    </main>
  );
}