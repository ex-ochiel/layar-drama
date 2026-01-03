"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Calendar, Edit2, Save, Loader2, ArrowLeft, Film, Heart, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBookmarks } from "@/context/BookmarkContext";
import { useWatchHistory } from "@/context/WatchHistoryContext";
import Link from "next/link";

interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
    created_at: string;
}

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const { bookmarks } = useBookmarks();
    const { history } = useWatchHistory();
    const router = useRouter();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    // Fetch profile
    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/profile');
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setFullName(data.full_name || "");
                setUsername(data.username || "");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: fullName,
                    username: username,
                }),
            });

            if (res.ok) {
                const updatedProfile = await res.json();
                setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                {/* Profile Header */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center overflow-hidden ring-4 ring-rose-500/20">
                            {profile?.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.full_name || "User"}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-12 h-12 text-white" />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Display Name</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full max-w-md px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                                            placeholder="Your display name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Username</label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full max-w-md px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                                            placeholder="@username"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFullName(profile?.full_name || "");
                                                setUsername(profile?.username || "");
                                            }}
                                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-2xl font-bold text-white">
                                            {profile?.full_name || "Drama Lover"}
                                        </h1>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="p-2 text-gray-400 hover:text-rose-400 transition-colors"
                                            title="Edit Profile"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {profile?.username && (
                                        <p className="text-gray-400 mb-2">@{profile.username}</p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {profile?.email}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            Joined {profile?.created_at ? formatDate(profile.created_at) : "N/A"}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Link
                        href="/mylist"
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-rose-500/50 transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-rose-500/10 rounded-lg group-hover:bg-rose-500/20 transition-colors">
                                <Heart className="w-6 h-6 text-rose-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{bookmarks.length}</p>
                                <p className="text-gray-400 text-sm">Saved Dramas</p>
                            </div>
                        </div>
                    </Link>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <Clock className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{history.length}</p>
                                <p className="text-gray-400 text-sm">Watch History</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-lg">
                                <Film className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">0</p>
                                <p className="text-gray-400 text-sm">Reviews Written</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                {history.length > 0 && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Recently Watched</h2>
                        <div className="space-y-3">
                            {history.slice(0, 5).map((item) => (
                                <Link
                                    key={item.dramaId}
                                    href={`/drama/${item.dramaId}`}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-800 transition-colors"
                                >
                                    <div className="w-16 h-10 rounded overflow-hidden bg-zinc-800 flex-shrink-0">
                                        {item.dramaThumbnail && (
                                            <img
                                                src={item.dramaThumbnail}
                                                alt={item.dramaTitle}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{item.dramaTitle}</p>
                                        <p className="text-sm text-gray-400">Episode {item.lastEpisode}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
