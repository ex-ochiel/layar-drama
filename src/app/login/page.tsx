"use client";

import { useState } from "react";
import Link from "next/link";
import { Film, User, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setIsSubmitting(true);
        try {
            await login(email);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-16 flex items-center justify-center relative overflow-hidden">
            {/* Background with blur effect */}
            <div className="absolute inset-0 bg-[url('/posters/vincenzo.png')] bg-cover bg-center opacity-20 blur-xl scale-110"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>

            <div className="relative w-full max-w-md p-6 animate-fade-in">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                            <Film className="w-8 h-8 text-rose-500 group-hover:scale-110 transition-transform" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                                LayarDrama
                            </span>
                        </Link>
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back!</h1>
                        <p className="text-gray-400 text-sm">
                            Sign in to continue watching your favorite dramas
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all group-hover:bg-white/10"
                                    required
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-rose-400 transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-gray-300">
                                    Password
                                </label>
                                <Link
                                    href="#"
                                    className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all group-hover:bg-white/10"
                                    required
                                />
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-rose-400 transition-colors" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 active:scale-95"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{" "}
                            <Link
                                href="/register"
                                className="text-white hover:text-rose-400 font-medium transition-colors hover:underline decoration-rose-500 underline-offset-4"
                            >
                                Sign up now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
