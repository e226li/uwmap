import "~/styles/globals.css";
import { Inter } from "next/font/google";
import NavigationBar from "./components/navigation-bar";
import { Metadata } from "next";
import { siteConfig } from "../app/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <div className="flex flex-col min-h-screen">
          <NavigationBar />
          <div className="flex-1 over">{children}</div>
        </div>
      </body>
    </html>
  );
}
