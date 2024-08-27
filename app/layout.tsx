import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/providers/SidebarContext";
import { FilterProvider } from "@/providers/FilterContext";
import { DataProvider } from "@/providers/DataContext";
import SideBar from "@/components/Global/SideBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pecuária",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SidebarProvider>
          <FilterProvider>
            <DataProvider>
              <div className="relative flex h-screen">
                <SideBar />
                <main className="flex-grow bg-accent">{children}</main>
              </div>
            </DataProvider>
          </FilterProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
