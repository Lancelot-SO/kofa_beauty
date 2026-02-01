import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/admin/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && session?.user) {
      // If a specific next path is provided (like /reset-password), use it
      const redirectTo = searchParams.get('next')
      if (redirectTo) {
        return NextResponse.redirect(`${origin}${redirectTo}`)
      }

      // Otherwise, check user role for default redirection
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile?.role === 'admin') {
        return NextResponse.redirect(`${origin}/admin/dashboard`)
      }
      
      // Default for customers
      return NextResponse.redirect(`${origin}/`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
