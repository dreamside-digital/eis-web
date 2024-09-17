import { verifyEmail } from '@/utils/directus'
import { redirect } from 'next/navigation'

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')
  const result = await verifyEmail(token)

  console.log(result)
  
  if (result.errors) {
    redirect('/register?verification=failed')
  }

  redirect('/login?verification=success')
}