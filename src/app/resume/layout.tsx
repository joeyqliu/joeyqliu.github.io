import type { Metadata } from "next";
import { Bebas_Neue, Poppins } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Joey Liu — Resume",
  description: "Joey Liu's resume",
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${bebas.variable} ${poppins.variable}`}>{children}</div>;
}
