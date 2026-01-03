"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Film, Menu, X, Heart, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const { user, signOut } = useAuth();
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                                className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </form>

                        {/* User Menu (Desktop) */}
                        <div className="flex-shrink-0 ml-4">
                            {user ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 focus:outline-none hover:scale-105 transition-transform"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center overflow-hidden border-2 border-rose-500 ring-2 ring-black/50">
                                            {/* Supabase user object typically doesn't have 'avatar' directly on top level, 
                                                it's in user_metadata or identities. Adjusting access. */}
                                            {user.user_metadata?.avatar_url ? (
                                                <img src={user.user_metadata.avatar_url} alt={user.email || "User"} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-5 h-5 text-white" />
                                            )}
                                        </div>
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl py-1 animate-fade-in z-50">
                                            <div className="px-4 py-3 border-b border-zinc-800">
                                                <p className="text-sm text-white font-medium truncate">{user.user_metadata?.full_name || user.email}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                href="/mylist"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                My List
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    signOut();
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 flex items-center gap-2"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-rose-600/20 hover:shadow-rose-600/40"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-gray-300 hover:text-white p-2"
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

                            {user ? (
                                <>
                                    <div className="py-2 border-t border-white/10 mt-2">
                                        <div className="flex items-center gap-3 mb-3 px-2">
                                            <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center overflow-hidden">
                                                {user.user_metadata?.avatar_url ? (
                                                    <img src={user.user_metadata.avatar_url} alt={user.email || "User"} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-5 h-5 text-white" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm text-white font-medium">{user.user_metadata?.full_name || user.email}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                signOut();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left flex items-center gap-2 text-red-400 hover:text-red-300 py-2 px-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block mt-2 text-center px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg transition-colors"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
