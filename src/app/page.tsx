import { getTrending, getLatest } from "@/lib/api";
import HeroSlider from "@/components/HeroSlider";
import MovieCard from "@/components/MovieCard";
import ContinueWatching from "@/components/ContinueWatching";
import { ChevronRight, Flame, Clock } from "lucide-react";
import Link from "next/link";

// Mock data for development/fallback
const mockDramas = [
  {
    id: "1",
    title: "Vincenzo",
    thumbnail: "/posters/vincenzo.png",
    rating: "9.2",
    year: "2021",
    genres: ["Crime", "Comedy", "Romance"],
    status: "completed" as const,
    description: "An Italian lawyer returns to Korea to recover hidden gold, but becomes entangled with a tenacious female lawyer fighting against a powerful conglomerate.",
  },
  {
    id: "2",
    title: "Crash Landing on You",
    thumbnail: "/posters/crash-landing.png",
    rating: "9.4",
    year: "2020",
    genres: ["Romance", "Comedy", "Drama"],
    status: "completed" as const,
    description: "A South Korean heiress crash-lands in North Korea and falls in love with an army captain who helps hide her.",
  },
  {
    id: "3",
    title: "Squid Game",
    thumbnail: "/posters/squid-game.png",
    rating: "8.8",
    year: "2021",
    genres: ["Thriller", "Drama", "Action"],
    status: "completed" as const,
    description: "Hundreds of cash-strapped contestants accept a strange invitation to compete in children's games for a tempting prize.",
  },
  {
    id: "4",
    title: "All of Us Are Dead",
    thumbnail: "/posters/all-of-us-are-dead.png",
    rating: "8.5",
    year: "2022",
    genres: ["Horror", "Action", "Thriller"],
    status: "completed" as const,
    description: "A high school becomes ground zero for a zombie virus outbreak. Trapped students must fight their way out or face becoming undead.",
  },
  {
    id: "5",
    title: "Business Proposal",
    thumbnail: "/posters/business-proposal.png",
    rating: "8.7",
    year: "2022",
    genres: ["Romance", "Comedy"],
    status: "completed" as const,
    description: "An employee goes on a blind date in place of her friend, but the date turns out to be her company's CEO.",
  },
  {
    id: "6",
    title: "Hometown Cha-Cha-Cha",
    thumbnail: "/posters/hometown-cha-cha-cha.png",
    rating: "8.9",
    year: "2021",
    genres: ["Romance", "Comedy", "Drama"],
    status: "completed" as const,
    description: "A dentist moves to a seaside village and forms a relationship with a handyman who is loved by all.",
  },
];

export default async function Home() {
  // Fetch data from API
  let trendingDramas = await getTrending();
  let latestDramas = await getLatest();

  // Use mock data if API returns empty
  if (trendingDramas.length === 0) {
    trendingDramas = mockDramas;
  }
  if (latestDramas.length === 0) {
    latestDramas = mockDramas.slice().reverse();
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSlider dramas={trendingDramas} />

      {/* Content Sections */}
      <div className="relative z-10 -mt-20 bg-gradient-to-t from-black via-black to-transparent pt-20">
        {/* Continue Watching Section */}
        <ContinueWatching />

        {/* Trending Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold text-white">Trending Now</h2>
            </div>
            <Link
              href="/search?sort=trending"
              className="flex items-center gap-1 text-rose-400 hover:text-rose-300 text-sm font-medium transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {trendingDramas.slice(0, 6).map((drama, index) => (
              <div
                key={drama.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MovieCard drama={drama} />
              </div>
            ))}
          </div>
        </section>

        {/* Latest Updates Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-white">Latest Updates</h2>
            </div>
            <Link
              href="/search?sort=latest"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {latestDramas.slice(0, 12).map((drama, index) => (
              <div
                key={drama.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MovieCard drama={drama} />
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 p-8 md:p-12">
            <div className="relative z-10 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Can't find what you're looking for?
              </h2>
              <p className="text-white/80 mb-6">
                Use our search feature to discover thousands of Asian dramas from Korea, China, Japan, and more.
              </p>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rose-600 font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                Browse All Dramas
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/10 rounded-full translate-y-1/2" />
          </div>
        </section>
      </div>
    </div>
  );
}
