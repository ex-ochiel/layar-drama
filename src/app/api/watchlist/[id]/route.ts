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

// DELETE /api/watchlist/[id] - Remove drama from watchlist
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { user, error: authError, supabase: supabaseServer } = await getAuthenticatedUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: dramaId } = await params;

    if (!dramaId) {
        return NextResponse.json({ error: 'Drama ID is required' }, { status: 400 });
    }

    // Delete by drama_id (UUID) for the current user
    const { error } = await supabaseServer
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('drama_id', dramaId);

    if (error) {
        console.error('Error removing from watchlist:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
}
