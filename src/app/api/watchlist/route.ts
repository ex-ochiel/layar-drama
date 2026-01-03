import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
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

// GET /api/watchlist - Get user's watchlist
export async function GET() {
    const { user, error: authError, supabase: supabaseServer } = await getAuthenticatedUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseServer
        .from('watchlist')
        .select(`
      id,
      created_at,
      drama_id,
      dramas (
        id,
        title,
        slug,
        thumbnail,
        rating,
        year,
        status,
        country,
        description,
        genres
      )
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching watchlist:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform to return drama objects directly
    const watchlist = data?.map((item: any) => ({
        ...item.dramas,
        watchlist_id: item.id, // Keep reference to watchlist entry if needed for deletion
    })) || [];

    return NextResponse.json(watchlist);
}

// POST /api/watchlist - Add drama to watchlist
export async function POST(request: Request) {
    const { user, error: authError, supabase: supabaseServer } = await getAuthenticatedUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { drama_id } = await request.json();

        if (!drama_id) {
            return NextResponse.json({ error: 'drama_id is required' }, { status: 400 });
        }

        const { data, error } = await supabaseServer
            .from('watchlist')
            .insert({ user_id: user.id, drama_id })
            .select()
            .single();

        if (error) {
            // Check if it's a duplicate entry error
            if (error.code === '23505') {
                return NextResponse.json({ error: 'Drama already in watchlist' }, { status: 409 });
            }
            console.error('Error adding to watchlist:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}
