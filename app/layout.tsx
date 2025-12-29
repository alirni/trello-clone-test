import type { Metadata } from "next";
import "../styles/main.scss";

export const metadata: Metadata = {
  title: "Trello Clone",
  description: "A simplified Trello clone built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
