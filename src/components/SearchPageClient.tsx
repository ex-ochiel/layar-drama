"use client";

import { useState, useMemo } from "react";
import { Search, Film, Filter, X } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import GenreFilter from "@/components/GenreFilter";
import AdvancedFilter from "@/components/AdvancedFilter";
import { Drama } from "@/lib/types";

interface SearchPageClientProps {
    initialDramas: Drama[];
    initialQuery: string;
}

export default function SearchPageClient({
    initialDramas,
    initialQuery,
}: SearchPageClientProps) {
    // Advanced Filter States
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [selectedCountry, setSelectedCountry] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedYear, setSelectedYear] = useState("all");

    const [showFilters, setShowFilters] = useState(false);

    // Filter dramas based on ALL criteria
    const filteredDramas = useMemo(() => {
        return initialDramas.filter((drama) => {
            // 1. Genre Filter
            if (selectedGenre !== "all" && !drama.genres?.some(
                (g) => g.toLowerCase() === selectedGenre.toLowerCase()
            )) {
                return false;
            }

            // 2. Country Filter
            if (selectedCountry !== "all" && drama.country !== selectedCountry) {
                return false;
            }

            // 3. Status Filter
            if (selectedStatus !== "all" && drama.status !== selectedStatus) {
                return false;
            }

            // 4. Year Filter
            if (selectedYear !== "all") {
                if (selectedYear === "older") {
                    // If "older", exclude 2020-2023 (or whatever remains in filter)
                    if (["2023", "2022", "2021", "2020"].includes(drama.year || "")) return false;
                } else if (drama.year !== selectedYear) {
                    return false;
                }
            }

            return true;
        });
    }, [initialDramas, selectedGenre, selectedCountry, selectedStatus, selectedYear]);

    // Count active filters
    const activeFiltersCount = [
        selectedGenre,
        selectedCountry,
        selectedStatus,
        selectedYear,
    ].filter((v) => v !== "all").length;

    const resetFilters = () => {
        setSelectedGenre("all");
        setSelectedCountry("all");
        setSelectedStatus("all");
        setSelectedYear("all");
    };

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
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all",
                            (showFilters || activeFiltersCount > 0) && "ring-2 ring-rose-500/50"
                        )}
                    >
                        <Filter className={cn("w-4 h-4", activeFiltersCount > 0 && "text-rose-400")} />
                        <span>Filters</span>
                        {activeFiltersCount > 0 && (
                            <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {activeFiltersCount}
                            </span>
                        )}
                        <span
                            className={`transition-transform text-gray-400 ${showFilters ? "rotate-180" : ""}`}
                        >
                            ▼
                        </span>
                    </button>

                    {activeFiltersCount > 0 && (
                        <button
                            onClick={resetFilters}
                            className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                        >
                            <X className="w-3 h-3" />
                            Clear all
                        </button>
                    )}
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="mb-8 p-6 bg-zinc-900/80 backdrop-blur rounded-2xl border border-white/10 animate-fade-in shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* 1. Genre */}
                            <div className="col-span-1 md:col-span-2 lg:col-span-4 border-b border-white/10 pb-6 mb-2">
                                <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                                    Main Genre
                                </h3>
                                <GenreFilter
                                    selectedGenre={selectedGenre}
                                    onGenreChange={setSelectedGenre}
                                />
                            </div>

                            {/* 2. Advanced Filters */}
                            <div className="col-span-1 md:col-span-2 lg:col-span-4">
                                <AdvancedFilter
                                    selectedCountry={selectedCountry}
                                    onCountryChange={setSelectedCountry}
                                    selectedStatus={selectedStatus}
                                    onStatusChange={setSelectedStatus}
                                    selectedYear={selectedYear}
                                    onYearChange={setSelectedYear}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div className="mb-4 text-gray-400 text-sm flex items-center gap-2">
                    <span>Found {filteredDramas.length} drama{filteredDramas.length !== 1 ? "s" : ""}</span>
                    {activeFiltersCount > 0 && <span className="text-rose-500 font-medium">(Filtered)</span>}
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
                    <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-white/5 mx-auto max-w-2xl">
                        <Film className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">
                            No matching dramas found
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Adjust your filters to see more results.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper for conditional classes
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}
