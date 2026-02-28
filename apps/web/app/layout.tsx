import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Providers from "./components/Providers";

export const metadata: Metadata = {
  title: "The North Route — Plan Gilgit-Baltistan with Local Experts",
  description:
    "Book a paid video consultation with trusted local experts from Gilgit-Baltistan. Get a custom itinerary and travel with confidence.",
  keywords: [
    "Gilgit-Baltistan",
    "travel consultation",
    "The North Route",
    "thenorthroute",
    "Pakistan travel",
    "Hunza",
    "Skardu",
    "Fairy Meadows",
    "K2",
    "local experts",
  ],
};

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch(e){}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 pt-18">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
