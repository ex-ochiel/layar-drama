"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "./AuthContext";

interface WatchHistoryItem {
    dramaId: string;
    dramaTitle: string;
    dramaThumbnail: string;
    lastEpisode: number;
    totalEpisodes?: number;
    lastWatched: number; // timestamp
}

interface WatchHistoryContextType {
    history: WatchHistoryItem[];
    addToHistory: (item: Omit<WatchHistoryItem, "lastWatched">) => Promise<void>;
    removeFromHistory: (dramaId: string) => Promise<void>;
    getLastWatched: (dramaId: string) => WatchHistoryItem | undefined;
    clearHistory: () => void;
    isLoading: boolean;
}

const WatchHistoryContext = createContext<WatchHistoryContextType | undefined>(undefined);

const STORAGE_KEY = "layar-drama-watch-history";
const MAX_HISTORY_ITEMS = 20;

export function WatchHistoryProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<WatchHistoryItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    // Fetch history from API or localStorage
    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        try {
            if (user) {
                // User is logged in, fetch from API
                const res = await fetch('/api/watch-history');
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data);
                } else if (res.status === 401) {
                    loadFromLocalStorage();
                }
            } else {
                loadFromLocalStorage();
            }
        } catch (error) {
            console.error("Error fetching watch history:", error);
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
                setHistory(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Error loading watch history from localStorage:", error);
        }
    };

    // Load history on mount and when user changes
    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // Save to localStorage for non-logged-in users
    useEffect(() => {
        if (isLoaded && !user) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
            } catch (error) {
                console.error("Error saving watch history:", error);
            }
        }
    }, [history, isLoaded, user]);

    const addToHistory = async (item: Omit<WatchHistoryItem, "lastWatched">) => {
        const newItem: WatchHistoryItem = {
            ...item,
            lastWatched: Date.now(),
        };

        // Optimistically update UI
        setHistory((prev) => {
            const filtered = prev.filter((h) => h.dramaId !== item.dramaId);
            return [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
        });

        // If logged in, save to database
        if (user) {
            try {
                const res = await fetch('/api/watch-history', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        drama_id: item.dramaId,
                        drama_title: item.dramaTitle,
                        drama_thumbnail: item.dramaThumbnail,
                        last_episode: item.lastEpisode,
                        total_episodes: item.totalEpisodes,
                    }),
                });

                if (!res.ok) {
                    console.error("Failed to save watch history to database");
                }
            } catch (error) {
                console.error("Error saving watch history:", error);
            }
        }
    };

    const removeFromHistory = async (dramaId: string) => {
        // Find item to remove (for potential rollback)
        const itemToRemove = history.find((h) => h.dramaId === dramaId);
        if (!itemToRemove) return;

        // Optimistically update UI
        setHistory((prev) => prev.filter((h) => h.dramaId !== dramaId));

        // If logged in, remove from database
        if (user) {
            try {
                const res = await fetch(`/api/watch-history?drama_id=${dramaId}`, {
                    method: 'DELETE',
                });

                if (!res.ok) {
                    // Revert on error
                    setHistory((prev) => [itemToRemove, ...prev]);
                    console.error("Failed to remove from watch history");
                }
            } catch (error) {
                setHistory((prev) => [itemToRemove, ...prev]);
                console.error("Error removing from watch history:", error);
            }
        }
    };

    const getLastWatched = (dramaId: string) => {
        return history.find((h) => h.dramaId === dramaId);
    };

    const clearHistory = () => {
        setHistory([]);
        if (!user) {
            localStorage.removeItem(STORAGE_KEY);
        }
        // Note: For logged-in users, we'd need a /api/watch-history/clear endpoint
    };

    return (
        <WatchHistoryContext.Provider
            value={{ history, addToHistory, removeFromHistory, getLastWatched, clearHistory, isLoading }}
        >
            {children}
        </WatchHistoryContext.Provider>
    );
}

export function useWatchHistory() {
    const context = useContext(WatchHistoryContext);
    if (context === undefined) {
        throw new Error("useWatchHistory must be used within a WatchHistoryProvider");
    }
    return context;
}
