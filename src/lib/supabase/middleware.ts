import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // EMERGENCY FIX: Hardcoded credentials matching client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bozlkhqnjaizqtkmmdsh.supabase.co";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_EtEOgiPYhPV7GS9S9_fBiA_QZt_T8x-";

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Admin Route Protection
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // 1. Not Logged In
        if (!user) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        // 2. Not Admin (Hardcoded Email Check)
        const allowedAdmin = 'ceosetyawan@gmail.com'
        if (user.email?.toLowerCase().trim() !== allowedAdmin) {
            const url = request.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)
        }
    }

    return response
}
