"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Drama } from "@/lib/types";

interface BookmarkContextType {
    bookmarks: Drama[];
    addBookmark: (drama: Drama) => void;
    removeBookmark: (dramaId: string) => void;
    isBookmarked: (dramaId: string) => boolean;
    toggleBookmark: (drama: Drama) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

const STORAGE_KEY = "layar-drama-bookmarks";

export function BookmarkProvider({ children }: { children: ReactNode }) {
    const [bookmarks, setBookmarks] = useState<Drama[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load bookmarks from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setBookmarks(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Error loading bookmarks:", error);
        }
        setIsLoaded(true);
    }, []);

    // Save bookmarks to localStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
            } catch (error) {
                console.error("Error saving bookmarks:", error);
            }
        }
    }, [bookmarks, isLoaded]);

    const addBookmark = (drama: Drama) => {
        setBookmarks((prev) => {
            const exists = prev.some((d) => d.id === drama.id || d.endpoint === drama.endpoint);
            if (exists) return prev;
            return [...prev, drama];
        });
    };

    const removeBookmark = (dramaId: string) => {
        setBookmarks((prev) =>
            prev.filter((d) => d.id !== dramaId && d.endpoint !== dramaId)
        );
    };

    const isBookmarked = (dramaId: string) => {
        return bookmarks.some((d) => d.id === dramaId || d.endpoint === dramaId);
    };

    const toggleBookmark = (drama: Drama) => {
        const id = drama.endpoint || drama.id;
        if (isBookmarked(id)) {
            removeBookmark(id);
        } else {
            addBookmark(drama);
        }
    };

    return (
        <BookmarkContext.Provider
            value={{ bookmarks, addBookmark, removeBookmark, isBookmarked, toggleBookmark }}
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
