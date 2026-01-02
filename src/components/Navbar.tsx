"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Film, Menu, X, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (searchQuery.trim()) {
                router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                setSearchQuery("");
                setIsMobileMenuOpen(false);
            }
        },
        [searchQuery, router]
    );

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-black/90 backdrop-blur-md shadow-lg"
                    : "bg-gradient-to-b from-black/80 to-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-white font-bold text-xl"
                    >
                        <Film className="w-8 h-8 text-rose-500" />
                        <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                            LayarDrama
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/search"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Browse
                        </Link>
                        <Link
                            href="/mylist"
                            className="flex items-center gap-1 text-gray-300 hover:text-rose-400 transition-colors"
                        >
                            <Heart className="w-4 h-4" />
                            My List
                        </Link>

                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Search dramas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </form>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-white p-2"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10">
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search dramas..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-rose-500"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </form>
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-gray-300 hover:text-white py-2 transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href="/search"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-gray-300 hover:text-white py-2 transition-colors"
                            >
                                Browse
                            </Link>
                            <Link
                                href="/mylist"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-2 text-gray-300 hover:text-rose-400 py-2 transition-colors"
                            >
                                <Heart className="w-4 h-4" />
                                My List
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
