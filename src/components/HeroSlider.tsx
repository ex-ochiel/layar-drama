"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Star, Info } from "lucide-react";
import { Drama } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HeroSliderProps {
    dramas: Drama[];
}

export default function HeroSlider({ dramas }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const slides = dramas.slice(0, 5); // Only show top 5

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (!isAutoPlaying || slides.length <= 1) return;
        const interval = setInterval(nextSlide, 6000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide, slides.length]);

    if (slides.length === 0) {
        return (
            <div className="relative h-[70vh] min-h-[500px] bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">
                <div className="text-center text-gray-400">
                    <p className="text-xl">No featured content available</p>
                </div>
            </div>
        );
    }

    const currentDrama = slides[currentIndex];
    const dramaId = currentDrama.endpoint || currentDrama.id;

    return (
        <div
            className="relative h-[70vh] min-h-[500px] overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Slides */}
            {slides.map((drama, index) => (
                <div
                    key={drama.id}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-1000",
                        index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                    )}
                >
                    {/* Background Image */}
                    <Image
                        src={drama.thumbnail || "/placeholder-hero.png"}
                        alt={drama.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
                </div>
            ))}

            {/* Content */}
            <div className="absolute inset-0 z-20 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                        {/* Badge */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                                Featured
                            </span>
                            {currentDrama.rating && (
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-sm font-medium">{currentDrama.rating}</span>
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                            {currentDrama.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 mb-4 text-gray-300 text-sm">
                            {currentDrama.year && <span>{currentDrama.year}</span>}
                            {currentDrama.genres && currentDrama.genres.length > 0 && (
                                <>
                                    <span className="w-1 h-1 bg-gray-500 rounded-full" />
                                    <span>{currentDrama.genres.slice(0, 3).join(" • ")}</span>
                                </>
                            )}
                            {currentDrama.status && (
                                <>
                                    <span className="w-1 h-1 bg-gray-500 rounded-full" />
                                    <span
                                        className={cn(
                                            "capitalize",
                                            currentDrama.status === "ongoing" && "text-green-400"
                                        )}
                                    >
                                        {currentDrama.status}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        {currentDrama.description && (
                            <p className="text-gray-300 text-base md:text-lg mb-6 line-clamp-3">
                                {currentDrama.description}
                            </p>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href={`/drama/${encodeURIComponent(dramaId)}`}
                                className="flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition-colors"
                            >
                                <Play className="w-5 h-5 fill-white" />
                                Watch Now
                            </Link>
                            <Link
                                href={`/drama/${encodeURIComponent(dramaId)}`}
                                className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg backdrop-blur-sm transition-colors"
                            >
                                <Info className="w-5 h-5" />
                                More Info
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}

            {/* Dots Navigation */}
            {slides.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                index === currentIndex
                                    ? "bg-rose-500 w-8"
                                    : "bg-white/50 hover:bg-white/80"
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
