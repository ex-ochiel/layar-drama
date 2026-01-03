import { Drama, Actor, DramaDetail } from './types';
import { mockDramas } from './mockData'; // Fallback / Types reference

// Use absolute URL during build, relative during runtime
const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        // Client-side
        return '/api';
    }
    // Server-side / Build time
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // During build, return empty and use mock data
        return '';
    }
    return '/api';
};

const API_BASE_URL = getBaseUrl();

export async function getDramas(filters?: { search?: string; status?: string; country?: string; year?: string }): Promise<Drama[]> {
    // During build time, return mock data
    if (!API_BASE_URL) {
        let result = mockDramas;
        if (filters?.search) {
            result = result.filter(d => d.title.toLowerCase().includes(filters.search!.toLowerCase()));
        }
        return result;
    }

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
        return mockDramas; // Fallback to mock data
    }
}

// Search dramas by query
export async function searchDrama(query: string): Promise<Drama[]> {
    return getDramas({ search: query });
}

export async function getTrendingDramas(): Promise<Drama[]> {
    try {
        // For now, trending is just top rated or random. Let's just fetch all and slice or sort.
        // Ideally backend endpoint /api/dramas/trending
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
        // Return dramas sorted by year (newest first)
        return allDramas.sort((a, b) => parseInt(b.year || "0") - parseInt(a.year || "0")).slice(0, 12);
    } catch (e) {
        return [];
    }
}

// Alias for getLatestDramas
export const getLatest = getLatestDramas;

export async function getDramaById(id: string): Promise<Drama | undefined> {
    // id here is actually the slug/endpoint
    try {
        const res = await fetch(`${API_BASE_URL}/dramas/${id}`);
        if (!res.ok) {
            if (res.status === 404) return undefined;
            throw new Error('Failed to fetch drama details');
        }
        return await res.json();
    } catch (error) {
        console.error(`API Error (getDramaById ${id}):`, error);
        return undefined;
    }
}

// Alias for getDramaById - returns full drama detail including cast
export async function getDramaDetail(slug: string): Promise<DramaDetail | null> {
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
    try {
        const res = await fetch(`${API_BASE_URL}/actors`);
        if (!res.ok) throw new Error('Failed to fetch actors');
        return await res.json();
    } catch (error) {
        console.error("API Error (getActors):", error);
        return [];
    }
}

// These client-side only functions might still use localStorage or need update to DB
// user-specific data like bookmarks and history should move to DB if user is logged in.
// For this step, we'll keep them on client or mock them for now until we fully switch Watchlist Context to use API.

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

import { StreamSource } from './types';

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
