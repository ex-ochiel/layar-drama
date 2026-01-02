"use client";

import { Heart, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useBookmarks } from "@/context/BookmarkContext";
import { Drama } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DetailActionsProps {
    drama: Drama;
    slug: string;
    firstEpisode?: number;
}

export default function DetailActions({ drama, slug, firstEpisode = 1 }: DetailActionsProps) {
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const dramaId = drama.endpoint || drama.id;
    const bookmarked = isBookmarked(dramaId);

    return (
        <div className="flex flex-wrap gap-3 mb-8">
            <Link
                href={`/watch/${encodeURIComponent(slug)}/${firstEpisode}`}
                className="flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition-colors"
            >
                <PlayCircle className="w-5 h-5" />
                Watch Episode {firstEpisode}
            </Link>

            <button
                onClick={() => toggleBookmark(drama)}
                className={cn(
                    "flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all",
                    bookmarked
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30"
                        : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                )}
            >
                <Heart
                    className={cn(
                        "w-5 h-5 transition-transform",
                        bookmarked && "fill-current scale-110"
                    )}
                />
                {bookmarked ? "In My List" : "Add to List"}
            </button>
        </div>
    );
}
