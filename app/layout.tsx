import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar/>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
