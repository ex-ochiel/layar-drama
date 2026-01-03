import { Drama, Actor, DramaDetail, StreamSource } from './types';
import { mockDramas } from './mockData';
import { supabase } from './supabaseClient';

// Use absolute URL during build, relative during runtime
const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return '/api';
    }
    // Server-side: we should not use this for internal API calls during build.
    // We will use direct DB calls instead.
    return '';
};

const API_BASE_URL = getBaseUrl();

export async function getDramas(filters?: { search?: string; status?: string; country?: string; year?: string }): Promise<Drama[]> {
    // Server-side / Build time: Use direct DB call
    if (typeof window === 'undefined') {
        try {
            // Check if supabase client is valid (it might be empty string during build if env missing)
            let query = supabase.from('dramas').select('*');

            if (filters?.search) query = query.ilike('title', `%${filters.search}%`);
            if (filters?.status && filters.status !== 'All') query = query.eq('status', filters.status);
            if (filters?.country && filters.country !== 'All') query = query.eq('country', filters.country);
            if (filters?.year && filters.year !== 'All') query = query.eq('year', parseInt(filters.year));

            const { data, error } = await query;
            if (error) throw error;
            return data as Drama[];
        } catch (error) {
            console.error("DB Error (getDramas):", error);
            // Fallback to mock data if DB fails
            let result = mockDramas;
            if (filters?.search) {
                result = result.filter(d => d.title.toLowerCase().includes(filters.search!.toLowerCase()));
            }
            return result;
        }
    }

    // Client-side: Fetch via API route
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters?.country && filters.country !== 'All') params.append('country', filters.country);
    if (filters?.year && filters.year !== 'All') params.append('year', filters.year);

    try {
        const res = await fetch(`${API_BASE_URL}/dramas?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch dramas');
        return await res.json();
    } catch (error) {
        console.error("API Error (getDramas):", error);
        return [];
    }
}

// Search dramas by query
export async function searchDrama(query: string): Promise<Drama[]> {
    return getDramas({ search: query });
}

export async function getTrendingDramas(): Promise<Drama[]> {
    try {
        const allDramas = await getDramas();
        return allDramas.sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0")).slice(0, 5);
    } catch (e) {
        return [];
    }
}

// Alias for getTrendingDramas
export const getTrending = getTrendingDramas;

export async function getLatestDramas(): Promise<Drama[]> {
    try {
        const allDramas = await getDramas();
        return allDramas.sort((a, b) => parseInt(b.year || "0") - parseInt(a.year || "0")).slice(0, 12);
    } catch (e) {
        return [];
    }
}

// Alias for getLatestDramas
export const getLatest = getLatestDramas;

export async function getDramaById(id: string): Promise<Drama | undefined> {
    // id here is actually the slug/endpoint
    return (await getDramaDetail(id)) || undefined;
}

// Alias for getDramaById - returns full drama detail including cast
export async function getDramaDetail(slug: string): Promise<DramaDetail | null> {
    // Server-side / Build time: Use direct DB call
    if (typeof window === 'undefined') {
        try {
            // First fetch drama detail
            const { data: drama, error: dramaError } = await supabase
                .from('dramas')
                .select('*')
                .eq('endpoint', slug)
                .single();

            if (dramaError && dramaError.code !== 'PGRST116') throw dramaError;
            if (!drama) return null;

            // Then fetch associated actors via drama_actors join table
            const { data: actorsData, error: actorsError } = await supabase
                .from('drama_actors')
                .select(`
                    actors (
                        id,
                        name,
                        slug,
                        photo
                    )
                `)
                .eq('drama_id', drama.id);

            if (actorsError) throw actorsError;

            // Transform actors data
            const actors = actorsData.map((item: any) => ({
                id: item.actors.id,
                name: item.actors.name,
                slug: item.actors.slug,
                photo: item.actors.photo,
                character: "Main Role", // Placeholder
                role: "Main Cast" // Placeholder
            }));

            // Generate mock episodes for now (since we don't have episodes table yet)
            // or we could add episodes table later.
            const episodes = Array.from({ length: 16 }, (_, i) => ({
                id: `${slug}-ep-${i + 1}`,
                number: i + 1,
                title: `Episode ${i + 1}`,
                endpoint: `${slug}-ep-${i + 1}`,
            }));

            return {
                ...drama,
                cast: actors,
                episodes
            };

        } catch (error) {
            console.error(`DB Error (getDramaDetail ${slug}):`, error);
            return null;
        }
    }

    // Client-side: use API
    try {
        const res = await fetch(`${API_BASE_URL}/dramas/${slug}`);
        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error('Failed to fetch drama details');
        }
        return await res.json();
    } catch (error) {
        console.error(`API Error (getDramaDetail ${slug}):`, error);
        return null;
    }
}

export async function getActors(): Promise<Actor[]> {
    // Server-side
    if (typeof window === 'undefined') {
        try {
            const { data, error } = await supabase.from('actors').select('*');
            if (error) throw error;
            return data as Actor[];
        } catch (error) {
            console.error("DB Error (getActors):", error);
            return [];
        }
    }

    try {
        const res = await fetch(`${API_BASE_URL}/actors`);
        if (!res.ok) throw new Error('Failed to fetch actors');
        return await res.json();
    } catch (error) {
        console.error("API Error (getActors):", error);
        return [];
    }
}

interface ReviewResponse {
    reviews: {
        id: string;
        rating: number;
        comment: string;
        created_at: string;
        user_id: string;
        user: {
            name: string;
            avatar: string | null;
        };
    }[];
    averageRating: number;
    totalReviews: number;
}

export async function getReviews(dramaId: string): Promise<ReviewResponse> {
    try {
        const res = await fetch(`${API_BASE_URL}/reviews?drama_id=${dramaId}`);
        if (!res.ok) throw new Error('Failed to fetch reviews');
        return await res.json();
    } catch (error) {
        console.error("API Error (getReviews):", error);
        return { reviews: [], averageRating: 0, totalReviews: 0 };
    }
}

// Get stream source for an episode (placeholder for now)
export async function getStreamSource(episodeId: string): Promise<StreamSource | null> {
    // This would fetch from an actual streaming API
    // For now, return a mock/placeholder
    return {
        url: `https://www.youtube.com/embed/dQw4w9WgXcQ`,
        quality: "HD",
        server: "Default",
    };
}
