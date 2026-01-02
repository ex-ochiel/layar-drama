import { Suspense } from "react";
import { searchDrama, getLatest } from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import { Search, Film, Loader2 } from "lucide-react";

// Mock data for fallback
const mockSearchResults = [
    {
        id: "1",
        title: "Vincenzo",
        thumbnail: "/posters/vincenzo.png",
        rating: "9.2",
        year: "2021",
        genres: ["Crime", "Comedy"],
        status: "completed" as const,
    },
    {
        id: "2",
        title: "Crash Landing on You",
        thumbnail: "/posters/crash-landing.png",
        rating: "9.4",
        year: "2020",
        genres: ["Romance", "Comedy"],
        status: "completed" as const,
    },
    {
        id: "3",
        title: "Squid Game",
        thumbnail: "/posters/squid-game.png",
        rating: "8.8",
        year: "2021",
        genres: ["Thriller", "Drama"],
        status: "completed" as const,
    },
    {
        id: "4",
        title: "All of Us Are Dead",
        thumbnail: "/posters/all-of-us-are-dead.png",
        rating: "8.5",
        year: "2022",
        genres: ["Horror", "Action"],
        status: "completed" as const,
    },
    {
        id: "5",
        title: "Business Proposal",
        thumbnail: "/posters/business-proposal.png",
        rating: "8.7",
        year: "2022",
        genres: ["Romance", "Comedy"],
        status: "completed" as const,
    },
    {
        id: "6",
        title: "Hometown Cha-Cha-Cha",
        thumbnail: "/posters/hometown-cha-cha-cha.png",
        rating: "8.9",
        year: "2021",
        genres: ["Romance", "Comedy"],
        status: "completed" as const,
    },
];

interface SearchPageProps {
    searchParams: Promise<{ q?: string; genre?: string; sort?: string }>;
}

async function SearchResults({ query }: { query: string }) {
    let results = await searchDrama(query);

    // Use mock data if API returns empty
    if (results.length === 0 && query) {
        results = mockSearchResults.filter((d) =>
            d.title.toLowerCase().includes(query.toLowerCase())
        );
    }

    if (results.length === 0) {
        return (
            <div className="text-center py-20">
                <Film className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                <p className="text-gray-400">
                    Try searching with different keywords or browse our collection.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((drama, index) => (
                <div
                    key={drama.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <MovieCard drama={drama} />
                </div>
            ))}
        </div>
    );
}

async function BrowseAll() {
    let dramas = await getLatest();

    if (dramas.length === 0) {
        dramas = mockSearchResults;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {dramas.map((drama, index) => (
                <div
                    key={drama.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <MovieCard drama={drama} />
                </div>
            ))}
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden bg-zinc-900">
                    <div className="aspect-[2/3] animate-shimmer" />
                    <div className="p-3 space-y-2">
                        <div className="h-4 bg-zinc-800 rounded animate-shimmer" />
                        <div className="h-3 bg-zinc-800 rounded w-2/3 animate-shimmer" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const query = params.q || "";

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Search className="w-6 h-6 text-rose-500" />
                        <h1 className="text-3xl font-bold text-white">
                            {query ? `Search: "${query}"` : "Browse Dramas"}
                        </h1>
                    </div>
                    {query && (
                        <p className="text-gray-400">Showing results for your search</p>
                    )}
                </div>

                {/* Search Form */}
                <form action="/search" method="GET" className="mb-8">
                    <div className="relative max-w-xl">
                        <input
                            type="text"
                            name="q"
                            defaultValue={query}
                            placeholder="Search for dramas, actors, genres..."
                            className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* Results */}
                <Suspense fallback={<LoadingSkeleton />}>
                    {query ? <SearchResults query={query} /> : <BrowseAll />}
                </Suspense>
            </div>
        </div>
    );
}
