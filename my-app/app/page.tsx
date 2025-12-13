import ProductViewer from "@/components/ProductViewer";
import ControlsPanel from "@/components/ControlsPanel";

export default function Page() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">3D Product Experience</h1>
      <div className="w-full max-w-4xl h-[600px] relative">
        <ProductViewer />
        <ControlsPanel />
      </div>
    </div>
  );
}