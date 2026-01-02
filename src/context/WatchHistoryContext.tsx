"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
    addToHistory: (item: Omit<WatchHistoryItem, "lastWatched">) => void;
    removeFromHistory: (dramaId: string) => void;
    getLastWatched: (dramaId: string) => WatchHistoryItem | undefined;
    clearHistory: () => void;
}

const WatchHistoryContext = createContext<WatchHistoryContextType | undefined>(undefined);

const STORAGE_KEY = "layar-drama-watch-history";
const MAX_HISTORY_ITEMS = 20;

export function WatchHistoryProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<WatchHistoryItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load history from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setHistory(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Error loading watch history:", error);
        }
        setIsLoaded(true);
    }, []);

    // Save history to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
            } catch (error) {
                console.error("Error saving watch history:", error);
            }
        }
    }, [history, isLoaded]);

    const addToHistory = (item: Omit<WatchHistoryItem, "lastWatched">) => {
        setHistory((prev) => {
            // Remove existing entry for this drama if exists
            const filtered = prev.filter((h) => h.dramaId !== item.dramaId);

            // Add new entry at the beginning
            const newItem: WatchHistoryItem = {
                ...item,
                lastWatched: Date.now(),
            };

            // Keep only the most recent items
            const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
            return updated;
        });
    };

    const removeFromHistory = (dramaId: string) => {
        setHistory((prev) => prev.filter((h) => h.dramaId !== dramaId));
    };

    const getLastWatched = (dramaId: string) => {
        return history.find((h) => h.dramaId === dramaId);
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <WatchHistoryContext.Provider
            value={{ history, addToHistory, removeFromHistory, getLastWatched, clearHistory }}
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
