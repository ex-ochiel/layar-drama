import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Film } from "lucide-react";
import { mockActors } from "@/lib/mockActors";
import { mockDramas } from "@/lib/mockData";
import MovieCard from "@/components/MovieCard";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ActorProfilePage({ params }: PageProps) {
    const resolvedParams = await params;
    const actor = mockActors.find((a) => a.slug === resolvedParams.slug);

    if (!actor) {
        notFound();
    }

    // Get dramas related to this actor
    const relatedDramas = mockDramas.filter((drama) =>
        actor.knownFor.includes(drama.id)
    );

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Back Button */}
            <div className="fixed top-20 left-4 z-50">
                <Link
                    href="/"
                    className="p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-rose-500 transition-colors border border-white/10"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
            </div>

            <div className="relative pt-20 pb-12">
                {/* Background Blur */}
                <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden opacity-20 z-0">
                    <Image
                        src={actor.photo}
                        alt={actor.name}
                        fill
                        className="object-cover blur-3xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                    <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                        {/* Actor Photo */}
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                            <div className="w-64 h-96 relative rounded-2xl overflow-hidden shadow-2xl border-4 border-zinc-800 rotate-2 hover:rotate-0 transition-transform duration-500">
                                <Image
                                    src={actor.photo}
                                    alt={actor.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Actor Info */}
                        <div className="flex-1 text-center md:text-left pt-4">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                {actor.name}
                            </h1>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 text-gray-400">
                                {actor.birthDate && (
                                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                        <Calendar className="w-4 h-4 text-rose-500" />
                                        <span className="text-sm">{actor.birthDate}</span>
                                    </div>
                                )}
                                {actor.birthPlace && (
                                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                        <MapPin className="w-4 h-4 text-rose-500" />
                                        <span className="text-sm">{actor.birthPlace}</span>
                                    </div>
                                )}
                            </div>

                            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed bg-zinc-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                    Biography
                                </h3>
                                <p>{actor.biography || `Data for ${actor.name} is currently being updated.`}</p>
                            </div>
                        </div>
                    </div>

                    {/* Known For Section */}
                    <div className="mt-16">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1 h-8 bg-rose-500 rounded-full"></div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Film className="w-6 h-6 text-gray-400" />
                                Wait, they star in these?
                            </h2>
                        </div>

                        {relatedDramas.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {relatedDramas.map((drama, index) => (
                                    <div
                                        key={drama.id}
                                        className="animate-fade-in"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <MovieCard drama={drama} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-zinc-900/30 rounded-xl border border-white/5">
                                <p className="text-gray-400 italic">No dramas listed for this actor locally yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
