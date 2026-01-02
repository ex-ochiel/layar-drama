import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDramaDetail } from "@/lib/api";
import { Star, Calendar, Clock, ChevronRight, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import DetailActions from "@/components/DetailActions";
import DetailRating from "@/components/DetailRating";

// Mock data for development
const mockDramaDetail = {
    id: "vincenzo",
    title: "Vincenzo",
    thumbnail: "/posters/vincenzo.png",
    rating: "9.2",
    year: "2021",
    genres: ["Crime", "Comedy", "Romance", "Drama"],
    status: "completed" as const,
    synopsis:
        "Vincenzo Cassano is an Italian lawyer and Mafia consigliere who moves back to Korea due to a conflict within his organization. He ends up crossing paths with a sharp-tongued lawyer named Cha-young, and together they use villainous methods to take down the bad guys — especially Babel Group and its unethical medical practices.",
    episodes: Array.from({ length: 20 }, (_, i) => ({
        id: `vincenzo-ep-${i + 1}`,
        number: i + 1,
        title: `Episode ${i + 1}`,
        endpoint: `vincenzo-ep-${i + 1}`,
    })),
    cast: ["Song Joong-ki", "Jeon Yeo-been", "Ok Taec-yeon", "Kim Yeo-jin"],
    director: "Kim Hee-won",
    country: "South Korea",
    duration: "80 min/ep",
};

interface DramaDetailPageProps {
    params: Promise<{ slug: string }>;
}

export default async function DramaDetailPage({ params }: DramaDetailPageProps) {
    const { slug } = await params;
    let drama = await getDramaDetail(slug);

    // Use mock data if API returns null
    if (!drama) {
        drama = mockDramaDetail;
    }

    if (!drama) {
        notFound();
    }

    return (
        <div className="min-h-screen">
            {/* Hero Background */}
            <div className="relative h-[60vh] min-h-[400px]">
                <Image
                    src={drama.thumbnail || "/placeholder-hero.png"}
                    alt={drama.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-80">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Poster */}
                    <div className="flex-shrink-0">
                        <div className="relative w-48 md:w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                            <Image
                                src={drama.thumbnail || "/placeholder-movie.png"}
                                alt={drama.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 pt-4 lg:pt-20">
                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            {drama.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                            {drama.rating && (
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="font-semibold">{drama.rating}</span>
                                </div>
                            )}
                            {drama.year && (
                                <div className="flex items-center gap-1 text-gray-300">
                                    <Calendar className="w-4 h-4" />
                                    <span>{drama.year}</span>
                                </div>
                            )}
                            {drama.duration && (
                                <div className="flex items-center gap-1 text-gray-300">
                                    <Clock className="w-4 h-4" />
                                    <span>{drama.duration}</span>
                                </div>
                            )}
                            {drama.country && (
                                <div className="flex items-center gap-1 text-gray-300">
                                    <Globe className="w-4 h-4" />
                                    <span>{drama.country}</span>
                                </div>
                            )}
                            {drama.status && (
                                <span
                                    className={cn(
                                        "px-3 py-1 rounded-full text-xs font-semibold",
                                        drama.status === "ongoing"
                                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                    )}
                                >
                                    {drama.status === "ongoing" ? "Ongoing" : "Completed"}
                                </span>
                            )}
                        </div>

                        {/* Genres */}
                        {drama.genres && drama.genres.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {drama.genres.map((genre) => (
                                    <span
                                        key={genre}
                                        className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300 hover:bg-white/20 transition-colors cursor-pointer"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        {drama.episodes && drama.episodes.length > 0 && (
                            <DetailActions
                                drama={drama}
                                slug={slug}
                                firstEpisode={drama.episodes[0].number}
                            />
                        )}

                        {/* Synopsis */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-white mb-3">Synopsis</h2>
                            <p className="text-gray-300 leading-relaxed">{drama.synopsis}</p>
                        </div>

                        {/* User Rating */}
                        <div className="mb-8">
                            <DetailRating dramaId={slug} />
                        </div>

                        {/* Cast & Crew */}
                        {(drama.cast || drama.director) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {drama.director && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-400 mb-2">
                                            Director
                                        </h3>
                                        <p className="text-white">{drama.director}</p>
                                    </div>
                                )}
                                {drama.cast && drama.cast.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-400 mb-2">
                                            Cast
                                        </h3>
                                        <p className="text-white">{drama.cast.join(", ")}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Episodes */}
                {drama.episodes && drama.episodes.length > 0 && (
                    <section className="mt-12 pb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Episodes</h2>
                            <span className="text-gray-400 text-sm">
                                {drama.episodes.length} Episodes
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                            {drama.episodes.map((episode) => (
                                <Link
                                    key={episode.id}
                                    href={`/watch/${encodeURIComponent(slug)}/${episode.number}`}
                                    className="group relative flex items-center justify-center p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-rose-500/50 rounded-xl transition-all"
                                >
                                    <div className="text-center">
                                        <span className="block text-lg font-semibold text-white group-hover:text-rose-400 transition-colors">
                                            EP {episode.number}
                                        </span>
                                        {episode.title && episode.title !== `Episode ${episode.number}` && (
                                            <span className="block text-xs text-gray-400 mt-1 line-clamp-1">
                                                {episode.title}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronRight className="absolute right-3 w-4 h-4 text-gray-600 group-hover:text-rose-400 transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
