// Types for Drama Streaming API

export interface Drama {
    id: string;
    title: string;
    thumbnail: string;
    rating?: string;
    year?: string;
    genres?: string[];
    status?: "ongoing" | "completed";
    description?: string;
    endpoint?: string; // legacy field, same as slug
    slug?: string; // URL-friendly identifier
    country?: string;
}

export interface Episode {
    id: string;
    number: number;
    title: string;
    endpoint: string;
}

export interface DramaDetail extends Drama {
    synopsis: string;
    episodes: Episode[];
    cast?: string[];
    director?: string;
    country?: string;
    duration?: string;
}

export interface StreamSource {
    url: string;
    quality?: string;
    server?: string;
}

export interface Actor {
    id: string;
    name: string;
    slug: string;
    photo: string; // URL to photo
    birthDate?: string;
    birthPlace?: string;
    biography?: string;
    knownFor: string[]; // Drama IDs
}

export interface ApiResponse<T> {
    status: boolean;
    data: T;
    message?: string;
}
