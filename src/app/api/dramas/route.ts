import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const country = searchParams.get('country');
    const year = searchParams.get('year');

    let query = supabase.from('dramas').select('*');

    if (search) {
        query = query.ilike('title', `%${search}%`);
    }

    if (status) {
        query = query.eq('status', status);
    }

    if (country) {
        if (country !== 'All') {
            query = query.eq('country', country);
        }
    }

    if (year) {
        if (year !== 'All') {
            query = query.eq('year', parseInt(year));
        }
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
