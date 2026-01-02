"use client";

import { useState, useMemo } from "react";
import { Search, Film, Filter } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import GenreFilter from "@/components/GenreFilter";
import { Drama } from "@/lib/types";

interface SearchPageClientProps {
    initialDramas: Drama[];
    initialQuery: string;
}

export default function SearchPageClient({
    initialDramas,
    initialQuery,
}: SearchPageClientProps) {
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    // Filter dramas by selected genre
    const filteredDramas = useMemo(() => {
        if (selectedGenre === "all") {
            return initialDramas;
        }
        return initialDramas.filter((drama) =>
            drama.genres?.some(
                (genre) => genre.toLowerCase() === selectedGenre.toLowerCase()
            )
        );
    }, [initialDramas, selectedGenre]);

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Search className="w-6 h-6 text-rose-500" />
                        <h1 className="text-3xl font-bold text-white">
                            {initialQuery ? `Search: "${initialQuery}"` : "Browse Dramas"}
                        </h1>
                    </div>
                    {initialQuery && (
                        <p className="text-gray-400">Showing results for your search</p>
                    )}
                </div>

                {/* Search Form */}
                <form action="/search" method="GET" className="mb-6">
                    <div className="relative max-w-xl">
                        <input
                            type="text"
                            name="q"
                            defaultValue={initialQuery}
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

                {/* Filter Toggle Button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 mb-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                >
                    <Filter className="w-4 h-4" />
                    <span>Filter by Genre</span>
                    <span
                        className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
                    >
                        ▼
                    </span>
                </button>

                {/* Genre Filter */}
                {showFilters && (
                    <div className="mb-8 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 animate-fade-in">
                        <h3 className="text-sm font-medium text-gray-400 mb-3">
                            Select Genre
                        </h3>
                        <GenreFilter
                            selectedGenre={selectedGenre}
                            onGenreChange={setSelectedGenre}
                        />
                    </div>
                )}

                {/* Results Count */}
                <div className="mb-4 text-gray-400 text-sm">
                    Showing {filteredDramas.length} drama{filteredDramas.length !== 1 ? "s" : ""}
                    {selectedGenre !== "all" && (
                        <span className="text-rose-400"> in {selectedGenre}</span>
                    )}
                </div>

                {/* Results Grid */}
                {filteredDramas.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {filteredDramas.map((drama, index) => (
                            <div
                                key={drama.id}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <MovieCard drama={drama} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Film className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">
                            No dramas found
                        </h3>
                        <p className="text-gray-400">
                            {selectedGenre !== "all"
                                ? `No dramas found in "${selectedGenre}" genre. Try another genre.`
                                : "Try searching with different keywords."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
