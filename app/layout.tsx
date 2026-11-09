import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: { default: "TRUST THE PROCESS", template: "%s — TRUST THE PROCESS" }, description: "The independent business ecosystem for TRUST THE PROCESS." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="fr"><body>{children}</body></html>; }
