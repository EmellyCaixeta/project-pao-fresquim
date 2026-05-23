import "./globals.css";
import Sidebar from "@/components/Sidebar";

import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Padaria System - Gestão de Vendas",
  description: "Sistema interno da Padaria Pão FresQUIM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="bg-gray-50 text-gray-900">
        <div className="flex">
          <Sidebar />

          <main className="flex-1 ml-64 min-h-screen">
            {children}

            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#fff",
                  color: "#374151",
                  fontWeight: "bold",
                },
                success: {
                  style: {
                    border: "1px solid #a7f3d0",
                  },
                },
                error: {
                  style: {
                    border: "1px solid #fecaca",
                  },
                },
              }}
            />
          </main>
        </div>
      </body>
    </html>
  );
}
