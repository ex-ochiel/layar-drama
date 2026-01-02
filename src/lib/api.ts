import { Drama, DramaDetail, StreamSource, ApiResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.sansekai.my.id";

/**
 * Fetches trending/home dramas
 */
export async function getTrending(): Promise<Drama[]> {
    try {
        const res = await fetch(`${BASE_URL}/dramabox/home`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });
        if (!res.ok) throw new Error("Failed to fetch trending dramas");
        const json: ApiResponse<{ trending?: Drama[]; latest?: Drama[] }> = await res.json();
        return json.data?.trending || json.data?.latest || [];
    } catch (error) {
        console.error("Error fetching trending:", error);
        return [];
    }
}

/**
 * Fetches latest released dramas
 */
export async function getLatest(): Promise<Drama[]> {
    try {
        const res = await fetch(`${BASE_URL}/dramabox/latest`, {
            next: { revalidate: 1800 }, // Cache for 30 minutes
        });
        if (!res.ok) throw new Error("Failed to fetch latest dramas");
        const json: ApiResponse<Drama[]> = await res.json();
        return json.data || [];
    } catch (error) {
        console.error("Error fetching latest:", error);
        return [];
    }
}

/**
 * Search dramas by query
 */
export async function searchDrama(query: string): Promise<Drama[]> {
    try {
        const res = await fetch(`${BASE_URL}/dramabox/search?q=${encodeURIComponent(query)}`, {
            cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to search dramas");
        const json: ApiResponse<Drama[]> = await res.json();
        return json.data || [];
    } catch (error) {
        console.error("Error searching dramas:", error);
        return [];
    }
}

/**
 * Fetches drama details by ID/slug
 */
export async function getDramaDetail(id: string): Promise<DramaDetail | null> {
    try {
        const res = await fetch(`${BASE_URL}/dramabox/detail?id=${encodeURIComponent(id)}`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) throw new Error("Failed to fetch drama detail");
        const json: ApiResponse<DramaDetail> = await res.json();
        return json.data || null;
    } catch (error) {
        console.error("Error fetching drama detail:", error);
        return null;
    }
}

/**
 * Gets stream source for an episode
 */
export async function getStreamSource(episodeId: string): Promise<StreamSource | null> {
    try {
        const res = await fetch(`${BASE_URL}/dramabox/stream?id=${encodeURIComponent(episodeId)}`, {
            cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch stream source");
        const json: ApiResponse<StreamSource> = await res.json();
        return json.data || null;
    } catch (error) {
        console.error("Error fetching stream source:", error);
        return null;
    }
}
