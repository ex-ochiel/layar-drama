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

// GET /api/reviews?drama_id=xxx - Get reviews for a drama
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dramaId = searchParams.get('drama_id');

    if (!dramaId) {
        return NextResponse.json({ error: 'drama_id is required' }, { status: 400 });
    }

    const { supabase } = await getAuthenticatedUser();

    // Fetch reviews with user profiles
    const { data, error } = await supabase
        .from('reviews')
        .select(`
      id,
      rating,
      comment,
      created_at,
      user_id,
      profiles (
        username,
        full_name,
        avatar_url
      )
    `)
        .eq('drama_id', dramaId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data to include user info
    const reviews = data?.map((review: any) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at,
        user_id: review.user_id,
        user: {
            name: review.profiles?.full_name || review.profiles?.username || 'Anonymous',
            avatar: review.profiles?.avatar_url || null,
        }
    })) || [];

    // Calculate average rating
    const totalRatings = reviews.length;
    const averageRating = totalRatings > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalRatings
        : 0;

    return NextResponse.json({
        reviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: totalRatings,
    });
}

// POST /api/reviews - Add a review
export async function POST(request: Request) {
    const { user, error: authError, supabase } = await getAuthenticatedUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { drama_id, rating, comment } = await request.json();

        if (!drama_id || !rating) {
            return NextResponse.json({ error: 'drama_id and rating are required' }, { status: 400 });
        }

        if (rating < 1 || rating > 10) {
            return NextResponse.json({ error: 'Rating must be between 1 and 10' }, { status: 400 });
        }

        // Check if user already reviewed this drama
        const { data: existing } = await supabase
            .from('reviews')
            .select('id')
            .eq('user_id', user.id)
            .eq('drama_id', drama_id)
            .single();

        if (existing) {
            // Update existing review
            const { data, error } = await supabase
                .from('reviews')
                .update({ rating, comment, created_at: new Date().toISOString() })
                .eq('id', existing.id)
                .select()
                .single();

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            return NextResponse.json(data);
        }

        // Create new review
        const { data, error } = await supabase
            .from('reviews')
            .insert({ user_id: user.id, drama_id, rating, comment })
            .select()
            .single();

        if (error) {
            console.error('Error adding review:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}

// DELETE /api/reviews?id=xxx - Delete a review
export async function DELETE(request: Request) {
    const { user, error: authError, supabase } = await getAuthenticatedUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('id');

    if (!reviewId) {
        return NextResponse.json({ error: 'Review id is required' }, { status: 400 });
    }

    // Only allow deleting own reviews
    const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id);

    if (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
