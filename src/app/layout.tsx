import { Inter } from "next/font/google";
import "./globals.css";

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
      <link rel="manifest" href="/manifest.json" />
      <title>en2han</title>
      <script type="module">
        {`
            import 'https://cdn.jsdelivr.net/npm/@pwabuilder/pwaupdate';
            const el = document.createElement('pwa-update');
            document.body.appendChild(el);
          `}
      </script>
    </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
