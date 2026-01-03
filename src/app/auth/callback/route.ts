import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Redirect to next page after successful login
            return NextResponse.redirect(new URL(next, request.url));
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(new URL('/auth/auth-code-error', request.url));
}
