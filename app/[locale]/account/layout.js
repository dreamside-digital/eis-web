import AuthProvider from "@/components/AuthProvider"
import { getServerSession } from "next-auth"
import { options } from "@/lib/auth/options"

export default async function AccountLayout({ children }) {
  const session = await getServerSession(options)  
  return <AuthProvider session={session}>{children}</AuthProvider>
}   