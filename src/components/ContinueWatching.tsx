"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Play, X, Clock } from "lucide-react";
import { useWatchHistory } from "@/context/WatchHistoryContext";
import { cn } from "@/lib/utils";

export default function ContinueWatching() {
    const { history, removeFromHistory } = useWatchHistory();
    const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

    if (history.length === 0) {
        return null;
    }

    const handleImgError = (dramaId: string) => {
        setImgErrors((prev) => ({ ...prev, [dramaId]: true }));
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-purple-500" />
                <h2 className="text-2xl font-bold text-white">Continue Watching</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {history.slice(0, 6).map((item) => (
                    <div
                        key={item.dramaId}
                        className="group relative rounded-xl overflow-hidden bg-zinc-900"
                    >
                        <Link href={`/watch/${encodeURIComponent(item.dramaId)}/${item.lastEpisode}`}>
                            {/* Thumbnail */}
                            <div className="relative aspect-[2/3] overflow-hidden">
                                <Image
                                    src={imgErrors[item.dramaId] ? "/placeholder-movie.png" : (item.dramaThumbnail || "/placeholder-movie.png")}
                                    alt={item.dramaTitle}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                    onError={() => handleImgError(item.dramaId)}
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                {/* Play Icon */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-14 h-14 rounded-full bg-purple-500/90 flex items-center justify-center backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
                                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                                    </div>
                                </div>

                                {/* Episode Badge */}
                                <div className="absolute bottom-2 left-2 right-2">
                                    <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2">
                                        <p className="text-xs text-purple-400 font-medium">
                                            Episode {item.lastEpisode}
                                            {item.totalEpisodes && (
                                                <span className="text-gray-500"> / {item.totalEpisodes}</span>
                                            )}
                                        </p>
                                        {/* Progress Bar */}
                                        {item.totalEpisodes && (
                                            <div className="mt-1 h-1 bg-zinc-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-purple-500 rounded-full"
                                                    style={{
                                                        width: `${(item.lastEpisode / item.totalEpisodes) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <div className="p-3">
                                <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-purple-400 transition-colors">
                                    {item.dramaTitle}
                                </h3>
                            </div>
                        </Link>

                        {/* Remove Button */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeFromHistory(item.dramaId);
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                            title="Remove from history"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
