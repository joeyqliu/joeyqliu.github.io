import type { Metadata } from "next";
import Board from "./Board";

export const metadata: Metadata = {
  title: "Family Feud — Board",
  robots: { index: false, follow: false },
};

export default function FamilyFeudBoardPage() {
  return <Board />;
}
