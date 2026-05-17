import { NextResponse } from 'next/server'
import { encrypt } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const adminEmail = process.env.ADMIN_EMAIL || 'reconinternational04@gmail.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Recon@123#'

    // Verify against env variables (with fallbacks for Netlify environment)
    if (
      email === adminEmail &&
      password === adminPassword
    ) {
      const session = await encrypt({ email, role: 'admin' })
      
      const response = NextResponse.json({ success: true })
      
      response.cookies.set({
        name: 'admin_session',
        value: session,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 hours
      })
      
      return response
    }

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
