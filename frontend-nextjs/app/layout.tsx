import type { Metadata } from "next"
import { Inter, Fira_Code } from "next/font/google"
import "./globals.css"
import NextAuthProvider from "@/components/NextAuthProvider"
import { AuthGuard } from "@/components/AuthGuard"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" })

export const metadata: Metadata = {
  title: "Ask Lytics - Natural Language to SQL",
  description: "Query your database using natural language",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${firaCode.variable} font-sans`}>
        <NextAuthProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </NextAuthProvider>
      </body>
    </html>
  )
}
