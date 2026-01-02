"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Play } from "lucide-react";
import { Drama } from "@/lib/types";
import { cn } from "@/lib/utils";
import BookmarkButton from "./BookmarkButton";

interface MovieCardProps {
    drama: Drama;
    className?: string;
}

export default function MovieCard({ drama, className }: MovieCardProps) {
    const dramaId = drama.endpoint || drama.id;
    const [imgError, setImgError] = useState(false);

    return (
        <Link
            href={`/drama/${encodeURIComponent(dramaId)}`}
            className={cn(
                "group relative block rounded-xl overflow-hidden bg-zinc-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/20",
                className
            )}
        >
            {/* Thumbnail */}
            <div className="relative aspect-[2/3] overflow-hidden">
                <Image
                    src={imgError ? "/placeholder-movie.png" : (drama.thumbnail || "/placeholder-movie.png")}
                    alt={drama.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    onError={() => setImgError(true)}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Play Icon on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-14 h-14 rounded-full bg-rose-500/90 flex items-center justify-center backdrop-blur-sm transform scale-75 group-hover:scale-100 transition-transform">
                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                </div>

                {/* Status Badge */}
                {drama.status && (
                    <span
                        className={cn(
                            "absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded-md",
                            drama.status === "ongoing"
                                ? "bg-green-500/80 text-white"
                                : "bg-blue-500/80 text-white"
                        )}
                    >
                        {drama.status === "ongoing" ? "Ongoing" : "Completed"}
                    </span>
                )}

                {/* Rating */}
                {drama.rating && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-medium text-white">
                            {drama.rating}
                        </span>
                    </div>
                )}

                {/* Bookmark Button */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-2 bg-black/60 rounded-full backdrop-blur-sm">
                        <BookmarkButton drama={drama} />
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="p-3">
                <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-rose-400 transition-colors">
                    {drama.title}
                </h3>
                {drama.year && (
                    <p className="text-xs text-gray-400 mt-1">{drama.year}</p>
                )}
                {drama.genres && drama.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {drama.genres.slice(0, 2).map((genre) => (
                            <span
                                key={genre}
                                className="text-[10px] px-2 py-0.5 bg-white/10 rounded-full text-gray-300"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}
