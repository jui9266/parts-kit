import "jotai-devtools/styles.css";
import "@/app/globals.css";

import { Suspense } from "react";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <Suspense>
          <Providers>
            <div className="flex">
              <Sidebar />
              <div className="min-h-screen flex-1">{children}</div>
            </div>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
