import { NextResponse } from 'next/server'
import { encrypt } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    console.log('Login attempt request received for email:', email)

    // Authenticate using Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Supabase Auth sign-in failed:', error.message)
      return NextResponse.json(
        { error: error.message || 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('Supabase Auth sign-in successful for user:', data.user?.email)

    // Create session token and set cookie (preserving the existing dashboard middleware protection)
    const session = await encrypt({ 
      email: data.user?.email, 
      role: 'admin', 
      userId: data.user?.id 
    })
    
    const response = NextResponse.json({ 
      success: true,
      user: data.user,
      session: data.session
    })
    
    response.cookies.set({
      name: 'admin_session',
      value: session,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
    })
    
    return response
  } catch (error: any) {
    console.error('Login internal server error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
