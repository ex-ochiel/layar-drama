"use client";

import { Film, Github, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

    // Hide Footer on Admin pages
    if (pathname?.startsWith("/admin")) return null;

    return (
        <footer className="bg-zinc-950 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-white font-bold text-xl mb-4"
                        >
                            <Film className="w-8 h-8 text-rose-500" />
                            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                                LayarDrama
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm max-w-md">
                            Watch your favorite Asian dramas anytime, anywhere. Stream the
                            latest Korean, Chinese, and Japanese dramas with high quality.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Browse</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-400 hover:text-white transition-colors text-sm"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/search"
                                    className="text-gray-400 hover:text-white transition-colors text-sm"
                                >
                                    Search
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/search?genre=romance"
                                    className="text-gray-400 hover:text-white transition-colors text-sm"
                                >
                                    Romance
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/search?genre=action"
                                    className="text-gray-400 hover:text-white transition-colors text-sm"
                                >
                                    Action
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <span className="text-gray-400 text-sm">Terms of Service</span>
                            </li>
                            <li>
                                <span className="text-gray-400 text-sm">Privacy Policy</span>
                            </li>
                            <li>
                                <span className="text-gray-400 text-sm">DMCA</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> by LayarDrama Team
                    </p>
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} LayarDrama. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
