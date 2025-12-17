import "./globals.css";
import { CarConfigProvider } from "@/context/CarConfigContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CarConfigProvider>{children}</CarConfigProvider>
      </body>
    </html>
  );
}