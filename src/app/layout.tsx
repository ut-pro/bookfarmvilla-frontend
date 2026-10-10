import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AIAssistant from "@/components/ai/AIAssistant";
import CallbackModal from "@/components/callback/CallbackModal";
import { UserLocationProvider } from "@/components/location/UserLocationContext";
import LocationPermissionPrompt from "@/components/location/LocationPermissionPrompt";
import { CallbackProvider } from "@/components/callback/CallbackContext";
import { PropertyDetailsProvider } from "@/components/property/PropertyDetailsContext";
import { VendorDetailsProvider } from "@/components/vendor/VendorDetailsContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bookfarmvilla.com"),
  title: "BookFarmVilla | Farmhouses, Villas & Wedding Venues",
  description:
    "Discover premium farmhouses, luxury villas and beautiful wedding venues for your special occasions.",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <UserLocationProvider>
          <CallbackProvider>
            <PropertyDetailsProvider>
              <VendorDetailsProvider>
                {children}
                <CallbackModal />
                <LocationPermissionPrompt />
                <AIAssistant />
              </VendorDetailsProvider>
            </PropertyDetailsProvider>
          </CallbackProvider>
        </UserLocationProvider>
      </body>
    </html>
  );
}