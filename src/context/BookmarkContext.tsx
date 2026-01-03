"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Drama } from "@/lib/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface BookmarkContextType {
    bookmarks: Drama[];
    addBookmark: (drama: Drama) => Promise<void>;
    removeBookmark: (dramaId: string) => Promise<void>;
    isBookmarked: (dramaId: string) => boolean;
    toggleBookmark: (drama: Drama) => Promise<void>;
    isLoading: boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

const STORAGE_KEY = "layar-drama-bookmarks";

export function BookmarkProvider({ children }: { children: ReactNode }) {
    const [bookmarks, setBookmarks] = useState<Drama[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    // Fetch bookmarks from API or localStorage
    const fetchBookmarks = useCallback(async () => {
        setIsLoading(true);
        try {
            if (user) {
                // User is logged in, fetch from API
                const res = await fetch('/api/watchlist');
                if (res.ok) {
                    const data = await res.json();
                    setBookmarks(data);
                } else if (res.status === 401) {
                    // Not authenticated, fallback to localStorage
                    loadFromLocalStorage();
                }
            } else {
                // No user, use localStorage
                loadFromLocalStorage();
            }
        } catch (error) {
            console.error("Error fetching bookmarks:", error);
            loadFromLocalStorage();
        } finally {
            setIsLoading(false);
            setIsLoaded(true);
        }
    }, [user]);

    const loadFromLocalStorage = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setBookmarks(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Error loading bookmarks from localStorage:", error);
        }
    };

    // Load bookmarks on mount and when user changes
    useEffect(() => {
        fetchBookmarks();
    }, [fetchBookmarks]);

    // Save to localStorage for non-logged-in users
    useEffect(() => {
        if (isLoaded && !user) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
            } catch (error) {
                console.error("Error saving bookmarks:", error);
            }
        }
    }, [bookmarks, isLoaded, user]);

    const addBookmark = async (drama: Drama) => {
        // Optimistically update UI
        const exists = bookmarks.some((d) => d.id === drama.id || d.slug === drama.slug);
        if (exists) return;

        setBookmarks((prev) => [...prev, drama]);
        toast.success(`Added "${drama.title}" to your list`);

        if (user) {
            try {
                const res = await fetch('/api/watchlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ drama_id: drama.id }),
                });

                if (!res.ok) {
                    // Revert on error
                    setBookmarks((prev) => prev.filter((d) => d.id !== drama.id));
                    toast.error("Failed to save to watchlist");
                }
            } catch (error) {
                // Revert on error
                setBookmarks((prev) => prev.filter((d) => d.id !== drama.id));
                toast.error("Failed to save to watchlist");
                console.error("Error adding to watchlist:", error);
            }
        }
    };

    const removeBookmark = async (dramaId: string) => {
        // Find the drama to remove (for potential rollback)
        const dramaToRemove = bookmarks.find((d) => d.id === dramaId || d.slug === dramaId);
        if (!dramaToRemove) return;

        // Optimistically update UI
        setBookmarks((prev) =>
            prev.filter((d) => d.id !== dramaId && d.slug !== dramaId)
        );
        toast.success(`Removed "${dramaToRemove.title}" from your list`);

        if (user) {
            try {
                const res = await fetch(`/api/watchlist/${dramaToRemove.id}`, {
                    method: 'DELETE',
                });

                if (!res.ok) {
                    // Revert on error
                    setBookmarks((prev) => [...prev, dramaToRemove]);
                    toast.error("Failed to remove from watchlist");
                }
            } catch (error) {
                // Revert on error
                setBookmarks((prev) => [...prev, dramaToRemove]);
                toast.error("Failed to remove from watchlist");
                console.error("Error removing from watchlist:", error);
            }
        }
    };

    const isBookmarked = (dramaId: string) => {
        return bookmarks.some((d) => d.id === dramaId || d.slug === dramaId);
    };

    const toggleBookmark = async (drama: Drama) => {
        const id = drama.slug || drama.id;
        if (isBookmarked(id)) {
            await removeBookmark(id);
        } else {
            await addBookmark(drama);
        }
    };

    return (
        <BookmarkContext.Provider
            value={{ bookmarks, addBookmark, removeBookmark, isBookmarked, toggleBookmark, isLoading }}
        >
            {children}
        </BookmarkContext.Provider>
    );
}

export function useBookmarks() {
    const context = useContext(BookmarkContext);
    if (context === undefined) {
        throw new Error("useBookmarks must be used within a BookmarkProvider");
    }
    return context;
}
