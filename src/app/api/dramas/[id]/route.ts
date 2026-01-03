import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: slug } = await params; // Next.js 15+ syntax for params

    if (!slug) {
        return NextResponse.json({ error: 'Drama ID is required' }, { status: 400 });
    }

    // Fetch drama details
    const { data: drama, error: dramaError } = await supabase
        .from('dramas')
        .select('*')
        .eq('slug', slug)
        .single();

    if (dramaError || !drama) {
        return NextResponse.json({ error: dramaError?.message || 'Drama not found' }, { status: 404 });
    }

    // Fetch actors associated with this drama
    // We join through the junction table which is a bit complex in Supabase JS syntax if not defining foreign keys strictly for nested select.
    // Standard way: select('*, actors(*)') if FK exists.
    // Our schema defined relations: drama_actors table links drama_id to dramas.id and actor_id to actors.id
    // So we can query drama_actors(actor_id, actors(*))

    const { data: actorsData, error: actorsError } = await supabase
        .from('drama_actors')
        .select(`
      actor_id,
      actors (
        id,
        name,
        slug,
        photo,
        birth_date,
        birth_place,
        biography
      )
    `)
        .eq('drama_id', drama.id);

    if (actorsError) {
        console.error("Error fetching actors:", actorsError);
        // We don't fail the whole request if actors fail, just return empty cast
    }

    // Transform the expected format
    const cast = actorsData?.map((item: any) => item.actors) || [];

    return NextResponse.json({ ...drama, cast });
}
