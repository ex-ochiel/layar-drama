"use client";

import { cn } from "@/lib/utils";

const GENRES = [
    { id: "all", label: "All", icon: "🎬" },
    { id: "romance", label: "Romance", icon: "💕" },
    { id: "action", label: "Action", icon: "💥" },
    { id: "comedy", label: "Comedy", icon: "😂" },
    { id: "thriller", label: "Thriller", icon: "😱" },
    { id: "horror", label: "Horror", icon: "👻" },
    { id: "drama", label: "Drama", icon: "🎭" },
    { id: "crime", label: "Crime", icon: "🔍" },
];

interface GenreFilterProps {
    selectedGenre: string;
    onGenreChange: (genre: string) => void;
}

export default function GenreFilter({ selectedGenre, onGenreChange }: GenreFilterProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
                <button
                    key={genre.id}
                    onClick={() => onGenreChange(genre.id)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                        selectedGenre === genre.id
                            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                            : "bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white"
                    )}
                >
                    <span>{genre.icon}</span>
                    <span>{genre.label}</span>
                </button>
            ))}
        </div>
    );
}

export { GENRES };
