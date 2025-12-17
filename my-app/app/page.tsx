import CarViewer from "@/components/viewer/CarViewer";
import CarDetails from "@/components/ui/CarDetails";

export default function Home() {
  return (
    <main className="h-screen w-full overflow-hidden bg-neutral-950 text-white">
      <div className="grid h-full grid-cols-1 lg:grid-cols-5">
        {/* 3D Viewer */}
        <section className="lg:col-span-3 h-[60vh] lg:h-full">
          <CarViewer />
        </section>

        {/* Info Panel */}
        <section className="lg:col-span-2 h-auto lg:h-full overflow-y-auto border-t lg:border-t-0 lg:border-l border-neutral-800">
          <CarDetails />
        </section>
      </div>
    </main>
  );
}