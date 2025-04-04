
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import  ReduxProvider from "./StoreProvider";
import "./globals.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
