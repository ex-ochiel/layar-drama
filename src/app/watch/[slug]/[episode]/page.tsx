import Link from "next/link";
import { notFound } from "next/navigation";
import { getDramaDetail, getStreamSource } from "@/lib/api";
import VideoPlayer from "@/components/VideoPlayer";
import WatchPageTracker from "@/components/WatchPageTracker";
import { ChevronLeft, ChevronRight, List, Home, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock stream source for development
const mockStreamSource = {
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    quality: "HD",
    server: "Default",
};

// Mock drama detail
const mockDramaDetail = {
    id: "vincenzo",
    title: "Vincenzo",
    thumbnail: "/posters/vincenzo.png",
    rating: "9.2",
    year: "2021",
    genres: ["Crime", "Comedy", "Romance"],
    status: "completed" as const,
    synopsis: "An Italian lawyer returns to Korea...",
    episodes: Array.from({ length: 20 }, (_, i) => ({
        id: `vincenzo-ep-${i + 1}`,
        number: i + 1,
        title: `Episode ${i + 1}`,
        endpoint: `vincenzo-ep-${i + 1}`,
    })),
};

interface WatchPageProps {
    params: Promise<{ slug: string; episode: string }>;
}

export default async function WatchPage({ params }: WatchPageProps) {
    const { slug, episode } = await params;
    const episodeNumber = parseInt(episode, 10);

    if (isNaN(episodeNumber) || episodeNumber < 1) {
        notFound();
    }

    // Fetch drama details and stream source
    let drama = await getDramaDetail(slug);
    let streamSource = await getStreamSource(`${slug}-ep-${episodeNumber}`);

    // Use mock data if API returns null
    if (!drama) {
        drama = mockDramaDetail;
    }

    if (!streamSource) {
        streamSource = mockStreamSource;
    }

    if (!drama) {
        notFound();
    }

    const currentEpisode = drama.episodes?.find((ep) => ep.number === episodeNumber);
    const prevEpisode = drama.episodes?.find((ep) => ep.number === episodeNumber - 1);
    const nextEpisode = drama.episodes?.find((ep) => ep.number === episodeNumber + 1);

    return (
        <div className="min-h-screen bg-black pt-16">
            {/* Breadcrumb Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <nav className="flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link
                        href={`/drama/${encodeURIComponent(slug)}`}
                        className="hover:text-white transition-colors"
                    >
                        {drama.title}
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-rose-400">Episode {episodeNumber}</span>
                </nav>
            </div>

            {/* Video Player Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <VideoPlayer
                    streamSource={streamSource}
                    title={`${drama.title} - Episode ${episodeNumber}`}
                />

                {/* Track Watch History */}
                <WatchPageTracker
                    dramaId={slug}
                    dramaTitle={drama.title}
                    dramaThumbnail={drama.thumbnail || "/placeholder-movie.png"}
                    episodeNumber={episodeNumber}
                    totalEpisodes={drama.episodes?.length}
                />

                {/* Episode Info */}
                <div className="mt-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {drama.title}
                    </h1>
                    <p className="text-lg text-rose-400 font-medium">
                        Episode {episodeNumber}
                        {currentEpisode?.title && currentEpisode.title !== `Episode ${episodeNumber}` && (
                            <span className="text-gray-400 ml-2">- {currentEpisode.title}</span>
                        )}
                    </p>
                </div>

                {/* Episode Navigation */}
                <div className="flex items-center justify-between mt-6 gap-4">
                    {prevEpisode ? (
                        <Link
                            href={`/watch/${encodeURIComponent(slug)}/${prevEpisode.number}`}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Previous</span>
                            <span>EP {prevEpisode.number}</span>
                        </Link>
                    ) : (
                        <div />
                    )}

                    <Link
                        href={`/drama/${encodeURIComponent(slug)}`}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                    >
                        <List className="w-5 h-5" />
                        <span className="hidden sm:inline">All Episodes</span>
                    </Link>

                    {nextEpisode ? (
                        <Link
                            href={`/watch/${encodeURIComponent(slug)}/${nextEpisode.number}`}
                            className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors"
                        >
                            <span>EP {nextEpisode.number}</span>
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    ) : (
                        <div />
                    )}
                </div>

                {/* Episodes Grid */}
                {drama.episodes && drama.episodes.length > 0 && (
                    <div className="mt-10 pb-12">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <List className="w-5 h-5 text-rose-500" />
                            All Episodes
                        </h2>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                            {drama.episodes.map((ep) => (
                                <Link
                                    key={ep.id}
                                    href={`/watch/${encodeURIComponent(slug)}/${ep.number}`}
                                    className={cn(
                                        "flex items-center justify-center p-3 rounded-lg text-sm font-medium transition-all",
                                        ep.number === episodeNumber
                                            ? "bg-rose-500 text-white"
                                            : "bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white"
                                    )}
                                >
                                    {ep.number}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back to Drama */}
                <div className="pb-12">
                    <Link
                        href={`/drama/${encodeURIComponent(slug)}`}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to {drama.title}
                    </Link>
                </div>
            </div>
        </div>
    );
}
