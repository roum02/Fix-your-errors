import { Inter } from "next/font/google";
import "./globals.css";
import ClientScript from "@/app/clientScript";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="manifest" href="manifest.json" />
      <title>en2han</title>
      {/*<Script*/}
      {/*    strategy="afterInteractive"*/}
      {/*    type="module"*/}
      {/*    src="https://cdn.jsdelivr.net/npm/@pwabuilder/pwaupdate"*/}
      {/*    onLoad={() => {*/}
      {/*      const el = document.createElement('pwa-update');*/}
      {/*      document.body.appendChild(el);*/}
      {/*    }}*/}
      {/*/>*/}
      <ClientScript />
    </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
