import type { Metadata } from "next";
import SpinnerGame from "./SpinnerGame";

export const metadata: Metadata = {
  title: "Skit Spinner",
  robots: { index: false, follow: false },
};

export default function SpinnerPage() {
  return <SpinnerGame />;
}
