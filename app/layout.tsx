import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Dharma Teja",
  description: "Product Builder",
  icons: {
    icon: "/",
    
  },
}

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // render server HTML with dark class to avoid light-mode flash before client theme applies
    <html lang="en" suppressHydrationWarning className={`dark ${spaceGrotesk.variable} ${GeistMono.variable} antialiased`}>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <Suspense fallback={<> </>}>
            {children}
            <Analytics />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
