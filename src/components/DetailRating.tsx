"use client";

import StarRating from "./StarRating";

interface DetailRatingProps {
    dramaId: string;
}

export default function DetailRating({ dramaId }: DetailRatingProps) {
    return (
        <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">Rate this drama</p>
                <StarRating dramaId={dramaId} size="lg" showLabel />
            </div>
        </div>
    );
}
