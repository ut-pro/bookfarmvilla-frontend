import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AIAssistant from "@/components/ai/AIAssistant";
import CallbackModal from "@/components/callback/CallbackModal";
import { CallbackProvider } from "@/components/callback/CallbackContext";
import { PropertyDetailsProvider } from "@/components/property/PropertyDetailsContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BookFarmVilla | Farmhouses, Villas & Wedding Venues",
  description:
    "Discover premium farmhouses, luxury villas and beautiful wedding venues for your special occasions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <CallbackProvider>
          <PropertyDetailsProvider>
            {children}
            <CallbackModal />
            <AIAssistant />
          </PropertyDetailsProvider>
        </CallbackProvider>
      </body>
    </html>
  );
}