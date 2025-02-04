"use client"
import Validate from "@/lib/auth/validate"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "./theme-provider"

export default function AdminProvider({
  session,
  children,
}) {
  return (
    <SessionProvider session={session}>
      <Validate>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </Validate>
    </SessionProvider>
  )
}
