import { Suspense } from "react";
import { searchDrama, getLatest } from "@/lib/api";
import SearchPageClient from "@/components/SearchPageClient";
import { mockDramas } from "@/lib/mockData";
import { Loader2 } from "lucide-react";

interface SearchPageProps {
    searchParams: Promise<{ q?: string; genre?: string }>;
}

function LoadingSkeleton() {
    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
                    <span className="ml-3 text-gray-400">Loading dramas...</span>
                </div>
            </div>
        </div>
    );
}

async function SearchContent({ query }: { query: string }) {
    let results = query ? await searchDrama(query) : await getLatest();

    // Use mock data if API returns empty
    if (results.length === 0) {
        if (query) {
            results = mockDramas.filter((d) =>
                d.title.toLowerCase().includes(query.toLowerCase())
            );
        } else {
            results = mockDramas;
        }
    }

    return <SearchPageClient initialDramas={results} initialQuery={query} />;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const query = params.q || "";

    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <SearchContent query={query} />
        </Suspense>
    );
}
