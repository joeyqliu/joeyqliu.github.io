import type { Metadata } from "next";
import HostConsole from "./HostConsole";

export const metadata: Metadata = {
  title: "Family Feud — Host",
  robots: { index: false, follow: false },
};

export default function FamilyFeudHostPage() {
  return <HostConsole />;
}
