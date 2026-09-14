import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import CartToast from "@/components/CartToast";

export const metadata: Metadata = {
  title: "Avira | Luxury & Lifestyle Fashion with AI Shopping Agent",
  description: "Boutique fashion e-commerce featuring tailored menswear, women's atelier dresses, contemporary footwear, and an autonomous AI Shopping Agent powered by OpenAI tool calling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-stone-950 text-stone-100 antialiased min-h-screen selection:bg-amber-500 selection:text-stone-950">
        <CartProvider>
          <WishlistProvider>
            {children}
            <CartToast />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
