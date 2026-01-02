"use client";

import { useState } from "react";
import { AlertCircle, RefreshCw, Server } from "lucide-react";
import { StreamSource } from "@/lib/types";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
    streamSource: StreamSource | null;
    title?: string;
    alternativeSources?: StreamSource[];
}

export default function VideoPlayer({
    streamSource,
    title,
    alternativeSources = [],
}: VideoPlayerProps) {
    const [currentSource, setCurrentSource] = useState<StreamSource | null>(
        streamSource
    );
    const [hasError, setHasError] = useState(false);

    const allSources = streamSource
        ? [streamSource, ...alternativeSources]
        : alternativeSources;

    if (!currentSource) {
        return (
            <div className="relative aspect-video bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center">
                <div className="text-center text-gray-400">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-rose-500" />
                    <p className="text-xl font-semibold">Stream Not Available</p>
                    <p className="mt-2 text-sm">
                        The video source could not be loaded. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                {hasError ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                        <div className="text-center text-gray-400">
                            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-rose-500" />
                            <p className="text-lg font-semibold">Failed to load video</p>
                            <button
                                onClick={() => {
                                    setHasError(false);
                                    // Try next source if available
                                    const currentIndex = allSources.findIndex(
                                        (s) => s.url === currentSource.url
                                    );
                                    if (currentIndex < allSources.length - 1) {
                                        setCurrentSource(allSources[currentIndex + 1]);
                                    }
                                }}
                                className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Another Server
                            </button>
                        </div>
                    </div>
                ) : (
                    <iframe
                        src={currentSource.url}
                        title={title || "Video Player"}
                        className="absolute inset-0 w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        onError={() => setHasError(true)}
                    />
                )}
            </div>

            {/* Server Selection */}
            {allSources.length > 1 && (
                <div className="mt-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Server className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-300">
                            Select Server:
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {allSources.map((source, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentSource(source);
                                    setHasError(false);
                                }}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                    currentSource.url === source.url
                                        ? "bg-rose-500 text-white"
                                        : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                                )}
                            >
                                {source.server || `Server ${index + 1}`}
                                {source.quality && (
                                    <span className="ml-2 text-xs opacity-75">
                                        ({source.quality})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
