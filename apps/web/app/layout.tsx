import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "GB Guide — Plan Gilgit-Baltistan with Local Experts",
  description:
    "Book a paid video consultation with trusted local experts from Gilgit-Baltistan. Get a custom itinerary and travel with confidence.",
  keywords: [
    "Gilgit-Baltistan",
    "travel consultation",
    "GB Guide",
    "Pakistan travel",
    "Hunza",
    "Skardu",
    "Fairy Meadows",
    "K2",
    "local experts",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-18">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
