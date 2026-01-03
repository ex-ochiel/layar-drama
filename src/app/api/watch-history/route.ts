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

// GET /api/watch-history - Get user's watch history
export async function GET() {
    const { user, error: authError, supabase } = await getAuthenticatedUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('watch_history')
        .select('*')
        .eq('user_id', user.id)
        .order('last_watched', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Error fetching watch history:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform to match expected format
    const history = data?.map((item: any) => ({
        dramaId: item.drama_id,
        dramaTitle: item.drama_title,
        dramaThumbnail: item.drama_thumbnail,
        lastEpisode: item.last_episode,
        totalEpisodes: item.total_episodes,
        lastWatched: new Date(item.last_watched).getTime(),
    })) || [];

    return NextResponse.json(history);
}

// POST /api/watch-history - Add/Update watch history
export async function POST(request: Request) {
    const { user, error: authError, supabase } = await getAuthenticatedUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { drama_id, drama_title, drama_thumbnail, last_episode, total_episodes } = await request.json();

        if (!drama_id || !drama_title) {
            return NextResponse.json({ error: 'drama_id and drama_title are required' }, { status: 400 });
        }

        // Upsert - update if exists, insert if not
        const { data, error } = await supabase
            .from('watch_history')
            .upsert({
                user_id: user.id,
                drama_id,
                drama_title,
                drama_thumbnail,
                last_episode: last_episode || 1,
                total_episodes,
                last_watched: new Date().toISOString(),
            }, { onConflict: 'user_id,drama_id' })
            .select()
            .single();

        if (error) {
            console.error('Error updating watch history:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}

// DELETE /api/watch-history?drama_id=xxx - Remove from watch history
export async function DELETE(request: Request) {
    const { user, error: authError, supabase } = await getAuthenticatedUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dramaId = searchParams.get('drama_id');

    if (!dramaId) {
        return NextResponse.json({ error: 'drama_id is required' }, { status: 400 });
    }

    const { error } = await supabase
        .from('watch_history')
        .delete()
        .eq('user_id', user.id)
        .eq('drama_id', dramaId);

    if (error) {
        console.error('Error removing from watch history:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
