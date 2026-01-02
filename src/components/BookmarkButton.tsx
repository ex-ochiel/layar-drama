"use client";

import { Heart } from "lucide-react";
import { useBookmarks } from "@/context/BookmarkContext";
import { Drama } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
    drama: Drama;
    className?: string;
    showLabel?: boolean;
}

export default function BookmarkButton({
    drama,
    className,
    showLabel = false,
}: BookmarkButtonProps) {
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const dramaId = drama.endpoint || drama.id;
    const bookmarked = isBookmarked(dramaId);

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark(drama);
            }}
            className={cn(
                "flex items-center gap-2 transition-all",
                bookmarked
                    ? "text-rose-500"
                    : "text-gray-400 hover:text-rose-400",
                className
            )}
            title={bookmarked ? "Remove from My List" : "Add to My List"}
        >
            <Heart
                className={cn(
                    "w-5 h-5 transition-all",
                    bookmarked && "fill-current scale-110"
                )}
            />
            {showLabel && (
                <span className="text-sm font-medium">
                    {bookmarked ? "In My List" : "Add to List"}
                </span>
            )}
        </button>
    );
}
