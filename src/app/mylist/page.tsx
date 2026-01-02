"use client";

import { Heart, Film } from "lucide-react";
import { useBookmarks } from "@/context/BookmarkContext";
import MovieCard from "@/components/MovieCard";

export default function MyListPage() {
    const { bookmarks } = useBookmarks();

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                        <h1 className="text-3xl font-bold text-white">My List</h1>
                    </div>
                    <p className="text-gray-400">
                        {bookmarks.length > 0
                            ? `You have ${bookmarks.length} drama${bookmarks.length > 1 ? "s" : ""} saved`
                            : "Your saved dramas will appear here"}
                    </p>
                </div>

                {/* Content */}
                {bookmarks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {bookmarks.map((drama, index) => (
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
                        <Film className="w-20 h-20 mx-auto text-gray-700 mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Your list is empty
                        </h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                            Start adding dramas to your list by clicking the heart icon on any
                            drama card. Your saved dramas will appear here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
