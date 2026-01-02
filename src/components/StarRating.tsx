"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useRating } from "@/context/RatingContext";
import { cn } from "@/lib/utils";

interface StarRatingProps {
    dramaId: string;
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
    readonly?: boolean;
}

const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
};

export default function StarRating({
    dramaId,
    size = "md",
    showLabel = false,
    readonly = false,
}: StarRatingProps) {
    const { getRating, setRating } = useRating();
    const [hoverRating, setHoverRating] = useState(0);
    const currentRating = getRating(dramaId) || 0;
    const displayRating = hoverRating || currentRating;

    const handleClick = (rating: number) => {
        if (!readonly) {
            setRating(dramaId, rating);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <div
                className={cn("flex gap-0.5", !readonly && "cursor-pointer")}
                onMouseLeave={() => setHoverRating(0)}
            >
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={readonly}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => !readonly && setHoverRating(star)}
                        className={cn(
                            "transition-transform",
                            !readonly && "hover:scale-110"
                        )}
                    >
                        <Star
                            className={cn(
                                sizeClasses[size],
                                "transition-colors",
                                star <= displayRating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-600"
                            )}
                        />
                    </button>
                ))}
            </div>
            {showLabel && currentRating > 0 && (
                <span className="text-sm text-yellow-400 font-medium">
                    {currentRating}/5
                </span>
            )}
            {showLabel && currentRating === 0 && !readonly && (
                <span className="text-sm text-gray-500">Rate this</span>
            )}
        </div>
    );
}
