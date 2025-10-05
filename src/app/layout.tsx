import "@/_styles/globals.css";
import "jotai-devtools/styles.css";

import { Suspense } from "react";
import Providers from "@/_components/Providers";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <Suspense>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
