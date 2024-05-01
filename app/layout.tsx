import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import Provider from "@/provider/Provider";
import QueryProvider from "@/provider/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Capacitaciones Remax Up",
  description: "Capacitaciones Remax Up",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // usePropertiesStore();

  return (
    <html lang="en">
      <QueryProvider>
        <Provider>
          <body className={inter.className}>
            <ConfettiProvider />
            <ToastProvider />
            {children}
          </body>
        </Provider>
      </QueryProvider>
    </html>
  );
}
