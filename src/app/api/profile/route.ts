import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Helper to get authenticated user on server-side
async function getAuthenticatedUser() {
    const cookieStore = await cookies();

    const supabaseServer = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                },
            },
        }
    );

    const { data: { user }, error } = await supabaseServer.auth.getUser();
    return { user, error, supabase: supabaseServer };
}

// GET /api/profile - Get current user's profile
export async function GET() {
    const { user, error: authError, supabase } = await getAuthenticatedUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get profile from profiles table
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no profile exists, return user metadata
    const profileData = profile || {
        id: user.id,
        username: null,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
    };

    return NextResponse.json({
        ...profileData,
        email: user.email,
        created_at: user.created_at,
    });
}

// PUT /api/profile - Update current user's profile
export async function PUT(request: Request) {
    const { user, error: authError, supabase } = await getAuthenticatedUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { full_name, username, avatar_url } = await request.json();

        // Update or insert profile in profiles table
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                full_name,
                username,
                avatar_url,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'id' })
            .select()
            .single();

        if (error) {
            console.error('Error updating profile:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Also update user metadata
        await supabase.auth.updateUser({
            data: {
                full_name,
                avatar_url,
            }
        });

        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}
