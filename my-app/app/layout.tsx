import "./globals.css";
import { CarConfigProvider } from "@/context/CarConfigContext";

export const metadata = {
  title: "Primyst Drive",
  description: "3D Car Selling Experience",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white">
        <CarConfigProvider>{children}</CarConfigProvider>
      </body>
    </html>
  );
}