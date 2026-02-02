import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google"; // Import all fonts
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "NAIZEN – Elite Hybrid Training | Performance Matrix",
  description: "High-intensity gym management and performance monitoring for NAIZEN, Drugmulla, Kupwara. Engineered for the elite 1%.",
  keywords: ["gym", "fitness", "Kupwara", "NAIZEN", "workout", "performance matrix"],
  authors: [{ name: "NAIZEN" }],
  openGraph: {
    title: "NAIZEN | Elite Performance Matrix",
    description: "Recalibrate Your Physical Logic",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-[#050505] text-white antialiased font-sans`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0D0D0D',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              },
              success: {
                iconTheme: {
                  primary: '#4ADE80',
                  secondary: '#000',
                },
              },
              error: {
                iconTheme: {
                  primary: '#FB7185',
                  secondary: '#000',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

